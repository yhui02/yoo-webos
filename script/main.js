/**
 * @author yohann
 * 
 * 2012-06-12
 */
if (!window.console) {
	window.console = {
		log : function(msg) {
		}
	};
}

/*
 * RequireJS config
 */
requirejs.onError = function(err) {
	console.log(err.requireType);
	if (err.requireType === 'timeout') {
		console.log('modules: ' + err.requireModules);
	}
	throw err;
};

require.config({
	baseUrl: './script/',
	paths: {
		'order' : 'library/requirejs/order',
		'text' : 'library/requirejs/text',
		'dojo' : 'http://ajax.googleapis.com/ajax/libs/dojo/1.7.2/dojo/dojo',
		'jquery' : 'library/jquery-1.8.1.min',
		'underscore' : 'library/underscore-min',
		'backbone' : 'library/backbone-min',
		'bootstrap-button' : 'library/bootstrap/bootstrap-button',
		'bootstrap-tooltip' : 'library/bootstrap/bootstrap-tooltip'
	},
	shim: {
		'underscore' : {
			exports: '_'
		},
		'backbone' : {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	},
	packages: ['tools'],
	waitSeconds : 20,
	urlArgs: 'v=1.0.2'
});

define(function(require, exports, module) {
	/*
	 * 核心框架初始化
	 */
	window.T = require('tools') || {};

	// 页面工具类
	var modelPage = require('model/model-page');
	// 页面初始化操作
	T.applyObj(modelPage.init);
	// 扩展 modelPage 工具类到 T 上
	T = $.extend(T, modelPage);
	
	require(['backbone'], function() {
		var B =  Backbone;
		var AppRouter = B.Router.extend({
			routes : {
				'tab/:id' : 'tab'
			},
			
			tab : function(id){
				try{
					T.tabRender(id);
				}catch(e){
					setTimeout(function(){
						T.tabRender(id);
					},400);
				}
			}
		});
		var app_router = new AppRouter;
		B.history.start({pushState: false});
		T.router = app_router;
	});
	
	/*
	 * desktop 初始化
	 */
	var desktop = require('model/model-desktop');
	desktop.init();
	T = $.extend(T, desktop);
	/*
	setTimeout(function(){
		console.log(window.frames["tab-con-iframe-a10"].location.href);
	}, 4000)
	*/
});
