/**
 * @file class test
 * @author leon<lupengyu@baidu.com>
 */

define(function (require) {

    var lib = require('ui/lib');

    describe('lib/class', function () {

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

            var Rat = lib.newClass({
                initialize: function () {
                    this.name = 'Jerry';
                }
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
                    return 'Meat' + this.$parent('eat');
                },

                big: function () {
                    return true;
                },

                unkown: function () {
                    return this.$parent('unkown');
                }
            });

            var sinbad = new Lion();

            expect(sinbad.name).toBe('Sinbad');
            expect(sinbad.eat()).toBe('MeatFish');
            expect(sinbad.big()).toBeTruthy();
            expect(sinbad.unkown).toThrow();

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
                    return 'Meat' + this.$parent('eat');
                },

                big: function () {
                    return true;
                }
            });

            var Lion1 = lib.newClass();
            Lion1.implement(Lion);

            var sinbad = new Lion1();

            expect(sinbad.name).toBe('Sinbad');
            expect(sinbad.eat()).toBe('MeatFish');
            expect(sinbad.big()).toBeTruthy();

            expect(sinbad instanceof Lion1).toBe(true);
            expect(sinbad instanceof Lion).toBe(false);
            expect(sinbad instanceof Cat).toBe(false);
        });

        it('类继承2', function () {
            var A = lib.newClass({
                options: {
                    a: true
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
                }
            });

            var a = new A();
            var b = new B();
            var c = new C();

            expect(a instanceof A).toBe(true);
            expect(b instanceof B).toBe(true);
            expect(b instanceof A).toBe(true);
            expect(c instanceof C).toBe(true);
            expect(c instanceof A).toBe(true);
            expect(c instanceof B).toBe(false);

            expect(a.options).toEqual({a: true});
            expect(b.options).toEqual(
                {
                    name: 'b',
                    b: 1
                }
            );
            expect(c.options).toEqual(
                {
                    name: 'c'
                }
            );
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
                    this.$parent(options);
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

        it('类工厂', function () {

            var Test = lib.newClass({

                $class: 'test',

                hello: function (name) {
                    return 'hello, ' + name + ', this is test';
                }

            });

            var TestResolveFromFactory = lib.getClass('test');
            var test = new TestResolveFromFactory();

            expect(test instanceof Test).toBe(true);

        });

        it('类工厂中的类名唯一', function () {

            lib.newClass({
                $class: 'test1'
            });

            expect(function () {
                lib.newClass({
                    $class: 'test1'
                });
            }).toThrow();

        });

        it('在一个不是子类的类实例方法中调用$parent会报错', function () {

            var Test2 = lib.newClass({
                hello: function () {
                    this.$parent();
                }
            });

            var test2 = new Test2();

            expect(function () {
                test2.hello();
            }).toThrow();

        });

        it('在一个子类方法中通过$parent()调用父类没有的方法会报错', function () {

            var Test3 = lib.newClass({
                $class: 'test3',

                hehe: '12321'

            });

            var Test4 = Test3.extend({
                $class: 'test4',
                hello: function () {
                    this.$parent();
                },

                hehe: function () {
                    this.$parent();
                }
            });

            var test4 = new Test4();

            expect(function () {
                test4.hello();
            }).toThrow();

            expect(function () {
                test4.hehe();
            }).toThrow();

        });

        it('获取一个类的指定派生类', function () {

            var Test3 = lib.getClass('test3');

            expect(typeof Test3.getClass).toBe('function');

            var Test4 = Test3.getClass('test4');

            expect(Test4.prototype.$class).toBe('test4');


        });

        it('获取一个类的所有直接派生类', function () {

            var Test3 = lib.getClass('test3');
            var Test4 = lib.getClass('test4');

            expect(typeof Test3.getAllClasses === 'function');

            expect(Test3.getAllClasses().test4).toBe(Test4);

        });



    });


});
