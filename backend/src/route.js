const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadImage } = require('./services/storage.service');
const Post = require('./models/post.model');

// Configure multer with file size limit and file type filter
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});


router.get("/", (req, res) => {
     res.send("Hello World");
})

router.post("/createpost", upload.single("image"), async (req, res) => {
    try {
        // Validate file upload
        if (!req.file) {
            return res.status(400).json({ 
                ok: false,
                error: "No image file uploaded" 
            });
        }

        // Validate caption
        const caption = req.body.caption?.trim();
        if (!caption) {
            return res.status(400).json({ 
                ok: false,
                error: "Caption is required" 
            });
        }

        if (caption.length < 3) {
            return res.status(400).json({ 
                ok: false,
                error: "Caption must be at least 3 characters long" 
            });
        }

        if (caption.length > 500) {
            return res.status(400).json({ 
                ok: false,
                error: "Caption must not exceed 500 characters" 
            });
        }

        // Upload image to imagekit
        const uploadResult = await uploadImage(req.file);
        
        if (!uploadResult || !uploadResult.url) {
            return res.status(500).json({ 
                ok: false,
                error: "Failed to upload image to storage" 
            });
        }

        // Save to database
        const post = new Post({
            image: uploadResult.url,
            caption: caption
        });
        
        await post.save();
        
        res.status(201).json({ 
            ok: true, 
            message: "Post created successfully",
            data: post 
        });
    } catch (error) {
        console.error('Error creating post:', error);
        
        // Handle multer errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                ok: false,
                error: "File size too large. Maximum size is 5MB" 
            });
        }

        if (error.message === 'Only image files are allowed!') {
            return res.status(400).json({ 
                ok: false,
                error: error.message 
            });
        }

        // Generic error handler
        res.status(500).json({ 
            ok: false,
            error: error.message || "Failed to create post" 
        });
    }
})

router.get("/getposts", async (req, res) => {
    try {
        // Sort by _id descending to show newest posts first
        // _id is generated chronologically, so this works even for old posts without createdAt
        const posts = await Post.find().sort({ _id: -1 });
        res.status(200).json({ 
            ok: true, 
            count: posts.length,
            data: posts 
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ 
            ok: false,
            error: "Failed to fetch posts" 
        });
    }
})


module.exports = router;