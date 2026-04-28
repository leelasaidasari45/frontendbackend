import express from 'express';
import { requireAuth, requireTenant } from '../middleware/auth.js';
import multer from 'multer';
import { supabase } from '../supabaseClient.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireTenant);

const upload = multer({ dest: 'uploads/' });

router.get('/dashboard', async (req, res) => {
  try {
    const tenantId = req.user.id;

    // ⚡ Optimized: Only fetch columns required for the frontend
    const { data: userData } = await supabase.from('users')
      .select('id, name, email, phone, role, hostel_id, father_name, address, vehicle_number, join_date')
      .eq('id', tenantId)
      .single();

    const tenant = userData || { ...req.user };

    // Find active allocation via Supabase
    const { data: allocations } = await supabase
       .from('allocations')
       .select('*, beds(*, rooms(*, floors(*)))')
       .eq('tenant_id', tenantId)
       .order('created_at', { ascending: false });

    const activeAlloc = (allocations || []).find(a => a.status === 'active' || a.status === 'vacating' || a.status === 'pending') || (allocations && allocations[0]);

    if (activeAlloc) {
      tenant.status = activeAlloc.status;
      tenant.roomNumber = activeAlloc.beds?.rooms?.room_number || 'Pending';
    } else {
      if (allocations && allocations.length > 0) {
        tenant.status = 'vacated';
      } else {
        tenant.status = 'new';
      }
    }

    let notices = [];
    let menu = null;
    let hostelName = "";

    // 🏆 Fallback: If user profile doesn't have hostel_id, get it from allocation's nested floors
    let hostelId = tenant.hostel_id;
    if (!hostelId && activeAlloc?.beds?.rooms?.floors?.hostel_id) {
        hostelId = activeAlloc.beds.rooms.floors.hostel_id;
    }
    
    // Only fetch hostel data if they are actively connected to one
    if (hostelId && tenant.status !== 'new') {
        const { data: hostelData } = await supabase.from('hostels').select('name').eq('id', hostelId).maybeSingle();
        hostelName = hostelData?.name || "";

        const { data: noticesData } = await supabase.from('notices').select('*').eq('hostel_id', hostelId).order('created_at', { ascending: false });
        notices = noticesData || [];
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const { data: menuData } = await supabase.from('menus').select('*').eq('hostel_id', hostelId).eq('day', today).maybeSingle();
        menu = menuData;
    }

    res.json({ tenant, notices, menu, hostelName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/verify-hostel/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const { data: hostel } = await supabase.from('hostels').select('id, name').eq('pg_code', code).maybeSingle();

    if (!hostel) return res.status(404).json({ message: 'Invalid Hostel Code' });
    res.json({ id: hostel.id, name: hostel.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/join', upload.single('aadhaar'), async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { hostelCode, tenantName, mobile, admissionDate, roomNumber, fatherName, address, vehicleNumber } = req.body;

    const { data: hostel } = await supabase.from('hostels').select('id').eq('pg_code', hostelCode).maybeSingle();
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });

    // Update user
    await supabase.from('users').update({
      hostel_id: hostel.id,
      phone: mobile,
      name: tenantName || req.user.name,
      join_date: admissionDate,
      father_name: fatherName,
      address: address,
      vehicle_number: vehicleNumber,
      aadhaar_url: req.file ? req.file.path : null
    }).eq('id', tenantId);

    let targetBedId = null;
    if (roomNumber) {
       const { data: beds } = await supabase.from('beds').select('id, rooms!inner(room_number, floors!inner(hostel_id))')
          .eq('rooms.floors.hostel_id', hostel.id)
          .eq('rooms.room_number', roomNumber)
          .limit(1)
          .maybeSingle();
          
       if (beds) targetBedId = beds.id;
    }

    await supabase.from('allocations').insert([{
      tenant_id: tenantId,
      bed_id: targetBedId,
      status: 'pending',
      start_date: admissionDate
    }]);

    res.json({ message: 'Application submitted successfully! Awaiting owner approval.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create application.' });
  }
});

// Payments
router.post('/pay', async (req, res) => {
  try {
    const tenantId = req.user.id;
    const { amount, month, year, utr_id } = req.body;
    
    await supabase.from('payments').insert([{
      tenant_id: tenantId,
      amount,
      month,
      year,
      utr_id,
      status: 'completed',
      paid_at: new Date().toISOString()
    }]);
    
    res.json({ message: 'Payment recorded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Complaints
router.post('/complaints', async (req, res) => {
  try {
    const tenantId = req.user.id;
    let hostelId = req.user.hostel_id;
    const { issue, tenantName, roomNumber } = req.body;
    
    // Fallback: lookup active allocation to find hostel_id
    if (!hostelId) {
      const { data: allocations } = await supabase
        .from('allocations')
        .select('beds(rooms(floors(hostel_id)))')
        .eq('tenant_id', tenantId)
        .in('status', ['active', 'pending', 'vacating'])
        .maybeSingle();
      
      if (allocations?.beds?.rooms?.floors?.hostel_id) {
        hostelId = allocations.beds.rooms.floors.hostel_id;
      }
    }

    if (!hostelId) {
       return res.status(400).json({ message: 'Hostel association not found' });
    }
    
    const { error: insertError } = await supabase.from('complaints').insert([{
      tenant_id: tenantId,
      hostel_id: hostelId,
      title: 'Complaint',
      description: issue,
      status: 'open'
    }]);

    if (insertError) {
      console.error("Complaint Insert Error:", insertError);
      throw new Error(insertError.message || 'Failed to insert complaint');
    }
    
    res.json({ message: 'Complaint submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vacate
router.post('/vacate', async (req, res) => {
  try {
    const tenantId = req.user.id;
    const hostelId = req.user.hostel_id;
    const { vacateDate, vacateReason } = req.body;
    
    await supabase.from('vacate_requests').insert([{
      tenant_id: tenantId,
      hostel_id: hostelId,
      requested_date: vacateDate,
      reason: vacateReason,
      status: 'pending'
    }]);

    await supabase.from('allocations').update({ status: 'vacating', end_date: vacateDate })
      .eq('tenant_id', tenantId)
      .eq('status', 'active');

    res.json({ message: 'Vacate request submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
