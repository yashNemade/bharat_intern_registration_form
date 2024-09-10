const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const dotenv = require("dotenv");

const app = express();
require("dotenv").config();

const port = process.env.PORT || 3000;


const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;


// Try catch for error handling
( async () => {
    try {
        await mongoose.connect(`mongodb+srv://${username}:${password}@yash.yv9n3.mongodb.net/biRegirationDB`, {useNewUrlParser : true, useUnifiedTopology : true});
        app.on("error", (error) => {
            console.log("error");
            throw error;
        })
    } catch (error) {
        console.log("error", error);
        throw error;
    }
})()



// registration schema
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
});


// model of registration schema
const registration = mongoose.model("registration", registrationSchema);

// model of registration schema
app.use(bodyParser.urlencoded ({ extended: true}));
app.use(bodyParser.json());



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});


app.post("/register", async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await registration.findOne({email: email});
        if (!existingUser) {    
            const registrationData = new registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else{
            console.log("User already exist");
            res.redirect("/error");
        }

    } catch (error){
        console.log(error);
        res.redirect("error");
    }
});


app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});


app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});
