/**
 * @file 公共库组件测试用例
 * @author chris <wfsr@foxmail.com>
 * @author ludafa <leonlu@outlook.com>
 */

define(function (require) {
    var $ = require('jquery');
    var lib = require('ui/lib');
    

    beforeEach(function () {

        
    });


    afterEach(function () {
    });
  
    describe('类型判断', function () {

        /* jshint -W053 */
        it('字符串判断', function () {

            expect(lib.isString).not.toBeUndefined();

            expect(lib.isString('just a pure string')).toBeTruthy();

            expect(lib.isString(new String('string create from new')))
                .toBeTruthy();

            expect(lib.typeOf(new String('box string'))).toBe('string');

        });

        it('数组判断及转换', function () {
            var array = [ 1, 2 ];
            expect(lib.clone(array) === array).toBeFalsy();
        });

        it('日期判断', function () {

            expect(lib.isDate).not.toBeUndefined();

            expect(lib.isDate(new Date())).toBeTruthy();

            expect(lib.typeOf(new Date())).toBe('date');

        });

        it('DOM判断', function () {
            expect(lib.typeOf(document.createElement('div'))).toBe('dom');
        });

        it('对象判断', function () {

            expect(lib.isObject).not.toBeUndefined();

            expect(lib.isObject(lib)).toBeTruthy();

            /* jshint -W010 */
            expect(lib.isObject({})).toBeTruthy();

            expect(lib.isObject(new Object())).toBeTruthy();

            expect(lib.typeOf({})).toBe('object');

        });

    });

    describe('JSON处理', function () {
        it('toQueryString', function () {
            var input = { a: [ 1, 2 ], b: 1, c: 'c', d: { e: 1 } };

            // 'a[1]=2&a[0]=1&b=1&c=c&d[e]=1';
            var output = lib.toQueryString(input);

            expect(lib.contains(output, 'a[0]=1', '&')).toBe(true);
            expect(lib.contains(output, 'a[1]=2', '&')).toBe(true);
            expect(lib.contains(output, 'b=1', '&')).toBe(true);
            expect(lib.contains(output, 'c=c', '&')).toBe(true);
            expect(lib.contains(output, 'd[e]=1', '&')).toBe(true);
        });
    });

    describe('string处理', function () {
        it('capitalize', function () {
            var input = 'position';
            var output = 'Position';
            expect(lib.capitalize(input)).toBe(output);

            input = 'border-left-width';
            output = 'Border-Left-Width';
            expect(lib.capitalize(input)).toBe(output);

            input = 'border-Left-width';
            output = 'Border-Left-Width';
            expect(lib.capitalize(input)).toBe(output);
        });
    });


    describe('Array处理', function () {

        it('slice', function () {
            expect(lib.slice).toBeDefined();
            expect(lib.array.slice).toBeDefined();

            var input = [ 1, 2, 3 ];
            // 返回的是副本
            expect(lib.slice(input)).not.toBe(input);
            expect(lib.slice(input)).toEqual(input);

            expect(lib.slice(input, 1)).toEqual([ 2, 3 ]);
            expect(lib.slice(input, 1, -1)).toEqual([ 2 ]);
        });

    });


    describe('function处理', function () {
        it('curry', function () {
            var fn = function (first, last) {
                return first + last;
            };

            var curried = lib.curry(fn, 'chris');

            expect(curried('wong')).toBe(fn('chris', 'wong'));
        });
    });

    describe('类模拟', function () {
        var Cat;

        beforeEach(function () {
            Cat = lib.newClass({
                initialize: function (name) {
                    this.name = name;
                },

                say: function () {
                    return 'Miao~';
                }
            });                
        });

        afterEach(function () {
            Cat = null;
        });

        it('类创建', function () {

            var Rat = lib.newClass(function () {
                this.name = 'Jerry';
            });

            var tom = new Cat('Tom');
            var jerry = new Rat();

            expect(tom instanceof Cat).toBeTruthy();
            expect(tom.name).toBe('Tom');
            expect(tom.say()).toBe('Miao~');

            expect(jerry.name).toBe('Jerry');
            expect(jerry instanceof Rat).toBeTruthy();
        });

        it('类扩展', function () {
            var tom = new Cat('Tom');

            expect(tom.name).toBe('Tom');
            expect(tom.say()).toBe('Miao~');
            expect(tom.eat).toBeUndefined();

            Cat.implement({
                say: function () {
                    return 'Mao';
                },

                eat: function () {
                    return 'Fish';
                }
            });

            expect(tom.say()).toBe('Mao');
            expect(tom.eat()).toBe('Fish');
        });

        it('类继承', function () {
            Cat.implement({
                eat: function () {
                    return 'Fish';
                }
            });
            
            var Lion = Cat.extend({
                initialize: function () {
                    this.name = 'Sinbad';
                },

                eat: function () {
                    return 'Meat' + this.parent('eat');
                },

                big: function () {
                    return true;
                },

                unknow: function () {
                    return this.parent('unknow');
                }
            });

            var sinbad = new Lion();

            expect(sinbad.name).toBe('Sinbad');
            expect(sinbad.eat()).toBe('MeatFish');
            expect(sinbad.big()).toBeTruthy();
            expect($.proxy(sinbad.unknow, sinbad)).toThrow();

            expect(sinbad instanceof Lion).toBe(true);
            expect(sinbad instanceof Cat).toBe(true);
        });

        it('类继承1', function () {
            Cat.implement({
                eat: function () {
                    return 'Fish';
                }
            });
            
            var Lion = Cat.extend({
                initialize: function () {
                    this.name = 'Sinbad';
                },

                eat: function () {
                    return 'Meat' + ' & ' + this.parent('eat');
                },

                big: function () {
                    return true;
                }
            });

            var Lion1 = lib.newClass();
            Lion1.implement(Lion);

            var sinbad = new Lion1();

            expect(sinbad.name).toBe('Sinbad');
            expect(sinbad.eat()).toBe('Meat & Fish');
            expect(sinbad.big()).toBeTruthy();

            expect(sinbad instanceof Lion1).toBe(true);
            expect(sinbad instanceof Lion).toBe(false);
            expect(sinbad instanceof Cat).toBe(false);
        });

        it('类继承2', function () {
            var A = lib.newClass({
                options: {
                    a: true
                },

                foo: function () {
                    return this.options.a;
                }
            });

            var B = A.extend({
                options: {
                    name: 'b',
                    b: 1
                }
            });

            var C = A.extend({
                options: {
                    name: 'c'
                },

                foo: function () {
                    return this.options.name + ':' + this.parent();
                }
            });

            var D = C.extend({
                name: 'D',

                foo: function () {
                    return this.name + ':' + this.parent();
                }
            });

            var a = new A();
            var b = new B();
            var c = new C();
            var d = new D();

            expect(a instanceof A).toBe(true);
            expect(b instanceof B).toBe(true);
            expect(b instanceof A).toBe(true);
            expect(c instanceof C).toBe(true);
            expect(c instanceof A).toBe(true);
            expect(c instanceof B).toBe(false);
            expect(d instanceof D).toBe(true);
            expect(d instanceof C).toBe(true);
            expect(d instanceof A).toBe(true);
            expect(d.foo()).toBe('D:c:true');

            expect(a.options).toEqual({ a: true });
            expect(b.options).toEqual(
                {
                    a: true,
                    name: 'b',
                    b: 1
                }
            );
            expect(c.options).toEqual(
                {
                    a: true,
                    name: 'c'
                }
            );
        });

        it('私有方法', function () {
            Cat.implement({
                _foo: function () {
                    return 'bar';
                },

                _bar: function () {
                    return this._foo();
                },

                foo: function () {
                    return this._bar();
                }
            });

            var cat = new Cat('Tom');
            expect(cat._foo).toThrow();
            expect(cat._bar).toThrow();
            expect($.proxy(cat.foo, cat)).not.toThrow();
        });

        it('事件实现', function () {
            Cat.implement(lib.observable);
            var tom = new Cat();

            var onCatchRat = jasmine.createSpy('onCatchRat');
            var onEvent = jasmine.createSpy('onEvent');
            var onOnceCatchRat = jasmine.createSpy('onOnceCatchRat');

            tom.on('catchRat', onCatchRat);
            tom.once('catchRat', onOnceCatchRat);
            tom.on(onEvent);
            tom.fire('catchRat');

            expect(onCatchRat).toHaveBeenCalled();
            expect(onOnceCatchRat).toHaveBeenCalled();
            expect(onEvent).toHaveBeenCalled();

            tom.fire('catchRat');
            expect(onCatchRat.calls.length).toBe(2);
            expect(onOnceCatchRat.calls.length).toBe(1);

            tom.un('catchRat');
            tom.fire('catchRat');
            expect(onCatchRat.calls.length).toBe(2);

        });

        it('参数可配实现', function () {
            var Lion = Cat.extend({
                options: {
                    name: 'Sinbad',
                    age: 3
                },
                initialize: function (options) {
                    options = this.setOptions(options);
                    this.name = options.name;
                    this.age = options.age;
                }
            }).implement(lib.configurable);
            

            var lion = new Lion({
                name: 'Sid',
                age: 1
            });

            expect(lion.name).toBe('Sid');
            expect(lion.age).toBe(1);

        });
    });

});
