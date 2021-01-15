const Widget = require('../Model/widgetModel');
const Icon = require('../Model/iconsModel');

exports.getPages = async (ctx) => {
    const {domain, accessToken} = ctx.request.body;
    const response = await fetch(`https://${domain}/admin/api/2019-10/pages.json`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": accessToken,
      }
    })
  
    const responseJson = await response.json();
    ctx.body ={
        response: responseJson
    }
};
exports.getBlogs = async (ctx) => {
  const {domain, accessToken} = ctx.request.body;
  const response = await fetch(`https://${domain}/admin/api/2019-10/blogs.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken,
    }
  })

  const responseJson = await response.json();
  ctx.body ={
      response: responseJson
  }
};

exports.getArticles = async(ctx) => {
  const {domain, accessToken, blogId} = ctx.request.body;
  const response = await fetch(`https://${domain}/admin/api/2020-07/blogs/${blogId}/articles.json`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "X-Shopify-Access-Token": accessToken,
    }
  })

  const responseJson = await response.json();
  ctx.body ={
      response: responseJson
  }
};
exports.unsubscribeSubscription = async(ctx) => {
  const id = ctx.request.params.hostId;

  const widget = await Widget.findOne({hostId:id})
  let impressions = widget.impressions;
  if(widget.impressions > 500) impressions = 500;
  
  const obj = {
      plan: "free",
      paymentId: "",
      floatingCart: false,
      impressions
  }
  await Widget.findOneAndUpdate({
      hostId: id
  }, obj)
  const icons = await Icon.find({hostId:id});
  if(icons.length > 1){
      icons.map(async(icon,i) => {
          if(i > 1) await Icon.findByIdAndDelete(icon._id)    
      })
      await Widget.findOneAndUpdate({hostId: id}, {iconCount: 2})
  }
  ctx.body = {
      status: "success",
      message: "unsubscribed"
  }
}

exports.initiateInstallation = async(ctx, shop) => {
  try {
      const object = await Widget.find({hostId: shop})
      if (object.length === 0) {
          await Widget.create({hostId: shop})
          return ctx.body ={
              status: "success"
          }
      }
      return ctx.body = {
          status: "success"
      }
  } catch(error) {
      console.error("error is",error)
  }
}