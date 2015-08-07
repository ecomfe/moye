/**
 * @file autocomplete测试用例
 * @author liulangu(liulangyu90316@gmail.com)
 * @date 2015-05-15
 */

define(function (require) {

    var $ = require('jquery');
    var TextBox = require('ui/TextBox');

    require('ui/plugin/TextBoxAutoComplete');

    var textbox;
    var autocomplete;
    var popup;
    var input;
    var textboxChangeDelay = 150;
    var keyMoveDelay = 50;

    var triggerChange;
    var triggerKeyEvent = {};

    var KeyCodes = {
        ENTER: 13,
        ESC: 27,
        UP: 38,
        DOWN: 40
    };

    var datasourceCalledCount = 0;

    var sourceData = [
        {
            text: 'aaa',
            value: 'aaa'
        },
        {
            text: 'bbb',
            value: 'bbb'
        }
    ];

    beforeEach(function () {
        var tpl = '<div id="text-container"><input type="text"></div>';
        $(document.body).append(tpl);

        textbox = new TextBox({
            main: $('#text-container').get(0),
            plugins: [{
                type: 'TextBoxAutoComplete',
                options: {
                    datasource: function () {
                        return sourceData;
                    }
                }
            }]
        }).render();

        // 获取插件
        autocomplete = textbox.plugins[0];
        popup = textbox.getPopup();
        input = textbox.input;

        // 触发input
        triggerChange = function (text) {
            textbox.setValue(text !== undefined ? text : 'test');
            textbox.fire('change');
        };

        $.each(KeyCodes, function (item, v) {
            triggerKeyEvent[item.toLowerCase()] = function () {
                $(input).trigger({
                    type: 'keydown',
                    keyCode: v
                });
            };
        });


        // history
        spyOn(autocomplete, 'datasource').andCallFake(function () {
            ++datasourceCalledCount;
            return sourceData;
        });

        jasmine.Clock.useMock();
    });

    afterEach(function () {
        textbox.destroy();
        popup.destroy();
        $('#text-container').remove();

        textbox = null;
        autocomplete = null;
        popup = null;
        input = null;
        triggerChange = null;
        triggerKeyEvent = {};
        datasourceCalledCount = 0;
    });

    describe('TextBoxAutoComplete 基本数据', function () {
        it('render', function () {
            expect(autocomplete.current).toBeNull();
            expect(autocomplete.delay).toBe(150);
            expect(autocomplete.suggestions).toBeUndefined();
        });
    });

    describe('TextBoxAutoComplete 事件处理', function () {
        it('change', function () {
            triggerChange();

            expect(popup.isVisible()).toBeFalsy();
            jasmine.Clock.tick(textboxChangeDelay);
            expect(popup.isVisible()).toBeTruthy();

            // load data
            expect(autocomplete.current).toBeNull();

            expect(autocomplete.getChildren().size()).toBe(2);

            expect(autocomplete.getActiveItem()).toBeNull();

            expect(autocomplete.getCacheKey()).toBe('test');
            expect($.isArray(autocomplete.getCacheData())).toBeTruthy();

            // set value '' to hide
            triggerChange('');
            jasmine.Clock.tick(textboxChangeDelay);
            expect(popup.isVisible()).toBeFalsy();
            expect(autocomplete.suggestions).toBeNull();
        });

        it('blur', function () {
            triggerChange();

            jasmine.Clock.tick(textboxChangeDelay);
            $(input).trigger('blur');

            expect(popup.isVisible()).toBeTruthy();
            jasmine.Clock.tick(200);
            expect(popup.isVisible()).toBeFalsy();
        });

        it('keydown', function () {
            triggerChange();

            jasmine.Clock.tick(textboxChangeDelay);

            // enter
            triggerKeyEvent.enter();

            // no select
            expect(autocomplete.current).toBeNull();
            expect(popup.isVisible()).toBeFalsy();
            expect(textbox.getValue()).toBe('test');

            // fake select one
            autocomplete.show();
            expect(popup.isVisible()).toBeTruthy();

            autocomplete.current = 0;
            triggerKeyEvent.enter();
            expect(textbox.getValue()).toBe('aaa');

            // esc
            triggerKeyEvent.esc();
            expect(popup.isVisible()).toBeFalsy();

            // real move dowm
            autocomplete.current = null;
            triggerChange('');
            jasmine.Clock.tick(textboxChangeDelay);

            expect(popup.isVisible()).toBeFalsy();

            triggerKeyEvent.down();
            expect(textbox.getValue()).toBe('');
            jasmine.Clock.tick(keyMoveDelay);

            // 没key不显示
            expect(popup.isVisible()).toBeFalsy();

            // trigger with key
            triggerChange();
            jasmine.Clock.tick(textboxChangeDelay);

            triggerKeyEvent.down();
            jasmine.Clock.tick(keyMoveDelay);
            expect(textbox.getValue()).toBe('aaa');

            triggerKeyEvent.down();
            triggerKeyEvent.down();
            jasmine.Clock.tick(keyMoveDelay);
            // throttle
            expect(textbox.getValue()).toBe('bbb');

            triggerKeyEvent.down();
            jasmine.Clock.tick(keyMoveDelay);

            expect(textbox.getValue()).toBe('test');

            // trigger show after hide
            autocomplete.hide();
            expect(popup.isVisible()).toBeFalsy();
            triggerKeyEvent.down();
            jasmine.Clock.tick(keyMoveDelay);
            expect(popup.isVisible()).toBeTruthy();

            // real move up
            triggerKeyEvent.up();
            jasmine.Clock.tick(keyMoveDelay);
            expect(textbox.getValue()).toBe('bbb');

            triggerKeyEvent.up();
            jasmine.Clock.tick(keyMoveDelay);
            expect(textbox.getValue()).toBe('aaa');

            triggerKeyEvent.up();
            jasmine.Clock.tick(keyMoveDelay);
            expect(textbox.getValue()).toBe('test');
            expect(autocomplete.current).toBeNull();
        });
    });

    describe('TextBoxAutoComplete history', function () {
        it('track datasource spy', function () {
            triggerChange();
            jasmine.Clock.tick(textboxChangeDelay);

            expect(autocomplete.datasource).toHaveBeenCalled();
            expect(datasourceCalledCount).toBe(1);

            triggerChange();
            jasmine.Clock.tick(textboxChangeDelay);

            expect(datasourceCalledCount).toBe(1);

            triggerChange('test2');
            jasmine.Clock.tick(textboxChangeDelay);

            expect(datasourceCalledCount).toBe(2);
        });
    });

    describe('TextBoxAutoComplete promsie datasource', function () {
        it('promise data', function () {
            textbox.dispose();
            popup.destroy();

            textbox = new TextBox({
                main: $('#text-container').get(0),
                plugins: [{
                    type: 'TextBoxAutoComplete',
                    options: {
                        datasource: function (query) {
                            return $.Deferred().resolve(sourceData);
                        },
                        // 定制dom
                        renderItem: function (data, index) {
                            return '<div class="test">' + data.text + '</div>';
                        }
                    }
                }]
            }).render();

            popup = textbox.getPopup();
            autocomplete = textbox.plugins[0];

            triggerChange();
            jasmine.Clock.tick(textboxChangeDelay);

            expect(popup.isVisible()).toBeTruthy();

            autocomplete.current = 0;
            var first = autocomplete.getActiveItem();
            expect(first instanceof $).toBeTruthy();
            expect(first.children().hasClass('test')).toBeTruthy();
        });
    });

    describe('TextBoxAutoComplete 暴露的事件', function () {
        it('各种事件', function () {
            var isClickFired;
            var isBeforeShowFired;
            var isShowFired;
            var isHideFired;
            var isPickFired;
            var isAutoCompleteFired;

            textbox
                .on('autocompleteclick', function () {
                    isClickFired = true;
                })
                .on('autocompletebeforeshow', function () {
                    isBeforeShowFired = true;
                })
                .on('autocompleteshow', function () {
                    isShowFired = true;
                })
                .on('autocompletehide', function () {
                    isHideFired = true;
                })
                .on('autocompletepick', function () {
                    isPickFired = true;
                })
                .on('autocomplete', function () {
                    isAutoCompleteFired = true;
                });

            // fire all
            textbox.setValue('test');
            // 可以手动触发下数据加载唷
            textbox.getSuggestions('test');

            $(input).trigger('click');
            expect(popup.isVisible()).toBeTruthy();

            popup.fire('click', {target: autocomplete.getChildren().get(0)});

            expect(isClickFired).toBeTruthy();
            expect(isBeforeShowFired).toBeTruthy();
            expect(isShowFired).toBeTruthy();
            expect(isHideFired).toBeTruthy();
            expect(isPickFired).toBeTruthy();
            expect(isAutoCompleteFired).toBeTruthy();

        });
    });

});
