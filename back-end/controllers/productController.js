import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
})

export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product)
        res.json(product);
    else {
        res.status(404)
        throw new Error("Resource not found")
    }
})

export const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: "Sample name",
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        category: 'Sample category',
        brand: 'Sample brand',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})

export const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, brand, category, countInStock } = req.body

    const product = await Product.updateOne({ _id: req.params.id }, {
        name,
        price,
        description,
        brand,
        category,
        countInStock
    });

    if (product.nModified === 0) {
        res.status(404)
        throw new Error("Resource not found")
    } else {
        res.json(product)
    }
})
