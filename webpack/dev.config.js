const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',

    entry: {
        Uploader: './src/index.js'
    },

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: '/'
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js']
    },

    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: ['@babel/preset-env'],
                        }
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            UPLOADER_VERSION: `"${require('../package.json').version}"`
        })
    ]

}