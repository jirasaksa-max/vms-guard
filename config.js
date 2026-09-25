/**
 * =========================================================================
 * การตั้งค่าระบบ Visitor Management System (VMS) สำหรับ GitHub Pages
 * =========================================================================
 */
const VMS_CONFIG = {
  // Supabase Project URL & Anon Key
  SUPABASE_URL: 'https://xshzgwlgwrsoyvmbdbuk.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzaHpnd2xnd3Jzb3l2bWJkYnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzI2MzksImV4cCI6MjEwNTgwODYzOX0.ijZspSAJJMegeIkVIs4HinUauGGJ7Jw7TOrFfo1hXF4',

  // Google Apps Script Web App URL (ใช้สำหรับ Gemini AI OCR และบันทึกลายเซ็นลง Google Drive)
  GAS_API_URL: 'https://script.google.com/macros/s/AKfycbwS1f-UefLt8XQNyKe0jlMbmkXrFdf0JevihtHEvdqO9O6J1W4y5B1_KF1mZvE_I_lo/exec'
};

/**
 * ฟังก์ชันกลางสำหรับเรียก Google Apps Script Web App (POST API)
 */
async function callGasApi(action, payload = {}) {
  const url = VMS_CONFIG.GAS_API_URL;
  if (!url) throw new Error('ยังไม่ได้กำหนด GAS_API_URL ในไฟล์ config.js');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(Object.assign({ action: action }, payload))
  });

  return await response.json();
}

/**
 * ฟังก์ชันกลางสำหรับเรียก Supabase REST API โดยตรง
 */
async function callSupabaseRest(endpoint, method = 'GET', body = null, extraHeaders = {}) {
  const url = `${VMS_CONFIG.SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = Object.assign({
    'apikey': VMS_CONFIG.SUPABASE_KEY,
    'Authorization': `Bearer ${VMS_CONFIG.SUPABASE_KEY}`,
    'Content-Type': 'application/json'
  }, extraHeaders);

  const options = {
    method: method,
    headers: headers
  };

  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase Error (${response.status}): ${errorText}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

/**
 * Universal Proxy Polyfill:
 * หากเปิดหน้าเว็บผ่าน GitHub Pages หรือเปิดไฟล์ HTML โดยตรง (ซึ่งไม่มี google.script.run)
 * ตัว Proxy นี้จะแปลงคำสั่ง google.script.run ทั้งหมด ให้เรียกผ่าน callGasApi อัตโนมัติ 100%!
 */
if (typeof window !== 'undefined') {
  if (typeof window.google === 'undefined') {
    window.google = {};
  }
  if (!window.google.script || !window.google.script.run) {
    function createGasShimRunner(handlers) {
      return new Proxy({}, {
        get(target, propKey) {
          if (propKey === 'withSuccessHandler') {
            return function(fn) {
              return createGasShimRunner(Object.assign({}, handlers, { success: fn }));
            };
          }
          if (propKey === 'withFailureHandler') {
            return function(fn) {
              return createGasShimRunner(Object.assign({}, handlers, { failure: fn }));
            };
          }

          // เมื่อมีการเรียกฟังก์ชันฝั่ง Server
          return async function(...args) {
            let action = propKey;
            let payload = {};

            if (propKey === 'extractIdCardWithGemini' || propKey === 'extractIdCard') {
              action = 'extractIdCard';
              payload = { base64Image: args[0], mimeType: args[1] };
            } else if (propKey === 'saveCheckIn') {
              action = 'saveCheckIn';
              payload = { visitor: args[0] };
            } else if (propKey === 'findActiveVisitorByPassCode' || propKey === 'findActiveVisitor') {
              action = 'findActiveVisitor';
              payload = { passCode: args[0] };
            } else if (propKey === 'saveCheckOut') {
              action = 'saveCheckOut';
              payload = { logId: args[0], passCode: args[1], notes: args[2] };
            } else if (propKey === 'getActiveVisitorsListForGuard') {
              action = 'getActiveVisitorsListForGuard';
            } else if (propKey === 'getVisitorPassForSigning') {
              action = 'getVisitorPassForSigning';
              payload = { passCode: args[0] };
            } else if (propKey === 'submitHostSignature') {
              action = 'submitHostSignature';
              payload = { passCode: args[0], hostName: args[1], signatureBase64: args[2], remarks: args[3] };
            } else if (propKey === 'getAdminOverviewStats' || propKey === 'getAdminDashboardStats') {
              action = 'getAdminOverviewStats';
            } else if (propKey === 'getAdminPassesList') {
              action = 'getAdminPassesList';
            } else if (propKey === 'getAdminVisitorLogs' || propKey === 'getAdminLogs') {
              action = 'getAdminLogs';
              payload = { dateRange: args[0] };
            } else if (propKey === 'getSystemConfigForAdmin' || propKey === 'getSystemConfig') {
              action = 'getSystemConfig';
            } else if (propKey === 'saveSystemConfig') {
              action = 'saveSystemConfig';
              payload = { config: args[0] };
            } else if (propKey === 'testSupabaseConnection' || propKey === 'testSupabase') {
              action = 'testSupabase';
            } else if (propKey === 'testGeminiConnection' || propKey === 'testGemini') {
              action = 'testGemini';
            } else if (propKey === 'adminForceResetPass') {
              action = 'adminForceResetPass';
              payload = { passCode: args[0] };
            } else if (propKey === 'adminForceCheckout') {
              action = 'adminForceCheckout';
              payload = { logId: args[0], passCode: args[1] };
            } else if (propKey === 'adminAddNewPasses') {
              action = 'adminAddNewPasses';
              payload = { prefix: args[0], startNum: args[1], endNum: args[2] };
            }

            try {
              const res = await callGasApi(action, payload);
              if (handlers.success) {
                handlers.success(res);
              }
              return res;
            } catch (err) {
              if (handlers.failure) {
                handlers.failure(err);
              } else {
                console.error('GAS Shim API Error:', err);
              }
              throw err;
            }
          };
        }
      });
    }

    window.google.script = {
      run: createGasShimRunner({ success: null, failure: null })
    };
  }
}
