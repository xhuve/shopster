import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getLoggedUserOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getAllOrders
} from '../controllers/orderController.js';
import { adminRoutes, protectRoutes } from '../middleware/authMiddleware.js';

router.route('/').post(protectRoutes, addOrderItems).get(protectRoutes, adminRoutes, getAllOrders);
router.route('/myorders').get(protectRoutes, getLoggedUserOrders);
router.route('/:id').get(protectRoutes, getOrderById);
router.route('/:id/pay').put(protectRoutes, updateOrderToPaid);
router.route('/:id/deliver').put(protectRoutes, adminRoutes, updateOrderToDelivered);


export default router