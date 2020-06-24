const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const postsRoutes = require("./routes/posts");
const userRoutes =require("./routes/user");
const app = express();

// var mongoDB = 'mongodb://127.0.0.1/my_database';
// mongoose.connect(mongoDB, { useNewUrlParser: true });

// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

mongoose.connect("mongodb+srv://saman:"+process.env.MONGO_ATLAS_PW +
"@cluster0-sgf1k.mongodb.net/node-angular?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log("connected to mongodb")
})
.catch(() => {
  console.log("connection failed!")
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));
app.use("/", express.static(path.join(__dirname, "postCreate")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers",
   "Origin, X-Requested-With, Content-Type, Accept, Authorization");
   res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH, OPTIONS");
next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use((req, res, next)=>{
  res.sendFile(path.join(__dirname,"postCreate", "index.html"));
});


// app.use((req, res, next) => {
//   console.log("first middleware");
//   next();
// });

// app.use((req, res, next) => {
//   res.send("second middleware");
// });

module.exports = app;
