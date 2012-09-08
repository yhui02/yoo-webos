/**
 * @authorYohann
 */
define(function(require, exports, module){
	/*
	// sessionStorage
	if(window.sessionStorage){
		alert('supportsessionStorage');
	}else{
		alert('notsupportsessionStorage');
		// 不支持sessionStorage
		// 用dojox.storage来实现相同功能
	}
	
	// localStorage
	if(window.localStorage){
		alert('supportlocalStorage');
	}else{
		alert('notsupportlocalStorage');
		// 不支持localStorage
		// 用dojox.storage来实现相同功能
	}
	*/
	
	window.addEventListener('storage', handleStorageEvent, false);
	function handleStorageEvent() {
		//console.log('test:' + window.localStorage);
	}
});
