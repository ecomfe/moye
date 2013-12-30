define(function (require) {
    
    var lib = require('ui/lib');
    var Lazy = require('ui/Lazy');
    var LazyImg = require('ui/LazyImg');
    
    var lazyImg;
    var main;
    /* jshint -W101 */
    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd',
            ''
                + '<div id="lazyImgContainer">'
                + new Array(5).join('<img width="270" height="129" src="http://tb2.bdstatic.com/tb/static-common/img/search_logo_039c9b99.png" _src="http://www.baidu.com/img/bdlogo.gif" />')
                + '</div>'
        );

        main = lib.g('lazyImgContainer');

        lazyImg = new LazyImg({
            main: main
        });


    });


    afterEach(function () {
        Lazy.remove(main);
        main.parentNode.removeChild(main);
        main = null;
    });
  
    describe('基本接口', function () {

        it('load', function () {
            window.scrollTo(0, 100);
            expect(1).toBe(1);
        });

    });

});