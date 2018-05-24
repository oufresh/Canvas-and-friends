module.exports = {
    entry: './src/app.js',
    output: {
        filename: './bundle.js'
    },
    watch: true,
    devtool: 'source-map',
	performance : {
		hints : false
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
          /*loader: 'babel-loader',
          query: { 
            //presets: ['env'],
            //plugins: ['transform-class-properties']
			plugins: ["transform-es2015-modules-commonjs"]
          } */
        }]
    }
  };