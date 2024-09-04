import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
    wishlist: [],
  },
  {
    name: "John Doe",
    email: "john@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    wishlist: [],
  },
  {
    name: "Jane Doe",
    email: "jane@gmail.com",
    password: bcrypt.hashSync("123456", 10),
    wishlist: [],
  },
];

export default users;
