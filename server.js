"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
const mongoose = require("mongoose");
const cors = require("@koa/cors");
require("dotenv").config();


const app = new Koa();
const router = new Router();

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI missing in .env");
  process.exit(1);
}

// anslut till mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log("Connected to MongoDB");})
  .catch(err => { console.error("Connection failed", err);});

  // hämta böcker
  router.get("/books", async ctx => {
    ctx.body = await Book.find();
  });

  // hämta böcker genom id
  router.get("/books/:id", async ctx => {
    const book = await Book.findById(ctx.params.id);
    if (!book) ctx.throw(404, "Book not found");
    ctx.body = book;
  });

  // skapa en bok
  router.post("/books", async ctx => {
    const newBook = new Book(ctx.request.body);
    const savedBook = await newBook.save();
    ctx.body = savedBook;
  });

  // uppdatera en bok
  router.put("/books/:id", async ctx => {
    const updated = await Book.findByIdAndUpdate(
      ctx.params.id, 
      ctx.request.body,
      { new: true }
    );
    if (!updated) ctx.throw(404, "Book not updated");
    ctx.body = updated;
  });

  // radera en bok
  router.delete("/books/:id", async ctx => {
    const deleted = await Book.findByIdAndDelete(ctx.params.id);
    if (!deleted) ctx.throw("Book not deleted");
    ctx.body = { message: "Book deleted" };
  });

  app.use(bodyParser());
  app.use(cors());
  app.use(router.routes());
  app.use(router.allowedMethods());

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log("Server is running on port: " + PORT));