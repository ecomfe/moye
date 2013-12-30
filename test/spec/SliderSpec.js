define(function (require) {
    var lib = require('ui/lib');
    var Slider = require('ui/Slider');
    
    var slider;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="slider-container">'

                +   '<div id="ecl-ui-slider-1" class="ecl-ui-slider">'
                +     '<i class="ecl-ui-slider-prev">&lt;</i>'
                +     '<i class="ecl-ui-slider-next">&gt;</i>'
                +     '<div class="ecl-ui-slider-index">'
                +       '<i></i><i></i><i></i><i></i>'
                +     '</div>'
                +     '<div class="ecl-ui-slider-stage">'
                +       '<img src="http://pic.hefei.cc/newcms'
                +         '/2012/03/14/13316929284f6005808aa20.jpg">'
                +       '<img src="http://pic.hefei.cc/newcms'
                +         '/2012/03/14/13316929274f60057f72733.jpg">'
                +       '<img src="http://pic.hefei.cc/newcms'
                +         '/2012/03/14/13316929284f60058013da9.jpg">'
                +       '<img src="http://pic.hefei.cc/newcms'
                +         '/2012/03/14/13316929294f600581a07e5.jpg">'
                +     '</div>'
                +   '</div>'

                +   '<div id="ecl-ui-slider-2" class="ecl-ui-slider">'
                +     '<i class="ecl-ui-slider-prev">&lt;</i>'
                +     '<i class="ecl-ui-slider-next">&gt;</i>'
                +     '<div class="ecl-ui-slider-index">'
                +       '<i></i><i></i><i></i><i></i>'
                +     '</div>'
                +     '<div class="ecl-ui-slider-stage '
                +           'ecl-ui-slider-stage-abs">'
                +       '<img src="http://pic.hefei.cc/newcms'
                +         '/2012/03/14/13316929284f6005808aa20.jpg">'
                +       '<img src="http://pic.hefei.cc/newcms'
                +         '/2012/03/14/13316929274f60057f72733.jpg">'
                +       '<img src="http://pic.hefei.cc/newcms'
                +         '/2012/03/14/13316929284f60058013da9.jpg">'
                +       '<img src="http://pic.hefei.cc/newcms'
                +         '/2012/03/14/13316929294f600581a07e5.jpg">'
                +     '</div>'
                +   '</div>'

                + '</div>'
        );

        slider = new Slider({
            prefix: 'ecl-ui-slider',
            main: lib.g('ecl-ui-slider-1')
          });
        slider.render();               
        
    });


    afterEach(function () {
        slider.dispose();
        document.body.removeChild(lib.g('slider-container'));
    });
  
    describe('基本接口', function () {


        it('控件类型', function () {
            //console.log(slider);
            expect(slider.type).toBe('Slider');
        });

        it('控件基本接口', function () {
            expect(Slider.Anim).not.toBe(null);
            expect(Slider.Anim.anims.no).not.toBe(null);
            expect(Slider.Anim.anims.slide).not.toBe(null);
            expect(Slider.Anim.anims.opacity).not.toBe(null);
            expect(Slider.Anim.anims.easing).not.toBe(null);
            expect(Slider.Anim.anims.TimeLine).not.toBe(null);
        });

        it('getIndex', function () {
            slider.index = 1;
            slider.options.circle = true;
            expect(slider.getIndex('')).toBe(0);
            expect(slider.getIndex('NaN')).toBe(0);
            expect(slider.getIndex(1000)).toBe(0);
            expect(slider.getIndex(-100)).toBe(slider.count - 1);
            expect(slider.getIndex(1)).toBe(-1);

            slider.options.circle = false;
            expect(slider.getIndex(1000)).toBe(slider.count - 1);
            expect(slider.getIndex(-100)).toBe(0);
            slider.options.circle = true;
        });

        it('play', function () {
            slider.play();
            expect(slider.switchTimer).not.toBe(null);
        });

        it('refresh', function () {
            slider.refresh();
            expect(slider.stage).not.toBe(null);
            expect(slider.count).toBe(4);
        });

        it('render', function () {
            slider.render();
            expect(slider.switchTimer).not.toBe(null);
            expect(slider.stage).not.toBe(null);
            expect(slider.count).toBe(4);
        });

        it('prev', function () {
            slider.index=0;
            slider.prev();
            expect(slider.index).toBe(slider.count-1);
        });

        it('next', function () {
            slider.index=slider.count-1;
            slider.next();
            expect(slider.index).toBe(0);
        });

        it('go', function () {
            slider.index=slider.count-1;
            slider.next();
            expect(slider.index).toBe(0);
        });

        it('go', function () {
            slider.go(4);
            expect(slider.index).toBe(0);
            slider.go(-1);
            expect(slider.index).toBe(3);
        });

        it('onchange', function () {
            var a =1;
            slider.on('change', slider.options.onChange = function(e) {
                expect(a).toBe(1);
                expect(e.index).not.toBe(null);
                expect(e.lastIndex).not.toBe(null);
            });
        });

        it('测试default动画', function () {
            var defaultSlider = new Slider({
                prefix: 'ecl-ui-slider',
                main: lib.g('ecl-ui-slider-2'),
                anim: 'no'
              });
            defaultSlider.render();    
            defaultSlider.go(-1);
            defaultSlider.go(1);
            defaultSlider.go(5);
            defaultSlider.dispose();
        });

        it('测试opacity动画', function () {
            var opacitySlider = new Slider({
                prefix: 'ecl-ui-slider',
                main: lib.g('ecl-ui-slider-2'),
                anim: 'opacity'
              });
            opacitySlider.render();  
            opacitySlider.go(-1);
            opacitySlider.go(1);
            opacitySlider.go(5);
            opacitySlider.dispose();
        });

    });

});