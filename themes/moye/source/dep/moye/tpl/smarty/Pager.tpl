{%include './base.tpl'%}

{%strip%}

{%function name=buildPageData%}{%strip%}
{%* result用来存储页面计算结果 *%}
{%$result = []%}
{%$result.left = []%}
{%$result.right = []%}
{%$page = $data.page - $data.first%}
{%$total = $data.total%}
{%$padding = $data.padding%}
{%$showCount = $data.showCount%}
{%* 计算showCount *%}
{%if $showCount > $total%}
{%$showCount = $total%}
{%/if%}
{%* 计算当前页面左右显示页码个数 *%}
{%$wing = floor($showCount / 2)%}
{%$paddingLeft = $padding%}
{%$wingLeft = $wing%}
{%$paddingRight = $padding%}
{%$wingRight = $wing%}
{%$reduceLeftToRight = $page - $wing%}
{%* 如果wingLeft小于0, 那么把小于0的部分移动到wingRight *%}
{%if $reduceLeftToRight < 0%}
{%$wingLeft = $wingLeft + $reduceLeftToRight%}
{%$wingRight = $wingRight - $reduceLeftToRight%}
{%/if%}
{%$reduceRightToLeft = $page + $wing + 1 - $total%}
{%* 如果wingRight大于total, 那么把超长的部分移动到wingLeft *%}
{%if $reduceRightToLeft > 0%}
{%$wingLeft = $wingLeft+$reduceRightToLeft%}
{%$wingRight = $wingRight-$reduceRightToLeft%}
{%/if%}
{%if $data.mode == 'normal'%}
{%$result.left = explode(' ', trim({%call pageRange start=0 stop=$page paddingLeft=$paddingLeft paddingRight=$wingLeft%}, ' '))%}
{%$result.right = explode(' ', trim({%call pageRange start=$page+1 stop=$total paddingLeft=$wingRight paddingRight=$paddingRight%}, ' '))%}
{%/if%}
{%$pageAll = []%}
{%$pageAll = array_merge($pageAll, $result.left, [$page], $result.right)%}
{%' '|@implode:$pageAll%}
{%/function%}{%/strip%}

{%* 计算页码范围 *%}
{%function name=pageRange%}{%strip%}
{%$pageResult = []%}
{%if $start + $paddingLeft < $stop - $paddingRight%}
{%$pageResult = array_merge(
    $pageResult,
    explode(' ', trim({%call range start=$start stop=$start+$paddingLeft%}, ' ')),
    [-$start - $paddingLeft],
    explode(' ', trim({%call range start=$stop-$paddingRight stop=$stop%}, ' '))
)%}
{%else%}
{%$pageResult = array_merge($pageResult, explode(' ', {%call range start=$start stop=$stop%}))%}
{%/if%}
{%' '|@implode:$pageResult%}
{%/strip%}{%/function%}

{%* 计算范围 *%}
{%function name=range%}{%strip%}
{%$rangeResult = []%}
{%$length = max(ceil($stop - $start), 0)%}
{%section name=count loop=$length%}
{%append var=rangeResult value=$start+$smarty.section.count.index%}
{%/section%}
{%* implode空数组会返回' ',所以后续的explode之前要先执行trim *%}
{%' '|@implode:$rangeResult%}
{%/strip%}{%/function%}

{%* 是否有anchor *%}
{%function name=getAnchor%}{%strip%}
{%if empty($anchor)%}
#
{%else%}
{%if strpos($anchor, '?')%}
{%$anchor%}&page={%$page%}
{%else%}
{%$anchor%}?page={%$page%}
{%/if%}
{%/if%}
{%/strip%}{%/function%}
{%/strip%}

{%* pager构建 *%}
{%function name=Pager%}{%strip%}
{%* 默认参数 *%}
{%$defaultOpts = []%}
{%$defaultOpts.page = 0%}
{%$defaultOpts.first = 0%}
{%$defaultOpts.total = 0%}
{%$defaultOpts.padding = 1%}
{%$defaultOpts.mode = 'normal'%}
{%$defaultOpts.showAlways = true%}
{%$defaultOpts.anchor = ''%}
{%$defaultOpts.dis%}
{%$defaultOpts.lang = []%}
{%$defaultOpts.lang.prev = '上一页'%}
{%$defaultOpts.lang.next = '下一页'%}
{%$defaultOpts.lang.ellipsis = '..'%}

{%* 合并配置和默认参数 *%}
{%$data = array_merge($defaultOpts, $data) %}
<div id="{%$data.id%}" data-click="1">
    {%$pageAll = explode(' ', trim({%call buildPageData data=$data%}, ' '))%}
    {%* 上一页 *%}
    <a href="{%call getAnchor anchor=$data.anchor page=max($data.page - 1,$data.first)%}"
        data-page="{%max($data.page - 1,$data.first)%}"
        class="{%call getPartClassName data=[type=>'pager',skin=>$data.skin] part='prev'%} {%if $page <= 0%}{%call getStateClassName data=[states=>['disabled'], skin=>$data.skin]%}{%/if%}">
            {%$data.lang.prev%}
    </a>
    {%if $data.mode == 'normal'%}
    {%foreach $pageAll as $key => $page%}
    {%$page = intval($page)%}
    {%* 判断是否为省略 *%}
    {%if $page < 0%}
    <a href="{%call getAnchor anchor=$data.anchor page=-$page+$data.first%}"
        data-page="{%-$page+$data.first%}"
        class="{%call getPartClassName data=[type=>'pager',skin=>$data.skin] part='item'%}">
            {%$data.lang.ellipsis%}
    </a>
    {%else%}
    <a href="{%call getAnchor anchor=$data.anchor page=$page+$data.first%}"
        data-page="{%$page+$data.first%}"
        class="{%call getPartClassName data=[type=>'pager',skin=>$data.skin] part='item'%} {%if $page+$data.first == $data.page%}{%call getPartClassName data=[type=>'pager',skin=>$data.skin] part='current'%}{%/if%}">
            {%$page+$data.first%}
    </a>
    {%/if%}
    {%/foreach%}
    {%else if $data.mode == 'simple'%}
    <span class="{%call getPartClassName data=[type=>'pager',skin=>$data.skin] part='item'%}">{%$pageAll[0]+$data.first%}/{%$data.total%}</span>
    {%/if%}
    {%* 下一页 *%}
    <a href="{%call getAnchor anchor=$data.anchor page=min($data.page - $data.first + 1, $data.total - 1)+$data.first%}"
        data-page="{%min($data.page - $data.first + 1, $data.total - 1)+$data.first%}"
        class="{%call getPartClassName data=[type=>'pager',skin=>$data.skin] part='prev'%} {%if $page >= $data.total - 1%}{%call getStateClassName data=[states=>['disabled'], skin=>$data.skin]%}{%/if%}">
            {%$data.lang.next%}
    </a>
</div>
{%/strip%}{%/function%}