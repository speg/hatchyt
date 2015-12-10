module.exports = {
    entry: {
        editor: "./dist/public/js/editor.js",
        hatchyt: "./dist/public/js/hatchyt.js"
    },
    devtool: "source-map",
    output: {
        path: "./dist/public/js/",
        filename: "[name].packed.js"
    },
    module: {
        loaders: [
            // { test: /\.css$/, loader: "style!css" }
        ]
    }
};