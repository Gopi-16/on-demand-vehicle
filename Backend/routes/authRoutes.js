import express from 'express';
import authController from '../controllers/authController.js';
import RequireAuth from '../middleware/Middleware.js';
import Profile_Controllers from '../controllers/Profile_Controller.js';
const router=express.Router();

router.post('/register',authController.register);

router.post('/login',authController.login);

router.get("/profile",RequireAuth,Profile_Controllers.Profile);
export default router;