const path = require('path')
const nodeExternals = require('webpack-node-externals')
module.exports = {
    target: 'node', // 运行环境
    mode: 'development',
    entry: './server.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'server.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_moudles/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    externals: [nodeExternals()]
}