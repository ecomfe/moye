<article id="{{ post.layout }}-{{ post.slug }}" class="article article-type-{{ post.layout }}" itemscope itemprop="blogPost">

  {{ partial('post/nav') }}

  <div class="article-content">
    <header class="article-header">
      {{ partial('post/title', {class_name: 'article-title'}) }}
    </header>
    <div class="article-entry" itemprop="articleBody">
      {{ post.content }}
    </div>

    <footer class="article-footer">

      <div class="duoshuo">

        <!-- 多说评论框 start -->
        <div class="ds-thread" data-thread-key="{{ post.slug }}" data-title="{{ post.title }}" data-url="{{ post.permalink }}"></div>

        <!-- 多说评论框 end -->
        <!-- 多说公共JS代码 start (一个网页只需插入一次) -->

        <script type="text/javascript">
        window.duoshuoQuery = {short_name:"moye"};
        (function() {
          var ds = document.createElement('script');
          ds.type = 'text/javascript';
          ds.src = '//static.duoshuo.com/embed.js';
          ds.charset = 'UTF-8';
          document.getElementsByTagName('head')[0].appendChild(ds);
        })();
        </script>
        <!-- 多说公共JS代码 end -->

        <!-- Place this tag right after the last button or just before your close body tag. -->
        <script async defer id="github-bjs" src="https://buttons.github.io/buttons.js"></script>
      </div>

    </footer>
  </div>
</article>
