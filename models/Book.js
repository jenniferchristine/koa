"use strict";

const mongoose = require("mongoose");

// skapa bookschema, validering
const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, "Titel måste anges"],
        trim: true
    },
    publication: { 
        type: Number, 
        required: [true, "Utgivningsår måste anges"], 
        min: [1, "Utgivningsår måste anges och kan inte anges som 0"],
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