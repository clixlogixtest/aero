const Icon = require('../Model/iconsModel');
const Widget = require('../Model/widgetModel');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
dotenv.config();

// CLOUDINARY CONFIG
cloudinary.config({cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET})

exports.createIcon = async(ctx) => {
    const body = ctx.request.body;
    //console.log(body)
    // 1. Check widget Icon Count
    const widget = await Widget.find({hostId: body.hostId});

    // 2. If Plan is free and icon count is more than 2 return warning
    if (widget[0].plan === 'free' && widget[0].iconCount > 1) {
        return ctx.body = {
            status: 'fail',
            message: 'You can create only two icons with current plan'
        };
    }
    // 3. If plan is premium or Icon Count is less than two for free plan
    await Icon.create(body);

    // 4. Update Icon Count in Widget
    const newIconCount = widget[0].iconCount + 1;
    await Widget.findByIdAndUpdate(widget[0]._id, {iconCount: newIconCount});

    // 5. Send Back All Icon
    const icons = await Icon.find({hostId: body.hostId});
    ctx.body = {
        status: 'success',
        icons
    }
}

exports.getIcons = async(ctx) => {
    const id = ctx.request.params.hostId;
    const icons = await Icon.find({hostId: id});
    ctx.body = {
        status: 'success',
        icons
    }
}
exports.deleteIcon = async(ctx) => {
    // 1. Extract Params
    const id = ctx.request.params.id;
    const key = ctx.request.params.key

    const {hostId} = await Icon.findById(id);
    // 2. Delete Icon
    const icon = await Icon.findByIdAndDelete(id);

    // 3. Delete Icon Image from Cloudinary
    cloudinary
        .uploader
        .destroy(key)

    // 4. Send Response
    ctx.body = {
        status: 'success',
        icon
    }
    const widget = await Widget.find({hostId});
    const newIconCount = widget[0].iconCount - 1;
    await Widget.findByIdAndUpdate(widget[0]._id, {iconCount: newIconCount});
}
exports.updateIcon = async(ctx) => {
    const body = ctx.request.body;
    const id = ctx.request.params.id;
    const data = await Icon.findByIdAndUpdate(id, body);
    if (!data) 
        ctx.body = {
            status: 'fail'
        };
    ctx.body = {
        status: 'success',
        data
    };
}