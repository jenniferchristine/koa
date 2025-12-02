"use strict";

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const cors = require("@koa/cors");
const bookRoutes = require("./routes/bookRoutes");

require("dotenv").config();

const app = new Koa();

app.use(cors());
app.use(bodyParser());
app.use(bookRoutes.routes());
app.use(router.allowedMethods());

// anslut till mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log("Connected to MongoDB"); })
  .catch(err => { console.error("Connection failed", err); });

// starta server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running on port: " + PORT));