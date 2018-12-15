const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "[name].[hash].js",
        path: path.resolve("dist"),        
    },
    stats: {
        children: false  
    },   
    devServer: {
        port: 8080,
        contentBase: "./dist",
        hot: true,   
        index: "index.html",    
        inline: true,   
        stats: {
            children: false  
          },     
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts",".tsx",".js",".json"]
    },    
    module: {
        rules: [
            // TSLinter and loader
            { test: /\.tsx?$/, enforce: 'pre',
                use: [
                    {
                        loader: 'tslint-loader',                        
                    }
                ]
            },

            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            // Exports HTML as a string and can minimise it, negates the use of CopyWebpackPlugin for 
            // index.html 
            {   test: /\.html$/, use: [ { loader: "html-loader", options: { minimize: true } } ] }
        ]
    },   
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "index.html"
          }) ,
        new webpack.HotModuleReplacementPlugin(),               
    ]
};
