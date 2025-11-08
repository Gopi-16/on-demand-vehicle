import express from 'express';
import  service_matching  from '../controllers/Servicecontrollers.js';
const router = express.Router();

router.post('/service', service_matching);
//router.post('/service_form',service_matching);

export default router;
