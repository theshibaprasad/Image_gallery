const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true
    },
    caption: {
        type: String,
        required: [true, 'Caption is required'],
        trim: true,
        minlength: [3, 'Caption must be at least 3 characters long'],
        maxlength: [500, 'Caption must not exceed 500 characters']
    }
}, {
    timestamps: true
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;