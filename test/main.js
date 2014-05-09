// Auto load specs 
// Generated on Fri Dec 27 2013 15:11:09 GMT+0800 (CST)

(function() {

var tests = [];
for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src',

    paths: {
        jquery: 'http://s1.bdstatic.com/r/www/cache/static/jquery/jquery-1.10.2.min_f2fb5194'
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
})();
