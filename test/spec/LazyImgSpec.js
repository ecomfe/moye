/**
 * @file 懒图片加载组件测试用例
 * @author chris <wfsr@foxmail.com>
 * @author ludafa <leonlu@outlook.com>
 */

define(function (require) {
    var $ = require('jquery');
    var lib = require('ui/lib');
    var Lazy = require('ui/Lazy');
    var LazyImg = require('ui/LazyImg');

    // var holder = 'http://tb2.bdstatic.com/tb/static-common/img/search_logo_039c9b99.png';
    // var dist = 'http://www.baidu.com/img/bdlogo.gif';
    
    var holder = '/test/spec/img/1.jpg';
    var dist = '/test/spec/img/2.jpg';

    var lazyImg;
    var main;
    /* jshint -W101 */
    beforeEach(function () {

        var html = ''
                + '<div id="lazyImgContainer" class="lazy-img" style="position:absolute;left: 10px; top: 700px">'
                + new Array(5).join('<p><img width="270" height="129" src="' + holder + '" _src="' + dist + '"></p>')
                + '</div>';

        document.body.insertAdjacentHTML('beforeEnd', html);

        main = lib.g('lazyImgContainer');
    });


    afterEach(function () {
        Lazy.remove(main);
        main.parentNode.removeChild(main);
        main = null;
    });
  
    describe('基本接口', function () {

        it('创建实例', function () {

            var img;

            runs(function () {
                lazyImg = new LazyImg({
                    main: main
                });

                var imgs = main.getElementsByTagName('img');
                img = imgs[Math.random() * imgs.length | 0];

                expect(img.src.indexOf(holder) !== -1).toBe(true);
                img.scrollIntoView();
                $(window).trigger('scroll');

            });

            waitsFor(function() {
                if (img.src.indexOf(holder) !== -1) {
                    return true;
                }
                return false;
            }, '图片地址应该被替换', 10000);
            
            runs(function() {
                expect(img.src.indexOf(dist) !== -1).toBe(true);
            });

        });


        it('静态方法: load', function() {
            
            var img;

            runs(function() {
                lazyImg = LazyImg.load({
                    main: main
                });

                var imgs = main.getElementsByTagName('img');

                img = imgs[Math.random() * imgs.length | 0];

                expect(img.src.indexOf(holder) !== -1).toBe(true);
                img.scrollIntoView();
                $(window).trigger('scroll');

            });

            waitsFor(function() {
                if (img.src.indexOf(holder) !== -1) {
                    return true;
                }
                return false;
            }, '图片地址应该被替换', 10000);

            runs(function() {
                expect(img.src.indexOf(dist) !== -1).toBe(true);
            });

        });

    });

});
