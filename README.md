# Integrate-Vue3-Inertia-adminLTE-with-Laravel8
> **NOTICE:** This guide was written using Laravel 8. It also works with Laravel 9 that's using Laravel Mix. If you're using Laravel 9 with Vite, follow this tutorial.

Before we dive in deep, we just want to make sure we have all the tools we need. We'll be using PHP 7, so make sure you have that installed, Composer and NPM. I'll briefly go over how to install Composer and NPM.

# 1. Installing Laravel

Please note that I'm using Laravel 8 and PHP 7.4.32.

Making sure we are in the desired folder we're going to require the Laravel's installer globally and then use it to create a new app called "**laravel8-vue3-inertia-adminLTE**" (this will automatically create the folder with the same name).

### 1.1 Create Project

*Using this command:*

    composer create-project laravel/laravel laravel8-vue3-inertia-adminLTE

### 1.2 Change Directory

*Using this command:*

    cd laravel8-vue3-inertia-adminLTE

### 1.3 Install: npm

*Using this command:*

    npm install
    
*Using this command:*  

    npm install --save @types/node

### 1.4 Run

*Using this command:*

    php artisan serv

### 1.5 Result
*The result like this:*

![](https://i.ibb.co/wWNGdm4/5-Result.png)

See more: https://laravel.com/

# 2. Install Vue.js

### 2.1 Install: vue
We'll be using version 3 of Vue. Let's add Vue 3.  

*Using this command:*

    npm install vue@next

### 2.2 Run

*Using this command:*

    npm run dev

# 3. Installing Inertia

Inertia is a new approach to building classic server-driven web apps. We call it the modern monolith.

Inertia allows you to create fully client-side rendered, single-page apps, without much of the complexity that comes with modern SPAs. It does this by leveraging existing server-side frameworks.

Inertia has no client-side routing, nor does it require an API. Simply build controllers and page views like you've always done!

See the [who is it](https://inertiajs.com/who-is-it-for) for and [how it works](https://inertiajs.com/how-it-works) pages to learn more.

See more: https://inertiajs.com/

### 3.1 Server-side setup

The first step when installing Inertia is to configure your server-side framework. Inertia ships with official server-side adapters for Laravel and Rails.

##### Install dependencies

Install the Inertia server-side adapters using the preferred package manager for that language or framework.

*Using this command:*

    composer require inertiajs/inertia-laravel
 
##### Middleware

Next, setup the Inertia middleware. In the Rails adapter, this is configured automatically for you. However, in Laravel you need to publish the `HandleInertiaRequests` middleware to your application, which can be done using this artisan command:

*Using this command:*

    php artisan inertia:middleware

Once generated, register the `HandleInertiaRequests` middleware in your `App\Http\Kernel.php`, as the last item in your `web` middleware group.

    'web' => [
        // ...
        \App\Http\Middleware\HandleInertiaRequests::class,
    ],

This middleware provides a version() method for setting your asset version, and a share() method for setting shared data. Please see those pages for more information.

### 3.2 Client-side setup

Once you have your server-side framework configured, you then need to setup your client-side framework. Inertia currently provides support for React, Vue, and Svelte.

##### Install dependencies

Install the Inertia client-side adapters using NPM command.

*Using this command:*

    npm install @inertiajs/inertia @inertiajs/inertia-vue3

##### Progress indicator

Since Inertia requests are made via XHR, there's no default browser loading indicator when navigating from one page to another. To solve this, Inertia provides an optional progress library, which shows a loading bar whenever you make an Inertia visit. To use it, start by installing it.

*Using this command:*

    npm install @inertiajs/progress

# 4. Install Ziggy

Ziggy provides a JavaScript `route()` helper function that works like Laravel's, making it easy to use your Laravel named routes in JavaScript.

Install Ziggy into your Laravel app with .

    composer require tightenco/ziggy

Add the `@routes` Blade directive to your main layout (_before_ your application's JavaScript), and the `route()` helper function will now be available globally!

> By default, the output of the `@routes` Blade directive includes a list of all your application's routes and their parameters. This route list is included in the HTML of the page and can be viewed by end users. To configure which routes are included in this list, or to show and hide different routes on different pages, see Filtering Routes.

See more: https://github.com/tighten/ziggy

# 5. Connect everything together

Now we have everything installed and ready to be used. We have installed **Laravel 8, Vue 3, Inertia** and **Ziggy**.

### 5.1 Setup - app.blade.php

Let's start by setting up our one and only **blade** template. We're going to rename the `welcome.blade.php` to `app.blade.php` inside `resources/views`. We're also going to remove all its content and replace it with the following:  

    <!DOCTYPE html>
    <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
    
            @routes
            <link href="{{ asset(mix('css/app.css')) }}" rel="stylesheet">
            <script src="{{ asset(mix('js/app.js')) }}" defer></script>
            <script src="{{ asset(mix('js/manifest.js')) }}" defer></script>
            <script src="{{ asset(mix('js/vendor.js')) }}" defer></script>
            <title>Integrate-Vue3-Inertia-with-Laravel8</title>
            @inertiaHead
        </head>
    
        <body>
            @inertia
        </body>
    
    </html>

So first of all you will notice we don't have any `<title>`. This is because we need it to be dynamic and we can set that using Inertia's `<Head>` component. That's why you can see that we've also added the `@inertiaHead` directive.

We have added the `@routes` directive to pass the Laravel's routes in the document's `<head>`.

We are importing our `app.css` and also a bunch of `.js` we are going to take care shortly.

In the `<body>` we only use the `@inertia` directive which renders a `div` element with a bunch of data passed to it using a `data-page` attribute.

### 5.2 Setup - Ziggy

Let's get back to Ziggy and generate the `.js` file that contains all of our routes. We'll gonna import this into our `app.js` a bit later.  

    php artisan ziggy:generate resources/js/ziggy.js

To resolve `ziggy` in Vue, we'll have to add an alias to the Vue driver in `webpack.mix.js`:  

    const path = require("path");
    
    // Rezolve Ziggy
    mix.alias({
        ziggy: path.resolve("vendor/tightenco/ziggy/dist/vue"),
    });

### 5.3 Setup - app.js

Let's move on by setting up our app.js file. This is our main main file we're going to load in our blade template.

Now open `resources/js/app.js` add the following chunk of code:  

    import { createApp, h } from "vue";
    import { createInertiaApp, Link, Head } from "@inertiajs/inertia-vue3";
    import { InertiaProgress } from "@inertiajs/progress";
    
    import { ZiggyVue } from "ziggy";
    import { Ziggy } from "./ziggy";
    
    InertiaProgress.init();
    
    createInertiaApp({
        resolve: async (name) => {
            return (await import(`./Pages/${name}`)).default;
        },
        setup({ el, App, props, plugin }) {
            createApp({ render: () => h(App, props) })
                .use(plugin)
                .use(ZiggyVue, Ziggy)
                .component("Link", Link)
                .component("Head", Head)
                .mixin({ methods: { route } })
                .mount(el);
        },
    });

What does this is to import Vue, Inertia, Inertia Progress and Ziggy and then create the Inertia App. We're also passing the `Link` and `Head` components as globals because we're going to use them a lot.

### 5.4 Setup - Folders & Files

Inertia will load our pages from the `Pages` directory so I'm gonna create 3 demo pages in that folder (`About.vue`, `Contact.vue`,  `Home.vue`). Like so:

![](https://i.ibb.co/jhPky0G/Folders-Files.png)

Each page will container the following template. The `Homepage` text will be replaced based on the file's name:  

    <template>
        <h1>Homepage</h1>
    </template> 

### 5.5 Setup - webpack.mix.js

The next step is to add the missing pieces to the `webpack.mix.js` file. Everything needs to look like this:

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


You can see that we're specifying the Vue version that we're using, we're also setting and alias (`@`) for our root js path and we're also using `.extract()` to split our code into smaller chunks (optional, but better for production in some use cases).

### 5.6 Settup - web.php

We've taken care of almost everything. Not we just need to create routes for each of the Vue pages we have created.

Let's open the `routes/web.php` file and replace everything there with the following:  

    <?php
    
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;
    
    Route::get(
        '/',
        static function () {
            return Inertia::render(
                'Home',
                [
                    'title' => 'Homepage',
                ]
            );
        }
    )->name('homepage');
    
    Route::get(
        '/about',
        static function () {
            return Inertia::render(
                'About',
                [
                    'title' => 'About',
                ]
            );
        }
    )->name('about');
    
    Route::get(
        '/contact',
        static function () {
            return Inertia::render(
                'Contact',
                [
                    'title' => 'Contact',
                ]
            );
        }
    )->name('contact');


You can notice right away that we're not returning any traditional blade view. Instead we return an `Inertia::render()` response which takes 2 parameters. The first parameter is the name of our Vue page and the 2nd is an array of properties that will be passed to the Vue page using `$page.props`.

### 5.7 Modifying the Vue pages

Knowing this we can modify our pages to the following template and also add a navigation to them:  

    <template>
    
        <Head>
            <title>{{ $page.props.title }} - Hello World</title>
        </Head>
    
        <body>
            <span>
                <a :href="route('homepage')"><button>Homepage</button></a>
                <a :href="route('about')"><button>About </button></a>
                <a :href="route('contact')"><button>Contact </button></a>
            </span>
    
            <div>
                <h1>This is: {{ $page.props.title }}</h1>
            </div>
        </body>
    </template>

Now we have a simple navigation on each page and also a dynamic page `<title>`.

# 6. Testing

The only thing left now is to compile everything and start the server:  

    npm install
    npm update vue-loader
    npm run dev
    npm install vue-loader@^16.2.0 --save-dev --legacy-peer-deps
    npm run dev
    php artisan serve
   
Result:

![](https://i.ibb.co/VWjkD7v/Result.png)

---
# 7. Installing Bootstrap

Bootstrap is a powerful, feature-packed frontend toolkit. Build anything—from prototype to production—in minutes.

### 7.1 Install - bootstrap

*Using this command:*

    npm install bootstrap
    
### 7.2 Install - sass

*Using this command:*

    npm install sass
    
### 7.3 Install - sass-loader

*Using this command:*

    npm install sass-loader

### 7.4 Create/Edit - app.scss  

Create (if not created) `resources/sass/app.scss` and add this:

    @import '~bootstrap';

### 7.5 Edit - webpack.mix.js

Add compilation in `webpack.mix.js`:

    mix.sass('resources/sass/app.scss', 'public/css');
    
### 7.6 Compile

Than, compile it with npm run dev - you see compiled file `public/css/app.css`

*Using this command:*

    npm run dev
    npm install resolve-url-loader@^5.0.0 --save-dev --legacy-peer-deps

# 8. Installing AdminLTE

AdminLTE Bootstrap Admin Dashboard Template.
Best open source admin dashboard & control panel theme. Built on top of Bootstrap, AdminLTE provides a range of responsive, reusable, and commonly used components.

### 8.1 Install - admin-lte

Install admin-lte 3 in Laravel 8 using: https://adminlte.io

*Using this command:*

    npm install admin-lte --save
    
### 8.2 Install - fontawesome-free

In this step, you have to Install fontawesome

*Using this command:*

    npm install --save @fortawesome/fontawesome-free

### 8.3 Edit - app.scss

Import admin lte and fontawesome css in `public/css/app.css` using laravel-mixins. Open: `resources\sass\app.scss` and paste below code:

    // Bootstrap
    @import '~bootstrap/scss/bootstrap';

    // AdminLTE
    @import '~admin-lte/dist/css/adminlte.css';

    // Fonts
    @import url('https://fonts.googleapis.com/css?family=Nunito');

    // Font Awesome
    @import '~@fortawesome/fontawesome-free/scss/brands';
    @import '~@fortawesome/fontawesome-free/scss/regular';
    @import '~@fortawesome/fontawesome-free/scss/solid';
    @import '~@fortawesome/fontawesome-free/scss/fontawesome';
    
### 8.4 Import

Import admin lte js in `public/js/app.js` using laravel-mixins. Open: `resources\js\bootstrap.js` and put below the line:

    require('admin-lte');

All content in `bootstrap.js` like this:

    window._ = require('lodash');
    
    /**
     * We'll load the axios HTTP library which allows us to easily issue requests
     * to our Laravel back-end. This library automatically handles sending the
     * CSRF token as a header based on the value of the "XSRF" token cookie.
     */
    
    window.axios = require('axios');
    
    window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    
    /**
     * Echo exposes an expressive API for subscribing to channels and listening
     * for events that are broadcast by Laravel. Echo and event broadcasting
     * allows your team to easily build robust real-time web applications.
     */
    
    require('admin-lte');


### 8.5 Copy

Copy admin lte related images from node_mudule directory to public directory. Open `webpack.mix` and add below line:

    mix.copy('node_modules/admin-lte/dist/img', 'public/dist/img');

All content in `webpack.mix` like this:

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

Now the admin lte 3 and font awesome ready to use with laravel 8

### 8.6 Compile

Now run the below command and enjoy

*Using this command:*

    npm run dev
    npm install autoprefixer@10.4.5 --save-exact
    npm run watch

### 8.7 Run

Clear the Laravel cache and Start laravel serve.

*Using this command:*

    php artisan optimize
    php artisan serve

Laravel and AdminLTE 3 are two new frameworks that you need to familiarize yourself with to complete the integration projects.

# 9. Test AdminLTE

Starter page AdminLTE https://adminlte.io/themes/v3/starter.html

### 9.1 Create - AdminLTE.vue

Create file `AdminLTE.vue` in `resources\js\Pages\AdminLTE.vue` put content like this:

    <template>
        <div class="wrapper">
            <nav class="main-header navbar navbar-expand navbar-white navbar-light " aria-label="">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="pushmenu" href="#" role="button">
                            <em class="fas fa-bars"></em>
                        </a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="#" class="nav-link">Home</a>
                    </li>
                    <li class="nav-item d-none d-sm-inline-block">
                        <a href="#" class="nav-link">Contact</a>
                    </li>
                </ul>
    
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item">
                        <a class="nav-link" data-widget="navbar-search" href="#" role="button">
                            <em class="fas fa-search"></em>
                        </a>
                        <div class="navbar-search-block">
                            <form class="form-inline">
                                <div class="input-group input-group-sm">
                                    <input class="form-control form-control-navbar" type="search" placeholder="Search"
                                        aria-label="Search">
                                    <div class="input-group-append">
                                        <button class="btn btn-navbar" type="submit">
                                            <em class="fas fa-search"></em>
                                        </button>
                                        <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                                            <em class="fas fa-times"></em>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </li>
    
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                            <em class="far fa-comments"></em>
                            <span class="badge badge-danger navbar-badge">3</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <a href="#" class="dropdown-item">
                                <div class="media">
                                    <img src="dist/img/user1-128x128.jpg" alt="User Avatar"
                                        class="img-size-50 mr-3 img-circle">
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            Brad Diesel
                                            <span class="float-right text-sm text-danger">
                                                <em class="fas fa-star"></em>
                                            </span>
                                        </h3>
                                        <p class="text-sm">Call me whenever you can...</p>
                                        <p class="text-sm text-muted"><em class="far fa-clock mr-1"></em> 4 Hours Ago</p>
                                    </div>
                                </div>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
    
                                <div class="media">
                                    <img src="dist/img/user8-128x128.jpg" alt="User Avatar"
                                        class="img-size-50 img-circle mr-3">
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            John Pierce
                                            <span class="float-right text-sm text-muted">
                                                <em class="fas fa-star"></em>
                                            </span>
                                        </h3>
                                        <p class="text-sm">I got your message bro</p>
                                        <p class="text-sm text-muted"><em class="far fa-clock mr-1"></em> 4 Hours Ago</p>
                                    </div>
                                </div>
    
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
    
                                <div class="media">
                                    <img src="dist/img/user3-128x128.jpg" alt="User Avatar"
                                        class="img-size-50 img-circle mr-3">
                                    <div class="media-body">
                                        <h3 class="dropdown-item-title">
                                            Nora Silvester
                                            <span class="float-right text-sm text-warning">
                                                <em class="fas fa-star"></em>
                                            </span>
                                        </h3>
                                        <p class="text-sm">The subject goes here</p>
                                        <p class="text-sm text-muted"><em class="far fa-clock mr-1"></em> 4 Hours Ago</p>
                                    </div>
                                </div>
    
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>
                        </div>
                    </li>
    
                    <li class="nav-item dropdown">
                        <a class="nav-link" data-toggle="dropdown" href="#">
                            <em class="far fa-bell"></em>
                            <span class="badge badge-warning navbar-badge">15</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                            <span class="dropdown-header">15 Notifications</span>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <em class="fas fa-envelope mr-2"></em> 4 new messages
                                <span class="float-right text-muted text-sm">3 mins</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <em class="fas fa-users mr-2"></em> 8 friend requests
                                <span class="float-right text-muted text-sm">12 hours</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item">
                                <em class="fas fa-file mr-2"></em> 3 new reports
                                <span class="float-right text-muted text-sm">2 days</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" class="dropdown-item dropdown-footer">See All Notifications</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-widget="fullscreen" href="#" role="button">
                            <em class="fas fa-expand-arrows-alt"></em>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
                            <em class="fas fa-th-large"></em>
                        </a>
                    </li>
                </ul>
            </nav>
    
    
            <aside class="main-sidebar sidebar-dark-primary elevation-4" aria-label="">
    
                <a href="#" class="brand-link">
                    <img src="dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3"
                        style="opacity: .8">
                    <span class="brand-text font-weight-light">AdminLTE 3</span>
                </a>
    
                <div class="sidebar">
    
                    <div class="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div class="image">
                            <img src="dist/img/user2-160x160.jpg" class="img-circle elevation-2" alt="User Image">
                        </div>
                        <div class="info">
                            <a href="#" class="d-block">Alexander Pierce</a>
                        </div>
                    </div>
    
                    <div class="form-inline">
                        <div class="input-group" data-widget="sidebar-search">
                            <input class="form-control form-control-sidebar" type="search" placeholder="Search"
                                aria-label="Search">
                            <div class="input-group-append">
                                <button class="btn btn-sidebar">
                                    <em class="fas fa-search fa-fw"></em>
                                </button>
                            </div>
                        </div>
                    </div>
    
                    <nav class="mt-2" aria-label="">
                        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu"
                            data-accordion="false">
    
                            <li class="nav-item menu-open">
                                <a href="#" class="nav-link active">
                                    <em class="nav-icon fas fa-tachometer-alt"></em>
                                    <p>
                                        Starter Pages
                                        <em class="right fas fa-angle-left"></em>
                                    </p>
                                </a>
                                <ul class="nav nav-treeview">
                                    <li class="nav-item">
                                        <a href="#" class="nav-link active">
                                            <em class="far fa-circle nav-icon"></em>
                                            <p>Active Page</p>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a href="#" class="nav-link">
                                            <em class="far fa-circle nav-icon"></em>
                                            <p>Inactive Page</p>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link">
                                    <em class="nav-icon fas fa-th"></em>
                                    <p>
                                        Simple Link
                                        <span class="right badge badge-danger">New</span>
                                    </p>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
    
            <div class="content-wrapper">
                <div class="content-header">
                    <div class="container-fluid">
                        <div class="row mb-2">
                            <div class="col-sm-6">
                                <h1 class="m-0">Starter Page</h1>
                            </div>
                            <div class="col-sm-6">
                                <ol class="breadcrumb float-sm-right">
                                    <li class="breadcrumb-item"><a href="#">Home</a></li>
                                    <li class="breadcrumb-item active">Starter Page</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
    
                <div class="content">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">Card title</h5>
                                        <p class="card-text">
                                            Some quick example text to build on the card title and make up the bulk of
                                            the card's
                                            content.
                                        </p>
                                        <a href="#" class="card-link">Card link</a>
                                        <a href="#" class="card-link">Another link</a>
                                    </div>
                                </div>
                                <div class="card card-primary card-outline">
                                    <div class="card-body">
                                        <h5 class="card-title">Card title</h5>
                                        <p class="card-text">
                                            Some quick example text to build on the card title and make up the bulk of
                                            the card's
                                            content.
                                        </p>
                                        <a href="#" class="card-link">Card link</a>
                                        <a href="#" class="card-link">Another link</a>
                                    </div>
                                </div>
                            </div>
    
                            <div class="col-lg-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="m-0">Featured</h5>
                                    </div>
                                    <div class="card-body">
                                        <h6 class="card-title">Special title treatment</h6>
                                        <p class="card-text">With supporting text below as a natural lead-in to
                                            additional content.</p>
                                        <a href="#" class="btn btn-primary">Go somewhere</a>
                                    </div>
                                </div>
                                <div class="card card-primary card-outline">
                                    <div class="card-header">
                                        <h5 class="m-0">Featured</h5>
                                    </div>
                                    <div class="card-body">
                                        <h6 class="card-title">Special title treatment</h6>
                                        <p class="card-text">With supporting text below as a natural lead-in to
                                            additional content.</p>
                                        <a href="#" class="btn btn-primary">Go somewhere</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    
            <aside class="control-sidebar control-sidebar-dark" aria-label="">
                <div class="p-3">
                    <h5>Title</h5>
                    <p>Sidebar content</p>
                </div>
            </aside>
    
            <footer class="main-footer">
    
                <div class="float-right d-none d-sm-inline">
                    Anything you want
                </div>
    
                <strong>Copyright &copy; 2014-2021 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights
                reserved.
            </footer>
        </div>
    </template>
    
    <script>
    export default {
    
    }
    
    </script>
    
    <style>
    
    </style>

### 9.2 Edit - web.php

Edit file `web.php` in `routes\web.php` and content below like this:

        Route::get(
            '/adminLTE',
            static function () {
                return Inertia::render(
                    'AdminLTE',
                    [
                        'title' => 'AdminLTE',
                    ]
                );
            }
        )->name('adminLTE');

All content in `web.php` like this:

    <?php
    
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;
    
    Route::get(
        '/',
        static function () {
            return Inertia::render(
                'Home',
                [
                    'title' => 'Homepage',
                ]
            );
        }
    )->name('homepage');
    
    Route::get(
        '/about',
        static function () {
            return Inertia::render(
                'About',
                [
                    'title' => 'About',
                ]
            );
        }
    )->name('about');
    
    Route::get(
        '/contact',
        static function () {
            return Inertia::render(
                'Contact',
                [
                    'title' => 'Contact',
                ]
            );
        }
    )->name('contact');
    
    Route::get(
        '/adminLTE',
        static function () {
            return Inertia::render(
                'AdminLTE',
                [
                    'title' => 'AdminLTE',
                ]
            );
        }
    )->name('adminLTE');

### 9.3 Compile - Again

Now run the below command and enjoy

*Using this command:*

    npm run dev

### 9.4 Run - Again

Clear the Laravel cache and Start laravel serve.

*Using this command:*

    php artisan optimize
    php artisan serve

### 9.5 Result

Result like this:

![](https://i.ibb.co/NYWyY1G/Result-Admin-LTE.png)

---
