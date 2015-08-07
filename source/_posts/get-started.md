title: 开始 / get started
categories:
  - introduction
date: 2015-08-07 12:17:45
---

## 安装 / Install

通过 `bower` 进行安装

{% codeblock 通过 bower 安装 moye lang:sh%}
# 如果你没有安装 bower，请先安装 bower 哟
# 如果已经安装过 bower，请跳过这一条
npm install -g bower

# 开始安装 moye
bower install moye
{% endcodeblock %}

或者从 github 上直接克隆源码


{% codeblock 从 github 安装 moye lang:sh %}
# 通过 git 从 github 上获取 moye

git clone https://github.com/ecomfe/moye.git
{% endcodeblock %}


## 设定 / Setup

### 设定 `amd` 配置

moye 是基于 `amd` 模式开发的，因此在正式使用前，需要对 `amd` 模块加载器进行配置。

{% codeblock 为 moye 添加 amd 配置 lang:js%}
require.config({
    baseUrl: 'src',

    // 只需要在这里配置一下 moye 包配置即可
    packages: [{
        name: 'moye',
        main: 'main',

        // 实际上主要是这个参数啦，指向项目中的 moye 目录即可
        location: 'path/to/your/moye'
    }]
});
{% endcodeblock%}

> NOTICE: `moye` 并不支持在 `global` 变量模式或者 `cjs` 模式下使用。建议使用 [amd](http://requirejs.org/docs/why.html) 来构建你的项目

### 设定 less 编译路径

`moye`的样式源码是使用 [less](http://www.lesscss.net/) 进行编写的。
我们使用了 [est](http://ecomfe.github.io/est) 来简化我们在开发 `less` 时的工作。[est](http://ecomfe.github.io/est) 这是一个非常强大的 `less mixin` 库。
因此，在你的 `less` 编译参数中，需要将 `est` 的路径加入到 `paths`中。

{% codeblock 将 est 路径加入 less 编译参数中 lang:sh %}
lessc --include-path=path/to/your/est
{% endcodeblock%}

> 一将来讲 `est` 会在 `bower install` 一起安装到你的项目，位于 `moye` 同一级的目录。
> 如果没有通过 `bower` 安装，那么可以通过这条命令来安装它

{% codeblock 通过 git 安装 est lang:sh%}
git clone https://github.com/ecomfe/est.git
{% endcodeblock %}

## 完成 / done

你已经完成了全部设置，开始使用吧！

{% post_link Button 立即开始 %}
