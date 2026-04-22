const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const axios = require('axios');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Hello API
app.get('/', (req, res) => {
  res.send('SKML Indana Server is running...');
});

// Create Order API
app.post('/api/order/create', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Verify Payment API
app.post('/api/order/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    // Send WhatsApp Notification to Admin
    sendAdminNotification(razorpay_order_id);
    res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
  }
});

async function sendAdminNotification(orderId) {
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || '919398324095';
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!apiKey) {
    console.log('WhatsApp notification skipped: CALLMEBOT_API_KEY not set in .env');
    return;
  }

  try {
    const message = encodeURIComponent(`🚀 *New Order Received!*%0A%0AOrder ID: ${orderId}%0A%0ACheck the Admin Panel for details:%0Ahttps://skml-party-store.vercel.app/admin/orders`);
    const url = `https://api.callmebot.com/whatsapp.php?phone=${adminPhone}&text=${message}&apikey=${apiKey}`;
    
    await axios.get(url);
    console.log('WhatsApp notification sent to admin.');
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error.message);
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
