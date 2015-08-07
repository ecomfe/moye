/**
 * @file 城市控件测试用例
 * @author chris(wfsr@foxmail.com)
 *         ludafa <leonlu@outlook.com>
 */
define(function (require) {
    var $ = require('jquery');
    var City = require('ui/City');
    var city;
    var triggers;

    beforeEach(function () {
        document.body.insertAdjacentHTML(
            'beforeEnd', ''
                + '<div id="cityContainer" class="result-op"'
                + ' data-click="{x:1, srcid: 16874, p1:2, y:\'FD9FFD6C\'}">'
                + ' <input type="text" class="city-trigger" />'
                + ' <input type="button" value="click" '
                + '     class="city-trigger" />'
                + '</div>'
        );

        triggers = $('.city-trigger').toArray();
        city = new City({
            prefix: 'ecl-ui-city',
            index: 2,
            dir: 'auto',
            triggers: triggers,
            target: triggers[0],
            hideCities: '上海',
            onChange: function () {
                // do nothing
            }
        });
        city.render();
    });


    afterEach(function () {
        triggers = null;
        city.dispose();
        $('#cityContainer').remove();
    });
  
    describe('基本接口', function () {

        it('控件类型', function () {
            expect(city.type).toBe('City');
        });

        it('显示/隐藏', function () {
            var isVisible = false;
            var onShow = function () {
                isVisible = true;
            };
            city.on('show', onShow);
            city.show();
            city.un('show', onShow);

            expect(isVisible).toBeTruthy();

            var isHide = false;
            var onHide = function () {
                isHide = true;
            };
            city.on('hide', onHide);
            city.hide();
            city.un('hide', onHide);

            expect(isHide).toBeTruthy();
        });

        it('默认激活', function () {
            expect(city.index).toBe(2);
        });

        it('隐藏城市', function () {
            $(triggers[0]).trigger('click');
            expect(city.panels.length).toBe(5);
            expect(
                city.panels[0].getElementsByTagName('a')[0].innerHTML
            ).not.toBe('上海');
        });

        it('onClick', function () {
            $(city.target).trigger('click');

            var target = city.labels[1];
            var event = { target: target };
            var value;

            var onPick = function (data) {
                value = data.value;
            };

            var isHide = false;
            var onHide = function () {
                isHide = true;
            };

            var onClick = function (args) {
                var el = args.event.target;

                if (el.tagName === 'LI') {
                    expect(el.getAttribute('data-idx') | 0).toBe(1);
                    expect($(el).hasClass('ecl-ui-city-active')).toBeTruthy();
                }
                else if (el.tagName === 'A') {
                    expect(value).toBe(el.innerHTML);
                    expect(city.target.value).toBe(value);
                    expect(city.main.style.left).toBe('-2000px');
                    expect(isHide).toBeTruthy();
                }
            };


            city.on('hide', onHide);
            city.on('pick', onPick);
            city.on('click', onClick);

            $(target).trigger('click');

            target = city.panels[1].getElementsByTagName('a')[1];
            event.target = target;
            $(target).trigger('click');

            city.un('hide', onHide);
            city.un('click', onClick);
            city.un('pick', onPick);
        });

    });

    describe('其它', function () {

        it('fill', function () {

            city.dispose();
            city = new City({
                prefix: 'ecl-ui-city',
                index: 1,
                autoFill: false,
                triggers: triggers,
                target: triggers[0]
            });

            city.fill('热门|'
                    + '北京,上海,广州,深圳,武汉,杭州,天津,南京,成都,'
                    + '重庆,西安,郑州,大连,青岛,长沙,济南,厦门,哈尔滨');

            city.fill('A-C|'
                    + '鞍山,安阳,安庆,安顺,阿里,安康,阿勒泰,阿克苏,阿坝,阿拉善,'
                    + '北京,保定,宝鸡,包头,北海,蚌埠,巴中,博尔塔拉,亳州,泊头,'
                    + '滨州,毕节,本溪,保山,百色,白银,白山,白城,巴音郭楞,巴彦淖尔,'
                    + '成都,重庆,长沙,常州,长春,常德,赤峰,承德,郴州,潮州,朝阳,常熟,'
                    + '沧州,长治,昌吉,昌都,从化,慈溪,楚雄,滁州,崇左,赤水,池州,巢湖');

            city.fill('K-N|'
                    + '昆明,昆山,开封,克州,克拉玛依,喀什,'
                    + '廊坊,乐山,聊城,丽水,洛阳,连云港,丽江,柳州,辽阳,兰州,'
                    + '拉萨,临沂,临汾,漯河,吕梁,泸州,娄底,陇南,龙岩,来宾,'
                    + '六盘水,六安,浏阳,临夏,临江,临沧,林芝,辽源,凉山,莱芜,'
                    + '牡丹江,绵阳,茂名,梅州,梅河口,眉山,马鞍山,'
                    + '南京,南昌,宁波,南宁,南通,宁德,怒江,南阳,南平,南充,那曲,内江');

            city.render();

            expect(city.tabs.length).toBe(3);
            expect(city.index).toBe(1);


        });
       
        it('setTarget', function () {
            expect(function () {
                city.setTarget($('.city-trigger')[0]);
            }).not.toThrow();
            expect(city.setTarget).toThrow();
        });
    });

});
