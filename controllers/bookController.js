"use strict";

const Book = require("../models/Book");
const mongoose = require("mongoose");

// hämta alla böcker
exports.getAllBooks = async (ctx) => {
    try {
        const books = await Book.find();
        ctx.body = books;
    } catch (err) {
        console.error("Error in getAllBooks: ", err);
        ctx.throw(500, "Server error");
    }
};

// hämta bok med id
exports.getBookById = async (ctx) => {
    try {
        const id = ctx.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            ctx.throw(400, "Invalid ID");
        }

        const book = await Book.findById(id);
        if (!book) ctx.throw(404, "Book not found");
        ctx.body = book;
    } catch (err) {
        console.error("Error in getBookById:", err);
        ctx.throw(500, "Server error");
    }
};

// lägg till bok
exports.createBook = async (ctx) => {
    try {
        const newBook = new Book(ctx.request.body);
        const savedBook = await newBook.save();
        ctx.body = savedBook;
    } catch (err) {
        console.error("Error in createBook: ", err);
        ctx.throw(500, "Server error");
    }
};

// uppdatera en bok
exports.updateBook = async (ctx) => {
    try {
        const id = ctx.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            ctx.throw(400, "Invalid ObjectID");
        }

        const updated = await Book.findByIdAndUpdate(id, ctx.request.body, { new: true });

        if (!updated) ctx.throw(404, "Book not updated");
        ctx.body = updated;
    } catch (err) {
        console.error("Error in updateBook: ", err);
        ctx.throw(500, "Server error");
    }
};

// radera en bok
exports.deleteBook = async (ctx) => {
    try {
        const id = ctx.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            ctx.throw(400, "Invalid ID");
        }

        const deleted = await Book.findByIdAndDelete(id);
        if (!deleted) ctx.throw(404, "Book not deleted");
        ctx.body = { message: "Book deleted" };
    } catch (err) {
        console.error("Error in deleteBook: ", err);
        ctx.throw(500, "Server error");
    }
};