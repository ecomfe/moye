exports.port = 8848;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var path = require('path');
var etpl = require('etpl');
var marked = require('marked');
var controls = require('./package.json').controls;
var highlight = require('highlight.js');

highlight.configure({
  classPrefix: ''
});

var renderer = new marked.Renderer();

renderer.code = function (code, language) {

    var style = 'display:' + (language === 'js' ? 'block' : 'none');

    return ''
        + '<pre style="' + style + '"><code class="lang lang-' + language + '">'
        + highlight.highlightAuto(code).value
        + '</code></pre>';
};

marked.setOptions({
  renderer: renderer,
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
});

etpl.addFilter('markdown', function (source) {
    return '<div class="markdown">' + marked(source) + '</div>';
});

etpl.addFilter('lower', function (source) {
    return source.toLowerCase();
});

etpl.config({
    namingConflict: 'override',
    commandOpen: '{%',
    commandClose: '%}'
});

etpl.compile(require('fs').readFileSync('./example/tpl/base.tpl', 'utf-8'));

exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home( 'index.html' )
        },
        {
            location: /\.css($|\?)/,
            handler: [
                autocss()
            ]
        },
        // smarty的配置
        {
            location: /^\/example\/smarty\/index\.php$/,
            handler: [
                php('php-cgi', '')
            ]
        },
        // etpl的配置
        {
            location: /\.tpl($|\?)/,
            handler: [
                file(),
                function (context) {

                    console.log(112321);

                    var name = path.basename(context.request.pathname, '.tpl');
                    var data = context.content.toString('utf-8');
                    var renderer = etpl.compile(data);
                    var html = renderer({
                        controls: controls,
                        name: name
                    });

                    context.header['content-type'] = 'text/html';
                    context.content = html;
                }
            ]
        },
        {
            location: /\.less($|\?)/,
            handler: [
                file(),
                less({
                    paths: [
                        __dirname,
                        __dirname + '/dep'
                    ]
                })
            ]
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function ( res ) {
    for ( var key in res ) {
        global[ key ] = res[ key ];
    }
};
