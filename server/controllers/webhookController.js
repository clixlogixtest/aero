const Widget = require('../Model/widgetModel');
const Icon = require('../Model/iconsModel');
const dotenv = require('dotenv');
dotenv.config();

const {SILVER_IMPRESSION, GOLD_IMPRESSION} = process.env;

exports.activatePayment = async(ctx) => {
    if(!ctx.state.webhook) {
        return ctx.body ={
            status: "fail",
            message: "unauthorized request"
        }
    }
    // 1. Extract Webhook State Values
    const hostId = ctx.state.webhook.domain;
    const plan = ctx.state.webhook.payload.app_subscription.name;
    const status = ctx.state.webhook.payload.app_subscription.status;
    const id = ctx.state.webhook.payload.app_subscription.admin_graphql_api_id;
    const newSubscriptionRefresh = Date.now() + 2592000000;

    // 2. Find Account Related To hostId
    const accounts = await Widget.find({hostId: hostId});

    // 3. If Account Find Execute Action
    if (accounts && accounts[0]) {
        const account = accounts[0];

        // A. If status ACTIVE (i.e. Amount Paid)
        if (status === 'ACTIVE') {

            // Add Ons on Basis of Plan Purchased
            if (plan === 'silver') {
                const impressions = parseInt(SILVER_IMPRESSION);

                // Save new impressions with updated add ons
                await Widget.findByIdAndUpdate(account._id, {
                    plan: plan,
                    impressions,
                    paymentId: id,
                    subscriptionRefresh: newSubscriptionRefresh
                })
            }
            if (plan === 'gold') {
                const impressions = parseInt(GOLD_IMPRESSION);

                // Save new impressions with updated add ons
                await Widget.findByIdAndUpdate(account._id, {
                    plan: plan,
                    impressions,
                    paymentId: id,
                    subscriptionRefresh: newSubscriptionRefresh
                });
            }
            if (plan === 'platinum') {
                const impressions = 999999999999999;
                // Save new impressions with updated add ons
                await Widget.findByIdAndUpdate(account._id, {
                    plan: plan,
                    impressions,
                    paymentId: id,
                    subscriptionRefresh: newSubscriptionRefresh
                });
            }
        }
    }
    if (status === 'CANCELLED') {
        //console.log('cancelled')
    }
    if(status === 'DECLINED'){
        // console.log('declined)
    }
}
exports.uninstalled = async(ctx) => {
    let impressions;
    const hook = ctx.state.webhook;
    const widget = await Widget.findOne({hostId: hook.domain})
    if(!widget) return
    impressions = widget.impressions;
    if(widget.impressions > 500) impressions = 500;
    await Widget.findByIdAndUpdate(widget._id,{
      plan: 'free',
      impressions,
      paymentId: "",
      floatingCart: false,
      iconCount: 0,
      enabled:false
    })
    const icons = await Icon.find({hostId:hook.domain});
    if(icons.length > 0){
        icons.map(async(icon,i) => {
            await Icon.findByIdAndDelete(icon._id)    
        })
    }
}