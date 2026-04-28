import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testFetch() {
  const { data: complaints, error } = await supabase
       .from('complaints')
       .select('*, users!tenant_id(name, allocations(status, beds(rooms(room_number))))')
       .limit(1);
       
  console.log("Complaints:", JSON.stringify(complaints, null, 2));
  console.log("Error:", error);
}

testFetch();
