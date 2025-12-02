/*import serve from "koa-static";
app.use(serve("./dist"));*/

"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
//const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
require("dotenv").config();


const app = new Koa();
const router = new Router();

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}

// anslut till mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Ansluten till MongoDB");
    process.exit(0);
  })
  .catch(err => {
    console.error("Anslutningen misslyckas", err);
    process.exit(1);
  });