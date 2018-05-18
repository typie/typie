module.exports = {
    devtool: 'inline-source-map',
    // devtool: 'cheap-source-map',
    module: {
        rules: [
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