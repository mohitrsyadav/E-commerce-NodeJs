const express = require("express");
const cors = require("cors");
require("./db/config");
const User = require("./db/users");
const app = express()
app.use(express.json());
app.use(cors());

// Resistor API==>

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

app.listen(5000);