import { supabase } from './supabaseClient.js';

async function test() {
  const hostelId = '44e6d275-9f1a-4784-bbd7-15efef1dc47b'; // dummy
  
  try {
    const { data: hostel } = await supabase.from('hostels').select('*').limit(1).single();
    
    // Active allocations
    const { data: allocations, count, error } = await supabase.from('allocations')
       .select('id, beds!inner(rooms!inner(floors!inner(hostel_id)))', { count: 'exact' })
       .in('status', ['active', 'vacating', 'pending'])
       .eq('beds.rooms.floors.hostel_id', hostel.id);
       
    console.log("ALLOCS:", allocations);
    console.log("ERR:", error);
  } catch (err) {
    console.error(err);
  }
}

test();
