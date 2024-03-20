const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';


module.exports = {
    mode,
    target,
    devtool: 'source-map',
    devServer: { 
        open: true,
        port: 8081
    },
    entry: {
        common: './src/common.js', 
        home: './src/pages/index/index.js',
        recipe: './src/pages/recipe/recipe.js',
        saved: './src/pages/saved/saved.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: '[name].[contenthash].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/pages/index/index.html',
            chunks: ['common', 'home']
        }),
        new HtmlWebpackPlugin({
            filename: 'recipe.html',
            template: './src/pages/recipe/recipe.html',
            chunks: ['recipe']
        }),
        new HtmlWebpackPlugin({
            filename: 'saved.html',
            template: './src/pages/saved/saved.html',
            chunks: ['saved']
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.scss$/i,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [require('postcss-preset-env')]
                            }
                        }
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: [
                      ['@babel/preset-env', { targets: "defaults" }]
                    ]
                  }
                }
            }
        ]
    }
}