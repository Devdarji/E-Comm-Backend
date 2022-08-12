const express = require("express");
// const mongoose = require("mongoose") -------------> This Package for Database Connection
const app = express();
const User = require("./db/User");
const cors = require("cors");
const Product = require("./db/Product");

require("./db/config");

// Database Connection Checking
// const connectDB = async () => {
//   mongoose.connect("mongodb://localhost:27017/ecomm");
//   const productSchema = new mongoose.Schema({});
//   const product = mongoose.model("products", productSchema);
//   const data = await product.find();
//   console.warn(data);
// };

// connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Register Post API
app.post("/register", async (req, res) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    res.send(result);
});

app.post("/login", async (req, res) => {
    if (req.body.email && req.body.password) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            res.send(user);
        } else {
            res.send({ res: "User Not Found" });
        }
    } else {
        res.send({ res: "User Not Found" });
    }
});

app.post("/add-product", async (req, res) => {
    let product = new Product(req.body);
    let result = await product.save();
    res.send(result);
});
// Get API For Testing
// app.get("/" , (req, res) =>{
//     res.send("App is Working...");
// });

// On this Port Server Run
app.listen(5000);
