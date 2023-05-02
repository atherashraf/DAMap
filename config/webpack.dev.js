const webpack = require('webpack');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: 'development',
    // devtool: 'inline-source-map',
    devtool: 'source-map',
    devServer: {
        static: path.resolve(__dirname, './dist'),
        // compress: true,
        historyApiFallback: true,
        port: process.env.port || 3000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            // title: 'Production',
            template: path.join(__dirname, "../public", "index.html"),
        }),
    ]

});
