// DEFAULT IMPORTS
require('isomorphic-fetch');
const mongoose = require('mongoose');
const Koa = require('koa');
const KoaRouter = require('koa-router');
const {receiveWebhook, registerWebhook} = require('@shopify/koa-shopify-webhooks');
const next = require('next');
const {default: createShopifyAuth} = require('@shopify/koa-shopify-auth');
const dotenv = require('dotenv');
const {verifyRequest} = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const koaBody = require('koa-body')
const cors = require('@koa/cors');

// ROUTE CONTROLLERS
const iconsController = require('./server/controllers/iconsController');
const webhookController = require('./server/controllers/webhookController');
const widgetController = require('./server/controllers/widgetController');
const imageController = require('./server/controllers/imageController');
const viewController = require('./server/controllers/viewsController');
const requestController = require('./server/controllers/requestsController');
const createScript = require('./server/controllers/enableScript'); 

dotenv.config();

// GRAPHQL IMPORTS
const {default: graphQLProxy} = require('@shopify/koa-shopify-graphql-proxy');
const {ApiVersion} = require('@shopify/koa-shopify-graphql-proxy');

// DEFAULT VALUES
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({dev});
const handle = app.getRequestHandler();

const {SHOPIFY_API_SECRET_KEY, SHOPIFY_API_KEY, HOST, SECRET} = process.env;

// SETUP SERVER AND ROUTER
const server = new Koa();

const router = new KoaRouter();

// CUSTOM WIDGET ROUTES HANDLED HERE
router.post('/api/v1/widget', koaBody(), widgetController.createWidget)
router.patch('/api/v1/widget', koaBody(), widgetController.updateWidget)
router.get('/api/v1/widget/:hostId', widgetController.getWidget)
router.patch('/api/v1/widget/unsubscribe/:hostId', requestController.unsubscribeSubscription)

// CUSTOM ICON ROUTES HANDLED HERE
router.post('/api/v1/icon', koaBody(), iconsController.createIcon)
router.patch('/api/v1/icon/:id', koaBody(), iconsController.updateIcon)
router.get('/api/v1/icon/:hostId', iconsController.getIcons)
router.delete('/api/v1/icon/:id/:key', iconsController.deleteIcon)

// VIEW ROUTE HANDLED HERE
router.get('/widget/:hostId', viewController.viewWidget);

//IMAGE ROUTES HANDLED HERE
router.post('/api/v1/uploads', koaBody(), imageController.imageUpload);
router.patch('/api/v1/uploads/:id/:key', koaBody(), imageController.imageUpdate);

// WEBHOOK ROUTES ARE HANDLED HERE
const webhook = receiveWebhook({secret: SHOPIFY_API_SECRET_KEY});
router.post('/webhooks/app_subscriptions/update', webhook, webhookController.activatePayment);
router.post('/webhooks/app/uninstalled', webhook, webhookController.uninstalled );

router.post('/customers/redact',webhook, (ctx)=>{
    ctx.body={
        status: "success"
    }
});
router.post('/shop/redact',webhook, (ctx)=>{
    ctx.body={
        status: "success",
        message: "request receieved"
    }
});
router.post('/customers/data_request', webhook, (ctx)=>{
    ctx.body={
        status: "success",
        message: "request receieved"
    }
});

// REQUEST ROUTES HERE
router.post('/api/v1/request/page', koaBody(), requestController.getPages);
router.post('/api/v1/request/blog', koaBody(), requestController.getBlogs);
router.post('/api/v1/request/articles', koaBody(), requestController.getArticles);

// INTEGRATE ROUTER TO SERVER
server.use(cors({origin: "*"}));
server.use(router.routes());
server.use(router.allowedMethods());

// PREPARE APP FOR INTEGRATION WITH APP.PREPARE
app
    .prepare()
    .then(() => {
        server.use(session({
            sameSite: 'none',
            secure: true
        }, server));
        server.keys = [SHOPIFY_API_SECRET_KEY];
        server.use(
        // MAKE SHOPIFY AUTHENTICATION
        createShopifyAuth({
            apiKey: SHOPIFY_API_KEY,
            secret: SHOPIFY_API_SECRET_KEY,
            scopes: [
                'read_products', 'read_script_tags', 'write_script_tags', 'read_content'
            ],
            // RUN BELOW FUNCTIONS FOR ONCE AFTER SUCCESSFUL AUTHENTICATION
            async afterAuth(ctx) {
                const {shop, accessToken} = ctx.session;
                // 1. Set Cookies
                ctx
                    .cookies
                    .set('shopOrigin', shop, {
                        httpOnly: false,
                        secure: true,
                        sameSite: 'none'
                    });
                ctx
                    .cookies
                    .set('aeroSecret', SECRET + shop, {
                        httpOnly: false,
                        secure: true,
                        sameSite: 'none'
                    });
                ctx
                    .cookies
                    .set('accessToken', accessToken, {
                        httpOnly: false,
                        secure: true,
                        sameSite: 'none'
                    });
                
                
                // 2. Add update Subscription webhook
                const registration = await registerWebhook({address: `${HOST}/webhooks/app_subscriptions/update`, topic: 'APP_SUBSCRIPTIONS_UPDATE', accessToken, shop, apiVersion: ApiVersion.July20});
                // 3. Check for webhook registration
                if (registration.success) {
                    console.log('Successfully Registered Subscription Webhook!');
                } else {
                    console.log('Failed to register webhook', registration.result);
                }
                const res = await registerWebhook({address: `${HOST}/webhooks/app/uninstalled`, topic: 'APP_UNINSTALLED', accessToken, shop, apiVersion: ApiVersion.July20 });
                if(res.success) console.log('uninstall webhook registered');

                await requestController.initiateInstallation(ctx, shop)
                await createScript(ctx, accessToken, shop, HOST)
                // 4. Redirect to homepage
                ctx.redirect('/');
            }
        }));

        // APPLYING APOLLO TO MIDDLEWARE
        server.use(graphQLProxy({version: ApiVersion.July20}))

        // VERIFY ALL REQUESTS BEFORE PROCESSING
        server.use(verifyRequest());
        server.use(async(ctx) => {
            await handle(ctx.req, ctx.res);
            ctx.respond = false;
            ctx.res.statusCode = 200;
        });
        // LISTEN TO PORT
        server.listen(port, () => {
            console.log(`Server ready on http://localhost:${port}`);
        });
    })

// CREATE AND CONNECT DATABASE CONNECTION
const DB = process.env.mongoURI;
mongoose
    .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(() => console.log('DB connection successful!'));

process.on('uncaughtException', (error) => {
    console.log('Oh my god, something terrible happened: ', error);
    process.exit(1); // exit application
})