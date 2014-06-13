define(function (require) {

    //设置jslint每行最大字数限制
    /*jslint maxlen: 200 */

    var Unit = require('ui/Unit');

    describe('度量衡算法', function () {

        it('算法+格式化', function () {
            var rs;

            //获取计算并格式化后的值，字符串
            rs = Unit.calc('length', 1, '米', '厘米');
            expect(rs.num).toBe('100');

            rs = Unit.calc('time', 1, '时', '分');
            expect(rs.num).toBe('60');

            rs = Unit.calc('length', 111111111111111111111111, '千米', '海里');
            expect(rs.num).toBe('5.9995e+22');

            //获取计算后的原始值，数字
            rs = Unit.calcOrigin('length', 111111111111111111111111, '千米', '海里');
            expect(rs.num).toBe(5.999520038396928e+22);

            //获取公式
            rs = Unit.getData('length');
            expect(rs).toBeDefined();

        });

        it('格式化单独测试', function () {
            var n;

            //小数位不超过7位正常显示
            n = Unit.format(-0.1);
            expect(n + '').toBe('-0.1');

            n = Unit.format(-0.0001);
            expect(n + '').toBe('-0.0001');

            n = Unit.format(-0.0000923);
            expect(n + '').toBe('-0.0000923');

            n = Unit.format(0.1);
            expect(n + '').toBe('0.1');

            n = Unit.format(0.0001);
            expect(n + '').toBe('0.0001');

            n = Unit.format(0.00009);
            expect(n + '').toBe('0.00009');

            n = Unit.format(1);
            expect(n + '').toBe('1');

            n = Unit.format(1.0001);
            expect(n + '').toBe('1.0001');

            n = Unit.format(1.00009);
            expect(n + '').toBe('1.00009');

            //小数点后超过4位的保留小数点后7位
            n = Unit.format(-0.3213213213212);
            expect(n + '').toBe('-0.3213213');

            n = Unit.format(0.3213213213212);
            expect(n + '').toBe('0.3213213');

            n = Unit.format(1.123456789012);
            expect(n + '').toBe('1.1234568');

            n = Unit.format(1.123456789012345);
            expect(n + '').toBe('1.1234568');

            n = Unit.format(1.123456789);
            expect(n + '').toBe('1.1234568');

            //小数位开始有5个及以上0，转换为科学计数法，计数小数保留四位
            n = Unit.format(-0.00000123);
            expect(n + '').toBe('-1.2300e-6');

            //小数点后超过4位的保留小数点后7位，最后的0省去
            n = Unit.format(-0.132100032123);
            expect(n + '').toBe('-0.1321');

            n = Unit.format(0.132100032123);
            expect(n + '').toBe('0.1321');

            //整数位不超过14位的正常显示，不省略0
            n = Unit.format(10000000000000);
            expect(n + '').toBe('10000000000000');

            n = Unit.format(10000000000001);
            expect(n + '').toBe('10000000000001');

            n = Unit.format(12345678901234);
            expect(n + '').toBe('12345678901234');

            n = Unit.format(1000000000000.1234);
            expect(n + '').toBe('1000000000000');

            //整数位超过14位，用科学计数法，保留小数4位
            n = Unit.format(123456789012345);
            expect(n + '').toBe('1.2346e+14');

            n = Unit.format(100056789012345);
            expect(n + '').toBe('1.0006e+14');

            n = Unit.format(100006789012345);
            expect(n + '').toBe('1.0001e+14');

            //整数位超过14位，用科学计数法，保留小数4位，如果4位小数均为0，则省去
            n = Unit.format(100000000000012);
            expect(n + '').toBe('1e+14');

            n = Unit.format(10000000000000.1);
            expect(n + '').toBe('1e+13');

            n = Unit.format(10000000000000.123);
            expect(n + '').toBe('1e+13');

            //整体不超过14位正常显示
            n = Unit.format(12345.6789);
            expect(n + '').toBe('12345.6789');

            n = Unit.format(12345.0001);
            expect(n + '').toBe('12345.0001');

            //整体不超过14位，保留小数位最多7位，四舍五入
            n = Unit.format(1234.000012321312);
            expect(n + '').toBe('1234.0000123');

            n = Unit.format(12345.67890123456);
            expect(n + '').toBe('12345.6789012');

            n = Unit.format(12345.0001234566);
            expect(n + '').toBe('12345.0001235');

            n = Unit.format(12345.00001234568);
            expect(n + '').toBe('12345.0000123');

            //保留小数位最多7位，四舍五入
            n = Unit.format(1.00000006);
            expect(n + '').toBe('1.0000001');

            n = Unit.format(1.000000124567);
            expect(n + '').toBe('1.0000001');

            n = Unit.format(1.000000123456789);
            expect(n + '').toBe('1.0000001');

            //正常显示
            n = Unit.format(1.0006);
            expect(n + '').toBe('1.0006');

            n = Unit.format(1.00006);
            expect(n + '').toBe('1.00006');

            n = Unit.format(1.0000006);
            expect(n + '').toBe('1.0000006');

            //四舍五入后小数点后都是0，省去
            n = Unit.format(1.00000001);
            expect(n + '').toBe('1');

            n = Unit.format(1.000000010001);
            expect(n + '').toBe('1');

            n = Unit.format(1.00000001);
            expect(n + '').toBe('1');

        });

    });

});
