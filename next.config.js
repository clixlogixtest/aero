require("dotenv").config();
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');

const apiKey =  JSON.stringify(process.env.SHOPIFY_API_KEY);
const host = JSON.stringify(process.env.HOST);
const SILVER = JSON.stringify(process.env.SILVER);
const GOLD = JSON.stringify(process.env.GOLD);
const PLATINUM = JSON.stringify(process.env.PLATINUM);
const SILVER_IMPRESSION = JSON.stringify(process.env.SILVER_IMPRESSION);
const GOLD_IMPRESSION = JSON.stringify(process.env.GOLD_IMPRESSION);
const PLATINUM_IMPRESSION = JSON.stringify(process.env.PLATINUM_IMPRESSION);
const TEST = JSON.stringify(process.env.TEST);
const SECRET = JSON.stringify(process.env.SECRET);

const pricing = {
  SILVER,
  GOLD,
  PLATINUM,
  SILVER_IMPRESSION,
  GOLD_IMPRESSION,
  PLATINUM_IMPRESSION,
  TEST
}
module.exports = withCSS({
  webpack: (config) => {
    const env = { API_KEY: apiKey, HOST: host, PRICING: pricing, SECRET };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
});