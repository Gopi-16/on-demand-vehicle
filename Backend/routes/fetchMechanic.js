import express from 'express';
import  fetch_mechanic  from '../controllers/FetchMechanicController.js';
const router = express.Router();

router.post('/available', fetch_mechanic);
//router.post('/service_form',service_matching);

export default router;
