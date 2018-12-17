/**
* Gulp task provider for creating simple http server
*/
import gulp from 'gulp'

import Browser from 'browser-sync'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import webpackConfig from './webpack'

import config from './config'

gulp.task('server', function(done) {

    let browser = Browser.create();
    let bundler = webpack(webpackConfig);

    let browserConfg = {

        // Serve files from dist directory
        server: config.dist,

        // Serve an index.html file for all non-asset routes. Useful when using client-routers
        single: true,

        // Middlewares
        middleware: [

            // Do not cache service worker script
            function(req, res, next){
                if(req.originalUrl === '/sw.js') {
                    res.setHeader('Cache-Control', 'no-cache');
                }
                next();
            }
        ]
    };

    if(process.env.HMR) {

        /**
         * Add WebPack and Hot Reload middlewares to support
         * Hot Module Replacement in development environment
         */
        browserConfg.middleware = browserConfg.middleware.concat([
            webpackDevMiddleware(bundler, {
                publicPath: webpackConfig.output.publicPath,
                stats: { colors: true }
            }),
            webpackHotMiddleware(bundler)
        ]);
    }

    if(process.env.NODE_ENV === 'production') {

        /**
         * Disable most of BrowserSync options to create conditions as close
         * as possible to production environment
         */
        browserConfg = Object.assign({}, browserConfg, {
            // Disable UI completely
            ui: false,

            // Disable ghost mode
            ghostMode: false,

            // Disable notifications
            notify: false,

            // Don't try to inject, just do a page refresh
            injectChanges: false,

            // Don't send any file-change events to browsers
            codeSync: false,

            // Do not inject snipper
            snippetOptions: {

                // Ignore all HTML files
                ignorePaths: "*.html",
            }
        });
    }

    browser.init(browserConfg);
    done();
});
