const mongoose = require('mongoose');

const menuSchema = mongoose.Schema({
    title: String,
    path: String,
    order: Number,
    active: Boolean,
});

module.exports = mongoose.model("Menu", menuSchema);