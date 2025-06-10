import express from 'express';
import { confirmWatering, createPlant, deletePlant, getAllPlants, getPlant, updatePlant } from '../controllers/plant.controllers.js';
import { protectedRoute } from '../middleware/proctectedRoute.js';

const router = express.Router();



router.post('/create-plant', protectedRoute,createPlant);
router.get('/water/:plantId', protectedRoute, confirmWatering);
router.get('/all-plants', protectedRoute,getAllPlants);
router.get('/:plantId', protectedRoute, getPlant);
router.post('/:plantId', protectedRoute, updatePlant);
router.delete('/delete/:plantId', protectedRoute, deletePlant);


export default router;