const path = require("path");
const mix = require("laravel-mix");

// Rezolve Ziggy
mix.alias({
    ziggy: path.resolve("vendor/tightenco/ziggy/dist/vue"),
});

// Build files
mix.js("resources/js/app.js", "public/js")
    .vue({version: 3})
    .webpackConfig({
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "resources/js"),
            },
        },
    })
    .extract()
    .postCss("resources/css/app.css", "public/css", [//
    ])
    .version();

mix.sass('resources/sass/app.scss', 'public/css');

mix.copy('node_modules/admin-lte/dist/img', 'public/dist/img');
