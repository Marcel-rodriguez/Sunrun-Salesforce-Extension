const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
    entry:{
        popup: './src/popup.jsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [{test: /\.(js|jsx)$/,
        exclude: /node_modules/,
         use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-react'],
            },
          },
        },
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
            exclude: /node_modules/,
        }
      ],
    },
    plugins: [new HtmlWebpackPlugin({
        template: './src/popup.html',
        filename: 'popup.html',
    }),
    new MiniCssExtractPlugin({
        filename: 'popup.css',
    }),
    new CopyPlugin({
        patterns: [
          { from: "public" },
        ],
      }),
    ],
};