/**
 * @file moye - TextBox - placeholder
 * @author Leon(lupengyu@baidu)
 */
define(function (require) {

    var lib = require('../lib');
    var Plugin = require('./Plugin');

    var TextBoxPlaceHolder = Plugin.extend({

        $class: 'TextBoxPlaceHolder',

        activate: function (textbox) {

            var ie = lib.browser.ie;

            if (!ie || ie > 8) {
                $(textbox.input).attr('placeholder', textbox.placeholder);
                return;
            }

            this.textbox = this.textbox;
            var main = this.main = textbox.helper.createPart('placeholder');
            textbox.main.appendChild(this.main);
            this.isNeedToShow() ? this.show() : this.hiden();
        },

        inactivate: function () {
            // TODO
        },

        isNeedToShow: function () {
            var textbox = this.textbox;
            return textbox.getValue() === '' && !$(textbox.input).is(':focus');
        },

        show: function () {

        },

        hide: function () {

        }

    });

    return TextBoxPlaceHolder;
});
