var path = require("path");
var loaders = require('./webpack/loaders');

module.exports = {
    entry: {
        app: [
            path.join(__dirname, 'src', 'app.tsx')
        ]
    },
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "http://localhost:8080/",
        filename:"[name].js"
    },
    cssnext: {
        browsers: "last 2 versions"
    },
    resolve: {
        // Add `.ts` and `.tsx` and `.css` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.css'],
        alias: {
             //jquery: "../node_modules/jquery/dist/jquery"
        }    
    },
    module: {
        loaders: [
            loaders.tsx,
            loaders.html,
            loaders.css,
            loaders.svg,
            loaders.eot,
            loaders.woff,
            loaders.woff2,
            loaders.ttf
        ]
    }
};
