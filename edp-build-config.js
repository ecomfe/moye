/**
 * @file build script
 * @author Leon(leon@outlook.com)
 */

exports.input = __dirname;
exports.output = require( 'path' ).resolve( __dirname, 'output' );



exports.getProcessors = function () {

    var lessProcessor = new LessCompiler();

    var cssProcessor = new CssCompressor();

    var moduleProcessor = new ModuleCompiler({
        bizId: 'moye'
    });

    var jsProcessor = new JsCompressor();

    var asset = new PathMapper();

    var addCopyright = new AddCopyright();


    return {
        'default': [
            lessProcessor, cssProcessor,
            moduleProcessor,
            jsProcessor,
            asset,
            addCopyright
        ]
    };
};

exports.exclude = [
    'example',
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

