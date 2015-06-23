/**
 * @file MOYE - Button - 测试用例
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var $ = require('jquery');
    var Control = require('ui/Control');
    var Plugin = require('ui/plugin/Plugin');

    var Test = Control.extend({

        type: 'TestControl',

        initStructure: function () {
            this.main.innerHTML = this
                .helper
                .getPartHTML(
                    'a',
                    'div',
                    'yoyoyo',
                    {
                        'data-value': 'hehe',
                        'data-name': 'a'
                    }
                );
        },

        initEvents: function () {
            this.delegate(this.main, 'click', '[data-value]', this.onClick);
        },

        onClick: function (e) {
            this.fire('click');
        },

        repaint: require('ui/painter').createRepaint(
            Control.prototype.repaint,
            {
                name: ['title'],
                paint: function (conf, title) {
                    this.main.setAttribute('title', title);
                }
            }
        ),

        dispose: function () {
            this.undelegate(this.main, 'click');
            this.$parent();
        }

    });

    var test;

    beforeEach(function () {
        test = new Test({
            name: '12321',
            skin: ['test', 'haha'],
            states: 'hover',
            onXxx: function () {
                this.fire('hehe');
            }
        }).appendTo(document.body);
    });


    afterEach(function () {
        test.destroy();
    });

    describe('Control', function () {

        it('带有ui-${type}样式', function () {
            expect(test.main.className).toContain('ui-testcontrol');
        });

        it('带有skin-${skin}-${type}样式', function () {
            expect(test.main.className).toContain('skin-test');
            expect(test.main.className).toContain('skin-test-testcontrol');
        });

        it('带有state-${state}样式', function () {
            test.addState('heihei');
            expect(test.main.className).toContain('state-heihei');
            expect(test.main.className).toContain('ui-testcontrol-heihei');
            test.removeState('heihei');
            expect(test.main.className).not.toContain('state-heihei');
            expect(test.main.className).not.toContain('ui-testcontrol-heihei');
        });

        it('获取部件的主要样式', function () {

            var partClass = test.helper.getPartClasses('test');
            expect($.isArray(partClass)).toBe(true);
            expect(partClass).toContain('ui-testcontrol-test');
            expect(partClass).toContain('skin-test-testcontrol-test');
            expect(partClass).toContain('skin-haha-testcontrol-test');

            var partClassName = test.helper.getPartClassName('test');

            expect(typeof partClassName === 'string').toBe(true);
            expect(partClassName).toBe(partClass.join(' '));

            var partPrimaryClassName = test.helper.getPrimaryClassName('test');

            expect(partPrimaryClassName).toBe(partClass[0]);

        });

        it('生成控件id', function () {
            var part = test.helper.getPartId();
            expect(part).toBe('ctrl-testcontrol-' + test.id);
        });

        it('生成部件id', function () {
            var part = test.helper.getPartId('yaya');
            expect(part).toBe('ctrl-testcontrol-' + test.id + '-yaya');
        });

        it('生成部件html', function () {

            var partHTML = test
                .helper
                .getPartHTML('button', 'a', 'yo~!', {href: '#'});

            var partClassName = test.helper.getPartClassName('button');

            var partId = test.helper.getPartId('button');

            expect(partHTML).toContain('<a ');
            expect(partHTML).toContain('href="#"');
            expect(partHTML).toContain(partClassName);
            expect(partHTML).toContain(partId);
            expect(partHTML).toContain('>yo~!</a>');

        });

        it('获取部件', function () {

            var part = test.helper.getPart('a');

            expect(part.tagName).toBe('DIV');
            expect(part.innerHTML).toBe('yoyoyo');
            expect(part.getAttribute('data-value')).toBe('hehe');

        });

        it('给某个dom添加/移除部件样式', function () {

            var newPart = document.createElement('div');

            test.helper.addPartClasses('haha', newPart);

            expect(newPart.className).toContain('ui-testcontrol-haha');
            expect(newPart.className).toContain('skin-test-testcontrol-haha');
            expect(newPart.className).toContain('skin-haha-testcontrol-haha');

            test.helper.removePartClasses('haha', newPart);

            expect(newPart.className).not.toContain('ui-testcontrol-haha');
            expect(newPart.className).not.toContain('skin-test-testcontrol-haha');
            expect(newPart.className).not.toContain('skin-haha-testcontrol-haha');


        });

        it('创建部件', function () {
            var part = test.helper.createPart('test', 'input', '', {'data-value': 1});
            expect(part.tagName).toBe('INPUT');
            expect(part.innerHTML).toBe('');
            expect(part.getAttribute('data-value')).toBe('1');
        });

        it('事件代理 - selector', function () {
            var spy = jasmine.createSpy();
            test.on('click', spy);
            $(test.helper.getPart('a')).trigger('click');
            expect(spy).toHaveBeenCalled();
        });

        it('通过配置中的onXXX添加事件侦听', function () {
            var spy = jasmine.createSpy();
            var options = {
                onXxx: spy
            };
            var test = new Test(options);
            test.fire('xxx');
            expect(spy).toHaveBeenCalled();

            // 我们会把options中的onXxx去掉
            expect(options.onXxx).toBe(void 0);
        });

        it('set & get', function () {

            test.set({
                a: 1,
                b: 2
            });

            expect(test.get('a')).toBe(1);
            expect(test.get('b')).toBe(2);

        });

        it('set 触发repaint', function () {
            test.set('title', 'aaa');
            expect(test.main.getAttribute('title')).toBe('aaa');
        });

        it('特殊属性 - disabled', function () {

            var test = new Test({
                disabled: true
            });

            test.render();

            expect(test.isDisabled()).toBe(true);

            test.enable();

            expect(test.isDisabled()).toBe(false);

        });

        it('特殊属性 - hidden', function () {

            var test = new Test({
                hidden: true
            });

            test.render();

            expect(test.hasState('hidden')).toBe(true);

            test.show();

            expect(test.hasState('hidden')).toBe(false);

        });

        it('特殊属性 - readOnly', function () {

            var test = new Test({
                readOnly: true
            }).render();

            // 因为这个标准Test控件没有getValue方法
            // 因此不认为这个货是可以有read-only状态，所以这里应该是false
            expect(test.isReadOnly()).toBe(false);

            var test1 = new Test({
                readOnly: true,
                getValue: function () {
                    return 111;
                }
            }).render();

            expect(test1.isReadOnly()).toBe(true);

            test1.setReadOnly(false);

            expect(test1.isReadOnly()).toBe(false);

        });


        it('插件 - use()', function () {

            var initializeSpy = jasmine.createSpy();
            var activateSpy = jasmine.createSpy();
            var inactivateSpy = jasmine.createSpy();
            var disposeSpy = jasmine.createSpy();

            var test = new Test();

            var TestPlugin = Plugin.extend({

                initialize: function (options) {
                    this.$parent(options);
                    this.initializeSpy();
                },

                initializeSpy: initializeSpy,

                activate: function () {
                    this.$parent();
                    this.activateSpy();
                },

                inactivate: function () {
                    this.$parent();
                    this.inactivateSpy();
                },

                inactivateSpy: inactivateSpy,

                activateSpy: activateSpy,

                dispose: disposeSpy

            });

            var plugin = new TestPlugin();

            test.use(plugin);
            test.render();

            expect(plugin.isActivated()).toBe(true);
            expect(initializeSpy).toHaveBeenCalled();
            expect(activateSpy).toHaveBeenCalled();

            test.dispose();

            expect(disposeSpy).toHaveBeenCalled();


        });

        it('插件 - 配置plugins', function () {

            var activateSpy1 = jasmine.createSpy();
            var inactivateSpy1 = jasmine.createSpy();

            var TestPlugin = Plugin.extend({
                activate: activateSpy1,
                inactivate: inactivateSpy1
            });

            var activateSpy2 = jasmine.createSpy();
            var inactivateSpy2 = jasmine.createSpy();

            Plugin.extend({
                type: 'NamedPlugin',
                activate: activateSpy2,
                inactivate: inactivateSpy2
            });

            var activateSpy3 = jasmine.createSpy();
            var inactivateSpy3 = jasmine.createSpy();

            var pluginOptions = {
                a: 1111
            };

            Plugin.extend({
                type: 'NamedPlugin2',
                activate: activateSpy3,
                inactivate: inactivateSpy3,
                initialize: function (options) {
                    expect(options).toEqual(pluginOptions);
                }
            });


            var TestK = Control.extend({
                plugins: [

                    // 直接传一个插件类，这样不使用任何参数
                    TestPlugin,
                    // 传一个插件类的名字，这样不使用任何参数
                    'NamedPlugin',
                    // 传一个配置，这样可以传递具体的参数
                    {
                        type: 'NamedPlugin2',
                        options: pluginOptions
                    }
                ]
            });

            var test = new TestK();

            test.render();

            expect(activateSpy1).toHaveBeenCalled();
            expect(activateSpy2).toHaveBeenCalled();
            expect(activateSpy3).toHaveBeenCalled();

            test.destroy();

            expect(inactivateSpy1).toHaveBeenCalled();
            expect(inactivateSpy2).toHaveBeenCalled();
            expect(inactivateSpy3).toHaveBeenCalled();

        });

    });

});
