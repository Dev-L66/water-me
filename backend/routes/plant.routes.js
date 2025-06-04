import express from 'express';
import { createPlant, getAllPlants } from '../controllers/plant.controllers.js';
import { protectedRoute } from '../middleware/proctectedRoute.js';

const router = express.Router();



router.post('/create-plant', protectedRoute,createPlant);
router.get('/all-plants', protectedRoute,getAllPlants);

export default router;