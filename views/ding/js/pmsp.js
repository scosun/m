(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'onorientationchange' in window ? 'onorientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			if(clientWidth >= 768){
				docEl.style.maxWidth = '768px';
				docEl.style.fontSize = '60px';//100px
				docEl.style.margin = "0 auto";				
			}else if(clientWidth <= 320){
				docEl.style.fontSize = '45px';
			}else{
				docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
			}
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
