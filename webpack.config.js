module.exports = {
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