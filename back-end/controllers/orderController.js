import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";


export const addOrderItems = asyncHandler(async (req, res) => {
    const {
        cartItems: orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice, 
        shippingPrice,
        totalPrice
    } = req.body
    
    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    } else {
        const order = new Order({
            orderItems: orderItems.map((item) => ({
                ...item,
                product: item._id,
                _id: undefined
            })), 
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice
        })

        const createdOrder = await order.save()

        res.status(201).json(createdOrder)
    }
})

export const getLoggedUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id})
    res.status(200).json(orders)
})

export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
    if (order)
        res.status(200).json(order)
    else {
        res.status(404)
        throw new Error('Order not found')
    }
})

export const updateOrderToPaid = asyncHandler(async (req, res) => {
    res.send("Update order to paid")
})

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
    res.send("Update order to delivered")
})

export const getAllOrders = asyncHandler(async (req, res) => {
    res.send("Get all orders")
})
