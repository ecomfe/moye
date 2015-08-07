{%strip%}
{%function name=getPartClassName part=''%}{%strip%}
{%$result=[]%}
{%append var=result value="ui-{%$data.type|lower%}{%if $part%}-{%$part|lower%}{%/if%}"%}
{%if isset($data.skin) and !empty($data.skin)%}
{%foreach $data.skin as $skin%}
    {%append var=result value="skin-{%$skin|lower%}{%if $part%}-{%$part|lower%}{%/if%}"%}
    {%append var=result value="skin-{%$skin|lower%}-{%$data.type|lower%}{%if $part%}-{%$part%}{%/if%}"%}
{%/foreach%}
{%/if%}
{%" "|@implode:$result%}
{%/strip%}{%/function%}
{%function name=getStateClassName%}{%strip%}
{%$result=[]%}
{%if isset($data.states) and !empty($data.states)%}
{%foreach $data.states as $state%}
    {%append var=result value="ui-{%$data.type|lower%}-{%$state|lower%}"%}
    {%append var=result value="state-{%$state|lower%}"%}
    {%if isset($data.skin) and !empty($data.skin)%}
    {%foreach $data.skin as $skin%}
        {%append var=result value="skin-{%$skin|lower%}-{%$state|lower%}"%}
        {%append var=result value="skin-{%$skin|lower%}-{%$data.type|lower%}-{%$state|lower%}"%}
    {%/foreach%}
    {%/if%}
{%/foreach%}
{%/if%}
{%" "|@implode:$result%}
{%/strip%}{%/function%}
{%function getClassName%}{%strip%}{%call getPartClassName data=$data%} {%call getStateClassName data=$data%}{%/strip%}{%/function%}
{%function name=getPartId part=""%}{%strip%}
ctrl-{%$data.type|lower%}-{%$data.id%}{%if !empty($part)%}-{%$part%}{%/if%}
{%/strip%}{%/function%}
{%function name=dataClick%}{%strip%}
{%if !empty($data)%}data-click="{%$data|escape:none%}"{%/if%}
{%/strip%}{%/function%}
{%/strip%}
