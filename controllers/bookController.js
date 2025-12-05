"use strict";

const Book = require("../models/Book");
const mongoose = require("mongoose");

// funktion för mongoose validering
function formatValidationErrors(err) {
    const errors = {};

    for (let field in err.errors) {
        errors[field] = err.errors[field].message;
    }
    return errors;
}

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
        ctx.throw(err.status || 500, err.message || "Server error");
    }
};

// lägg till bok
exports.createBook = async (ctx) => {
    try {
        const newBook = new Book(ctx.request.body);
        const savedBook = await newBook.save();
        ctx.status = 201;

        ctx.body = savedBook;
    } catch (err) {
        if (err.name === "ValidationError") {
            ctx.status = 400;
            ctx.body = { errors: formatValidationErrors(err) };
        } else {
            console.error("Error in createBook: ", err);
            ctx.throw(500, "Server error");
        }
    }
};

// uppdatera en bok
exports.updateBook = async (ctx) => {
    try {
        const id = ctx.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            ctx.throw(400, "Invalid ID");
        }

        const updated = await Book.findByIdAndUpdate(
            id,
            ctx.request.body,
            { new: true, runValidators: true }
        );

        if (!updated) ctx.throw(404, "Book could not update");

        ctx.body = updated;
    } catch (err) {
        if (err.name === "ValidationError") {
            ctx.status = 400;
            ctx.body = { errors: formatValidationErrors(err) };
        } else {
            console.error("Error in updateBook: ", err);
            ctx.throw(err.status || 500, err.message || "Server error");
        }
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
        ctx.throw(err.status || 500, err.message || "Server error");
    }
};