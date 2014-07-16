define('ui/City', [
    'require',
    'jquery',
    './lib',
    './Control',
    './Popup'
], function (require) {
    var $ = require('jquery');
    var lib = require('./lib');
    var Control = require('./Control');
    var Popup = require('./Popup');
    var privates = {
            build: function () {
                var options = this.options;
                var prefix = options.prefix;
                var index = this.index;
                var active = ' class="' + prefix + '-active"';
                var labels = [];
                var panels = [];
                labels.push('<ul class="' + prefix + '-labels c-clearfix">');
                panels.push('<ul class="' + prefix + '-panels">');
                var comma = ',';
                var hideCities = options.hideCities;
                if (hideCities) {
                    hideCities = comma + hideCities.replace(/\s+/g, '') + comma;
                }
                var makeLinks = function (cities) {
                    var links = [];
                    $.each(cities.split(comma), function (i, city) {
                        if (!hideCities || !~hideCities.indexOf(comma + city + comma)) {
                            links.push('' + '<a href="#" title="' + city + '">' + city + '</a>');
                        }
                    });
                    return links.join('');
                };
                $.each(this.tabs, function (i, tab) {
                    var start = '<li data-idx="' + i + '"' + (i === index ? active : '');
                    tab = tab.split('|');
                    labels.push(start + '>' + tab[0] + '</li>');
                    panels.push(start + '>' + makeLinks(tab[1]) + '</li>');
                });
                labels.push('</ul>');
                panels.push('</ul>');
                return labels.join('') + panels.join('');
            },
            onClick: function (args) {
                var e = args.event;
                if (!e) {
                    return;
                }
                var el = e.target;
                var tag = el.tagName;
                var target = this.target;
                var index = el.getAttribute('data-idx');
                switch (tag) {
                case 'A':
                    e.preventDefault();
                    if (el.className) {
                        this.hide();
                    } else {
                        privates.pick.call(this, el);
                    }
                    break;
                case 'LI':
                    if (index) {
                        this.change(index);
                    }
                    break;
                default:
                    if (target) {
                        target.select();
                    }
                    break;
                }
                this.fire('click', args);
            },
            onBeforeShow: function (arg) {
                this.fire('beforeShow', arg);
                if (!this.labels) {
                    var popup = this.popup;
                    popup.content = privates.build.call(this);
                    popup.render();
                    var main = this.main;
                    var list = main.getElementsByTagName('ul');
                    this.labels = list[0].getElementsByTagName('li');
                    this.panels = list[1].getElementsByTagName('li');
                }
            },
            pick: function (el) {
                var value = el.innerHTML;
                var target = this.target;
                if (target) {
                    if (target.type) {
                        target.value = value;
                        target.focus();
                    } else {
                        target.innerHTML = value;
                    }
                }
                this.fire('pick', { value: value });
                this.hide();
            }
        };
    var City = Control.extend({
            type: 'City',
            options: {
                disabled: false,
                main: '',
                target: '',
                prefix: 'ecl-hotel-ui-city',
                index: 0,
                activeClass: 'active',
                autoFill: true,
                hideCities: null
            },
            binds: 'onClick,onBeforeShow',
            init: function (options) {
                this.disabled = options.disabled;
                this.index = options.index;
                var tabs = this.tabs = [];
                if (options.autoFill) {
                    tabs.push('\u70ED\u95E8|' + '\u4E0A\u6D77,\u5317\u4EAC,\u5E7F\u5DDE,\u6606\u660E,\u897F\u5B89,\u6210\u90FD,\u6DF1\u5733,\u53A6\u95E8,\u4E4C\u9C81\u6728\u9F50,\u5357\u4EAC,' + '\u91CD\u5E86,\u676D\u5DDE,\u5927\u8FDE,\u957F\u6C99,\u6D77\u53E3,\u54C8\u5C14\u6EE8,\u9752\u5C9B,\u6C88\u9633,\u4E09\u4E9A,\u6D4E\u5357,' + '\u6B66\u6C49,\u90D1\u5DDE,\u8D35\u9633,\u5357\u5B81,\u798F\u5DDE,\u5929\u6D25,\u957F\u6625,\u77F3\u5BB6\u5E84,\u592A\u539F,\u5170\u5DDE');
                    tabs.push('A-G|' + '\u5B89\u5E86,\u963F\u52D2\u6CF0,\u5B89\u5EB7,\u978D\u5C71,\u5B89\u987A,\u5B89\u9633,\u963F\u514B\u82CF,\u5305\u5934,\u868C\u57E0,\u5317\u6D77,' + '\u5317\u4EAC,\u767E\u8272,\u4FDD\u5C71,\u535A\u4E50,\u957F\u6CBB,\u957F\u6625,\u957F\u6D77,\u5E38\u5DDE,\u660C\u90FD,\u671D\u9633,\u6F6E\u5DDE,' + '\u5E38\u5FB7,\u957F\u767D\u5C71,\u6210\u90FD,\u91CD\u5E86,\u957F\u6C99,\u8D64\u5CF0,\u5927\u540C,\u5927\u8FDE,\u8FBE\u53BF,\u5927\u8DB3,\u4E1C\u8425,' + '\u5927\u5E86,\u4E39\u4E1C,\u5927\u7406,\u6566\u714C,\u9102\u5C14\u591A\u65AF,\u6069\u65BD,\u4E8C\u8FDE\u6D69\u7279,\u4F5B\u5C71,\u798F\u5DDE,' + '\u961C\u9633,\u5BCC\u8574,\u8D35\u9633,\u6842\u6797,\u5E7F\u5DDE,\u5E7F\u5143,\u8D63\u5DDE,\u683C\u5C14\u6728,\u5E7F\u6C49,\u56FA\u539F');
                    tabs.push('H-L|' + '\u547C\u548C\u6D69\u7279,\u54C8\u5BC6,\u9ED1\u6CB3,\u6D77\u62C9\u5C14,\u54C8\u5C14\u6EE8,\u6D77\u53E3,\u8861\u9633,\u9EC4\u5C71,\u676D\u5DDE,' + '\u90AF\u90F8,\u5408\u80A5,\u9EC4\u9F99,\u6C49\u4E2D,\u548C\u7530,\u60E0\u5DDE,\u5409\u5B89,\u5409\u6797,\u9152\u6CC9,\u9E21\u897F,\u664B\u6C5F,' + '\u9526\u5DDE,\u666F\u5FB7\u9547,\u5609\u5CEA\u5173,\u4E95\u5188\u5C71,\u6D4E\u5B81,\u4E5D\u6C5F,\u4F73\u6728\u65AF,\u6D4E\u5357,\u5580\u4EC0,' + '\u6606\u660E,\u5EB7\u5B9A,\u514B\u62C9\u739B\u4F9D,\u5E93\u5C14\u52D2,\u5580\u7EB3\u65AF,\u5E93\u8F66,\u5170\u5DDE,\u6D1B\u9633,\u4E3D\u6C5F,\u6881\u5E73,' + '\u8354\u6CE2,\u5E90\u5C71,\u6797\u829D,\u67F3\u5DDE,\u6CF8\u5DDE,\u8FDE\u4E91\u6E2F,\u9ECE\u5E73,\u8FDE\u57CE,\u62C9\u8428,\u4E34\u6CA7,\u4E34\u6C82');
                    tabs.push('M-T|' + '\u7261\u4E39\u6C5F,\u8292\u5E02,\u6EE1\u6D32\u91CC,\u7EF5\u9633,\u6885\u53BF,\u6F20\u6CB3,\u5357\u4EAC,\u5357\u5145,\u5357\u5B81,\u5357\u9633,\u5357\u901A,' + '\u90A3\u62C9\u63D0,\u5357\u660C,\u5B81\u6CE2,\u6500\u679D\u82B1,\u8862\u5DDE,\u79E6\u7687\u5C9B,\u5E86\u9633,\u4E14\u672B,\u9F50\u9F50\u54C8\u5C14,\u9752\u5C9B,' + '\u6C55\u5934,\u6DF1\u5733,\u77F3\u5BB6\u5E84,\u4E09\u4E9A,\u6C88\u9633,\u4E0A\u6D77,\u601D\u8305,\u912F\u5584,\u97F6\u5173,\u6C99\u5E02,\u82CF\u5DDE,' + '\u5510\u5C71,\u94DC\u4EC1,\u901A\u5316,\u5854\u57CE,\u817E\u51B2,\u53F0\u5DDE,\u5929\u6C34,\u5929\u6D25,\u901A\u8FBD,\u592A\u539F,\u5410\u9C81\u756A');
                    tabs.push('W-Z|' + '\u5A01\u6D77,\u6B66\u6C49,\u68A7\u5DDE,\u6587\u5C71,\u65E0\u9521,\u6F4D\u574A,\u6B66\u5937\u5C71,\u4E4C\u5170\u6D69\u7279,\u6E29\u5DDE,\u4E4C\u9C81\u6728\u9F50,' + '\u829C\u6E56,\u4E07\u5DDE,\u4E4C\u6D77,\u5174\u4E49,\u897F\u660C,\u53A6\u95E8,\u9999\u683C\u91CC\u62C9,\u897F\u5B89,\u8944\u9633,\u897F\u5B81,' + '\u9521\u6797\u6D69\u7279,\u897F\u53CC\u7248\u7EB3,\u5F90\u5DDE,\u5174\u57CE,\u5174\u5B81,\u90A2\u53F0,\u4E49\u4E4C,\u6C38\u5DDE,\u6986\u6797,' + '\u5EF6\u5B89,\u8FD0\u57CE,\u70DF\u53F0,\u94F6\u5DDD,\u5B9C\u660C,\u5B9C\u5BBE,\u76D0\u57CE,\u5EF6\u5409,\u7389\u6811,\u4F0A\u5B81,\u4F0A\u6625,' + '\u73E0\u6D77,\u662D\u901A,\u5F20\u5BB6\u754C,\u821F\u5C71,\u90D1\u5DDE,\u4E2D\u536B,\u82B7\u6C5F,\u6E5B\u6C5F,\u4E2D\u7538,\u9075\u4E49');
                }
                this.bindEvents(privates);
            },
            fill: function (tabsOrItem) {
                var tabs = this.tabs;
                if (lib.isString(tabsOrItem)) {
                    tabs.push(tabsOrItem);
                } else {
                    this.tabs = tabsOrItem;
                }
                return this;
            },
            render: function () {
                var options = this.options;
                if (!this.rendered) {
                    this.rendered = true;
                    var popup = this.popup = new Popup(this.srcOptions);
                    var bound = this._bound;
                    popup.on('click', $.proxy(bound.onClick, this));
                    popup.on('beforeShow', $.proxy(bound.onBeforeShow, this));
                    this.main = popup.main;
                    if (options.target) {
                        this.setTarget(lib.g(options.target));
                    }
                }
                return this;
            },
            setTarget: function (target) {
                if (!target || target.nodeType !== 1) {
                    throw new Error('target \u4E3A null \u6216\u975E Element \u8282\u70B9');
                }
                this.target = target;
                if (this.popup) {
                    this.popup.target = target;
                }
            },
            change: function (i) {
                var options = this.options;
                var labels = this.labels;
                var panels = this.panels;
                var index = this.index;
                var activeClass = options.prefix + '-' + options.activeClass;
                i |= 0;
                if (i !== index) {
                    $(labels[index]).removeClass(activeClass);
                    $(panels[index]).removeClass(activeClass);
                    index = this.index = i;
                    $(labels[index]).addClass(activeClass);
                    $(panels[index]).addClass(activeClass);
                }
            },
            show: function (target) {
                this.popup.show();
                this.fire('show', { target: target });
            },
            hide: function () {
                this.popup.hide();
                this.fire('hide');
            }
        });
    return City;
});