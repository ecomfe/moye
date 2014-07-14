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
})

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  },
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
            location: /^\/redirect-local/, 
            handler: redirect('redirect-target', false) 
        },
        { 
            location: /^\/redirect-remote/, 
            handler: redirect('http://www.baidu.com', false) 
        },
        { 
            location: /^\/redirect-target/, 
            handler: content('redirectd!') 
        },
        { 
            location: '/empty', 
            handler: empty() 
        },
        { 
            location: /\.css($|\?)/, 
            handler: [
                autocss()
            ]
        },
        { 
            location: /\.tpl($|\?)/, 
            handler: [
                file(),
                function (context) {

                    var name = path.basename(context.request.pathname, '.tpl');
                    var data = context.content.toString( 'utf-8' );
                    var renderer = etpl.compile( data );
                    var html = renderer({
                        controls: controls,
                        name: name
                    });

                    context.header[ 'content-type' ] = 'text/html';
                    context.content = html;
                }
            ]
        },
        { 
            location: /\.less($|\?)/, 
            handler: [
                file(),
                less()
            ]
        },
        { 
            location: /\.styl($|\?)/, 
            handler: [
                file(),
                stylus()
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
