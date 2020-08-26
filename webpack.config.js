
module.exports = {
    entry: './src/js/index.jsx',
    output: {
        path: __dirname + '/public',
        filename: 'bundle.js',
        publicPath: '/'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: 'file-loader'
            }
        ]
    },
    devServer: {
        contentBase: __dirname + '/public',
        historyApiFallback: true
    }
};