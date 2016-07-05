# Variable declaration

NODE_ENV="production"
file="$(NODE_ENV)_template.ejs"
cssStart="<link rel='stylesheet' href='"
cssEnd="' />"
jsStart="<script type='text/javascript' src='"
jsEnd="'></script>"
match="</title>"
# * "files" *
bootstrap="$(cssStart)/bootstrap/dist/css/bootstrap.min.css$(cssEnd)"
framework="$(cssStart)/stylesheets/framework.css$(cssEnd)"
d3="$(cssStart)/stylesheets/d3Framework.css$(cssEnd)"
jquery="$(jsStart)/jquery/dist/jquery.js$(jsEnd)"
jqueryui="$(jsStart)/jquery-ui/jquery-ui.js$(jsEnd)"
datamanager="$(jsStart)/data/dataManager.js$(jsEnd)"
loadDatamanager="<script type='text/javascript'>window.datamanager.loadData\(\(<%- JSON.stringify\(data\)%>\)\);</script>"
validations="$(jsStart)/javascripts/library/validations.js$(jsEnd)"

all:
	mkdir -p public/javascripts/library
	mkdir node_modules
	mkdir -p build/stylesheets
	cp views/default_template.ejs views/$(file)
	cp css/css_framework/framework.css build/stylesheets
	cp css/d3_components/d3Framework.css build/stylesheets
	cp -r vendor/* node_modules/
	cp js/util/*.js public/javascripts/library/
	sed -i.bak "s~$(subst $\",,$(match))~$(subst $\",,$(match))\\$(bootstrap)\\$(subst $\",,$(framework))\\$(subst $\",,$(d3))\\ $(subst $\",,$(jquery))\\$(subst $\",,$(jqueryui))\\$(subst $\",,$(datamanager))\\$(subst $\",,$(loadDatamanager))\\ $(subst $\",,$(validations))~" views/$(subst $\",,$(file))

clean:
	rm -rf node_modules
	rm -rf public/*
	rm -rf build
	rm views/$(file)
