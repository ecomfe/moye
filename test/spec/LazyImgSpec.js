define(function (require) {
    
    var lib = require('ui/lib');
    var Lazy = require('ui/Lazy');
    var LazyImg = require('ui/LazyImg');

    var holder = 'http://tb2.bdstatic.com/tb/static-common/img/search_logo_039c9b99.png';
    var dist = 'http://www.baidu.com/img/bdlogo.gif';
    
    var lazyImg;
    var main;
    /* jshint -W101 */
    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd',
            ''
                + '<div id="lazyImgContainer" class="lazy-img" style="position:absolute;left: 10px; top: 700px">'
                + new Array(5).join('<p><img width="270" height="129" src="' + holder + '" _src="' + dist + '"></p>')
                + '</div>'
        );

        main = lib.g('lazyImgContainer');
        jasmine.Clock.useMock();
    });


    afterEach(function () {
        Lazy.remove(main);
        main.parentNode.removeChild(main);
        main = null;
    });
  
    describe('基本接口', function () {

        it('创建实例', function () {

            lazyImg = new LazyImg({
                main: main
            });

            var imgs = main.getElementsByTagName('img');
            var img = imgs[Math.random() * imgs.length | 0];

            expect(img.src).toBe(holder);
            img.scrollIntoView();
            // window.scrollTo(0, 700);
            lib.fire(window, 'scroll');
            
            jasmine.Clock.tick(1000);
            expect(img.src).toBe(dist);
        });


        it('静态方法: load', function () {

            lazyImg = LazyImg.load({
                main: main
            });

            var imgs = main.getElementsByTagName('img');
            var img = imgs[Math.random() * imgs.length | 0];

            expect(img.src).toBe(holder);
            img.scrollIntoView();
            lib.fire(window, 'scroll');
            
            jasmine.Clock.tick(100);
            expect(img.src).toBe(dist);
        });

    });

});
