#!/bin/bash
PATH=$PATH:./node_modules/.bin
INP=./src
OUT=./release/statics
HOUT=./release
ROOT=/static/
# ROOT
TMP=$OUT/js/app.babel.js

rm -rf $OUT
mkdir $OUT/css $OUT/js -p
cp $INP/lib $INP/images $INP/fonts $OUT/ -r

printf $ROOT > $INP/html/links/root.htm
printf $ROOT > $INP/html/scripts/root.htm
printf $ROOT > $INP/html/scripts/app/root.htm
printf app.js > $INP/html/scripts/app/filename.htm

htmlbilder $INP/html/ -o $HOUT/index.html
handlebars $INP/templates/template/ -f $OUT/lib/templates.js -e hbs -m -o
handlebars $INP/templates/partial/ -f $OUT/lib/partials.js -p -e hbs -m -o

r_js -o baseUrl=$INP/js/ name=main out=$TMP optimize=none
babel $TMP -o $OUT/js/app.js -s
rm -f $TMP

if [ -x "$(command -v sass)" ]; then
	sass $INP/sass/style.scss:$OUT/css/style.css --style expanded --sourcemap=auto
else
	node-sass $INP/sass/style.scss > $OUT/css/style.css --output-style expanded --source-map true --indent-type tab --indent-width 1
fi