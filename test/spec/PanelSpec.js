/**
 * @file Panel控件测试用例
 * @author wuhuiyao(wuhuiyao@baidu.com)
 */

define(function (require) {

    var $ = require('jquery');
    var lib = require('ui/lib');

    require('ui/Button');
    var Panel = require('ui/Panel');

    var testPanel;

    function createPanel() {
        var main = $('<div id="my-panel"><button data-ui-id="btn" type="Button">按钮</button><button data-ui-id="btn2" type="Button">按钮2</button></div>').appendTo(document.body);
        testPanel = new Panel({main: main[0]});
        testPanel.context.fill({
            btn: {
                type: 'Button'
            },
            btn2: {
                type: 'Button'
            },
            btn3: {
                type: 'Button'
            }
        });
        testPanel.render();
    }

    function disposePanel() {
        testPanel.dispose();
        $('#my-panel').remove();
    }

    describe('标准接口', function () {
        beforeEach(createPanel);
        afterEach(disposePanel);

        it('render', function () {
            expect(testPanel.children.length).toEqual(2);

            var btn = testPanel.context.get('btn');
            expect(btn).toBeDefined();
            expect(btn.type).toEqual('Button');
        });

        it('disable', function () {
            testPanel.disable();

            var children = testPanel.children;
            var disabeld = true;
            $.each(children, function (idx, item) {
                disabeld && (disabeld = item.isDisabled());
            });
            expect(disabeld).toBeTruthy();
        });

        it('enable', function () {
            testPanel.disable();
            testPanel.enable();

            var children = testPanel.children;
            var enabled = true;
            $.each(children, function (idx, item) {
                enabled && (enabled = !item.isDisabled());
            });
            expect(enabled).toBeTruthy();
        });

        it('setContent', function () {
            testPanel.setContent('<div data-ui-id="btn3">新按钮</div><label>Hello</label>');

            expect(testPanel.children.length).toEqual(1);

            var btn = testPanel.context.get('btn3');
            expect(btn).toBeDefined();
            expect(btn.type).toEqual('Button');
            expect($('label', testPanel.main).length).toEqual(1);
        });
    });

});
