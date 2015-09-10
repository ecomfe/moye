#!/bin/sh

git pull

###############################
# 构建代码
edp build -f
mkdir -p output/asset/_css
cp -R src/css/ output/asset/_css
rm -rf output/asset/css/

# update 引用的字体路径，站点的主题moye用的字体路径在fonts下
sed -ib "s/\/font\//\/css\/fonts\//g" output/asset/_css/icon.less
rm output/asset/_css/icon.lessb # 删除备份文件

# 生成 api 文档
jsdoc src/ui -c jsdoc.json

#############################
# 切换站点代码分支
git checkout site

# 更新主题引用的moye source
cp -R output/asset/ themes/moye/source/dep/moye/
cp -R output/asset/font/ themes/moye/source/css/fonts/

# 更新 moye 版本号信息，用时间戳
# 更新 moye 版本号信息，用时间戳
timestamp=`date +%Y%m%d`
sed -ib "s/'v[0-9]*'/'v${timestamp}'/g" themes/moye/layout/_base.swig
rm themes/moye/layout/_base.swigb  # 删除备份文件

# 生成站点
git pull
hexo generate

# 拷贝 api 文档到部署的目录里，随后部署时候一并提交
cp -R api public/api

# hexo 部署 自己手动 check 下生成的站点没问题了再手动部署到 gh-pages 分支
