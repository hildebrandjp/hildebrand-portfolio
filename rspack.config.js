const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const { TsCheckerRspackPlugin } = require('ts-checker-rspack-plugin');

// Ensure output directory exists
const outputPath = path.resolve(__dirname, '_site/assets/js');
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const DISABLE_COMMENTS_AND_CONSOLE_LOG = false;
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    entry: './_assets/js/app.ts',  // Your main JavaScript file
    output: {
        path: path.resolve(__dirname, 'assets/js/dist'),  // Output transpiled files to Jekyll's _site folder
        filename: 'app.js',  // Output bundle name
        clean: true,  // Clean output directory before each build
    },
    mode: isProduction ? 'production' : 'development',  // Switch based on NODE_ENV
    devtool: isProduction ? false : 'source-map',
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: DISABLE_COMMENTS_AND_CONSOLE_LOG,  // Remove console logs
                    },
                    mangle: {
                        properties: true  // Mangle property names (useful for making object property access unreadable)
                    },
                    format: {
                        comments: DISABLE_COMMENTS_AND_CONSOLE_LOG,  // Remove comments
                    },
                    keep_classnames: false,  // Obfuscate class names
                    keep_fnames: false,  // Obfuscate function names
                },
                extractComments: false,  // Don't extract comments to a separate file
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,  // Handle JavaScript files
                exclude: /node_modules/,  //
                use: {
                    loader: 'babel-loader',  // Use Babel to transpile ES6 to ES5
                    options: {
                        presets: ['@babel/preset-env'],  // Transpile ES6+
                    },
                },
            },
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                loader: 'builtin:swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                        },
                    },
                },
                type: 'javascript/auto',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, '_assets/js')
        }
    },
    plugins: [new TsCheckerRspackPlugin()],
    watchOptions: {
        ignored: /node_modules/,
        poll: 1000, // Enable polling for Docker compatibility
        aggregateTimeout: 300,
        followSymlinks: false,
    }
};