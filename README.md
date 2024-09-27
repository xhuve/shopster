# Shopster

Shopster is an e-commerce application that allows users to browse, purchase, and manage products online.

## Purpose

The project aims to provide a comprehensive online shopping platform where users can browse products, add them to their cart, make purchases, and manage their orders and wishlist.

## Key Features

- **User Authentication**: Secure login and registration for users.
- **Product Management**: Admins can add, edit, and delete products.
- **Shopping Cart**: Users can add products to their cart and proceed to checkout.
- **Order Management**: Users can view their order history and details.
- **Wishlist**: Users can add products to their wishlist for future reference.
- **Product Reviews**: Users can leave reviews for products.
- **Image Upload**: Admins can upload product images.

## Technologies Used

- **Programming Languages**: JavaScript
- **Front-End**: React, React Bootstrap
- **State Management**: Redux (with Redux Toolkit)
- **Back-End**: Node.js, Express.js
- **Database**: MongoDB
- **Libraries**: Axios, JWT, Mongoose, Multer, Bcrypt.js

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd shopster
   ```
3. Install dependencies for both front-end and back-end:
   ```
   npm install
   npm install --prefix front-end
   ```
4. Set up environment variables by creating a `.env` file in the root directory and adding the necessary variables:
   ```
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   PAYPAL_CLIENT_ID=<your-paypal-client-id>
   ```

## Usage

1. Seed the database with initial data:
   ```
   npm run data:import
   ```
2. Start the development server:
   ```
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000` to access the application.
