define(function (require) {
    
    var config = require('ui/config');

    var lib = require('ui/lib');

    var iz, $imgs;

    var href = 'http://www.baidu.com/';

    var zoomImgs = [
        'http://t12.baidu.com/it/u=3212677892,2248381863&fm=32',
        'http://t11.baidu.com/it/u=1230530443,2758239786&fm=32',
        'http://t12.baidu.com/it/u=1315258025,3740341982&fm=32',
        'http://t10.baidu.com/it/u=2837462175,2127340680&fm=32',
        'http://t10.baidu.com/it/u=1062234012,3466388488&fm=32',
        'http://t11.baidu.com/it/u=350827582,246717697&fm=32',
        'http://t12.baidu.com/it/u=2100165218,745113816&fm=32',
        'http://t10.baidu.com/it/u=2261371008,3030880374&fm=32',
        'http://t10.baidu.com/it/u=2118454176,1431207690&fm=32'
    ];

    function preStr(str) {
        return '.' + config.prefix + (str || '');
    }


    beforeEach(function () {
            var str = '';

            $(zoomImgs).each(function (i) {
                str += ''
                    + '<div style="margin-bottom:20px" >'
                    + ' <a href="' + href + '>'
                    + '  <img src="' + zoomImgs[i]
                    + '  " data-zoomImg="' + zoomImgs[i] + '" />'
                    + ' </a>'
                    + '</div>';

            });

            document.body.insertAdjacentHTML('beforeEnd', str);
            $imgs = $('img');

            require(['ui/ImgZoomHover'], function (ImgZoomHover) {
                    iz = new ImgZoom();
                });
        });


    afterEach(function () {
            iz.dispose();
        });
  

    describe('控件基本', function () {
            it('控件类型', function () {
                    expect(iz.type).toBe('ImgZoomHover');

                });

            it('init', function () {
                    iz.init({MaxWidth: 540, MaxHeight: 400});
                    expect(iz.options.MaxWidth).toEqual(540);
                    expect(iz.options.MaxHeight).toEqual(400);

                });

            it('render', function () {
                    iz.render($imgs);
                    var bodyHeight = $(document.body).height();
                    $imgs.on('click', function () {
                            var $mask = $(preStr('-mask'));
                            var $cont = $(preStr('-container'));
                            var $close = $(preStr('-close'));
                            var $link = $(preStr('-link'));

                            expect($cont).toContain($close);  
                            expect($cont).toContain($link); 
                            expect($mask.height()).toEqual(bodyHeight);

                        });
                    $imgs.each(function () {
                            lib.fire(this, 'click');
                        });

                });
            
            it('closeClick', function () {
                    iz.render($imgs);
                    $(preStr('-close')).on('click', function () {
                            var $mask = $(preStr('-mask'));
                            var $cont = $(preStr('-container'));
                            var $close = $(preStr('-close'));
                            var $link = $(preStr('-link'));

                            expect(iz.close).toHaveBeenCalled();
                            expect(lib.q(preStr())[0]).toBeUndefined();
                            expect($mask).toBeUndefined();
                            expect($cont).toBeUndefined();
                            expect($close).toBeUndefined();
                            expect($link).toBeUndefined();
                       
                        });

                });

            it('close', function () {
                    iz.render($imgs);
                    $imgs.each(function () {
                            lib.fire(this, 'click');
                        });
                    iz.close();
                    
                    expect(lib.q(preStr())[0]).toBeUndefined();
                    expect(lib.q(preStr('-mask'))[0]).toBeUndefined();
                    expect(lib.q(preStr('-container'))[0]).toBeUndefined();
                    expect(lib.q(preStr('-close'))[0]).toBeUndefined();
                    expect(lib.q(preStr('-link'))[0]).toBeUndefined();
                });

            it('dispose', function () {
                    iz.render($imgs);
                    $imgs.each(function () {
                            lib.fire(this, 'click');
                        });                    
                    iz.close();
                    iz.dispose();
                                    
                    expect(lib.q(preStr())[0]).toBeUndefined();
                    expect(lib.q(preStr('-mask'))[0]).toBeUndefined();
                    expect(lib.q(preStr('-container'))[0]).toBeUndefined();
                    expect(lib.q(preStr('-close'))[0]).toBeUndefined();
                    expect(lib.q(preStr('-link'))[0]).toBeUndefined();
                });
        });

});
