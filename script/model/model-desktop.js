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
				$('.roles-tab li.tab').removeClass('active');
				$('.roles-tab a[data-id="'+localStorage.label+'"]').parent().addClass('active');
			}
			$('.roles-tab .label').click(function(){
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
			var menuCtrlVal = $('.role-admin').html();
			$('.role-admin').click(function() {
				var conMenuObj = $('#con-menu'), conMainObj = $('#con-main');
				if (conMenuObj.is(":visible")) {
					conMenuObj.hide();
					conMainObj.removeClass('with_menu');
					$(this).html('»展开');
				} else {
					conMenuObj.show();
					conMainObj.addClass('with_menu');
					$(this).html(menuCtrlVal);
				}
			})
			
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
			$('#tab-header-'+id).addClass('tab-strip-active').siblings().removeClass('tab-strip-active');
			$('#tab-con-'+id).show().siblings().hide();
		}
		var _tabHeaderHtml = _.template($('#tab-header-template').html())({name: name, id: id});
		var _tabConHtml = _.template($('#tab-con-template').html())({url: url, id: id});
		if ($('#tab-header-'+id)[0] == undefined) {
			$('.tab-strip-top').find('li').removeClass('tab-strip-active');
		
			$('.tab-strip-top').append(_tabHeaderHtml);
			$('.tab-panel-bwrap').find('>div').hide();
			$('.tab-panel-bwrap').append(_tabConHtml);
			
			// tab 点击事件
			$('#tab-header-'+id).click(function(e){
				if (e.which == 2) {
					$(this).remove();
					$('#tab-con-'+id).remove();
					return false;
				}
			})
		} else {
			_tabShow(id);
		}
	}
});
