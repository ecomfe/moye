{%function name=Button%}{%strip%}
<button type="{%if isset($data.mode)%}{%$data.mode|escape:html%}{%else%}button{%/if%}"
    class="{%getPartClassName data=$data%}"
    {%if isset($data.id)%}data-ui-id="{%$data.id%}"{%/if%}
    {%if isset($data.disabled) and $data.disabled%}disabled="disabled"{%/if%}>
    {%$data.text|escape:none%}
</button>
{%/strip%}{%/function%}
