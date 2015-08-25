#!/bin/bash

rm -rf moye-tmp

git clone https://github.com/ecomfe/moye.git moye-tmp --depth 1

cd moye-tmp

bower install

cp -f ../tools/module.conf .

edp build -f

cp -rf src/css/* ../themes/moye/source/dep/moye/_css

jsdoc src/ui -c jsdoc.json

cp -rf output/asset/* ../themes/moye/source/dep/moye

hexo g

cp -rf api ../public
