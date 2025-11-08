import express from 'express';
import sendOTPController from '../controllers/sendOTPController.js';
const router=express.Router();

router.post('/sendotp',sendOTPController.sendOTP);

router.post('/verifyotp',sendOTPController.verifyOTP);

router.post('/resendotp',sendOTPController.resendOTP);


export default router;