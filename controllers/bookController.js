"use strict";

const Book = require("../models/Book");
const mongoose = require("mongoose");

// hämta alla böcker
exports.getAllBooks = async (ctx) => {
    ctx.body = await Book.find();
};

// hämta bok med id
exports.getBookById = async (ctx) => {
    const id = ctx.paramd.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        ctx.throw(400, "Invalid ID");
    }
};

// lägg till bok
exports.createBook = async (ctx) => {
    const newBook = new Book(ctx.request.body);
    const savedBook = await newBook.save();
    ctx.body = savedBook;
};

// uppdatera en bok
exports.updatedBook = async (ctx) => {
    const id = ctx.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        ctx.throw(400, "Invalid ID");
    }

    const updated = await Book.findByIdAndUpdate(id, ctx.request.body, { new: true });
    if (!updated) ctx.throw(404, "Book not updated");
    ctx.body = updated;
};

// radera en bok
exports.deleteBook = async (ctx) => {
    const id = ctx.paramd.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        ctx.throw(400, "Invalid ID");
    }

    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) ctx.throw(404, "Book not deleted");
    ctx.body = { message: "Book deleted" };
};



