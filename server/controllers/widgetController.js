const Widget = require('../Model/widgetModel');
const dotenv = require('dotenv');
dotenv.config();

const {SECRET} = process.env;
exports.createWidget = async(ctx) => {
    // 1. Extract Body and Host
    const body = ctx.request.body;
    const hostId = body.hostId;
    const secret = ctx
        .cookies
        .get('aeroSecret');
    if (secret !== (SECRET + body.hostId)) {
        return ctx.body = {
            status: 'fail',
            message: 'unauthorized request'
        }
    }

    // 2. Check For unauthorized Object
    if (body.impressions || body.plan || body.paymentId || body.subscriptionRefresh) {
        return ctx.body = {
            status: 'fail',
            message: 'unauthorized object'
        }
    }

    // 3. Check if Widget for the Host Already Exists
    const object = await Widget.find({hostId: hostId})

    // 4. If Widget Found Just Enable The Widget
    if (object.length !== 0) 
        return
    const data = await Widget.create(body)
    if (!data) 
        return ctx.body = {
            status: 'fail'
        }
    
    ctx.body = {
        status: 'success',
        widget: data,
        hostId,
        object: object
    }
}
exports.updateWidget = async(ctx) => {
    const body = ctx.request.body;

    const secret = ctx
        .cookies
        .get('aeroSecret');
    if (secret !== (SECRET + body.hostId)) {
        return ctx.body = {
            status: 'fail',
            message: 'unauthorized request'
        }
    }

    if (body.floatingCart) {
        const widg = await Widget.find({hostId: body.hostId});
        if (widg[0].plan === "free") {
            return ctx.body = {
                status: "fail",
                message: "unauthorized request"
            }
        }
    }
    // 1. Check For Unauthorized Object
    if (body.impressions || body.plan || body.paymentId || body.subscriptionRefresh) {
        return ctx.body = {
            status: 'fail',
            message: 'unauthorized object'
        }
    }
    // 2. Update Widget
    const data = await Widget.updateOne({
        hostId: body.hostId
    }, body)
    if (!data) 
        ctx.body = {
            status: 'fail'
        }
    ctx.body = {
        status: 'success',
        message: 'widget has been updated'
    }
}
exports.deleteWidget = async(ctx) => {
    const id = ctx.request.params.hostId;
    const secret = ctx
        .cookies
        .get('aeroSecret');
    if (secret !== (SECRET + id)) {
        return ctx.body = {
            status: 'fail',
            message: 'unauthorized request'
        }
    }
    const data = await Widget.deleteOne({hostId: id})
    ctx.body = {
        status: 'success',
        request: ctx.request.url,
        params: ctx.request.params.hostId,
        data
    }
}
exports.getWidget = async(ctx) => {
    const id = ctx.request.params.hostId
    let data = await Widget.find({hostId: id})

    try {
        if (!data[0]) {
            return ctx.body = {
                message: 'no store front'
            }
        }
        // Check if 30 Days over || If Over add 30 days and 500 impressions
        if (data[0].subscriptionRefresh < Date.now()) {
            let newImpress = 500;
            const newSubscriptionRefresh = Date.now() + 2592000000;
            if (data[0].plan === 'silver') 
                newImpress = 1000;
            if (data[0].plan === 'gold') 
                newImpress = 10000;
            if (data[0].plan === 'platinum') 
                newImpress = 99999999999999999999999999;
            await Widget.findOneAndUpdate({
                _id: data[0]._id
            }, {
                impressions: newImpress,
                subscriptionRefresh: newSubscriptionRefresh,
                plan: data[0].plan
            })
            data = await Widget.find({hostId: id})
        }
        // return response
        return ctx.body = {
            status: 'success',
            data
        }
    } catch (e) {
        //console.log(e)
        return null
    }

}
