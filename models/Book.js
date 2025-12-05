"use strict";

const mongoose = require("mongoose");

// skapa bookschema
const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Titel måste anges"],
        trim: true
    },
    publication: { 
        type: Number, 
        required: [true, "Utgivningsår måste anges"], 
        min: [0, "Utgivningsår kan inte vara 0"],
        validate: {
            validator: Number.isInteger,
            message: "Utgivningsår måste vara ett heltal"
        }
    },
    read: { 
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model("Book", bookSchema);