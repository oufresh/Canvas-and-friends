const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');
//const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: './bundle.js'
    },
    externals: {
      canvas: 'canvas-5-polyfill'
    },
    watch: true,
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      port: 9000
    },
    module: {
        rules: [
        {
          test: /\.css$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" }
          ]
        },{
          test: /\.js$/,
          exclude: /(node_modules)///,
         /* loader: 'babel-loader',
          query: { 
            presets: ['env']
            //plugins: ['transform-class-properties']
			     // plugins: ["transform-es2015-modules-commonjs"]
          }*/
        }]
    },
    plugins: [
      //new HtmlWebpackPlugin({title: 'Output Management'}),
      //new CleanWebpackPlugin(['dist']),
      new CopyWebpackPlugin([{
          from: './src/index.html',
          to: './index.html'
      },{
        from: './node_modules/canvas-5-polyfill/canvas.js',
        to: './canvas.js'
      }])
    ]
  };