exports.input = __dirname;
exports.output = require( 'path' ).resolve( __dirname, 'example-dist' );

var etpl = require('etpl');
var marked = require('marked');

var path = require('path');
var etpl = require('etpl');
var marked = require('marked');
var controls = require('./package.json').controls;
var highlight = require('highlight.js');

highlight.configure({
  classPrefix: ''
});

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
    commandClose: '%}',
    strip: true
});

etpl.compile(require('fs').readFileSync('./example/tpl/base.tpl', 'utf-8'));

// var moduleEntries = 'html,htm,phtml,tpl,vm,js';
// var pageEntries = 'html,htm,phtml,tpl,vm';

exports.getProcessors = function () {
    var lessProcessor = new LessCompiler({
        entryExtnames: 'tpl',
        paths: [
            __dirname,
            __dirname + '/dep'
        ]
    });
    var cssProcessor = new CssCompressor();
    var moduleProcessor = new ModuleCompiler();
    var jsProcessor = new JsCompressor();
    var pathMapperProcessor = new PathMapper({
        mapper: function (value) {
            value = value.replace( this.from, this.to );
            if (/\.tpl$/.test(value)) {
                value = value.replace(/\.tpl$/, '.html');
            }
            return value;
        }
    });
    var asset = new PathMapper();
    var addCopyright = new AddCopyright();
    var etplCompiler = {
        files: [ '*.tpl' ],
        name: 'tpl',
        process: function (file, processContext, callback) {

            var name = path.basename(file.path, '.tpl');
            var renderer = etpl.compile( file.data );
            var html = renderer({
                controls: controls,
                name: name
            });
            file.outputPath = file.outputPath.replace( /\.tpl$/, '.html' );
            file.setData(html);
            callback();
        }
    };

    return {
        'default': [
            etplCompiler, lessProcessor, cssProcessor, moduleProcessor,
            jsProcessor, pathMapperProcessor, asset, addCopyright
        ]
    };
};

exports.exclude = [
    'tool',
    'doc',
    'test',
    'dep',
    '*.log',
    'node_modules',
    'module.conf',
    'demo',
    'dep/packages.manifest',
    'dep/*/*/test',
    'dep/*/*/doc',
    'dep/*/*/demo',
    'dep/*/*/tool',
    'dep/*/*/*.md',
    'dep/*/*/package.json',
    'edp-*',
    '.*',
    'Gruntfile.js',
    'CHANGELOG.md',
    'package.json',
    'README.md',
    'Desktop.ini',
    'Thumbs.db'
];

exports.injectProcessor = function ( processors ) {
    for ( var key in processors ) {
        global[ key ] = processors[ key ];
    }
};

