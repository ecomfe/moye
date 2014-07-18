define('ui/Tabs', [
    'require',
    'jquery',
    './lib',
    './Control'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var privates = {
            onClick: function (e) {
                var main = this.main;
                var options = this.options;
                var target = $(e.target);
                if (!target.is('li')) {
                    target = target.closest('li', main);
                    if (!target.length) {
                        return;
                    }
                }
                var selectedClass = options.prefix + '-selected';
                var hasSelected = target.hasClass(selectedClass);
                var index = target.attr('data-index') | 0;
                if (hasSelected || this.onBeforeChange(this.selectedIndex, index) === false) {
                    return;
                }
                var labels = this.labels;
                $(labels[this.selectedIndex]).removeClass(selectedClass);
                $(labels[index]).addClass(selectedClass);
                var selectedLabel = labels[index];
                this.fire('change', {
                    selected: selectedLabel,
                    oldIndex: this.selectedIndex,
                    newIndex: index
                });
                this.selectedIndex = index;
            }
        };
    var Tabs = Control.extend({
            type: 'Tabs',
            options: {
                disabled: false,
                main: '',
                prefix: 'ecl-ui-tabs',
                selectedIndex: 0
            },
            init: function (options) {
                this.main = lib.g(options.main);
                this.labels = $('.' + options.prefix + '-labels', this.main)[0];
                this.selectedIndex = options.selectedIndex | 0;
                this.bindEvents(privates);
            },
            render: function () {
                var options = this.options;
                if (!this.rendered) {
                    this.rendered = true;
                    $(this.labels).on('click', this._bound.onClick);
                    var labels = $('li', this.labels).toArray();
                    var noPseudoElement = lib.browser.ie6;
                    $.each(labels, function (i, label) {
                        label.setAttribute('data-index', i);
                        if (noPseudoElement) {
                            label.innerHTML += '<i></i>';
                        }
                    });
                    var selectedClass = options.prefix + '-selected';
                    var selectedLabel = $('.' + selectedClass, this.labels)[0];
                    this.labels = labels;
                    if (selectedLabel) {
                        this.selectedIndex = selectedLabel.getAttribute('data-index') | 0;
                    } else {
                        selectedLabel = labels[this.selectedIndex];
                        selectedLabel && $(selectedLabel).trigger('click');
                    }
                }
                return this;
            },
            onBeforeChange: function (oldIndex, newIndex) {
                return true;
            }
        });
    return Tabs;
});