/*import serve from "koa-static";
app.use(serve("./dist"));*/

"use strict";

const Koa = require("koa");
const Router = require("@koa/router");
const bodyParser = require("koa-bodyparser");
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

  // skapa bookschema
  const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    publication: { type: Number, required: true },
    read: { type: Boolean, default: false }
  });

  const Book = mongoose.model("Book", bookSchema);

  // hämta böcker
  router.get("/books", async ctx => {
    ctx.body = await Book.find();
  });

  // hämta böcker genom id
  router.get("/books/_id", async ctx => {
    const book = await Book.findById(ctx.params.id);
    if (!book) ctx.throw(404, "Book not found");
    ctx.body = book;
  });

  // uppdatera en bok
  router.put("/books/_id", async ctx => {
    const updated = await Book.findByIdAndUpdate(
      ctx.params.id, 
      ctx.request.body,
      { new: true }
    );
    if (!updated) ctx.throw(404, "Book not updated");
    ctx.body = updated;
  });

  // radera en bok
  router.delete("/books/_id", async ctx => {
    const deleted = await Book.findByIdAndDelete(ctx.params.id);
    if (!deleted) ctx.throw("Book not deleted");
    ctx.body = { message: "Book deleted" };
  });