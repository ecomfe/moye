{% target: Button(master=base) %}

{% content: style %}
<link rel="stylesheet" href="../src/css/Mask.less">

{% content: content %}

{% filter: markdown %}

# mask

{%/filter%}

<button id="show">show mask</button>
<select name="a" id="a">
    <option value="1">aaa</option>
    <option value="2">aaa</option>
    <option value="3">aaa</option>
    <option value="4">aaa</option>
    <option value="5">aaa</option>
    <option value="6">aaa</option>
</select>

<script>
require(['jquery', 'ui/Mask'], function ($, Mask) {

    $('#show').on('click', function () {

        Mask
            .create()
            .render()
            .show()
            .on('click', function () {
                this.hide();
            });

    });

});
</script>
