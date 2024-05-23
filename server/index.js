const express = require('express');
const port = 4000;
const bodyParser = require("body-parser");

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
app.use((req, res, next) => {
    const now = new Date();
    const time = ` ${now.toLocaleTimeString()} `;
    const log = `${req.method} ${req.originalUrl} ${time} `
    errorStream.write(log + "\n")
    res.status(404 ).send("route not found");
    
});

app.listen(port,()=>{
    console.log('server running')
})