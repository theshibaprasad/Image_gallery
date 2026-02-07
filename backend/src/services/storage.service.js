const Imagekit = require('imagekit');

const imagekit = new Imagekit({
    publicKey: process.env.publicKey,
    privateKey: process.env.privateKey,
    urlEndpoint: process.env.urlEndpoint
})

const uploadImage = async (file) => {
    if (!file || !file.buffer) {
        throw new Error("Invalid file object");
    }
    
    const response = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: file.originalname || `image_${Date.now()}`,
        folder: "/images"
    });

    return response;
};

module.exports = { uploadImage };
