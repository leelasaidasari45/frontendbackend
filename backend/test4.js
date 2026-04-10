import { supabase } from './supabaseClient.js';

async function verifyOwner() {
  const { data: users } = await supabase.from('users').select('id');
  const { data: hostels } = await supabase.from('hostels').select('id, owner_id');
  console.log("USER ID:", users[0]?.id);
  console.log("HOSTEL OWNER_ID:", hostels[0]?.owner_id);
  console.log("MATCH?", users[0]?.id === hostels[0]?.owner_id);
}

verifyOwner();
