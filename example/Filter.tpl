{% target: Filter(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Filter.less">

{% content: content %}

{% filter: markdown %}
# Filter

### DEMO
-----------------------

{% /filter%}

<div class="result-op" srcid="16873" id="1" mu="http://baike.baidu.com/view/1758.htm" data-op="{'y':'FD9FFD6B'}">
    <form class="ecl-ui-filter" autocomplete="off">
        <p>按类型：
            <label class="checked"><input type="radio" name="type" value="" checked="checked" />全部</label>
            <label><input type="radio" name="type" value="1" />角色扮演</label>
            <label><input type="radio" name="type" value="2" />运动休闲</label>
            <label><input type="radio" name="type" value="3" />射击游戏</label>
            <label><input type="radio" name="type" value="4" />回合游戏</label>
            <label><input type="radio" name="type" value="5" />策略经营</label>
        </p>
        <p>按特色：
            <label data-all="all"><input type="checkbox" name="special" value="" />全部</label>
            <label><input type="checkbox" name="special" value="1" />奇幻</label>
            <label class="checked"><input type="checkbox" name="special" value="2" checked="checked" />玄幻</label>
            <label><input type="checkbox" name="special" value="3" />武侠</label>
            <label><input type="checkbox" name="special" value="4" />历史</label>
            <label><input type="checkbox" name="special" value="5" />写实</label>
            <label><input type="checkbox" name="special" value="6" />魔幻</label>
            <label><input type="checkbox" name="special" value="7" />体育</label>
            <label><input type="checkbox" name="special" value="8" />科幻</label>
            <label><input type="checkbox" name="special" value="9" />狂欢</label>
        </p>
    </form>
</div>

{% filter: markdown %}

### 源码
-----------------------

```html
<form class="ecl-ui-filter" autocomplete="off">
    <p>按类型：
        <label class="checked"><input type="radio" name="type" value="" checked="checked" />全部</label>
        <label><input type="radio" name="type" value="1" />角色扮演</label>
        <label><input type="radio" name="type" value="2" />运动休闲</label>
        <label><input type="radio" name="type" value="3" />射击游戏</label>
        <label><input type="radio" name="type" value="4" />回合游戏</label>
        <label><input type="radio" name="type" value="5" />策略经营</label>
    </p>
    <p>按特色：
        <label data-all="all"><input type="checkbox" name="special" value="" />全部</label>
        <label><input type="checkbox" name="special" value="1" />奇幻</label>
        <label class="checked"><input type="checkbox" name="special" value="2" checked="checked" />玄幻</label>
        <label><input type="checkbox" name="special" value="3" />武侠</label>
        <label><input type="checkbox" name="special" value="4" />历史</label>
        <label><input type="checkbox" name="special" value="5" />写实</label>
        <label><input type="checkbox" name="special" value="6" />魔幻</label>
        <label><input type="checkbox" name="special" value="7" />体育</label>
        <label><input type="checkbox" name="special" value="8" />科幻</label>
        <label><input type="checkbox" name="special" value="9" />狂欢</label>
    </p>
</form>
```

```js
require(['ui/Filter'], function (Filter) {

    var map = {
        '1': [2, 3, 5],
        '2': [1, 2, 4]
    };

    new Filter({
        prefix: 'ecl-ui-filter',
        main: $('.ecl-ui-filter')[0],
        groups: 'p',
        
        onChange: function (e) {

            if (e.key === 'type') {
                var value = e.value[0];

                if (map[value]) {
                    this.disableItems('special', map[value]);
                }
                else {
                    this.enableItems('special');
                }
            }
        }

    }).render();
});
```
{% /filter %}
{% content: script %}
<script>
require(['ui/Filter'], function (Filter) {
	var map = {
		'1': [2, 3, 5],
		'2': [1, 2, 4]
	};

    new Filter({
        prefix: 'ecl-ui-filter',
        main: $('.ecl-ui-filter')[0],
        groups: 'p',
        
        onChange: function (e) {

        	if (e.key === 'type') {
        		var value = e.value[0];

        		if (map[value]) {
        			this.disableItems('special', map[value]);
        		}
        		else {
        			this.enableItems('special');
        		}
        	}
        }

    }).render();
});
</script>