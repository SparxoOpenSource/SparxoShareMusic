var path = require("path");
var loaders = require('./webpack/loaders');
const webpack = require('webpack');


const postcssBasePlugins = [
  require('postcss-modules-local-by-default'),
  require('postcss-import')({
    addDependencyTo: webpack,
  }),
  require('postcss-cssnext')({
    browsers: ['ie >= 8', 'last 2 versions'],
  }),
];
const postcssDevPlugins = [];
const postcssProdPlugins = [
  require('cssnano')({
    safe: true,
    sourcemap: true,
    autoprefixer: false,
  }),
];
const postcssPlugins = postcssBasePlugins
  .concat(process.env.NODE_ENV === 'production' ? postcssProdPlugins : [])
  .concat(process.env.NODE_ENV === 'development' ? postcssDevPlugins : []);
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
    },
    postcss: () => {
        return postcssPlugins;
    }
};
