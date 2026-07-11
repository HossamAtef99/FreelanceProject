/* ============================================
   OMAR PHONE — Supabase Configuration
   ============================================ */

const SUPABASE_URL = 'https://quysvtaemhjwiyrwxqfl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1eXN2dGFlbWhqd2l5cnd4cWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2ODAyMjMsImV4cCI6MjA5OTI1NjIyM30.r_9fM1i_2Zc3rlGErtCbBW93DbUncXCwpiwLBIUJqTk';

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
