import express from 'express';
import { requireAuth, requireOwner } from '../middleware/auth.js';
import { supabase } from '../supabaseClient.js';
import https from 'https';
// In a real prod app, use the official paytmchecksum library: 
// import PaytmChecksum from 'paytmchecksum'; 

const router = express.Router();

router.use(requireAuth);
router.use(requireOwner);

// 1. Initiate Subscription
router.post('/create-subscription', async (req, res) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        
        // This is where we would call Paytm Subscription API
        // For now, we return a mock success to allow frontend development
        // Real implementation requires Paytm MID, KEY, and Website Name
        
        const paytmParams = {
            "requestType": "SUBSCRIBE",
            "mid": process.env.PAYTM_MID || "YOUR_MID_HERE",
            "websiteName": "WEBSTAGING",
            "orderId": `ORDER_${Date.now()}`,
            "callbackUrl": `${process.env.BACKEND_URL}/api/subscription/callback`,
            "subscriptionAmountType": "FIXED",
            "subscriptionFrequency": "1",
            "subscriptionFrequencyUnit": "MONTH",
            "subscriptionExpiryDate": "2030-12-31",
            "subscriptionEnableRetry": "1",
            "subscriptionPaymentMode": "NORMAL",
            "txnAmount": {
                "value": "999.00",
                "currency": "INR"
            },
            "userInfo": {
                "custId": userId,
                "mobile": req.user.phone || "9999999999",
                "email": userEmail
            }
        };

        // TODO: Generate Checksum using PaytmChecksum.generateSignature(JSON.stringify(paytmParams), process.env.PAYTM_KEY);

        res.json({
            message: "Subscription initiation success",
            paytmParams,
            // checksum: signature,
            isMock: true
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Callback from Paytm
router.post('/callback', async (req, res) => {
    // Paytm POSTs the response here after user approves on their side
    const { ORDERID, RESPCODE, SUBS_ID, STATUS } = req.body;
    
    if (STATUS === "TXN_SUCCESS") {
        // Update user setup status in Supabase
        // We'd need to map ORDERID back to userId or pass it in callback
        // For simplicity in this demo, we'll implement a 'verify' endpoint
    }
    
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?status=${STATUS}`);
});

export default router;
