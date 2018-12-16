const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const plugins = (env) => {
    const allPlugins = ([
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "index.html"
          }) ,
        new webpack.HotModuleReplacementPlugin(),        
    ]);

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
