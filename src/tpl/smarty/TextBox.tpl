{%strip%}
{%function name=TextBox dataClick=""%}{%strip%}
<div id="{%$data.id%}"
    class="{%getClassName data=$data%}"
    data-ui-id="{%$data.id%}"
    {%call dataClick data=$dataClick%}>
    <input type="{%if isset($data.mode) and !empty($data.mode)%}{%$data.mode|escape:html%}{%else%}text{%/if%}"
        id="{%getPartId data=$data%}"
        {%if isset($data.name) and $data.name%}name="{%$data.name|escape:html%}"{%/if%}
        {%if isset($data.disabled) and $data.disabled%}disabled="disabled"{%/if%}
        {%if isset($data.readOnly) and $data.readOnly%}readonly="readonly"{%/if%}
        {%if isset($data.value)%}value="{%$data.value|escape:html%}"{%/if%}
        {%if isset($data.placeholder)%}placeholder="{%$data.placeholder%}"{%/if%}>
</div>
{%/strip%}{%/function%}
{%/strip%}
