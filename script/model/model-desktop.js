/**
 * @author yohann
 */
define(function(require, exports, module) {
	require('jquery');
	
	(function($) {
		$.fn.hoverDelay = function(options) {
			var defaults = {
				hoverDuring : 200,
				outDuring : 200,
				hoverEvent : function() {
					$.noop();
				},
				outEvent : function() {
					$.noop();
				}
			};
			var sets = $.extend(defaults, options || {});
			var hoverTimer, outTimer;
			return $(this).each(function() {
				$(this).hover(function() {
					clearTimeout(outTimer);
					hoverTimer = setTimeout(sets.hoverEvent, sets.hoverDuring);
				}, function() {
					clearTimeout(hoverTimer);
					outTimer = setTimeout(sets.outEvent, sets.outDuring);
				});
			});
		}
	})(jQuery);
	
	/*
	 * init
	 */
	exports.init = function() {
		$(function() {
			// item tab
			localStorage.label = localStorage.label || 'lable1';
			var _labelAct = function(){
				$('.roles-tab .tab').removeClass('active');
				$('.roles-tab a[data-id="'+localStorage.label+'"]').parent().addClass('active');
			}
			$('.roles-tab .tab a').click(function(){
				localStorage.label = $(this).attr('data-id');
				_labelAct();
			}) 
			_labelAct();
			
			
			// item create
			var itemJson = require('menu.json');
			window.itemJsonObj = {}
			var _itemHtml = '';
			$.each(itemJson, function(i, n){
				itemJsonObj[n.id] = n;
				var compiled = _.template($('#menu-item-template').html());
				_itemHtml += compiled({name: n.name, url: n.url, id: n.id});
			})
			$('#con-menu-results').append(_itemHtml);
			$('#con-menu-results a.menu-item-link').click(function(e){
				var _id = $(this).attr('data-id');
				//exports.tabRender(_id);
				location.hash = '#tab/' + _id;
				// style
				$(this).parent().parent().find('.menu-item-link').removeClass('active');
				$(this).addClass('active');
				return false;
			})
			$.each($('.menu-item-link'), function(i,n){
				if(location.hash.indexOf('tab/'+$(n).attr('data-id')) != -1) {
					$(this).addClass('active');
				}
			})
			// 初始 tab
			if (location.hash == '' || location.hash == '#') {
				location.hash = '#tab/' + $('.menu-item-link:first').attr('data-id');
			}
			
			T.inputDefaultValue('buddysearch_input');
			
			// item ctrls
			$('.role-admin').click(function() {
				var conMenuObj = $('#con-menu'), conMainObj = $('#con-main');
				if (conMenuObj.is(":visible")) {
					conMenuObj.hide();
					conMainObj.removeClass('with_menu');
				} else {
					conMenuObj.show();
					conMainObj.addClass('with_menu');
				}
			});
			
			// item hover
			$('#con-menu-results .menu-item').each(function() {
				var _this = $(this);
				_this.hoverDelay({
					hoverEvent : function() {
						_this.find('.menu-item-link').addClass('hover');
						_this.find('.item-tooltips').css({top:_this.position().top + 70}).show();
					},
					outEvent : function() {
						_this.find('.menu-item-link').removeClass('hover');
						_this.find('.item-tooltips').hide();
					}
				});
			});
		})
	};
	
	exports.tabRender = function(id) {
		var name = '', url = '';
		if(typeof id == 'string') {
			name = itemJsonObj[id].name;
			url = itemJsonObj[id].url;
		} else if(id == 'object') {
			name = id.name;
			url = id.url;
		}
		// 显示tab
		var _tabShow = function(id) {
			$('#tab-header-'+id).addClass('active').siblings().removeClass('active');
			$('#tab-pane-'+id).show().siblings().hide();
		};
		var _tabHeaderHtml = _.template($('#tab-header-template').html())({name: name, id: id});
		var _tabConHtml = _.template($('#tab-pane-template').html())({url: url, id: id});
		if ($('#tab-header-'+id)[0] == undefined) {
			$('#tab-region .tab-header').find('li').removeClass('active');
		
			$('#tab-region .tab-header').append(_tabHeaderHtml);
			$('#tab-region .tab-content').find('>div').hide();
			$('#tab-region .tab-content').append(_tabConHtml);
			
			// tab 点击事件
			$('#tab-header-'+id).click(function(e){
				if (e.which == 2) { // 中键点击
					var _nextTabId;
					if ($(this).hasClass('active')) {
							_nextTabId = $(this).prev().attr('data-id');
						if (_nextTabId == undefined)
							_nextTabId = $(this).next().attr('data-id');
					}
					
					// delete this
					$(this).remove();
					$('#tab-pane-'+id).remove();
					// open next
					if (_nextTabId != undefined)
						$('#con-menu-results a[data-id="'+_nextTabId+'"]').trigger('click');
					return false;
				}
			}).dblclick(function(){
				var bodyObj = $('body');
				if (bodyObj.hasClass('fullScreen'))
					bodyObj.removeClass('fullScreen');
				else
					bodyObj.addClass('fullScreen');
			})
		} else {
			_tabShow(id);
		}
	}
});
