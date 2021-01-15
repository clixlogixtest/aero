const Widget = require('../Model/widgetModel');
const Icon = require('../Model/iconsModel');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const {EMAIL_HOST, EMAIL_USERNAME, EMAIL_PASSWORD, APP_NAME} = process.env

let mailTransporter = nodemailer.createTransport({
    service: 'SendinBlue',
    host: EMAIL_HOST,
    port: 587,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});

const sendMail = (receipt, message, host) => {
    let mailDetails = {
        from: 'aero@launchtip.com',
        to: receipt,
        subject: 'Shopfy AERO Impression Alert',
        html: `<div style="width: 100%; background-color: #F4F6F8;padding: 40px 30px;box-sizing: border-box;"><div style="text-align: center;"> <img style="height: 45px;margin-right: 6px;" src="https://res.cloudinary.com/dww89xxkb/image/upload/v1606224160/aero-v2.png" alt="logo"></div><div style="background-color:#ffffff;margin: auto;padding: 20px 16px;border: 1px solid #ddd;box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;color: grey;border-radius: 1px;margin-top: 10px;"><p style="text-align: center;font-size: 25px; color:#0a1d30;"> Impressions Alert!</p><hr><p style="margin: 0;font-weight: bold;text-decoration: underline;margin-top: 20px;">Greetings,</p><p style="color: #2E2E2E;font-size: 14px;margin-top: 5px;"> ${message} </p><div style="text-align: center;padding-bottom: 20px;"> <a href="https://${host}/admin/apps/${APP_NAME}/pricing" target="_blank"> <button style="padding:10px 11px; padding-top: 11px; border: none;background-color: #5563c1;color: #ffffff;border-radius: 2px;cursor: pointer;margin-top: 10px;"> Upgrade Account </button> </a></div></div></div>`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            //console.log('Error Occurs', err);
        } else {
            //console.log('Email sent successfully');
        }
    });
}

exports.viewWidget = async(ctx) => {
    // Extract params
    const id = ctx.request.params.hostId

    // 1. Find Widget By Store using params
    let data = await Widget.findOne({hostId: id})

    // 2. Check Subscription Refresh Date
    if (!data) {
        return ctx.body = {
            status: 'fail',
            message: 'no store found'
        }
    }
    // + If subscription days not left || Add monthly impressions
    if (data.subscriptionRefresh < Date.now()) {
        const newSubscriptionRefresh = Date.now() + 2592000000;
        let newImpress = 500;
        if(data.paymentId && data.plan === "silver") newImpress = 1000
        if(data.paymentId && data.plan === "gold") newImpress = 10000
        if(data.paymentId && data.plan === "platinum") newImpress = 99999999999
        
        await Widget.findOneAndUpdate({
            _id: data._id
        }, {
            impressions: newImpress,
            subscriptionRefresh: newSubscriptionRefresh,
            plan: data.plan
        })
        data = await Widget.find({hostId: id})
    }
    // 3. If subscription days and impressions are there
    if (data.impressions === 100) {
        sendMail(data.hostEmail, "You are left with less than 100 Aero Impressions for the current month. Upgrade Your Account to continue showing Aero on Your store front.", data.hostId)
    }
    if (data.impressions === 1) {
        sendMail(data.hostEmail, "You have exhausted impressions for this month and Aero is no longer visible. Please upgrade your account to reactivate Aero.", data.hostId)
    }
    if (data.impressions !== 0) {
        const newImp = data.impressions - 1;
        await Widget.findByIdAndUpdate(data._id, {impressions: newImp})
        const icons = await Icon.find({hostId: id}).sort({order: 1});
        return ctx.body = {
            status: 'success',
            data,
            icons
        }
    } else if (data.impressions === 0) {
        return ctx.body = {
            status: 'fail',
            message: 'you have reached you impression limit'
        }
    }
}