const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const catalog = [
 ['pipe-installation','Pipe Installation',2500],
 ['leak-repair','Comprehensive Leak Detection & Fix',2800],
 ['drain-cleaning','Drain & Sewer Clog Unblocking',3200],
 ['tap-installation','Sink Tap & Bathroom Mixer Installation',1900],
 ['overhead-tank','Overhead Tank & Water Pump Repair',4500],
 ['ac-deep-service','Comprehensive AC Deep Service',3500],
 ['ac-gas-refill','AC Gas Refill & Leak Fix',4800],
 ['ac-cooling-diagnostic','Cooling Diagnostic Check',1500],
 ['ac-split-installation','Split AC Installation / Shift',5500],
 ['garden-overhaul','Full Garden Overhaul & Cleanup',3800],
 ['lawn-mowing','Precision Lawn Mowing & Edging',2500],
 ['shrub-pruning','Shrub & Tree Pruning Service',3200],
 ['drip-irrigation','Automated Drip Irrigation Setup',5200],
 ['breaker-db-inspection','Main Breaker & DB Box Inspection',3200],
 ['switch-socket-repair','Switch & Socket Installation / Repair',1800],
 ['ceiling-fan-fitting','Ceiling Fan & Light Fitting',2400],
 ['short-circuit-diagnostic','Short Circuit Emergency Diagnostic',2000],
 ['deep-home-cleaning','Deep Home Cleaning',3500],
];
const paymentSchema = new mongoose.Schema({
 bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
 customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 method: { type: String, enum: ['card','online','cash'], required: true },
 status: { type: String, enum: ['demo_paid','due'], required: true },
 amountMinor: { type: Number, required: true },
 currency: { type: String, default: 'LKR' },
 demo: { type: Boolean, default: true },
}, { timestamps: true });
const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
router.use('/bookings', auth);
router.use('/payments', auth);
router.post('/bookings', async (req,res) => {
 try {
  if (req.user.role !== 'customer') return res.status(403).json({message:'Customer account required'});
  const { serviceId, date, timeSlot, address, promoCode = '' } = req.body;
  const service = catalog.find(item => item[0] === serviceId);
  if (!service) return res.status(400).json({message:'Unknown service'});
  if (![date,timeSlot,address].every(value => typeof value === 'string' && value.trim() && value.length <= 500)) return res.status(400).json({message:'Valid date, time slot and address required'});
  if (typeof promoCode !== 'string') return res.status(400).json({message:'Invalid promo code'});
  const promo = promoCode.trim().toUpperCase();
  if (promo && promo !== 'HOMECOOL20') return res.status(400).json({message:'Invalid promo code'});
  const discount = promo ? Math.round(service[2] * 0.2) : 0;
  const booking = await Booking.create({customerId:req.user._id,serviceId:service[0],serviceTitle:service[1],date,timeSlot,address:address.trim(),amountMinor:(service[2]-discount)*100,currency:'LKR',status:'scheduled'});
  res.status(201).json({success:true,booking});
 } catch(error) { console.error(error.message); res.status(500).json({message:'Unable to save booking'}); }
});
router.post('/payments', async (req,res) => {
 try {
  const {bookingId,method} = req.body;
  if (!mongoose.isObjectIdOrHexString(bookingId) || !['card','online','cash'].includes(method)) return res.status(400).json({message:'Valid booking ID and payment method required'});
  const booking = await Booking.findOne({_id:bookingId,customerId:req.user._id});
  if (!booking) return res.status(404).json({message:'Booking not found'});
  if (booking.status !== 'scheduled') return res.status(409).json({message:'Booking cannot be paid in this state'});
  let payment;
  try {
   payment = await Payment.findOneAndUpdate({bookingId:booking._id},{$setOnInsert:{customerId:req.user._id,method,status:method === 'cash' ? 'due' : 'demo_paid',amountMinor:booking.amountMinor,currency:booking.currency,demo:true}},{upsert:true,new:true,runValidators:true});
  } catch(error) {
   if (error.code !== 11000) throw error;
   payment = await Payment.findOne({bookingId:booking._id});
  }
  if (payment.method !== method) return res.status(409).json({message:'A different payment method is already recorded for this booking'});
  res.json({success:true,payment});
 } catch(error) { console.error(error.message); res.status(500).json({message:'Unable to save demo payment'}); }
});
module.exports = router;
