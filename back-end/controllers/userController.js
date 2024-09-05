import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout a user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  console.log("Logging out");
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out" });
});

// @desc    Register a user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json(user);
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get a user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  }
});

// @desc    Update a user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.name;

    console.log("🚀 ~ updateUserProfile ~ body:", req.body);
    if (user.body?.password) {
      user.password = req.body.password;
    } else {
      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      });
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// @desc    Get all users
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) res.status(200).json(user);
  else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete an admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  await User.updateOne(
    { _id: req.params.id },
    {
      name: req.body.name || req.user.name,
      email: req.body.email || req.user.email,
      isAdmin: req.body.isAdmin || req.user.isAdmin,
    }
  );

  res.status(200).json({ message: "User updated" });
});

const getUserWishlistProducts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.query.id).populate("wishlist");

  res.status(200).send(user.wishlist);
});

const addProductToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);
  const product = await Product.findById(req.body.productId);
  const productExists = user.wishlist.find((x) => x.toString() === product._id);

  if (productExists) {
    res.status(404);
    throw new Error("Product already in wishlist");
  }

  user.wishlist.push(product);
  console.log("🚀 ~ addProductToWishlist ~ user.wishlist:", user.wishlist);
  await user.save();
  res.status(200).json({ message: "Product added" });
});

const deleteProductFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.id);
  const productIndex = user.wishlist.findIndex(
    (value) => value.toString() === req.body.productId
  );

  user.wishlist.splice(productIndex, 1);
  await user.save();
  res.status(200).json({ message: "Product removed" });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  addProductToWishlist,
  getUserWishlistProducts,
  deleteProductFromWishlist,
};
