import { supabase } from './supabaseClient.js';

async function test() {
  const hostelId = '44e6d275-9f1a-4784-bbd7-15efef1dc47b'; // dummy
  
  try {
    const { data: hostel } = await supabase.from('hostels').select('*').eq('id', hostelId).maybeSingle();
    console.log("HOSTEL:", hostel);
  } catch(e) {}
}

test();
