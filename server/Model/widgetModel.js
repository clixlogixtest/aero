const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const widgetSchema = new mongoose.Schema({
    hostId: {
        type: String,
        required: true
    },
    hostEmail: {
        type: String
    },
    enabled: {
        type: Boolean,
        default: false
    },
    widgetPosition: {
        type: String,
        default: 'bottom-right'
    },
    widgetShape: {
        type: String,
        default: 'circle'
    },
    widgetMb: {
        type: Number,
        default: 3
    },
    widgetMr: {
        type: Number,
        default: 2
    },
    widgetButtonColor: {
        type: String,
        default: '#1d3c3f'
    },
    label: {
        type: String,
        default: 'labelOn'
    },
    labelFc: {
        type: String,
        default: '#ffffff'
    },
    labelBc: {
        type: String,
        default: '#596c6c'
    },
    customCSS: {
        type: String
    },
    Facebook: {
        type: String,
        default: ''
    },
    Whatsapp: {
        type: String,
        default: ''
    },
    Slack: {
        type: String,
        default: ''
    },
    Drift: {
        type: String,
        default: ''
    },
    plan: {
        type: String,
        default: 'free'
    },
    impressions: {
        type: Number,
        default: 500
    },
    iconCount: {
        type: Number,
        default: 0
    },
    floatingCart: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String
    },
    subscriptionRefresh: {
        type: Number,
        default: Date.now() + 2592000000
    }
}, { timestamps: true })

const Widget = mongoose.model('Widget', widgetSchema);

module.exports = Widget