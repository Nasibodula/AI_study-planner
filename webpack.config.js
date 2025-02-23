// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// module.exports = {
//   entry: './src/index.js',  // Your application's entry point
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: '[name].[contenthash].js',
//     clean: true,
//     publicPath: '/'
//   },
//   mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
//   devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map',
//   resolve: {
//     extensions: ['.js', '.jsx', '.ts', '.tsx'],
//     alias: {
//       '@': path.resolve(__dirname, 'src')
//     }
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx|ts|tsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: [
//               '@babel/preset-env',
//               ['@babel/preset-react', { runtime: 'automatic' }]
//             ]
//           }
//         }
//       },
//       {
//         test: /\.css$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           'css-loader',
//           'postcss-loader'
//         ]
//       },
//       {
//         test: /\.js$/,
//         enforce: 'pre',
//         use: ['source-map-loader'],
//         exclude: [
//           /node_modules\/face-api\.js/  // Excludes face-api.js from source-map-loader
//         ]
//       },
//       {
//         test: /\.(png|svg|jpg|jpeg|gif)$/i,
//         type: 'asset/resource'
//       },
//       {
//         test: /\.(woff|woff2|eot|ttf|otf)$/i,
//         type: 'asset/resource'
//       }
//     ]
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       template: './public/index.html',
//       favicon: './public/favicon.ico'
//     }),
//     new MiniCssExtractPlugin({
//       filename: '[name].[contenthash].css'
//     })
//   ],
//   devServer: {
//     historyApiFallback: true,
//     hot: true,
//     open: true,
//     port: 3000,
//     client: {
//       overlay: {
//         errors: true,
//         warnings: false
//       }
//     }
//   },
//   optimization: {
//     splitChunks: {
//       chunks: 'all'
//     }
//   }
// };