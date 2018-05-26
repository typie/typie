module.exports = {
    devtool: 'inline-source-map',
    // devtool: 'cheap-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'string-replace-loader',
                options: {
                    search: '{%VERSION%}',
                    replace: process.env.npm_package_version,
                }
            },
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    project: "tsconfig.json",
                    config: "tslint.json"
                }
            }
        ]
    }
};