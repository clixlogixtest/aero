const Icon = require('../Model/iconsModel');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config();

// // CLOUDINARY CONFIG
cloudinary.config({cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET})

exports.imageUpload = async(ctx) => {
    const body = ctx.request.body;
    const result = await cloudinary
        .uploader
        .upload(body.image, result => {}, {
            public_id: `${Date.now()}`, // Public Name
            resource_type: 'auto' //JPEG PNG etc
        })
    ctx.body = {
        url: result.url,
        public_id: result.public_id
    }
}

exports.deleteUpload = (ctx) => {
    const image_id = ctx.request.body.public_id;

    cloudinary
        .uploader
        .destroy(image_id, (error, result) => {
            if (error) 
                return ctx.bocy = {
                    status: 'fail'
                }
            ctx.body = {
                status: 'success'
            }
        }, {
            public_id: `${Date.now()}`, // Public Name
            resource_type: 'auto' //JPEG PNG etc
        })

}

exports.imageUpdate = async(ctx) => {

    const key = ctx.request.params.key
    const id = ctx.request.params.id

    cloudinary
        .uploader
        .destroy(key);

    const body = ctx.request.body;
    const result = await cloudinary
        .uploader
        .upload(body.image, result => {}, {
            public_id: `${Date.now()}`, // Public Name
            resource_type: 'auto' //JPEG PNG etc
        })
    const icon = await Icon.findByIdAndUpdate(id, {
        iconImage: result.url,
        iconKey: result.public_id
    })
    ctx.body = {
        url: result.url,
        icon
    }
}