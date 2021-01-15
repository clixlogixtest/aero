const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const iconSchema = new mongoose.Schema({
    hostId: {
        type: String
    },
    order: {
        type: Number,
        required: true
    },
    type: {
        type: String
    },
    enabled: {
        type: Boolean,
        default: true
    },
    style: {
        type: String
    },
    background: {
        type: String
    },
    color: {
        type: String
    },
    iconType: {
        type: String,
        default: 'page'
    },
    iconButtonColor: {
        type: String,
        default: '#1d3c3f'
    },
    iconLabel: {
        type: String,
        required: true
    },
    iconHref: {
        type: String,
        default: 'www.google.com'
    },
    iconImage: {
        type: String,
        default: 'https://res.cloudinary.com/dww89xxkb/image/upload/v1599991402/pngbarn_fnnwtg.png'
    },
    iconKey: {
        type: String
    },
    iconLinkName: {
        type: String
    }
}, {timestamps: true})

const Icon = mongoose.model('Icon', iconSchema);

module.exports = Icon