const express = require('express');
const mongoose = require('mongoose')
const port = 4000;
const dotenv = require('dotenv')

const bodyParser = require("body-parser");

dotenv.config();

const app = express();

const fs = require("fs")
const path= require ("path")
const logStream = fs.createWriteStream(path.join(__dirname,"log.txt"),{
    flags:"a"
})
const errorStream = fs.createWriteStream(path.join(__dirname,"error.txt"),{
    flags:"a"
})

const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/job");
const { error } = require('console');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use((req, res, next) => {
   // console.log("Middleware executing...");
    const now = new Date();
    const time = ` ${now.toLocaleTimeString()} `;
    const log = `${req.method} ${req.originalUrl} ${time}`
    logStream.write(log + "\n")
   // console.log(req.originalUrl, time);
    next();
});

app.use("/api/auth",authRoutes)
app.use("/api/job",jobRoutes)


app.get("/",(req,res)=>{
    res.send("Backend Capstone").status(200);
})

app.use((err,req, res, next) => {
    const now = new Date();
    const time = ` ${now.toLocaleTimeString()} `;
    const log = `${req.method} ${req.originalUrl} ${time} `
    errorStream.write(error + err.stack + "\n")
    res.status(500 ).send("internal server error");
});

app.use((req, res, next) => {
    const now = new Date();
    const time = ` ${now.toLocaleTimeString()} `;
    const log = `${req.method} ${req.originalUrl} ${time} `
    errorStream.write(error + "\n")
    res.status(404 ).send("route not found");
    
});

app.listen(port,()=>{
    mongoose
    .connect(process.env.MONGODB_URL)
    .then(()=>console.log("connected to Db"))
    .catch((error)=>console.log(error))
})