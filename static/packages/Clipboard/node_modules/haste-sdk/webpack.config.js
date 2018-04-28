const path = require('path');
const pkg = require('./package.json');

let libraryName = pkg.name;

module.exports = {
    target: 'node',
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: './dist/index.js',
        path: path.resolve(__dirname),
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['ts-loader', 'tslint-loader'],
                exclude: '/node_modules/'
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    }
};