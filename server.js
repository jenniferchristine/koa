"use strict";

const Koa = require("koa"); // importerar koa
const bodyParser = require("koa-bodyparser"); // middleware för att läsa json
const mongoose = require("mongoose"); // mongoose för anslutning till mongodb
const cors = require("@koa/cors"); // middleware för anrop
const bookRoutes = require("./routes/bookRoutes"); // importerar routes för api

require("dotenv").config();

const app = new Koa(); // ny koa applikation

app.use(cors());
app.use(bodyParser());
app.use(bookRoutes.routes());
app.use(bookRoutes.allowedMethods());

// anslut till mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log("Connected to MongoDB"); })
  .catch(err => { console.error("Connection failed", err); });

// starta server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server is running on port: " + PORT));