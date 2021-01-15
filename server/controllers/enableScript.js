const createScript = async (ctx, accessToken, shop, HOST) => {
    const body = JSON.stringify({
      script_tag: {
        event: "onload",
        src: `https://res.cloudinary.com/launchtip/raw/upload/v1609750345/javascript/useaero.js`
      }
    })
    const scripts = await fetch(`https://${shop}/admin/api/2020-10/script_tags.json?limit=5`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": accessToken,
      }
    });
    const {script_tags} = await scripts.json();
    if(script_tags.length === 0){
      const response = await fetch(`https://${shop}/admin/api/2020-10/script_tags.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Shopify-Access-Token": accessToken,
      },
      body
    });
    const ress = await response.json();
    }
  };
  
  module.exports = createScript;