import express from 'express';
import  {mechanic_requests}  from '../controllers/MechanicRequestsController.js';
import  {acceptRequest}  from '../controllers/MechanicRequestsController.js';
import {completeRequest}  from '../controllers/UserRequestsController.js';
import {rejectRequest}  from '../controllers/MechanicRequestsController.js';
import { showAcceptRequest } from '../controllers/UserRequestsController.js';
const router = express.Router();

router.post('/requests', mechanic_requests);
router.post('/request/accept', acceptRequest);
router.post('/request/reject', rejectRequest);
router.post('/request/complete',completeRequest);
router.post('/request/showaccept',showAcceptRequest);
//router.post('/service_form',service_matching);

export default router;