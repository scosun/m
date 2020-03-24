


$(function(){

	$("#refreshbtn").bind("click",refreshContainer);

	$("#completebtn").bind("click",completeSeats);
	$("#savelocalbtn").bind("click",saveLocalSeats);
	$("#restorelocalbtn").bind("click",restoreLocalSeats);

	$("#dleftmovebtn").bind("click",leftMoveSeats);
	$("#drightmovebtn").bind("click",rightMoveSeats);
	$("#dtopmovebtn").bind("click",topMoveSeats);
	$("#dbottommovebtn").bind("click",bottomMoveSeats);

	$("#rightbtn").bind("click",bindContextMenu);
	$("#cancelrightbtn").bind("click",removeContextMenu);

	$("#nav-delete").bind("click",deleteSeats);
	$("#nav-rollback").bind("click",resetSeats);

	$("#nav-mark").bind("click",setRowNum);
	$("#nav-forward").bind("click",revertSeats);

	$("#nav-radio").bind("click",bindOneSeats);
	$("#nav-selection").bind("click",selectSeats);
	
	$("#nav-drag").bind("click",dragMoveSeats);



	// $("#autocirclecodebtn").bind("click",function(){
	// 	autoCircleCode(1);
	// });
	// $("#autocodebtn").bind("click",function(){
	// 	autoCode(1);
	// });



	//加载默认数据
	// loadSessionData();


	// $("#createcirclebtn").bind('click',function(){
	// 	createCircleSeatMap();
	// });
	// $("#createrunbtn").bind('click',function(){
	// 	createRunSeatMap();
	// });
});

function refreshContainer(){
	$("#seatcontainerId").html('');
}




function bulidSeverPolygonContainer(data){
	var maxwidth = data.width/2 || 1000;
	var maxheight = data.height/2 || 500;

	$("#seatcontainer").width(maxwidth + 100);
	$("#seatcontainer").height(maxheight + 150);

	var seatw = 40;
	var seath = 40;

	//开始角度,默认3点方向,为0度
	var startage = 270;
	var seathtml = [];
	var seats = data.seats || [];
	for (var i = 0,len = seats.length; i < len; i++) {
		// var ang = i * angleSpace - 270;
		// if(ang == 0 || ang >= 180){
		// 	ang = ang + 90;
		// }else{
		// 	ang = ang - 90;
		// }
		var seat = seats[i] || {};
		seathtml.push('<div class="seatdiv" style="transform: rotate('+seat.rotate+'deg);transform-origin:50% 50%;'+'top:' + seat.top + 'px; left:'+ seat.left + 'px;" id="' + seat.seatid + '">' + (i+1) + '辛海涛' + '</div>');
		
	}
	$("#seatcontainerId").html(seathtml.join(''));
}



var runrow = 0;
function createRunSeatMap(ccx,ccy,r1,ballNumber1,centernum){
	countRunMaxWidth(ccx,ccy,r1,ballNumber1,centernum);

	bulidRunSeatsContainer(ccx,ccy,r1,ballNumber1,centernum);
	
	clearCompleteSeats();
	selectSeats();
}

function countRunMaxWidth(ccx,ccy,r1,ballNumber1,centernum){
	// var centernum = +$("#centernum").val() || 10;
	var ccx = +ccx*2 + centernum*50;
	var ccy = +ccy*2;
	$("#seatcontainer").width(ccx);
	$("#seatcontainer").height(ccy);
}

function bulidRunSeatsContainer(ccx,ccy,r1,ballNumber1,centernum){
	//长半径,//高半径, 两个半径一样就是圆形
	// var r1 = +$("#r1").val() || 400;

	//每个座位的宽高,用来计算位置偏移
	var seatw = 40;
	var seath = 40;

	//总个数
	// var ballNumber1 = +$("#ballNumber1").val() || 30;
	// var centernum = +$("#centernum").val() || 10;

	// var ccx = +$("#ccx").val();
	// var ccy = +$("#ccy").val();

	//座位个数
	// var ballNumber2 = +$("#ballNumber2").val() || 20;
	
	
	// var text = 1;
	// var edge = 0;

	runrow++;
	var seathtml = [];
	
	//先画跑道上下座位

	var sleft = ccx - 20;
	var stop = ccy - r1 - 20;

	for(var aa = 1; aa <= 2; aa++){
		var ang = 270 + ((aa-1)*180);
		for(var bb = 0; bb < +centernum; bb++){
			seathtml.push('<div r="' + r1 + '" ang="' + ang + '" class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="' + (runrow) + '-' + (bb+1+(aa-1)*centernum) + '-c">' + (bb+1+(aa-1)*centernum) + '</div>');
			// stop = stop + 50;
			sleft = sleft + 50;
		}
		sleft = ccx - 20;
		stop = stop + r1*2;
	}


	// $("#seatcontainerId").append("<div style='position:absolute;width:1px;height:1px;background:red;left:"+(ccx)+"px;top:"+(ccy)+"px;'></div>");

	var rightseats = ballNumber1/2 + 1;
	var rightccx = ccx + (centernum - 1)*50;
	//每个座位所占的角度,按平均算
	var angleSpace = 180/rightseats;
	//开始角度,3点方向,为0度,270就是12点
	var startage = 270;
	for (var i = 1; i <rightseats; i++) {
		var sang = i * angleSpace + startage;
		var x = rightccx + (r1) * Math.cos((sang)/180 * Math.PI) - seatw/2;
		var y = ccy + (r1) * Math.sin((sang)/180 * Math.PI) - seath/2;

		var ang = i * angleSpace - 270;
		if(ang == 0 || ang >= 180){
			ang = ang + 90;
		}else{
			ang = ang - 90;
		}
		seathtml.push('<div r="' + r1 + '" circle="'+(rightccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (runrow) + '-' + (i) + '-r">' + (i) + '辛海涛' + '</div>');
		
	}
	var leftseats = ballNumber1/2 + 1;
	var leftccx = ccx;
	//每个座位所占的角度,按平均算
	var angleSpace = 180/leftseats;
	//开始角度,3点方向,为0度, 450就是6点钟
	var startage = 450;
	for (var n = 1; n <leftseats; n++) {
		var sang = n * angleSpace + startage;
		var x = leftccx + (r1) * Math.cos((sang)/180 * Math.PI) - seatw/2;
		var y = ccy + (r1) * Math.sin((sang)/180 * Math.PI) - seath/2;

		var ang = n * angleSpace - 450;
		if(ang == 0 || ang >= 180){
			ang = ang + 90;
		}else{
			ang = ang - 90;
		}
		seathtml.push('<div r="' + r1 + '" circle="'+(rightccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (runrow) + '-' + (n) + '-l">' + (n) + '辛海涛' + '</div>');
		
	}
	// for (var j = 0; j <ballNumber1; j++) {
	// 	var x = ccx + (r1) * Math.cos((j * angleSpace + startage)/180 * Math.PI);// - seatw/2;
	// 	var y = ccy + (r1) * Math.sin((j * angleSpace + startage)/180 * Math.PI);// - seath/2;
	// 	// x = dleft + x;
	// 	// y = dtop + y;

	// 	var ang = j * angleSpace;
	// 	if(ang == 0 || ang >= 180){
	// 		ang = ang + 90;
	// 	}else{
	// 		ang = ang - 90;
	// 	}
	// 	seathtml.push('<div style="transform: rotate('+ang+'deg);width:1px;height:1px;background:red;position:absolute;transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" ></div>');
	
	// }
	$("#seatcontainerId").append(seathtml.join(''));
}



var circlerow = 0;
function createCircleSeatMap(ccx,ccy,r1,ballNumber1){
	countCircleMaxWidth(ccx,ccy,r1,ballNumber1);

	bulidCircleSeatsContainer(ccx,ccy,r1,ballNumber1);
	
	clearCompleteSeats();
	selectSeats();
}


function countCircleMaxWidth(ccx,ccy,r1,ballNumber1){
	var ccx = +ccx*2;
	var ccy = +ccy*2;
	$("#seatcontainer").width(ccx);
	$("#seatcontainer").height(ccy);
}


function bulidCircleSeatsContainer(ccx,ccy,r1,ballNumber1){
	//长半径,//高半径, 两个半径一样就是圆形
	// var r1 = +$("#r1").val() || 400;

	//每个座位的宽高,用来计算位置偏移
	var seatw = 40;
	var seath = 40;

	//开始角度,默认3点方向,为0度
	var startage = 270;

	//总个数
	// var ballNumber1 = +$("#ballNumber1").val() || 30;
	// var ccx = +$("#ccx").val();
	// var ccy = +$("#ccy").val();

	//座位个数
	// var ballNumber2 = +$("#ballNumber2").val() || 20;
	//每个座位所占的角度,按平均算
	var angleSpace = 360/ballNumber1;
	
	// var text = 1;
	// var edge = 0;

	circlerow++;
	var seathtml = [];
	
	// $("#seatcontainerId").append("<div style='position:absolute;width:1px;height:1px;background:red;left:"+(ccx)+"px;top:"+(ccy)+"px;'></div>");

	for (var i = 0; i <ballNumber1; i++) {
		var sang = i * angleSpace + startage;
		var x = ccx + (r1) * Math.cos((sang)/180 * Math.PI) - seatw/2;
		var y = ccy + (r1) * Math.sin((sang)/180 * Math.PI) - seath/2;
		// x = dleft + x;
		// y = dtop + y;

		var ang = i * angleSpace - 270;
		if(ang == 0 || ang >= 180){
			ang = ang + 90;
		}else{
			ang = ang - 90;
		}
		seathtml.push('<div r="' + r1 + '" circle="'+(ccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (circlerow) + '-' + (i+1) + '-c">' + (i+1) + '辛海涛' + '</div>');
		
	}
	// for (var j = 0; j <ballNumber1; j++) {
	// 	var x = ccx + (r1) * Math.cos((j * angleSpace + startage)/180 * Math.PI);// - seatw/2;
	// 	var y = ccy + (r1) * Math.sin((j * angleSpace + startage)/180 * Math.PI);// - seath/2;
	// 	// x = dleft + x;
	// 	// y = dtop + y;

	// 	var ang = j * angleSpace;
	// 	if(ang == 0 || ang >= 180){
	// 		ang = ang + 90;
	// 	}else{
	// 		ang = ang - 90;
	// 	}
	// 	seathtml.push('<div style="transform: rotate('+ang+'deg);width:1px;height:1px;background:red;position:absolute;transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" ></div>');
	
	// }
	$("#seatcontainerId").append(seathtml.join(''));
}


function rotateRightSeats(){
	var seled = $("#seatcontainerId .seled");
	var lefts = [];
	var tops = [];
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;

		lefts.push(+sl);
		tops.push(+st);
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});

	//长半径,//高半径, 两个半径一样就是圆形
	var r1 = (seled.length * 50 - 10)/2 - 15;
	var ccx = lefts[0] - 40 - 5;
	var ccy = tops[0] + r1 - 5;
	var startage = 270;

	//总个数
	var ballNumber1 = seled.length+1;
	var angleSpace = 180/ballNumber1;

	for (var i = 1; i < ballNumber1; i++) {
		var x = ccx + (r1) * Math.cos((i * angleSpace + startage)/180 * Math.PI);
		var y = ccy + (r1) * Math.sin((i * angleSpace + startage)/180 * Math.PI);

		var ang = i * angleSpace;
		if(ang == 0 || ang >= 180){
			ang = ang + 90;
		}else{
			ang = ang - 90;
		}

		$(seled[i-1]).css({'transform': 'rotate('+ang+'deg)','transform-origin':'50% 50%','top':y + 'px','left':x + 'px'});
	}
	$("#seatcontainerId .seled").removeClass("seled");
}

function rotateLeftSeats(){
	var seled = $("#seatcontainerId .seled");
	var lefts = [];
	var tops = [];
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;

		lefts.push(+sl);
		tops.push(+st);
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});

	//长半径,//高半径, 两个半径一样就是圆形
	var r1 = (seled.length * 50 - 10)/2 - 15;
	var ccx = lefts[0] + 40 + 5;
	var ccy = tops[0] + r1 - 5;
	var startage = 90;

	//总个数
	var ballNumber1 = seled.length+1;
	var angleSpace = 180/ballNumber1;

	for (var i = 1; i < ballNumber1; i++) {
		var x = ccx + (r1) * Math.cos((i * angleSpace + startage)/180 * Math.PI);
		var y = ccy + (r1) * Math.sin((i * angleSpace + startage)/180 * Math.PI);

		var ang = i * angleSpace;
		if(ang == 0 || ang >= 180){
			ang = ang + 90;
		}else{
			ang = ang - 90;
		}

		$(seled[i-1]).css({'transform': 'rotate('+ang+'deg)','transform-origin':'50% 50%','top':y + 'px','left':x + 'px'});
	}
	$("#seatcontainerId .seled").removeClass("seled");
}



// var maxSeatNum = 0;
function creatSeats(rownum,colnum){
	countMaxWidth(+rownum,+colnum);
	bulidSeatsContainer(rownum,colnum);
	clearCompleteSeats();
	selectSeats();
}

function selectSeats(){
	getAllSeatsNode();
	bindContainerEvent();
}


function getAllSeatsNode(){
	selList = $("#" + seatcontainerId).find("."+seatNodeClass);
}


function unbindOneSeats(){
	selList.unbind("click");
}


function bindContainerEvent(){
	unbindOneSeats();

	var $events = $("." + seatContainerClass).data("events");
	if($events && $events["mousedown"]){
		
	}else{
		$("." + seatContainerClass).bind("mousedown",containerMouseDown);
		$("." + seatContainerClass).bind("mousemove",containerMouseMove);
		$("." + seatContainerClass).bind("mouseup",containerMouseUp);
	}
}



function containerMouseDown(){

	if(typeof showRuleIds != "undefined"){
		if(showRuleIds.length > 0){
			showRuleIds.forEach(function(item){
				$("#" + item.seatid).removeClass('seled');
			})
			showRuleIds.length = 0;
		}
	}
	
	var evt = window.event || arguments[0];
	//框选起点位置
	startX = (evt.x || evt.clientX);
	startY = (evt.y || evt.clientY);

	isSelect = true;
	selDiv = document.createElement("div");
	// selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
	selDiv.style.cssText = "position:absolute;width:0px;height:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1;filter:alpha(opacity:60);opacity:0.6;display:none;";
	selDiv.className = selDivClass;

	var container = $("." + seatContainerClass);
	if(container.length == 0){
		return;
	}
	container[0].appendChild(selDiv);

	selDiv.style.left = "-100px";
	selDiv.style.top = "-100px";

}

var isSelect = false;
function containerMouseMove(evt){
	evt = window.event || arguments[0];
	var _x = null;
	var _y = null;
	if (isSelect) {
		if (selDiv.style.display == "none") {
			selDiv.style.display = "";
		}
		//鼠标位置
		_x = (evt.x || evt.clientX);
		_y = (evt.y || evt.clientY);

		//滚动条高度
		var _stop = document.documentElement.scrollTop || document.body.scrollTop || 0;
		var _sleft = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
		// _x = _x + _sleft;
		// _y = _y + _stop;

		var container = $("." + seatContainerClass);
		//减去容器初始化位移,因为鼠标是屏幕坐标
		var cx = container.offset().left;
		var cy = container.offset().top;
		// startX = startX + X;
		// startY = startY + Y;

		//正向框选,反向框选
		var sleft = Math.min(_x, startX) - cx + _sleft;
		var stop = Math.min(_y, startY) - cy + _stop;
		var swidth = Math.abs(_x - startX);
		var sheight = Math.abs(_y - startY);
		// console.log(sleft,stop,swidth,sheight)
		selDiv.style.left = sleft + "px";
		selDiv.style.top = stop + "px";

		selDiv.style.width = swidth + "px";
		selDiv.style.height = sheight + "px";

		//框选宽度小于10px 矩形 就直接返回
		if(Math.abs(_x - startX) < 10 && Math.abs(_y - startY) < 10){
			return;
		}

		// ---------------- 关键算法 ---------------------  
		// var _l = selDiv.offsetLeft+_sleft, _t = selDiv.offsetTop+_stop;
		// var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
		var _l = sleft - seatWidth/2, _t = stop - seatWidth/2;
		var _w = swidth + seatWidth/2, _h = sheight + seatWidth/2;
		for (var i = 0,len = selList.length; i < len; i++) {
			var sel = $(selList[i]);
			var sl = parseInt(sel.css("left"));
			var st = parseInt(sel.css("top"));

			var sid = selList[i].id;
			// if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
			if (sl > _l && st > _t && (sl+seatWidth/4) < _l + _w && (st+seatWidth/4) < _t + _h) {
				// console.log("------", selList[i], sid, selList[i].className)

				if(isLocked(sel)){
					continue;
				}

				//在里面
				// if (selList[i].className.indexOf("seled") == -1) {
				if (!sel.hasClass(seledClass)) {
					//当前没选中，并且不再取消选中数组，需要选中
					//为什么要加一个取消选中判断,是为了避免取消后反复选中
					if (sckids.indexOf(sid) == -1) {
						//保存选中id
						if(ckids.indexOf(sid) == -1){
							ckids.push(sid);
							sel.addClass(seledClass);
						}  
					}
				} else {
					//当前已选中
					if (ckids.indexOf(sid) == -1) {
						if(sckids.indexOf(sid) == -1){
							sckids.push(sid);
							sel.removeClass(seledClass);
						}
					}
				}
			} else {
			}
		}
	}
}

function containerMouseUp(evt){
	isSelect = false;
	ckids = [];
	sckids = [];
	if (selDiv) {
		$("." + selDivClass).remove();
	}
	_x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
}


function removeContainerEvent(){
	$("." + seatContainerClass).unbind("mousedown");
	$("." + seatContainerClass).unbind("mousemove");
	$("." + seatContainerClass).unbind("mouseup");
}



function bindOneSeats(){
	removeContainerEvent();

	selList.bind("click",function(evt){
		var sel = $(this);
		if(isLocked(this)){
			return;
		}
		if (!sel.hasClass(seledClass)) {
			sel.addClass(seledClass);
		} else {
			sel.removeClass(seledClass);
		}
	})
}



//拖拽选区
function dragSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	var lefts = [];
	var tops = [];
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;

		lefts.push(+sl);
		tops.push(+st);
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});
	// console.log(lefts,tops);

	var w = lefts[lefts.length-1] - lefts[0] + seatWidth + 20;
	var h = tops[tops.length-1] - tops[0] + seatHeight + 20;
	var l = lefts[0] - 10;
	var t = tops[0] - 10;

	var dragseats = seled.clone();
	for(var j = 0,len = dragseats.length; j < len; j++){
		var sl = $(seled[j]).position().left + 10;
		var st = $(seled[j]).position().top + 10;
		$(dragseats[j]).css({"left":sl-lefts[0],"top":st-tops[0]});
	}

	$("#" + dragcontainerId).css({"width":w+"px","height":h+"px","left":l+"px","top":t+"px"});
	// $("#"+selDivId).append(seled);

	removeContainerEvent();

	// seled.removeClass
	$("#" + dragcontainerId).html(dragseats);
	$("#" + dragcontainerId).show();

	$("#" + dragcontainerId).on({
		dblclick:function(e){
			// console.log("drag dblclick");
			dblclickDragSeats();
		},
		mousedown:function(e){
			var el=$(this);
			var os = el.offset(); dx = e.pageX-os.left, dy = e.pageY-os.top;
			$(document).on('mousemove.drag', function(e){
				el.offset({top: e.pageY-dy, left: e.pageX-dx});
				dragContainerMove(e);
			});
		},
	   	mouseup: function(e){ 
		   $(document).off('mousemove.drag');
		}
	})
}

function dragContainerMove(e){
	//获取推拽框位置
	var container = $("#" + dragcontainerId);
	var cx = container.position().left;
	var cy = container.position().top;
	//获取框内方框位置
	var seledPos = [];
	var seledIds = [];
	var seled = container.find("."+seledClass);
	// console.log("seled------",seled)
	for(var n = 0,len = seled.length; n < len; n++){
		var x = $(seled[n]).position().left;
		var y = $(seled[n]).position().top;
		seledPos.push([cx+x,cy+y]);
		seledIds.push(seled[n].id);
	}
	for (var i = 0,ilen = selList.length; i < ilen; i++) {
		var sel = $(selList[i]);
		var sl = sel.position().left;
		var st = sel.position().top;

		if(isLocked(sel)){
			continue;
		}

		var sbl = false;
		for(var j = 0, jlen = seledPos.length; j < jlen; j++){
			var xy = seledPos[j];
			if(seledIds.indexOf(sel.attr("id")) == -1 && Math.abs(sl-xy[0]) >= 0 && Math.abs(sl-xy[0]) <= 20 && Math.abs(st-xy[1]) >= 0 && Math.abs(st-xy[1]) <= 20){
				sbl = true;
				break;
			}else{
				sbl = false;
			}
		}
		if(sbl){
			sel.addClass("dragbg");
		}else{
			sel.removeClass("dragbg");
		}
	}
}

function dblclickDragSeats(){
	var dragmatch = $(".dragbg");
	var ids = [];
	for(var i = 0,len = dragmatch.length; i < len; i++){
		ids.push(dragmatch[i].id);
	}

	alert("匹配上" + ids.join(','));
	cancelDragSeats();
}


function cancelDragSeats(){
	$("#" + dragcontainerId).html("");
	$("#" + dragcontainerId).hide();

	$("#" + dragcontainerId).unbind("mousedown");
	$("#" + dragcontainerId).unbind("mouseup");
	$("#" + dragcontainerId).unbind("dblclick");

	$(".dragbg").removeClass("dragbg");

	bindContainerEvent();
}


function bindContextMenu(){
	removeContainerEvent();

	var filediv = $("#" + seatcontainerId).find("."+seatNodeClass);
	for(var i = 0, len = filediv.length; i < len; i++){
		var item = filediv[i];
		bindMenu(item.id);
	}
}


function removeContextMenu(){
	selectSeats();

	var filediv = $("#" + seatcontainerId).find("."+seatNodeClass);
	for(var i = 0, len = filediv.length; i < len; i++){
		var item = filediv[i];
		item.oncontextmenu = null;
	}
}


function bindLockSeats(){
	removeContainerEvent();

	selList.bind("click",function(evt){
		var sel = $(this);
		if (!sel.hasClass(lockClass)) {
			sel.removeClass(seledClass);
			sel.addClass(lockClass);
		} else {
			sel.removeClass(lockClass);
		}
	})
}

function isLocked(el){
	return $(el).hasClass(lockClass);
}


var delSeatsData = [];
function deleteSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	if(seled.length == 0){return;}

	seled.removeClass(seledClass);
	delSeatsData.push(seled);

	seled.remove();
	// seled.css("display","none");
}


function resetSeats(){
	var pop = delSeatsData.pop();
	if(pop && pop.length > 0){
		$("#seatcontainerId").append(pop);
	}
}



function dragMoveSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	var lefts = [];
	var tops = [];
	// var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;

		lefts.push(+sl);
		tops.push(+st);

	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});

	var w = lefts[lefts.length-1] - lefts[0] + seatWidth + 10;
	var h = tops[tops.length-1] - tops[0] + seatHeight + 2;
	var l = lefts[0];
	var t = tops[0];

	var moveseats = seled.clone();
	for(var j = 0,len = moveseats.length; j < len; j++){
		var sl = $(seled[j]).position().left;
		var st = $(seled[j]).position().top;
		$(moveseats[j]).css({"left":sl-lefts[0],"top":st-tops[0]});
	}

	moveStartLeft = l;
	moveStartTop = t;
	$("#" + movecontainerId).css({"width":w+"px","height":h+"px","left":l+"px","top":t+"px"});
	$("#" + movecontainerId).html(moveseats);
	$("#" + movecontainerId).show();

	removeContainerEvent();

	$("#" + movecontainerId).on({
		dblclick:function(e){
			dblclickMoveSeats();
			selectSeats();
		},
		mousedown:function(e){
			var el=$(this);
			var os = el.offset(); dx = e.pageX-os.left, dy = e.pageY-os.top;
			$(document).on('mousemove.drag', function(e){
				el.offset({top: e.pageY-dy, left: e.pageX-dx});
			});
		},
	   	mouseup: function(e){ 
		   $(document).off('mousemove.drag');
		}
	});
}

function dblclickMoveSeats(){

	$("#movecontainerId").hide();

	var eleft = parseFloat($("#" + movecontainerId).css("left"));
	var etop = parseFloat($("#" + movecontainerId).css("top"));

	var cleft = moveStartLeft - eleft;
	var ctop = moveStartTop-etop;
	var seled = $("#seatcontainerId ."+seledClass);
	seled.each(function(){
		let left = parseFloat($(this).css("left"));
		let top = parseFloat($(this).css("top"));
		$(this).css({"left":left - cleft + "px","top":top-ctop+"px"});
	});
	seled.removeClass(seledClass);

	$("#movecontainerId").html('');
}



function leftMoveSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	seled.each(function(){
		var left = parseFloat($(this).css("left"));
		$(this).css("left",left-1+"px");
	});
}
function rightMoveSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	seled.each(function(){
		var left = parseFloat($(this).css("left"));
		$(this).css("left",left+1+"px");
	});
}
function topMoveSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	seled.each(function(){
		var top = parseFloat($(this).css("top"));
		$(this).css("top",top-1+"px");
	});
}
function bottomMoveSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	seled.each(function(){
		var top = parseFloat($(this).css("top"));
		$(this).css("top",top+1+"px");
	});
}

function saveLocalSeats(){
	var allseats = $("#seatcontainer").html();
	localStorage.setItem("_seatscontainer",allseats);
}

function restoreLocalSeats(){
	var allseats = localStorage.getItem("_seatscontainer") || "";
	if(allseats){
		$("#seatcontainer").html(allseats);
	}
}



function completeSeats(){
	saveLocalSeats();

	var seats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
	seats.each(function(){
		var id = this.id;
		var arr = id.split("-");
		var nid = arr[0] + "-" + arr[1];
		$(this).attr("id",nid);
	})
	var rownum = $("#seatcontainerId .rownumseats");
	// console.log(seats,seats.html(),rownum,rownum.html())
	$("#seatcontainerId").html('');
	$("#seatcontainerId").append(seats);
	$("#seatcontainerId").append(rownum);
	
	saveCompleteSeats();

}

function saveCompleteSeats(){
	var seathtml = $("#seatcontainer").html().trim();
	var copyhtml = $("#seatcontainer").prop("outerHTML").trim();
	var flag = copyText(copyhtml); //传递文本
	alert(flag ? "复制成功！" : "复制失败！");

	sessionStorage.setItem("_seatscomplete",seathtml);
}
function clearCompleteSeats(){
	sessionStorage.setItem("_seatscomplete","");
}
function loadSessionData(){
	var html = sessionStorage.getItem("_seatscomplete") || "";
	if(html){
		$("#seatcontainer").prop("outerHTML",html);
		clearCompleteSeats();	
	}
}

function copyText(text) {
	var textarea = document.createElement("input");//创建input对象
	var currentFocus = document.activeElement;//当前获得焦点的元素
	document.body.appendChild(textarea);//添加元素
	textarea.value = text;
	textarea.focus();
	if(textarea.setSelectionRange)
		textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
	else
		textarea.select();
	try {
		var flag = document.execCommand("copy");//执行复制
	} catch(eo) {
		var flag = false;
	}
	document.body.removeChild(textarea);//删除元素
	currentFocus.focus();
	return flag;
}



function autoCode(ruleid){
	var seled = $("#seatcontainerId ."+seatNodeClass+":not(.rownumseats)");
	// seled.removeClass(seledClass);
	
	// var lefts = [];
	// var tops = [];
	var seledgroup = {};
	var seledrowv = [];
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;

		var h = $(seled[i]).height();

		// lefts.push(+sl);
		// tops.push(+st);

		var id = seled[i].id;
		// var kid = id.split('-')[0]+"-";
		var kid = isRow(seledgroup,(st - h/2),(st + h/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[st] = [];
			seledgroup[st].push(id);
			seledrowv.push(st);
		}
	}

	seledrowv = seledrowv.sort(function(a,b){return a-b;});
	seledrowv.forEach(function(ik,rowid){
		var col = seledgroup[ik];
		col.sort(function(a,b){
			var la = $("#" + a).position().left;
			var lb = $("#" + b).position().left;
			return la - lb;
		});
		var oae = oddAndEven(col.length);
		var seatsnum = [];
		if(ruleid == 1){
			seatsnum = oae.odd.concat(oae.even.reverse());
		}else if(ruleid == 2){
			seatsnum = oae.even.concat(oae.odd.reverse());
		}
		col.forEach(function(oid,colid){
			// var oid = col[ck];
			$("#" + oid).html(seatsnum[colid]);
			$("#" + oid).attr("id",(rowid+1)+"-"+(seatsnum[colid])+"-"+new Date().getTime());
		});
	});

	// var oae = oddAndEven(seatnum);
	// var seatsnum = [];
	// if(+seatrule == 1){
	// 	seatsnum = oae.odd.concat(oae.even.reverse());
	// }else if(+seatrule == 2){
	// 	seatsnum = oae.even.concat(oae.odd.reverse());
	// }else if(+seatrule == 3){
	// 	seatsnum = oae.desc.reverse();
	// }else if(+seatrule == 4){
	// 	seatsnum = oae.desc;
	// }
}

function isRow(seledgroup,d,h){
	for(var k in seledgroup){
		if(+k >= d && +k <= h){
			return k;
		}
	}
	return false;
}

function isCircle(seledgroup,r){
	for(var k in seledgroup){
		// if(r > (r-20) && r < (r-20)){
		if(r == k){
			return k;
		}
	}
	return false;
}

function autoCircleCode(ruleid){
	var seled = $("#seatcontainerId ."+seatNodeClass+":not(.rownumseats)");
	// seled.removeClass(seledClass);
	
	// var lefts = [];
	// var tops = [];
	var seledgroup = {};
	var seledrowv = [];
	for(var i = 0,len = seled.length; i < len; i++){
		// var sl = $(seled[i]).position().left;
		// var st = $(seled[i]).position().top;
		// var cc = $(seled[i]).attr("circle").split('-');
		// var ang = $(seled[i]).attr("sang");
		var r = $(seled[i]).attr("r");
		// var ccx = cc[0];
		// var ccy = cc[1];

		// var h = $(seled[i]).height();

		// lefts.push(+sl);
		// tops.push(+st);
		// debugger
		var id = seled[i].id;
		// var r = Math.sqrt(Math.pow(ccx-sl,2) + Math.pow(ccy-st,2));
		var kid = isCircle(seledgroup,r);
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[r] = [];
			seledgroup[r].push(id);
			seledrowv.push(r);
		}
	}

	console.log(seledgroup,seledrowv)
	seledrowv = seledrowv.sort(function(a,b){return a-b;});
	seledrowv.forEach(function(ik,rowid){
		//获取到这一组座位所有的id
		var seatids = seledgroup[ik];
		//现在要分成上下两个部分
		var up = [];
		var down = [];
		// debugger
		seatids.forEach(function(id){
			var ang = +$("#" + id).attr("ang");
			// console.log(ang)
			if(ang > 360 && ang < 540){
				down.push(id);
			}else{
				up.push(id);
			}
		});
		console.log(up,down,seatids)

		up.sort(function(a,b){
			var la = $("#" + a).position().left;
			var lb = $("#" + b).position().left;
			return la - lb;
		});

		down.sort(function(a,b){
			var la = $("#" + a).position().left;
			var lb = $("#" + b).position().left;
			return la - lb;
		});
		
		var oae = oddAndEven(up.length);
		var seatsnum = [];
		if(ruleid == 1){
			seatsnum = oae.odd.concat(oae.even.reverse());
		}else if(ruleid == 2){
			seatsnum = oae.even.concat(oae.odd.reverse());
		}
		up.forEach(function(oid,colid){
			// var oid = col[ck];
			$("#" + oid).html(seatsnum[colid]);
			$("#" + oid).attr("id",(rowid+1)+"-"+(seatsnum[colid])+"-"+new Date().getTime());
		});
		var oae = oddAndEven(down.length);
		var seatsnum = [];
		if(ruleid == 1){
			seatsnum = oae.odd.concat(oae.even.reverse());
		}else if(ruleid == 2){
			seatsnum = oae.even.concat(oae.odd.reverse());
		}
		down.forEach(function(oid,colid){
			// var oid = col[ck];
			$("#" + oid).html(seatsnum[colid]);
			$("#" + oid).attr("id",(rowid+1)+"-"+(seatsnum[colid])+"-"+new Date().getTime());
		});
	});
}







































function creatSeats2(rownum,colnum){
	// countMaxWidth();
	appendSeatsContainer(rownum,colnum);

	getAllSeatsNode();
}
function appendSeatsContainer(rownum,colnum){
	var seathtml = [];
	
	var stop = 110;
	var sleft = maxWidth;

	for(var j = 1; j <= +rownum; j++){
		for(var i = 0; i < +colnum; i ++){
			seathtml.push('<div class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="' + (j) + '-' + (i+1) + '-' + new Date().getTime() +'">' + (i+1) + '</div>');
			sleft = sleft + 50;
		}
		sleft = maxWidth;
		stop = stop + 50;
	}

	$("#seatcontainerId").append(seathtml.join(''));
}

var isDrop = false;
var meetingid  = 0;


var areas = [];


var maxWidth;
function countMaxWidth(rownum,colnum){
	maxWidth = colnum*50 + 100;
	$(".seatcontainer").width(colnum*50 + 100);
	$(".seatcontainer").height(rownum*50 + 200);

	// var arearule = +$("#arearule").val();
	// if(arearule == 1){
	// 	if(addwidth){
	// 		var w = $(".seatcontainer").width();
	// 		$(".seatcontainer").width(w + addwidth);
	// 	}else{
	// 		$(".seatcontainer").width(maxSeatNum*50 + 200);
	// 	}
	// }else{
	// 	if(addwidth){
	// 		var h = $(".seatcontainer").height();
	// 		$(".seatcontainer").height(h + addwidth);
	// 	}else{
	// 		$(".seatcontainer").height(maxSeatNum*50 + 200);
	// 	}
	// }
	
}

var sTop = 110;
var sLeft = 50;
// var rowId = 0;
var colId = 0;

// $("div[id$=-1]")
// 获取 id -1结尾的div
function bulidSeatsContainer(rownum,colnum){

	// if($("#"+aid).length == 0){
	// 	$("#seatcontainerId").append("<div id='" + aid + "' ></div>");
	// }
	// var oae = oddAndEven(seatnum);
	// var seatsnum = [];
	// if(+seatrule == 1){
	// 	seatsnum = oae.odd.concat(oae.even.reverse());
	// }else if(+seatrule == 2){
	// 	seatsnum = oae.even.concat(oae.odd.reverse());
	// }else if(+seatrule == 3){
	// 	seatsnum = oae.desc.reverse();
	// }else if(+seatrule == 4){
	// 	seatsnum = oae.desc;
	// }
	var seathtml = [];
	
	var stop = sTop;
	var sleft = sLeft;

	for(var j = 1; j <= +rownum; j++){
		for(var i = 0; i < +colnum; i ++){
			seathtml.push('<div class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="' + (j) + '-' + (i+1) + '-c">' + (i+1) + '</div>');
			// stop = stop + 50;
			sleft = sleft + 50;
		}
		sleft = 50;
		stop = stop + 50;
	}
	// rowId = +rownum;

	// sTop = stop;
	

	$("#seatcontainerId").html(seathtml.join(''));
}


function oddAndEven(n){
	//求偶奇数
	var str1="",str2="",n1=0,n2=0;
	var nums = {
		odd:[],
		even:[],
		desc:[]
	};
    for(var i=n; i>=1; i--){
        if(i%2!=0){
            str1 = str1 + i + ","; //将奇数连到一个字符串中
        }else{
            str2 = str2 + i + ","; //将偶数连到一个字符串中
		}
		nums.desc.push(i);
	}
	nums.odd = str1.substr(0,str1.length-1).split(',');
	nums.even = str2.substr(0,str2.length-1).split(',');
	return nums;
}

// $("div[id$=-1]")
// 获取 id -1结尾的div
// [属性名称] 匹配包含给定属性的元素
// [att=value] 匹配包含给定属性的元素 (大小写区分)
// [att*=value] 模糊匹配
// [att!=value] 不能是这个值
// [att$=value] 结尾是这个值
// [att^=value] 开头是这个值
// [att1][att2][att3]... 匹配多个属性条件中的一个

var colIds = [];
function createColNum(){
	var col = +$("#colnum").val();
	var seats = $("div[id$=-" + col + "]");
	var colhtml = [];
	for(var i = 0,len = seats.length; i < len; i++){
		var ele = seats[i];
		var id = ele.id;
		var nums = id.split('-');
		var ckseats = $("div[id^=" + nums[0] + "-]");
		ckseats = ckseats.filter(function(i,item){
			var iid = +item.id.split('-')[1];
			return iid >= +nums[1];
		});

		var left = $(ele).css("left");
		var top = $(ele).css("top");
		colhtml.push('<div class="colDiv" style="left:' + left + ';top:' + top + '">' + (i+1) + '排</div>');

		ckseats.map(function(i,item){
			var left = parseFloat($(item).css("left"));
			$(item).css("left",left+50+"px");
		});
	}
	countMaxWidth(50);

	$("#seatcontainerId").append("<div >" + colhtml.join('') + "</div>");
}


function createColAisle(){
	var col = +$("#acolnum").val();
	var seats = $("div[id$=-" + col + "]");
	for(var i = 0,len = seats.length; i < len; i++){
		var ele = seats[i];
		var id = ele.id;
		var nums = id.split('-');
		var ckseats = $("div[id^=" + nums[0] + "-]");
		ckseats = ckseats.filter(function(i,item){
			var iid = +item.id.split('-')[1];
			return iid >= +nums[1];
		});
		ckseats.map(function(i,item){
			var left = parseFloat($(item).css("left"));
			$(item).css("left",left+50+"px");
		});
	}
	countMaxWidth(50);
}


function createRowAisle(){
	var row = +$("#arownum").val();
	var seats = $("div[id^=" + row + "-]");
	for(var i = 0,len = seats.length; i < len; i++){
		var ele = seats[i];
		var id = ele.id;
		var nums = id.split('-');
		var ckseats = $("div[id$=-" + nums[1] + "]");
		ckseats = ckseats.filter(function(i,item){
			var iid = +item.id.split('-')[0];
			return iid > +nums[0];
		});
		ckseats.map(function(i,item){
			var top = parseFloat($(item).css("top"));
			$(item).css("top",top+50+"px");
		});
	}
}














var seatContainerClass = "seatcontainer";
var seatcontainerId = "seatcontainerId";
var dragcontainerId = "dragcontainerId";
var dargseatsId = "dargseatsId";
var seatNodeClass = "seatdiv";
var seatWidth = 40;
var seatHeight = 40;
var seledClass = "seled";
var lockClass = "locked";
var selDivClass = "selectionDiv";

//座区
var selList = [];
//选中ids
var ckids = [];
//取消选中ids
var sckids = [];
//拖拽匹配上的座区
var dragMatchSeat = [];

var selDiv;

var startX;
var startY;






var currseatno;
function bindMenu(seatno){
	var menuJson = [
		{
			name:"编号",
			id:"menu0",
			seatno:seatno,
			callback: function(seatno) {
				var cid = $("[cid="+seatno+"]").attr("cid") || "";
				if(cid){
					seatno = $("[cid="+seatno+"]").attr("id");
				}
				currseatno = seatno;
				var newno = window.prompt("请输入编号X-Y");
				var reg = /^\d+\-\d+$/g;
				if(newno){
					if(reg.test(newno)){
						if($("#"+newno).length == 0){
							var id = newno.split("-");
							$("#"+seatno).attr("id",newno);
							if(!cid){
								$("#"+newno).attr("cid",seatno);
							}
							$("#"+newno).text(id[1]);

							console.log($("[cid=1-1]").length)
						}else{
							alert("编号已存在");
						}
					}else{
						alert("编号输入不合法");
					}
				}
			}
		},
		{
			name:"编排",
			id:"menu4",
			seatno:seatno,
			callback: function(seatno) {
				var cid = $("[cid="+seatno+"]").attr("cid") || "";
				if(cid){
					seatno = $("[cid="+seatno+"]").attr("id");
				}
				currseatno = seatno;
				var newno = window.prompt("请输入排号");
				if(newno){
					$("#"+seatno).text(newno);
					$("#"+seatno).addClass("rownumseats");
				}
			}
		},
		// {
		// 	name:"改名",
		// 	id:"menu1",
		// 	seatno:seatno,
		// 	callback: function(seatno) {
		// 		console.log(this,seatno);
		// 		currseatno = seatno;
		// 		var name = $("#"+seatno).text();
		// 		var regnum = /^\d*$/;
		// 		// && !regnum.test(name)
		// 		if(name != "空座" ){
		// 			// $("#username").val(name);
		// 			var newname = window.prompt("请输入名字",name);
		// 			$("#"+seatno).text(newname);
		// 		}else{
		// 			// $("#username").val('');
		// 		}
		// 	}
		// },
		// {
		// 	name:"空座",
		// 	id:"menu2",
		// 	seatno:seatno,
		// 	callback: function(seatno) {
		// 		$("#"+seatno).html('空座');
		// 		// $("#"+seatno).removeClass("R1 R2 R3 R4 R5 R6 R7 R8 R9 R10");
		// 	}
		// },
		// {
		// 	name:"发送短信",
		// 	id:"menu3",
		// 	seatno:seatno,
		// 	callback: function(seatno) {
		// 		$("#"+seatno).html('空座');
		// 		// $("#"+seatno).removeClass("R1 R2 R3 R4 R5 R6 R7 R8 R9 R10");
		// 	}
		// }
		// ,{
		// 	name:"状态刷新",
		// 	id:"menu-delete",
		// 	callback: function() {
		// 		alert("刷新");
		// 	}
		// }
	];
	
	if($("#"+seatno).length > 0){
		ContextMenu.bind("#"+seatno, menuJson);
	}
}







function setRowNum(){
	
	var seled =  $("#seatcontainerId ."+seledClass);
	if(seled.length == 0){return;}
	
	seled = seled.sort(function(a,b){
		var topa = parseFloat($(a).css("top"));
		var topb = parseFloat($(b).css("top"));
		return topa - topb;
	});

	seled.removeClass(seledClass);
	seled.addClass("rownumseats");
	seled.each(function(_i){
		$(this).html((_i+1) + "排");
	});
}

function revertSeats(){
	var seled =  $("#seatcontainerId ."+seledClass);
	if(seled.length == 0){return;}
	seled.removeClass(seledClass);
	seled.each(function(){
		var id = this.id;
		$(this).removeClass("rownumseats");
		var num = id.split("-");
		$(this).html(num[1]);
	});
}


var movecontainerId = "movecontainerId";
var moveStartLeft = 0;
var moveStartTop = 0;
function xCenterSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	seled.removeClass(seledClass);

	var lefts = [];
	var tops = [];
	var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;
		var h = $(seled[i]).height();

		lefts.push(+sl);
		tops.push(+st);

		var id = seled[i].id;
		// var kid = id.split('-')[0]+"-";
		var kid = isRow(seledgroup,(st - h/2),(st + h/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[st] = [];
			seledgroup[st].push(id);
		}
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});
	// console.log(lefts,tops);

	var w = lefts[lefts.length-1] - lefts[0] + seatWidth + 10;
	var h = tops[tops.length-1] - tops[0] + seatHeight + 2;
	var l = lefts[0];
	var t = tops[0];

	for(var gk in seledgroup){
		var gids = seledgroup[gk];
		var sw = gids.length * 50;
		if(w > sw){
			var moveleft = w/2 - sw/2;
			gids.forEach(function(_id,i){
				$("#" + _id).css("left", (l + 50*i + moveleft) +"px");
			})
		}
	}

}

function yCenterSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	seled.removeClass(seledClass);

	var lefts = [];
	var tops = [];
	var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;
		var w = $(seled[i]).width();

		lefts.push(+sl);
		tops.push(+st);

		var id = seled[i].id;
		// var kid = "-"+id.split('-')[1];
		var kid = isRow(seledgroup,(sl - w/2),(sl + w/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[sl] = [];
			seledgroup[sl].push(id);
		}
		// if(seledgroup[kid]){
		// 	seledgroup[kid].push(id);
		// }else{
		// 	seledgroup[kid] = [];
		// 	seledgroup[kid].push(id);
		// }
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});
	// console.log(lefts,tops);

	var w = lefts[lefts.length-1] - lefts[0] + seatWidth + 10;
	var h = tops[tops.length-1] - tops[0] + seatHeight + 8;
	var l = lefts[0];
	var t = tops[0];

	for(var gk in seledgroup){
		var gids = seledgroup[gk];
		var sh = gids.length * 50;
		if(h > sh){
			var movetop = Math.floor(h/2 - sh/2);
			gids.forEach(function(_id,i){
				$("#" + _id).css("top", (t + 50*i + movetop) +"px");
			})
		}
	}
}

function xAvgSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	seled.removeClass(seledClass);

	var lefts = [];
	var tops = [];
	var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;
		var h = $(seled[i]).height();

		lefts.push(+sl);
		tops.push(+st);

		var id = seled[i].id;
		// var kid = id.split('-')[0]+"-";
		var kid = isRow(seledgroup,(st - h/2),(st + h/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[st] = [];
			seledgroup[st].push(id);
		}
		// if(seledgroup[kid]){
		// 	seledgroup[kid].push(id);
		// }else{
		// 	seledgroup[kid] = [];
		// 	seledgroup[kid].push(id);
		// }
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});
	// console.log(lefts,tops);

	var w = lefts[lefts.length-1] - lefts[0] + seatWidth;
	var h = tops[tops.length-1] - tops[0] + seatHeight + 2;
	var l = lefts[0];
	var t = tops[0];

	for(var gk in seledgroup){
		var gids = seledgroup[gk];
		var sw = gids.length * 50;
		var ssw = gids.length * 40;
		if(w > sw){
			var moveleft = (w-ssw)/(gids.length-1);
			gids.forEach(function(_id,i){
				$("#" + _id).css("left", (l + i*(40 + moveleft)) +"px");
			})
		}
	}
}

function yAvgSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	seled.removeClass(seledClass);

	var lefts = [];
	var tops = [];
	var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;
		var w = $(seled[i]).width();

		lefts.push(+sl);
		tops.push(+st);

		var id = seled[i].id;
		// var kid = "-"+id.split('-')[1];
		var kid = isRow(seledgroup,(sl - w/2),(sl + w/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[sl] = [];
			seledgroup[sl].push(id);
		}

		// if(seledgroup[kid]){
		// 	seledgroup[kid].push(id);
		// }else{
		// 	seledgroup[kid] = [];
		// 	seledgroup[kid].push(id);
		// }
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});
	// console.log(lefts,tops);

	var w = lefts[lefts.length-1] - lefts[0] + seatWidth;
	var h = tops[tops.length-1] - tops[0] + seatHeight;
	var l = lefts[0];
	var t = tops[0];

	for(var gk in seledgroup){
		var gids = seledgroup[gk];
		var sh = gids.length * 50;
		var ssh = gids.length * 40;
		if(h > sh){
			var movetop = (h-ssh)/(gids.length-1);
			gids.forEach(function(_id,i){
				$("#" + _id).css("top", (t + i*(40 + movetop)) +"px");
			})
		}
	}
}

function leftSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	seled.removeClass(seledClass);
	
	var lefts = [];
	// var tops = [];
	var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;
		var h = $(seled[i]).height();

		lefts.push(+sl);
		// tops.push(+st);

		var id = seled[i].id;
		// var kid = id.split('-')[0]+"-";
		var kid = isRow(seledgroup,(st - h/2),(st + h/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[st] = [];
			seledgroup[st].push(id);
		}
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	// tops = tops.sort(function(a,b){return a - b;});
	// console.log(lefts,tops);

	var w = lefts[lefts.length-1] - lefts[0] + seatWidth + 10;
	// var h = tops[tops.length-1] - tops[0] + seatHeight + 2;
	var l = lefts[0];
	// var t = tops[0];

	for(var gk in seledgroup){
		var gids = seledgroup[gk];
		var sw = gids.length * 50;
		if(w > sw){
			// var moveleft = w/2 - sw/2;
			gids.forEach(function(_id,i){
				$("#" + _id).css("left", (l + 50*i) +"px");
			})
		}
	}

}

function rightSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	seled.removeClass(seledClass);
	
	var lefts = [];
	var tops = [];
	var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;
		var h = $(seled[i]).height();

		lefts.push(+sl);
		tops.push(+st);

		var id = seled[i].id;
		// var kid = id.split('-')[0]+"-";
		var kid = isRow(seledgroup,(st - h/2),(st + h/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[st] = [];
			seledgroup[st].push(id);
		}
	}

	lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});
	// console.log(lefts,tops);

	var w = lefts[lefts.length-1] - lefts[0] + seatWidth + 10;
	var h = tops[tops.length-1] - tops[0] + seatHeight + 2;
	var l = lefts[0];
	var t = tops[0];

	for(var gk in seledgroup){
		var gids = seledgroup[gk];
		var sw = gids.length * 50;
		if(w > sw){
			var moveleft = w - sw;
			gids.forEach(function(_id,i){
				$("#" + _id).css("left", (l + moveleft + 50*i) +"px");
			})
		}
	}

}
function topSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	seled.removeClass(seledClass);
	
	var lefts = [];
	var tops = [];
	var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;

		var w = $(seled[i]).width();

		lefts.push(+sl);
		tops.push(+st);

		var id = seled[i].id;
		// var kid = "-"+id.split('-')[1];
		var kid = isRow(seledgroup,(sl - w/2),(sl + w/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[sl] = [];
			seledgroup[sl].push(id);
		}
	}

	// lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return a - b;});
	// console.log(lefts,tops);
	
	// var w = lefts[lefts.length-1] - lefts[0] + seatWidth + 10;
	// var h = tops[tops.length-1] - tops[0] + seatHeight + 2;
	// var l = lefts[0];
	var t = tops[0];
	for(var gk in seledgroup){
		var gids = seledgroup[gk];
		gids.forEach(function(_id,i){
			console.log(i)
			$("#" + _id).css("top", (t + 50*i) +"px");
		});
	}

}
function bottomSeats(){
	var seled = $("#seatcontainerId ."+seledClass);
	seled.removeClass(seledClass);
	
	var lefts = [];
	var tops = [];
	var seledgroup = {};
	for(var i = 0,len = seled.length; i < len; i++){
		var sl = $(seled[i]).position().left;
		var st = $(seled[i]).position().top;

		var w = $(seled[i]).width();

		lefts.push(+sl);
		tops.push(+st);

		var id = seled[i].id;
		// var kid = "-"+id.split('-')[1];
		var kid = isRow(seledgroup,(sl - w/2),(sl + w/2));
		if(kid){
			seledgroup[kid].push(id);
		}else{
			seledgroup[sl] = [];
			seledgroup[sl].push(id);
		}
	}

	// lefts = lefts.sort(function(a,b){return a - b;});
	tops = tops.sort(function(a,b){return b - a;});
	// console.log(lefts,tops);

	// var w = lefts[lefts.length-1] - lefts[0] + seatWidth + 10;
	// var h = tops[tops.length-1] - tops[0] + seatHeight + 2;
	// var l = lefts[0];
	var t = tops[0];

	for(var gk in seledgroup){
		var gids = seledgroup[gk];
		gids.forEach(function(_id,i){
			$("#" + _id).css("top", (t - 50*i) +"px");
		});
	}

}











































