"use strict";

const mongoose = require("mongoose");

// skapa bookschema
const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    publication: { type: Number, required: true },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model("Book", bookSchema);