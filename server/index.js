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

// Helper function to send WhatsApp notification
const sendWhatsAppNotification = async (userName, amount) => {
  const phone = process.env.ADMIN_PHONE || '919398324095';
  const apiKey = process.env.CALLMEBOT_API_KEY;
  
  if (!apiKey) {
    console.log('WhatsApp Notification skipped: CALLMEBOT_API_KEY not found in .env');
    return;
  }

  const message = `🚀 *NEW ORDER RECEIVED* 🚀%0A%0A👤 *Customer:* ${userName}%0A💰 *Amount:* ₹${amount}%0A%0A👉 Check Admin Panel for details: ${process.env.ADMIN_URL || 'https://skml-indana.vercel.app/admin'}`;

  try {
    await axios.get(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${message}&apikey=${apiKey}`);
    console.log('WhatsApp Notification sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error.message);
  }
};

// Verify Payment API
app.post('/api/order/verify', async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    userName,
    amount 
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    // Payment is verified, send notification
    if (userName && amount) {
      sendWhatsAppNotification(userName, amount);
    }
    res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
