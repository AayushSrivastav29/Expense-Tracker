const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./utils/db-connection");
const path = require("path");
const fs = require("fs");
const morgan = require('morgan')
require('dotenv').config();

//
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "view")));

//importing models
require("./models");

//importing routes
const userRoute = require("./routes/userRoute");
const expenseRoute = require("./routes/expenseRoute");
const paymentRoute = require("./routes/paymentRoute");
const premiumRoute = require("./routes/premiumRoute");


app.use("/api/user", userRoute);
app.use("/api/expense", expenseRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/premium", premiumRoute);

const accessLog = fs.createWriteStream(path.join(__dirname,'access.log'), {flags: 'a'})
app.use(morgan('combined', {stream:accessLog}))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "view", "home.html"));
});


app.all("/{*any}", (req, res) => {
  const htmlFiles = [
    "/view/home.html",
    "/view/dashboard.html",
    "/view/paymentPage.html",
    
  ];
  if (htmlFiles.includes(req.path)) {
    return res.sendFile(path.join(__dirname, "view", req.path));
  }

  // For all other requests, serve the file if it exists
  const filePath = path.join(__dirname, "public", req.path);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  return res.sendFile(path.join(__dirname, "view/notFound.html"));
});

const PORT = process.env.PORT;


db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
 