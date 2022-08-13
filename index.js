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


// Get API for Product List
app.get('/products', async (req, res) => {
    const products = await Product.find();
    if (products.length > 0) {
        res.send(products)
    } else {
        res.send({ result: "No Product found" })
    }
})

// Delete API for Product
app.delete("/products/:id", async (req, res) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    res.send(result)
})

// Get API for Particular One Product
app.get("/product/:id", async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        res.send(result)
    } else {
        res.send({ result: "No Product Found" })
    }

})


// Update API update Product Data
app.put("/product/:id", async (req, res) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    );
    res.send(result);
})


// Search API for product
app.get("/search/:key", async (req, res) => {
    let result = await Product.find({
        "$or": [
            {
                name: { $regex: req.params.key }
            },
            {
                price: { $regex: req.params.key }
            },
            {
                category: { $regex: req.params.key }
            },
            {
                company: { $regex: req.params.key }
            },
        ]
    })

    res.send(result)
})



// Get API For Testing
// app.get("/" , (req, res) =>{
//     res.send("App is Working...");
// });

// On this Port Server Run
app.listen(5000);
