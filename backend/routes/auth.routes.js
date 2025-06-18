import express from "express";
import { checkAuth, loginController, logoutController, resetPasswordController, signupController, verifyEmail, verifyResetPasswordController } from "../controllers/auth.controllers.js";
import { protectedRoute } from "../middleware/proctectedRoute.js";

const router = express.Router();

router.get('/me',protectedRoute, checkAuth);
router.post('/signup', signupController);
router.post('/verify-email', verifyEmail);
router.post('/login', loginController);
router.post('/reset-password', resetPasswordController);
router.post('/verify-reset-password', verifyResetPasswordController);
router.post('/logout', logoutController);
export default router;