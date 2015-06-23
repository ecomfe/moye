/**
 * @file MOYE - main模块 - 测试用例
 * @author Leon(leon@outlook.com)
 */

define(function (require) {

    var $ = require('jquery');
    var main = require('ui/main');

    var lib = require('ui/lib');

    require('ui/Button');
    require('ui/Panel');

    /*eslint-disable max-nested-callbacks*/

    describe('main', function () {

        it('init', function () {
            var html = ''
                + '<div id="container">'
                +     '<div id="app" data-ui-id="app">'
                +         '<button data-ui-id="btn">按钮</button>'
                +         '<button data-ui-id="btn2">按钮2</button>'
                +     '</div>'
                +     '<button data-ui-id="btn3">按钮3</button>'
                + '</div>';

            $(html).appendTo(document.body);

            var controls = main.init(document.getElementById('container'), {
                app: {
                    type: 'Panel'
                },
                btn: {
                    type: 'Button',
                    text: 'a',
                    childName: 'a'
                },
                btn2: {
                    type: 'Button',
                    text: 'b',
                    childName: 'b'
                },
                btn3: {
                    type: 'Button',
                    text: 'c'
                }
            });

            expect(lib.keys(controls).length).toBe(2);

            var panel = controls.app;

            expect(main.getControlByDOM(document.getElementById('app'))).toBe(panel);

            var btn = main.get('btn');

            expect(panel.getChild('a')).toBe(btn);
            expect(panel.getChild('b')).toBe(main.get('btn2'));

            panel.removeChild(btn);

            expect(btn.getParent()).toBe(null);
            expect(panel.getChild('a')).toBeFalsy();

            lib.each(controls, function (control) {
                control.destroy();
            });

            $('#container').remove();

        });

    });

});
