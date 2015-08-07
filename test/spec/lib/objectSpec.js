/**
 * @file MOYE - lib/object - 测试用例
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var lib = require('ui/lib');

    describe('lib.stringify', function () {

        it('简单的序列化', function () {

            var a = {
                name: 'aaa',
                cars: ['baoma', 'minicooper'],
                isChecked: true,
                age: 10
            };

            var str = lib.stringify(a);

            expect(str).toBe('{"name":"aaa","cars":["baoma","minicooper"],"isChecked":true,"age":10}');

        });

    });


    describe('lib.clone', function () {

        it('复制对象', function () {

            var a = {
                name: 'aaa'
            };

            var b = lib.clone(a);

            expect(b).not.toBe(a);

            expect(b.name).toBe('aaa');

        });


        it('复制数组', function () {

            var a = [1, 2, 3];

            var b = lib.clone(a);

            expect(b).not.toBe(a);

            expect(b[0]).toBe(1);
            expect(b[1]).toBe(2);
            expect(b[2]).toBe(3);

        });

        it('深层复制', function () {

            var a = {
                name: 'aaa',
                age: 1,
                students: [{
                    name: 's1',
                    age: 0
                }]
            };

            var b = lib.clone(a);

            expect(b.students).not.toBe(a.students);
            expect(b.students[0]).not.toBe(a.students[0]);

            expect(b.students[0]).toEqual(a.students[0]);


        });


        it('不复制复杂对象', function () {

            var A = function () {
                this.name = '111';
            };

            var a = new A();

            var b = lib.clone(a);

            expect(a).toBe(b);

        });

    });

    describe('lib.extend', function () {

        it('正常状态', function () {

            var empty = {};

            var another = {
                e: 5
            };

            var a = lib.extend(
                empty,
                {
                    a: 1,
                    b: 2
                },
                {
                    b: 0,
                    c: 3
                },
                {
                    d: another
                }
            );

            expect(a).toBe(empty);
            expect(a.a).toBe(1);
            expect(a.b).toBe(0);
            expect(a.c).toBe(3);
            expect(a.d.e).toBe(5);
            expect(a.d).not.toBe(another);

        });

        it('合并数组', function () {

            var a = [1, 2, 3];

            var b = [{name: 'aaa'}];

            var result = lib.extend(a, b);

            expect(result[0].name).toBe('aaa');
            expect(result[0]).not.toBe(b[0]);

        });

        it('把数组合并到对象上', function () {

            var a = {};

            var b = [1, 2, 3];

            var result = lib.extend(a, b);

            expect(result[0]).toBe(1);

        });

        it('把对象合并到数组上', function () {

            var a = [];

            var b = {
                name: '222'
            };

            expect(lib.extend(a, b).name).toBe('222');

        });

        it('忽略null/undefined的合并对象', function () {

            var a = {
                name: 1
            };

            var b = lib.extend(a, null, void 0);

            expect(b.name).toBe(1);

        });

    });

    describe('lib.has', function () {

        it('判断一个对象是否自拥有一个属性', function () {

            var obj = {foo: 'bar', func: function () {}};
            expect(lib.has(obj, 'foo')).toBe(true, 'has() checks that the object has a property.');
            expect(!lib.has(obj, 'baz')).toBe(true, 'has() returns false if the object doesn\'t have the property.');
            expect(lib.has(obj, 'func')).toBe(true, 'has() works for functions too.');
            obj.hasOwnProperty = null;
            expect(lib.has(obj, 'foo')).toBe(true, 'has() works even when the hasOwnProperty method is deleted.');
            var child = {};
            child.prototype = obj;
            expect(!lib.has(child, 'foo')).toBe(true, 'has() does not check the prototype chain for a property.');
            expect(lib.has(null, 'foo')).toBe(false, 'has() returns false for null');
            expect(lib.has(void 0, 'foo')).toBe(false, 'has() returns false for undefined');

        });

    });

    describe('lib.toQueryString', function () {
        it('正常状态', function () {
            var input = {
                b: 1,
                c: 'c'
            };

            // 'a[1]=2&a[0]=1&b=1&c=c&d[e]=1';
            var output = lib.toQueryString(input).split('&');
            expect(output).toContain('b=1');
            expect(output).toContain('c=c');
        });

        it('忽略null/undefined值', function () {
            var input = {
                a: void 0,
                name: 'aaa'
            };
            // 'a[1]=2&a[0]=1&b=1&c=c&d[e]=1';
            var output = lib.toQueryString(input);
            expect(output).toContain('name=aaa');
            expect(output).toNotContain('a=');
        });

        it('转化数组', function () {
            var input = {
                a: [1, 2]
            };
            var output = lib.toQueryString(input).split('&');
            expect(output).toContain('a[0]=1');
            expect(output).toContain('a[1]=2');
        });

        it('转化对象', function () {
            var input = {
                d: {
                    e: 1
                }
            };
            // 'a[1]=2&a[0]=1&b=1&c=c&d[e]=1';
            var output = lib.toQueryString(input).split('&');
            expect(output).toContain('d[e]=1');
        });

    });

});
