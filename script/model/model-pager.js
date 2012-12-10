define(function(require, exports, module) {
	
	function getGoPageHtml(pageNo, goFuncName, showPageNo) {
		showPageNo = showPageNo || pageNo;
		var H = [];
		H.push('<span class="normal"><a href="javascript:', goFuncName, '(', pageNo, ')">', showPageNo, '</a></span>');
		return H.join('');
	}

	function getCurrPageHtml(currPageNo) {
		var H = [];
		H.push('<span class="disabled">', currPageNo, '</span>');
		return H.join('');
	}

	/**
	 * 返回页码导航HTML。
	 * 1) 1 2 3 4 5 6 7 8 9 10 ... >>
	 * 2) << 1 ... 3 4 5 6 7 8 9 10 11 ... >>
	 * 3) << 1 ... 15 16 17 18 19 20 21 22 23 >>
	 *
	 * @param {Object} pageNo
	 * @param {Object} pageNum
	 * @param {Object} extArgs { goFuncName : 'goPage', showPageNum : 10 }
	 */
	exports.getPageHtml = function(pageNo, pageNum, extArgs) {
		// 总页数
		pageNum = (typeof (pageNum) == 'number' && pageNum > 1) ? pageNum : 1;
		if (pageNum == 1) {
			return getCurrPageHtml(pageNum);
		}
		// 当前页
		pageNo = (typeof (pageNo) == 'number' && pageNo > 1) ? pageNo : 1;
		if (pageNo > pageNum) {
			pageNo = pageNum;
		}
		// 翻页函数、显示分页数、校正页数
		extArgs = extArgs || {};
		var goFuncName = extArgs.goFuncName || 'goPage';
		var showPageNum = extArgs.showPageNum;
		showPageNum = (typeof (showPageNum) == 'number' && showPageNum > 1) ? showPageNum : 10;
		var rectifyNum = parseInt(showPageNum / 2);
		// 当前页前(包含当前页)后显示页数
		var modNum = pageNo % showPageNum;
		var divNum = pageNo / showPageNum;
		var prePageNum = (divNum > 1 || modNum == 0) ? rectifyNum + 1 : modNum;
		var nextPageNum = pageNum - pageNo;
		// 后置页数可补
		if (nextPageNum >= rectifyNum) {
			if (prePageNum <= rectifyNum) {
				nextPageNum = showPageNum - prePageNum;
			} else {
				nextPageNum = rectifyNum - 1;
			}
		}
		// 前置页数可补
		if (prePageNum > rectifyNum) {
			if (nextPageNum < rectifyNum - 1) {
				prePageNum = showPageNum - nextPageNum - 1;
			} else {
				prePageNum = rectifyNum;
			}
		}
		// 显示最终页
		var rectifyLastPageNum = pageNum - pageNo - nextPageNum;
		if (rectifyLastPageNum == 1) {
			nextPageNum++;
			prePageNum--;
		}
		var H = [];
		if (typeof (extArgs.totalPages) != 'undefined')
			H.push('<span>共'+extArgs.totalPages+'页，</span>');
		if (typeof (extArgs.total) != 'undefined')
			H.push('<span>共'+extArgs.total+'条记录</span>');
		// 当前页前页
		if (pageNo > 1) {
			var prePageNo = pageNo - 1;
			H.push(getGoPageHtml(prePageNo, goFuncName, '上一页'), getGoPageHtml(1, goFuncName));
			if (prePageNo > prePageNum) {
				H.push('...');
			}
			for ( var i = prePageNum - 1;; i--) {
				if (i <= 0)
					break;
				var currPageNo = pageNo - i;
				if (currPageNo <= 1)
					continue;
				H.push(getGoPageHtml(currPageNo, goFuncName));
			}
		}
		// 当前页
		H.push(getCurrPageHtml(pageNo, goFuncName));
		// 当前页后页
		if (pageNo < pageNum) {
			for ( var i = 1; i <= nextPageNum; i++) {
				var currPageNo = pageNo + i;
				H.push(getGoPageHtml(currPageNo, goFuncName));
				if (currPageNo >= pageNum)
					break;
			}
			if (rectifyLastPageNum > 1) {
				H.push('...');
			}
			var nextPageNo = pageNo + 1;
			H.push(getGoPageHtml(nextPageNo, goFuncName, '下一页'));
		}
		return H.join('&nbsp;&nbsp;');
	}
})