
var isDrop = false;
var meetingid  = 0;

$(function(){
	//绑定座区事件
	// bindBoxEvent();

	// temp_ruletemplateid = getCookie("temp_ruletemplateid") - 0 || 0;
	// roomtemplateid = GetQueryString("roomtemplateid") - 0;
	// meetingid = GetQueryString("meetingid") - 0;

	// $("#meetingid").val(meetingid);

	// clearSeatList(meetingid);
	// clearRuleList(false);

	// getAllGroup();
	// getAllMeetingGroup();
	// queryAllSeatStatus();

	// geteSeatMap(roomtemplateid);

	// $("#prepare").bind("click",changeDropSelect);
	// $("#start").bind("click",changeBoxSelect);

	// $("#outwordbtn").bind("click",outWord);
	// $("#upload_file").bind("change",uploadWord);

	// $("#saveseatmap").bind("click",function(){
	// 	$("#czdropdown").dropdown('close');
	// 	saveSeatMap(meetingid);
	// });

	// $("#importbtn").bind("click",function(){
	// 	if(nameList && nameList.length > 0){
	// 		bindName(meetingid);
	// 	}else{
	// 		alert("请先获取人员数据");
	// 	}
	// });

	// $("#groupbtn").bind("click",function(){
	// 	if($("#btnloading").is(':hidden')){
	// 		$("#btnloading").show();
	// 		var groupid = $("#groupselect").val();
	// 		// var meetingid = $("#meetingselect").val();
	// 		getAllName(meetingid,groupid);
	// 	}
	// });
	
	// $("#updaterule").bind("click",function(){
	// 	$("#ruledropdown").dropdown('close');
	// 	if(changeSeatIds.length > 0){
	// 		isaddrule = false;
	// 		setSeatRule(true);
	// 	}
	// });
	// $("#cancelrule").bind("click",function(){
	// 	$("#ruledropdown").dropdown('close');
	// 	changeSeatIds = [];
	// 	$(".reseled").removeClass("reseled");
	// });
	
	
	
	// $("#enterbtn").bind('click',function(evt){
	// 	var $modal = $('#doc-modal-0');
	// 	$modal.modal('close');
		
	// 	if (evt.stopPropagation)
	// 		evt.stopPropagation();
	// 	else
	// 		evt.cancelBubble = true;
	// 	if (evt.preventDefault)
	// 		evt.preventDefault();
	// 	else
	// 		evt.returnValue = false;

	// 	setSeatRule();
	// });



	getAllSeatsNode();

	$("#nav-selection").bind("click",selectSeats);
	$("#nav-lock").bind("click",bindLockSeats);

	$("#nav-drag").bind("click",dragSeats);
	$("#nav-radio").bind("click",bindOneSeats);
	// $("#canceldragbtn").bind("click",cancelDragSeats);
	
	


	$("#rightbtn").bind("click",bindContextMenu);
	$("#cancelrightbtn").bind("click",removeContextMenu);

	bindContainerEvent();
});


function selectSeats(){
	cancelDragSeats();

	bindContainerEvent();
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

function removeContainerEvent(){
	$("." + seatContainerClass).unbind("mousedown");
	$("." + seatContainerClass).unbind("mousemove");
	$("." + seatContainerClass).unbind("mouseup");
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

//拖拽选区
function dragSeats(){
	var seled = $("."+seledClass);

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
	$("#" + dragcontainerId).append(dragseats);
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
var isSelect;
var startX;
var startY;


function getAllSeatsNode(){
	selList = $("#" + seatcontainerId).find("."+seatNodeClass);
	// var fileNodes = $("#" + seatcontainerId).find("."+seatNodeClass);
	// for (var i = 0,len = fileNodes.length; i < len; i++) {
	// 	if (fileNodes[i].className.indexOf(seatNodeClass) != -1) {
	// 		// var classname = fileNodes[i].className.replace("fileDiv","");
	// 		// fileNodes[i].className = classname + " fileDiv"; 
	// 		selList.push(fileNodes[i]);
			
	// 	}
	// }
}

function containerMouseDown(){

	if(showRuleIds.length > 0){
		showRuleIds.forEach(function(item){
			$("#" + item.seatid).removeClass('seled');
		})
		showRuleIds.length = 0;
	}
	
	// var fileNodes = document.getElementsByTagName("div");
	// for (var i = 0; i < fileNodes.length; i++) {
	// 	if (fileNodes[i].className.indexOf("fileDiv") != -1) {
	// 		// var classname = fileNodes[i].className.replace("fileDiv","");
	// 		// fileNodes[i].className = classname + " fileDiv"; 
	// 		selList.push(fileNodes[i]);
	// 	}
	// }

	


	
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


	// selDiv.style.left = startX + "px";
	// selDiv.style.top = startY + "px";
	selDiv.style.left = "-100px";
	selDiv.style.top = "-100px";

	
	// clearEventBubble(evt);



	// document.onmousemove = function () {
		
	// }

	// document.onmouseup = function () {
		
	// }
}

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
		console.log(sleft,stop,swidth,sheight)
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
			var sl = sel.position().left;
			var st = sel.position().top;

			// var sl = selList[i].offsetWidth + selList[i].offsetLeft;
			// var st = selList[i].offsetHeight + selList[i].offsetTop;
			// console.log(selList[i].offsetWidth + selList[i].offsetLeft,sl,selList[i].offsetHeight + selList[i].offsetTop,st)
			var sid = selList[i].id;
			// if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
			if (sl > _l && st > _t && (sl+seatWidth/4) < _l + _w && (st+seatWidth/4) < _t + _h) {
				// console.log("------", selList[i], sid, selList[i].className)

				// if(selList[i].className.indexOf("reseled") == -1){
				// 	//首先判断当选座位没有绑定规则
				// 	var rclass = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10"];
				// 	var isr = false;
				// 	for(var r = 0; r < rclass.length; r++){
				// 		if(selList[i].className.indexOf(rclass[r]) != -1){
				// 			isr = true;
				// 			continue;
				// 		}
				// 	}
				// 	if(isr){
				// 		continue;
				// 	}
				// }

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
						// sel.removeClass(seledClass);
						//取消选中
						// var classname = selList[i].className.replace("reseled", "");
						// classname = classname.replace("seled", "");
						// classname = classname.replace("R1", "");
						// classname = classname.replace("R2", "");
						// classname = classname.replace("R3", "");
						// classname = classname.replace("R4", "");
						// classname = classname.replace("R5", "");
						// classname = classname.replace("R6", "");
						// classname = classname.replace("R7", "");
						// classname = classname.replace("R8", "");
						// classname = classname.replace("R9", "");
						// classname = classname.replace("R10", "");
						// selList[i].className = classname;
					}
				}
			} else {
				// if (sid) {
				// 	console.log(ckids, sid, selList[i].className)
				// }
				// if (sid && selList[i].className.indexOf("seled") != -1 && ckids.indexOf(sid) != -1) {
				// 	// ckids = ckids.filter(function(t){
				// 	//   return t != sid;
				// 	// })
				// 	var classname = selList[i].className.replace("seled","");
				// 	classname = classname.replace("fileDiv","");
				// 	selList[i].className = classname + "fileDiv";
				// }
			}
		}

	}
	// clearEventBubble(evt);
}

function containerMouseUp(evt){
	isSelect = false;
	ckids = [];
	sckids = [];
	if (selDiv) {
		// document.body.removeChild(selDiv);
		$("." + selDivClass).remove();
		
		// showSelDiv(selList);
	}
	// selList = null, 
	_x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
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
	bindContainerEvent();
	var filediv = $("#" + seatcontainerId).find("."+seatNodeClass);
	for(var i = 0, len = filediv.length; i < len; i++){
		var item = filediv[i];
		item.oncontextmenu = null;
	}
}
var currseatno;
function bindMenu(seatno){
	var menuJson = [
		{
			name:"改名",
			id:"menu1",
			seatno:seatno,
			callback: function(seatno) {
				console.log(this,seatno);
				currseatno = seatno;
				var name = $("#"+seatno).text();
				var regnum = /^\d*$/;
				// && !regnum.test(name)
				if(name != "空座" ){
					// $("#username").val(name);
					var newname = window.prompt("请输入名字",name);
					$("#"+seatno).text(newname);
				}else{
					// $("#username").val('');
				}
				
				// $('#doc-modal-2').modal({
				// 	relatedTarget: this,
				// 	onConfirm: function(e) {
				// 		var name = $("#username").val() || "";
				// 		if(name){
				// 			if(addnames[name]){
				// 				alert(name + "已添加到" + currseatno);
				// 			}else{
				// 				$("#"+currseatno).text(name);
				// 			}
				// 		}
						
				// 		$('#doc-modal-2').modal('close');
				// 	},
				// 	onCancel: function(e) {
				// 	}
				// });
			}
		},
		{
			name:"空座",
			id:"menu2",
			seatno:seatno,
			callback: function(seatno) {
				$("#"+seatno).html('空座');
				// $("#"+seatno).removeClass("R1 R2 R3 R4 R5 R6 R7 R8 R9 R10");
			}
		},
		{
			name:"发送短信",
			id:"menu3",
			seatno:seatno,
			callback: function(seatno) {
				$("#"+seatno).html('空座');
				// $("#"+seatno).removeClass("R1 R2 R3 R4 R5 R6 R7 R8 R9 R10");
			}
		}
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








function bindBoxEvent(){
	// document.onmousedown = function () {
		
	// }
}

function removeBoxEvent(){
	document.onmousedown = null;
	document.onmousemove = null;
	document.onmouseup = null;
}

function clearEventBubble(evt) {
	if (evt.stopPropagation)
		evt.stopPropagation();
	else
		evt.cancelBubble = true;
	// if (evt.preventDefault)
	// 	evt.preventDefault();
	// else
	// 	evt.returnValue = false;
}

















var seatObj = {};
var ckids_now = [];
function showSelDiv(arr) {
	var count = 0;
	var selInfo = "";

	ckids_now = [];

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].className.indexOf("seled") != -1) {
			count++;
			var id = arr[i].id;
			selInfo += arr[i].id + "/";

			

			if (seatObj[id]) {
				// 已绑定规则
			} else {
				ckids_now.push(id);
			}
		}
	}
	// console.log("共选择 " + ckids_now.length + " 个文件，分别是：" + ckids_now);
} 



var colors = ["#FFC0CB","#6495ED","#7FFFAA","#F4A460","#F0E68C","#D2B48C","#FA8072","#00FFFF","#8A2BE2","#FF4500"];
function setSeatRule(empty){
	var ruleid = $("#ruleselect").val();
	var isincrement = $("#isincrement").val() - 0;

	if(isaddrule){
		if(ckids_now && ckids_now.length > 0){
			var rule = [];
			for(var i = 0,len = ckids_now.length; i < len; i++){
				rule.push({"seatid":ckids_now[i],"attender":""});
			}
			this.saveSeatRule(rule,ruleid,temp_ruletemplateid,roomtemplateid,isincrement);
		}else{
			alert("请选择座区");
		}
	}else{
		
		if(changeSeatIds && changeSeatIds.length > 0){
			console.log(changeSeatIds,ckids_now)
			if(ckids_now && ckids_now.length > 0){
				var rule = [];
				for(var i = 0,len = ckids_now.length; i < len; i++){
					rule.push({"seatid":ckids_now[i],"ruleid":ruleid,"attender":"","temp_ruletemplateid":temp_ruletemplateid,"roomtemplateid":roomtemplateid});
				}
				// console.log(rule,ruleid)
				this.updateSeatRule(rule,ruleid,isincrement);
				this.resetChangeSeartIds(empty);
			}else{
				// alert("没有选择任何座位")
			}
		}else{
			if(changeRuleZone && changeRuleZone.length > 0){
				// changeRuleZone.forEach(function(item){
				// 	item.ruleid = ruleid;
				// })
				this.updateSeatRule(changeRuleZone,ruleid,isincrement);
			}
		}
		
	}
}

function saveSeatRule(rule,ruleid,temp_ruletemplateid,roomtemplateid,isincrement){
	// var rule = [];
	// rule.push({"seatid":"1-1","ruleid":"1"});

	var data = {};
	data.action = "add";
	data.rule = rule;
	data.ruleid = ruleid;
	data.temp_ruletemplateid = temp_ruletemplateid;
	data.roomtemplateid = roomtemplateid;
	data.isincrement = isincrement;

	$.ajax({
		type: "POST",
		url: "ruletemplate2_add_next_do.php",
		data: data,
		dataType:'json',
		success: function(data){
			if(!data){return}
			// console.log(data)
			// $("#myDiv").html('<h2>'+data+'</h2>');
			if(data.state){
				for(var i = 0,len = ckids_now.length; i < len; i++){
					// console.log($("#" + ckids_now[i]).attr("class"))
					$("#" + ckids_now[i]).removeClass('seled');
					$("#" + ckids_now[i]).addClass(ruleid);
					$("#" + ckids_now[i]).text("空座");
					// console.log($("#" + ckids_now[i]).attr("class"))
				}
				window.frames["mainid"].contentWindow.location.reload();
			}else{
				alert("设置失败");
			}
		}
	});
}
function updateSeatRule(rule,ruleid,isincrement){
	// var rule = [];
	// rule.push({"seatid":"1-1","ruleid":"1"});
	var data = {};
	data.rule = rule;//JSON.stringify(rule);
	data.action = "u";
	data.ruleid = ruleid;
	data.rulerecordid = rulerecordid;
	data.isincrement = isincrement;
	$.ajax({
		type: "POST",
		url: "ruletemplate2_add_next_do.php",
		data: data,
		dataType:'json',
		success: function(data){
			if(!data){return}
			// console.log(data)
			// $("#myDiv").html('<h2>'+data+'</h2>');
			if(data.state){
				for(var i = 0,len = rule.length; i < len; i++){
					// console.log($("#" + ckids_now[i]).attr("class"))
					$("#" + rule[i].seatid).removeClass(oldruleid);
					$("#" + rule[i].seatid).addClass(ruleid);
					// $("#" + rule[i].seatid).text("空座");
					// console.log($("#" + ckids_now[i]).attr("class"))
				}
				window.frames["mainid"].contentWindow.location.reload();
			}else{
				alert("设置失败");
			}
		}
	});

	
}


function queryAllSeatStatus(t){
	var data = {};
	data.action = "s";
// 	var temp_ruletemplateid = 0;
// var roomtemplateid = 0;
	data.rule_id = temp_ruletemplateid;
	data.room_id = roomtemplateid;
	// rule_id=180&room_id=67
	$.ajax({
		type: "POST",
		url: "ruletemplate2_add_next_do.php",
		data: data,
		dataType:'json',
		success: function(data){
			if(data && data instanceof Array){
				console.log(data)
					setSeatStatus(data,t);
			}
			// $("#myDiv").html('<h2>'+data+'</h2>');
		}
	});
}
function queryAllSeatStatusById(id){
	var data = {};
	data.action = "s";
	data.ruleid = id;
	$.ajax({
		type: "POST",
		url: "ruletemplate2_add_next_do.php",
		data: data,
		dataType:'json',
		success: function(data){
			console.log("queryAllSeatStatusById---",data)
			if(data && data instanceof Array){
				// console.log(data)
				// setSeatStatus(data);
			}
			// $("#myDiv").html('<h2>'+data+'</h2>');
		}
	});
}


function getAllGroup(){
	var data = {};
	data.action = "s";
	data.parameter = "grouplist";
	$.ajax({
		type: "GET",
		url: "fastseatslayout_api.php",
		data: data,
		dataType:'json',
		success: function(data){
			if(!data){return}
			console.log("getAllGroup---",data);
			var list = data.list || []
			if(list.length > 0){
				// console.log(data)
				// setSeatStatus(data);
				var option = [];
				for(var i = 0,len = list.length; i < len; i++){
					var item = list[i] || {};
					option.push("<option value='"+ item.value + "' >"+ item.name + "</option>")
				}
				
				$("#groupselect").html(option.join(''));
			}
		}
	});
}

function getAllMeetingGroup(){
	var data = {};
	data.action = "s";
	data.parameter = "meetinglist";
	$.ajax({
		type: "GET",
		url: "fastseatslayout_api.php",
		data: data,
		dataType:'json',
		success: function(data){
			if(!data){return;}
			console.log("meetinglist---",data);
			var list = data.list || []
			if(list.length > 0){
				// console.log(data)
				// setSeatStatus(data);
				var option = [];
				for(var i = 0,len = list.length; i < len; i++){
					var item = list[i] || {};
					option.push("<option value='"+ item.value + "' >"+ item.name + "</option>")
				}
				
				$("#meetingselect").html(option.join(''));
			}
		}
	});
}

var nameList = [];
function getAllName(meetingid,groupid){
	var data = {};
	data.action = "s";
	data.parameter = "canhui";
	data.meetingid = meetingid;
	data.groupid = groupid;

	$.ajax({
		type: "GET",
		url: "fastseatslayout_api.php",
		data: data,
		dataType:'json',
		success: function(data){
			console.log("getAllName---",data);
			$("#btnloading").hide();
			if(data && data.list && data.list.length > 0){
				var list = data.list || []
				nameList = list;
			}else{
				alert("没有获取到参会人员数据");
			}
			// if(list.length > 0){
			// 	// console.log(data)
			// 	// setSeatStatus(data);
			// 	var option = [];
			// 	for(var i = 0,len = list.length; i < len; i++){
			// 		var item = list[i] || {};
			// 		option.push("<option value='"+ item.value + "' >"+ item.name + "</option>")
			// 	}
				
			// 	$("#groupselect").html(option.join(''));
			// }
		}
	});
}
function bindName(meetingid){
	var data = {};
	// data.action = "s";
	// data.parameter = "canhui";
	data.meetingid = meetingid;
	data.rule = bindRuleZone;
	data.ruleid = bindRuleId;
	data.list = nameList;

	$.ajax({
		type: "POST",
		url: "rulenew.php",
		data: data,
		dataType:'json',
		success: function(data){
			console.log("bindName---",data);
			// $("#btnloading").hide();
			var list = data.list || []
			nameList = list;
			if(data && data instanceof Array){
				for(var i=0,len=data.length;i<len;i++){
					var item = data[i];

					if(item.attender){
						if(addnames[item.attender]){
							alert(item.attender + "已添加到" + item.seatid);
						}else{
							$("#" + item.seatid).html(item.attender);
							addnames[item.attender] = item.seatid;
						}
					}
				}
			}
			var $modal = $('#doc-modal-1');
			$modal.modal('close');
		}
	});
}

function saveSeatMap(meetingid){
	var seatmap = [];

	var filediv = $(".fileDiv");
	var regnum = /^\d*$/;
	for(var i = 0,len = filediv.length; i < len; i++){
		var item = $(filediv[i]);
		if(item.text() != "空座" && !regnum.test(item.text())){
			seatmap.push({seatid:item.attr("id"),name:item.text()})
		}

	}
	if(seatmap.length == 0){
		alert("还没有绑定人员");
		return;
	}

	var data = {};
	data.action = "save";
	// data.parameter = "canhui";
	data.meetingid = meetingid;
	data.rule = seatmap;
	// data.ruleid = bindRuleId;
	// data.list = nameList;
	console.log(data)
	$.ajax({
		type: "POST",
		url: "rulenew.php",
		data: data,
		dataType:'json',
		success: function(data){
			console.log("saveSeatMap---",data);
			if(data && data.state){
				alert("保存成功");
			}
			// $("#btnloading").hide();
			// var list = data.list || []
			// nameList = list;
			// if(data && data instanceof Array){
			// 	for(var i=0,len=data.length;i<len;i++){
			// 		var item = data[i];
			// 		$("#" + item.seatid).html(item.attender);
			// 	}
			// }
		}
	});
}

function geteSeatMap(meetingid){
	var data = {};
	data.action = "search";
	// data.parameter = "canhui";
	data.meetingid = meetingid;
	// data.rule = seatmap;
	// data.ruleid = bindRuleId;
	// data.list = nameList;
	console.log(data)
	$.ajax({
		type: "POST",
		url: "rulenew.php",
		data: data,
		dataType:'json',
		success: function(data){
			console.log("getSeatMap---",data);
			// $("#btnloading").hide();
			// var list = data.list || []
			// nameList = list;
			// if(data && data instanceof Array){
			// 	for(var i=0,len=data.length;i<len;i++){
			// 		var item = data[i];
			// 		$("#" + item.seatid).html(item.attender);
			// 	}
			// }
		}
	});
}

function clearRuleList(reload){
	var data = {};
	data.action = "init";
	// data.parameter = "canhui";
	// data.meetingid = meetingid;
	// data.rule = seatmap;
	// data.ruleid = bindRuleId;
	// data.list = nameList;
	console.log(data)
	$.ajax({
		type: "POST",
		url: "rulesetup_drop_do.php",
		data: data,
		dataType:'html',
		success: function(data){
			console.log("clearRuleList---",data);
			if(data == "OK"){
				if(reload){
					window.frames["mainid"].contentWindow.location.reload();
				}else{
					setTimeout(function(){
						window.frames["mainid"].contentWindow.location.reload();
					},2000)
				}
			}
			// $("#btnloading").hide();
			// var list = data.list || []
			// nameList = list;
			// if(data && data instanceof Array){
			// 	for(var i=0,len=data.length;i<len;i++){
			// 		var item = data[i];
			// 		$("#" + item.seatid).html(item.attender);
			// 	}
			// }
		}
	});
}

function clearSeatList(meetingid){
	var data = {};
	data.action = "delall";
	// data.parameter = "canhui";
	data.meetingid = meetingid;
	// data.rule = seatmap;
	// data.ruleid = bindRuleId;
	// data.list = nameList;
	console.log(data)
	$.ajax({
		type: "POST",
		url: "rulenew.php",
		data: data,
		dataType:'html',
		success: function(data){
			console.log("clearSeatList---",data);
		}
	});
}


function setSeatStatus(data,t){
	if(data && data instanceof Array){
		for(var i = 0,len = data.length; i < len; i++){
			var items = data[i] || [];
			items.forEach(function(item){
				if(t){
					var name = $("#" + item.seatid).text();
					var regnum = /^\d*$/;
					if( name != "空座" && !regnum.test(name)){
						$("#" + item.seatid).addClass(items[0].ruleid);
					}
				}else{
					$("#" + item.seatid).addClass(items[0].ruleid);
				}
			});
		}
	}
	
}

var showRuleIds = [];
function querySeatById(rulezone){
	resetChangeSeartIds();

	

	// if(showRuleIds.length > 0){
	// 	showRuleIds.forEach(function(item){
	// 		$("#" + item.seatid).removeClass('seled');
	// 	});
	// }
	if(rulezone && rulezone.length > 0){
		showRuleIds = [];
		rulezone.forEach(function(item){
			$("#" + item.seatid).addClass('seled');
			if(!$("#" + item.seatid).hasClass(item.ruleid)){
				$("#" + item.seatid).addClass(item.ruleid);
			}
			showRuleIds.push(item);
		});
	}
}

function delSeatRule(rulezone){
	console.log('delSeatRule---',rulezone);
	resetChangeSeartIds();

	if(rulezone && rulezone.length > 0){
		rulezone.forEach(function(item){
			// $("#" + item.seatid).removeClass('seled');
			// $("#" + item.seatid).removeClass(item.ruleid);
			if($("#" + item.seatid).hasClass("big")){
				$("#" + item.seatid).removeClass();
			$("#" + item.seatid).addClass('fileDiv big');
			}else{
				$("#" + item.seatid).removeClass();
			$("#" + item.seatid).addClass('fileDiv');
			}
			
		});
	}
}


var bindRuleZone;
var bindRuleId;
function showGroupModel(rulezone,ruleid,isincrement){
	console.log('showGroupModel---',rulezone,ruleid,isincrement);
	nameList = [];
	bindRuleZone = rulezone;
	bindRuleId = ruleid;

	var $modal = $('#doc-modal-1');
	$modal.modal('open');

}


var changeRuleZone = [];
var rulerecordid = 0;
var oldruleid = 0;
var oldisincrement = 0;
function changeSeatRuleById(id,rulezone,ruleid,isincrement){
	console.log("changeSeatRuleById----",id,rulezone,ruleid);

	if(window.confirm("修改参数需要重新绑定人员")){
	
		resetChangeSeartIds();

		var $modal = $('#doc-modal-0');
		$modal.modal('toggle');

		isaddrule = false;
		changeRuleZone = rulezone || [];
		rulerecordid = id;
		oldruleid = ruleid;
		oldisincrement = isincrement;
		$("#ruleselect").val(ruleid);
		$("#isincrement").val(isincrement);
	}
}

var changeSeatIds = [];
function changeSeatRuleArea(id,rulezone,ruleid,isincrement){
	console.log("changeSeatRuleArea----",id,rulezone,ruleid);

	if(window.confirm("重选坐区,可以重新绑定规则或者直接保存座区信息")){

		resetChangeSeartIds();
		rulerecordid = id;
		oldruleid = ruleid;
		oldisincrement = isincrement;
		$("#isincrement").val(isincrement);
		if(rulezone && rulezone.length > 0){
			rulezone.forEach(function(item){
				// $("#" + item.seatid).removeClass('seled');
				$("#" + item.seatid).addClass('reseled');
				if(!$("#" + item.seatid).hasClass(item.ruleid)){
					$("#" + item.seatid).addClass(item.ruleid);
				}
				changeSeatIds.push(item.seatid);
			});
		}
	}
}
function outWord(){
	// console.log("outWord----",id,rulezone,ruleid);

	var data = {};
	data.action = "exp";
	// data.parameter = "canhui";
	data.meetingid = meetingid;
	// data.rule = seatmap;
	// data.ruleid = bindRuleId;
	// data.list = nameList;
	console.log(data)
	
	$.ajax({
		type: "POST",
		url: "rulenew.php",
		data: data,
		dataType:'json',
		success: function(data){
			console.log("outWord---",data);
			if(!data){return}
			if(data.status=="ok"){
				var url = "https://www.qgfan.com/ljl_adm/admin/"+data.url;
				window.open(url)
			}
		}
	});
}
function uploadWord(){
	
	var form=document.getElementById("seatform");
		var fd =new FormData(form);
		console.log("upload_file-----",fd);
        $.ajax({
             url: "rulenew.php",
             type: "POST",
             data: fd,
             processData: false,  // 告诉jQuery不要去处理发送的数据
             contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
             success: function(response,status,xhr){
                console.log(response);
				if(response){
					var json=$.parseJSON(response) || "";
					if(json && json.status == "ok"){
						//清空上一次数据
						var filediv = $(".fileDiv");
						for(var i = 0, len = filediv.length; i < len; i++){
							var item = filediv[i];
							if(item.id && item.id.split('-').length > 1){
								$(item).html(item.id.split('-')[1]);
							}
						}
						addnames = {};

						var data = json.data || [];
						for(var i = 0,len = data.length; i < len; i++){
							var item = data[i] || {};

							if(item.name){
								if(addnames[item.name]){
									alert(item.name + "已添加到" + item.seatid);
								}else{
									$("#"+item.seatid).html(item.name);
									addnames[item.name] = item.seatid;
								}
							}
						}

					}
				}

				document.getElementById('seatform').reset();
            }
        });
        return false;
}

function resetChangeSeartIds(empty){
	$(".seled").removeClass("seled");
	if(changeSeatIds.length > 0){
		changeSeatIds.forEach(function(item){
			$("#" + item).removeClass('reseled');
			if(!empty){
				$("#" + item).text('空座');
			}
		});
	}
	changeSeatIds = [];
}

function setRuleBtnclick(evt){
	if(changeSeatIds.length > 0){
		isaddrule = false;
	}else{
		isaddrule = true;
	}
}

var isaddrule = true;
var temp_ruletemplateid = 0;
var roomtemplateid = 0;
var addnames = {};

function changeBoxSelect(){
	if(!isDrop){return;}
	if(window.confirm("切换至框选操作,只能对空白座位进行操作")){

		isDrop = false;

		document.getElementById('rulepanel').style.display='block';
		document.getElementById('rulepaneltitle').innerHTML='关闭规则面板';
		// document.getElementById('btmh').classList.remove('btmh_nullpanel');
		// document.getElementById('btmh').classList.add('btmh');
		
		$("#kzdropdown").dropdown('close');
		removeDropEvent();
		removeContextMenu();
		bindBoxEvent();

		queryAllSeatStatus(1);
	}
}
function changeDropSelect(){
	if(isDrop){return;}
	if(window.confirm("切换至拖拽和右键操作,操作完之后需要重新保存数据")){

		isDrop = true;

		document.getElementById('rulepanel').style.display='none';
		document.getElementById('rulepaneltitle').innerHTML='打开规则面板';
		// document.getElementById('btmh').classList.remove('btmh');
		// document.getElementById('btmh').classList.add('btmh_nullpanel');
		
		$("#kzdropdown").dropdown('close');
		$(".fileDiv").removeClass('seled');

		clearRuleList(true);
		removeBoxEvent();
		bindDropEvent();
		bindContextMenu();


		$(".fileDiv").removeClass("R1 R2 R3 R4 R5 R6 R7 R8 R9 R10");
	};
}


function removeDropEvent(){
	$(".fileDiv").attr('draggable',false);
	$(".fileDiv").unbind("drop");
	$(".fileDiv").unbind("dragover");
	$(".fileDiv").unbind("dragstart");
}

function bindDropEvent(){
	$(".fileDiv").attr('draggable',true);
	$(".fileDiv").bind('drop',function(){
		// console.log(event)
		drop(event,this);
	});
	$(".fileDiv").bind('dragover',function(){
		// console.log(event)
		allowDrop(event,this);
	});
	$(".fileDiv").bind('dragstart',function(){
		// console.log(event)
		drag(event,this);
	});
}





function allowDrop(ev)
{
	ev.preventDefault();
}

var srcdiv = null;
function drag(ev,divdom)
{
	srcdiv=divdom;
	console.log(divdom)
	ev.dataTransfer.setData("text/html",divdom.innerHTML);
}

function drop(ev,divdom)
{
	ev.preventDefault();
	console.log("drop---",divdom)
	if(srcdiv != divdom){
		srcdiv.innerHTML = divdom.innerHTML;
		divdom.innerHTML = ev.dataTransfer.getData("text/html");
	}
}

// function allowDrop(ev)
// {
// 	ev.preventDefault();
// }

// function drag(ev)
// {
// 	ev.dataTransfer.setData("Text",ev.target.id);
// }

// function drop(ev)
// {
// 	ev.preventDefault();
// 	var data=ev.dataTransfer.getData("Text");
// 	ev.target.appendChild(document.getElementById(data));
// }

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
     if(r!=null)return  unescape(r[2]); return null;
}

function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
    }else{
        return null;
    }
}