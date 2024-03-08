const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/users");
const Product = require("./db/product");
const app = express()
app.use(express.json());
app.use(cors());

// Resistor API===>

app.post("/registor", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password;
    resp.send(result);
    console.log("Test", result);
})

// Login API===>

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password");
        if (user) {
            resp.send(user);
        }
        else {
            resp.send({ result: "No result found" });
        }
    }
    else {
        resp.send({ result: "No result found" });
    }
})

// Add Product API===>

app.post("/add-product", async (req, resp)=>{
    let product = new Product(req.body);
    let result = await product.save();
    resp.send(result);
    console.log(result);
})

// Get Product API===>

app.get("/products", async(req, resp)=>{
    let products =  await Product.find();
    if(products.length > 0){
        resp.send(products);
    }else{
        resp.send({result: "No Products found"});
    }
})

// Delete Product API ===>

app.delete("/product:id", async(req, resp)=>{
    const result = await Product.deleteOne({_id: req.params.id});
    resp.send(result);
})

app.listen(5000);