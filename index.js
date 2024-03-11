const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/users");
const Product = require("./db/product");
const Jwt = require("jsonwebtoken");
const jwtKey = 'e-comm';
const app = express()
app.use(express.json());
app.use(cors());

// Resistor API===>

app.post("/registor", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    Jwt.sign({
        result
    }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if(err){
            resp.send({ result: "something went wrong, Please try after some time"});
        }
        resp.send({result, auth: token });
    })

});

// Login API===>

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            Jwt.sign({
                user
            }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if(err){
                    resp.send({ result: "something went wrong, Please try after some time"});
                }
                resp.send({user, auth: token });
            })
            

        }
        else {
            resp.send({ result: "No result found" });
        }
    }
    else {
        resp.send({ result: "No result found" });
    }
});

// Add Product API===>

app.post("/add-product", async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
});

// Get Product API===>

app.get("/products", async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Products found" });
    }
});

// Delete Product API ===>

app.delete("/product/:id", async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result);
});


// Get single product API ===>

app.get("/product/:id", async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No recond found" });
    }
})
// Update Product API ===>

app.put("/product/:id", async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        {
            $set: req.body
        }
    )
    resp.send(result);
})

// Search Product API===>
app.get("/search/:key", async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }
        ]
    });
    resp.send(result);
})

app.listen(5000);