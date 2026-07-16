/* ============================================
   OMAR PHONE — Supabase Configuration
   ============================================ */

const SUPABASE_URL = 'https://quysvtaemhjwiyrwxqfl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eXN2dGFlbWhqd2l5cnd4cWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2ODAyMjMsImV4cCI6MjA5OTI1NjIyM30.r_9fM1i_2Zc3rlGErtCbBW93DbUncXCwpiwLBIUJqTk';

var supabase = (function () {
  try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
  } catch (_) {}
  console.error('Supabase JS SDK failed to load. Auth features will be unavailable.');
  return null;
})();
