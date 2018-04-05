const path = require('path');
const pkg = require('./package.json');
const DtsPlugin = require('dts-webpack-plugin');

let libraryName = pkg.name;

module.exports = {
    target: 'node',
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname),
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                //use: 'babel-loader?presets[]=es2015!ts-loader',
                use: ['ts-loader'],
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
        // That Webpack plugin generate single TypeScript *.d.ts declaration file using dts-bundle.
        new DtsPlugin({
            name: 'index'
        })
    ]
};