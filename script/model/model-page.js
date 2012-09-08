/**
 * @author Yohann
 */
define(function(require, exports, module) {
	require('jquery');
	
	// 内部对象T
	var T = (function(o) {
		o.alert = function() {
			//
		};
		
		o.confirm = function() {
			//
		};
		
		o.login = function() {
			console.log('login');
		};
		
		o.error = function() {
			o.login.apply();
		};
		
		o._loadPage = function(eleObj, url) {
			eleObj.load(url, {_t: new Date().getTime()}, function(d) {
				//
			});
		};
		
		o.scrollTo = function(ele) {
			if (typeof ele == 'string') {
				if (ele == 'body' || ele == 'html')
					ele = $(ele);
				else
					ele = $('#'+ele);
			}
			window.scrollTo(ele.position().left, ele.position().top);
		};
		
		return o;
	})(exports);
	
	
	exports.init = (function(o) {
		/*
		 * ajax helper
		 */
		o.ajaxHelper = function() {
			var loadingId = '__loading';
			var loadingEle = $('<div>').attr('id', loadingId)
				.html('loading...')
				.css({
					display: 'none',
					position: 'fixed',
					top: 0,
					right: 0,
					backgroundColor: 'DD4B39',
					padding: '1px 8px'
				});
			$('body').append(loadingEle);
			
			var loadingEleObj = $('#' + loadingId);
			loadingEleObj.ajaxStart(function() {
				$(this).show();
			}).ajaxStop(function() {
				$(this).hide();
			}).ajaxError(function(event, request, settings) {
				T.login();
				console.log('ajaxError >> ' + settings.url + '\t by ' + location.href);
			});

			$.ajaxSetup({
				error: function(jqXHR, textStatus, errorThrown) {
					try {
						loadingEleObj.hide();
					} catch(e) {
						//
					}
					switch (jqXHR.status) {
						case 403:
							T.login();
							break;
						case 404:
							T.error();
						default:
							break;
					}
				}
			});
			
			if ($.browser.msie && $.browser.version <= 8) {
				$.ajaxSetup({
					cache: false
				});
			}
		};
		
		return o;
	})({});
	
});
