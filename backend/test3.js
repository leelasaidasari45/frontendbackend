import { supabase } from './supabaseClient.js';

async function verifyOwner() {
  const { data: users } = await supabase.from('users').select('*');
  console.log("USERS:", users);
  
  const { data: hostels } = await supabase.from('hostels').select('*');
  console.log("HOSTELS:", hostels);
}

verifyOwner();
