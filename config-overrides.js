const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
    addWebpackAlias({
        'ol/Map': path.resolve(__dirname, 'node_modules/ol/Map.js')
    })
);
