/**
 * @file 校验状态测试用例
 * @author cxtom (cxtom2010@gmail.com)
 */

define(function (require) {

    var lib  = require('ui/lib');
    var TextBox = require('ui/TextBox');
    require('ui/plugin/TextBoxPlaceHolder');

    var ie = lib.browser.ie;

    // 非IE8以下没有
    if (!ie || ie > 8) {
        describe('TextBoxPlaceHolder 非IE8以下浏览器不使用', function () {
            it('', function () {
                expect(true).toBeTruthy();
            });
        });
        return;
    }

    var textbox;
    var placeholder;
    var popup;
    var input;
    var triggerChange;
    var popupDelay = 50;
    var textboxChangeDelay = 150;

    beforeEach(function () {
        var tpl = '<div id="text-container"><input type="text"></div>';
        $(document.body).append(tpl);

        textbox = new TextBox({
            main: $('#text-container').get(0),
            plugins: ['TextBoxPlaceHolder']
        }).render();

        // 获取插件
        placeholder = textbox.plugins[0];
        popup = placeholder.getPopup();
        input = textbox.input;

        // 触发change
        triggerChange = function (text) {
            textbox.setValue(text !== undefined ? text : 'test');
            textbox.fire('change');
        };

        jasmine.Clock.useMock();
    });

    afterEach(function () {
        textbox.destroy();
        popup.destroy();
        $('#text-container').remove();

        textbox = null;
        placeholder = null;
        popup = null;
        input = null;
    });

    describe('TextBoxPlaceHolder 事件处理', function () {
        it('focus', function () {
            triggerChange('');
            $(input).trigger('focus');

            jasmine.Clock.tick(textboxChangeDelay);
            expect(popup.isVisible()).toBeFalsy();
        });

        it('blur', function () {
            triggerChange();

            jasmine.Clock.tick(textboxChangeDelay);
            $(input).trigger('blur');

            jasmine.Clock.tick(popupDelay);
            expect(popup.isVisible()).toBeFalsy();

            triggerChange('');

            jasmine.Clock.tick(textboxChangeDelay);
            $(input).trigger('blur');

            jasmine.Clock.tick(popupDelay);
            expect(popup.isVisible()).toBeTruthy();
        });
    });

});
