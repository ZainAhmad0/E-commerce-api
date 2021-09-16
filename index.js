// const express = require('express');
import express from "express";
import user from "./routes/api/controllers/user/index.js"

const app = express();

//In it middleware
app.use(express.json()); // this allows us to take request.body data


// Defining Routes
app.use('/api/user', user)


app.get('/', (req, res) => res.send("API Running"));


const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server started on port no ${PORT}`))