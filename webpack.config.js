const HtmlWebPackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebPackPlugin = require("script-ext-html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const plugins = (env) => {
    const allPlugins = ([

        // Copies the index.html template and tells it where to inject the script tags 
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "index.html",
            inject: "head",
          }),
          // This will defer the script until the page has been loaded, extension of HtmlWebPackPlugin
          new ScriptExtHtmlWebPackPlugin({
            defaultAttribute: 'defer'
          }),
          // We can define constants here 
          new webpack.DefinePlugin({                        
            _DEFAULT_GREETING: JSON.stringify("This is a sample project constant."),
        }),
        // HMR
        new webpack.HotModuleReplacementPlugin(),
        // Copy any static resources required to the dist folder  
        new CopyWebpackPlugin([
            { from: "src/images", to: "images" }
        ]),       
    ]);

    // If we are not doing any analysis on the bundle then we don't need this. 
    if (env && env.ANALYSE_BUNDLES) {
        allPlugins.push(new BundleAnalyzerPlugin());
    }
    return allPlugins;
}

module.exports = env => {
    return {
    mode: "development",
    entry: { 
        app: "./src/index.tsx",        
    },
    output: {
        filename: "[name].[hash].js",
        path: path.resolve("dist"),        
    },
    stats: {
        children: false  
    },
    optimization: {
        splitChunks: {
          cacheGroups: {
            node_vendors : {
                test : /[\\/]node_modules[\\/]/,
                chunks: 'all',
                name: 'vendor',
                priority: 1,
            },                 
          }
        },
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
        extensions: [".ts",".tsx",".js",".json"],
        plugins: [
            new TsConfigPathsPlugin()
        ]
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
    plugins: plugins(env)
}
};
