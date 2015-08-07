/**
 * @file 懒图片加载组件测试用例
 * @author huanghuiquan <huanghuiquan@baidu.com>
 */

define(function (require) {
    var $ = require('jquery');
    var lib = require('ui/lib');
    var Lazyload = require('ui/Lazyload');

    var holder = '/test/spec/img/1.gif';
    var dist = '/test/spec/img/2.gif';

    var lazyload;
    var main;

    /* jshint -W101 */
    beforeEach(function () {

        var html = ''
                + '<div id="lazyloadContainer" class="lazyload-img" style="position:absolute;left: 10px; top: 700px">'
                + new Array(5).join('<p><img width="270" height="129" src="' + holder + '" _src="' + dist + '"></p>')
                + '</div>';

        document.body.insertAdjacentHTML('beforeEnd', html);

        main = $('#lazyloadContainer');
    });


    afterEach(function () {
        // lazyload.dispose();
        main.remove();
        main = null;
    });

    describe('基本接口', function () {

        it('创建实例', function () {
            var img;

            runs(function () {

                lazyload = new Lazyload({
                    main: '#lazyloadContainer'
                });

                var imgs = main.find('img');
                img = imgs[0];

                expect(img.src.indexOf(holder) !== -1).toBe(true);
                img.scrollIntoView();
            });

            waitsFor(function() {
                return img.src.indexOf(dist) !== -1;
            }, '图片地址应该被替换', 5000);

            runs(function() {
                expect(img.src.indexOf(dist) !== -1).toBe(true);
            });
        });

        it('add接口', function () {

            var img;

            runs(function () {
                lazyload = new Lazyload({
                    main: '#lazyloadContainer'
                });

                main.append('<p><img width="270" height="129" src="' + holder + '" _src="' + dist + '"></p>');

                img = main.find('img').last()[0];

                lazyload.add(img);

                expect(img.src.indexOf(holder) !== -1).toBe(true);

                img.scrollIntoView();
            });

            waitsFor(function() {
                return img.src.indexOf(dist) !== -1;
            }, '图片地址应该被替换', 5000);

            runs(function() {
                expect(img.src.indexOf(dist) !== -1).toBe(true);
            });
        });

        it('remove接口', function () {

            var img;

            runs(function () {

                main.append('<p><img width="270" height="129" style="margin-top: 1000px" src="' + holder + '" _src="' + dist + '"></p>');

                lazyload = new Lazyload({
                    main: '#lazyloadContainer'
                });

                img = main.find('img').last()[0];

                lazyload.remove(img);

                expect(img.src.indexOf(holder) !== -1).toBe(true);

                img.scrollIntoView();
            });

            var start = Date.now();

            waitsFor(function() {
                return Date.now() - start > 4000;
            }, '', 5000);

            runs(function() {
                expect(img.src.indexOf(dist) === -1).toBe(true);
            });
        });

    });



});
