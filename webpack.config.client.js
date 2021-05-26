const path = require('path')

module.exports = {
    target: 'web', // 运行环境
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_moudles/,
            use: {
                loader: 'babel-loader'
            }
        }]
    }
}