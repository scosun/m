
// showRuleIds

(function(){

	var isSelect = false;
	var selDiv;
	var seatWidth = 40;
	var seatHeight = 40;
	var currseatno;
	var toutDrag = null;

	var seatMapsControl = function(obj){
		this.init.apply(this,arguments);
	}

	seatMapsControl.prototype = {
		constructor:seatMapsControl,

		selList:[],
		//选中ids
		ckids:[],
		//取消选中ids
		sckids:[],

		//点选规则ids
		clickRuleIds:[],

		init:function(){

		}
	}


	//获取点选数据
	seatMapsControl.prototype.getClickRulePoint = function(){
		return this.clickRuleIds;
	}

	//赋值点选数据
	seatMapsControl.prototype.setClickRulePoint = function(seatids){
		if(!(seatids instanceof Array)){
			seatids = JSON.parse(seatids);
		}
		this.clickRuleIds = seatids.map(function(item){
			return item.seatid;
		});

		this.clickRuleIds.forEach(function(item,index){
			$("#" + item).text(index+1);
		});
	}

	//清空点选数据
	seatMapsControl.prototype.clearClickRulePoint = function(){
		this.clickRuleIds.forEach(function(item,index){
			$("#" + item).text(item.split("-")[3]);
			$("#" + item).removeClass("seled");
		});
		this.clickRuleIds = [];
	}
	
	//点选设置排序规则
	seatMapsControl.prototype.bindClickRule = function(){
		this.removeContainerEvent();
		
		//点选规则，先清除原有全部已选座区
		var seleds = $(".seled");
		for(var i = 0,len = seleds.length; i < len; i++){
			var id = seleds[i].id;
			if(this.clickRuleIds.indexOf(id) == -1){
				$(seleds[i]).removeClass("seled");
			}
		}

		this.selList.bind("click",function(evt){
			var ele = evt.currentTarget;
			var sel = $(ele);
			if(this.isLocked(ele)){
				return;
			}

			var rclass = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10","R98","R99"];
			for(var i = 0,len = rclass.length; i < len; i++){
				if(sel.hasClass(rclass[i])){
					return;
				}
			}

			if (!sel.hasClass("seled")) {
				sel.addClass("seled");

				this.clickRuleIds.push(ele.id);

			} else {
				sel.removeClass("seled");
				
				var ii = this.clickRuleIds.indexOf(ele.id);
				if(ii > -1){
					this.clickRuleIds.splice(ii,1);
					sel.text(ele.id.split("-")[3]);
				}
			}

			this.clickRuleIds.forEach(function(item,index){
				$("#" + item).text(index+1);
			});

			console.log(this.clickRuleIds)
		}.bind(this));
	}
	
	seatMapsControl.prototype.isRow = function(seledgroup,d,h){
		for(var k in seledgroup){
			if(+k >= d && +k <= h){
				return k;
			}
		}
		return false;
	}

	seatMapsControl.prototype.unbindStaffDrap = function(){
		this.removeContainerEvent();
	}
		
	seatMapsControl.prototype.bindStaffDrap = function(){
		this.removeContainerEvent();

		var __x = 0;
		var __y = 0;
		var tout = null;
		$("#seatcontainer").bind("dragover",function(){
			//鼠标位置
			var _x = window.event.x
			var _y = window.event.y

			if(Math.abs(__x - _x) < 10 && Math.abs(__y - _y) < 10){
				return;
			}

			//滚动条高度
			var _stop = document.documentElement.scrollTop || document.body.scrollTop || 0;
			var _sleft = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
			var container = $("#seatcontainer");
			//减去容器初始化位移,因为鼠标是屏幕坐标
			var cx = container.offset().left;
			var cy = container.offset().top;

			__x = _x;
			__y = _y;
			clearTimeout(toutDrag);
			toutDrag = setTimeout(function(){
				this.matchStaffDrap(_x,_y,cx,cy,_sleft,_stop);
			}.bind(this),100);
		}.bind(this));
	}
		
	seatMapsControl.prototype.matchStaffDrap = function(_x,_y,cx,cy,_sleft,_stop){
		var sleft = _x - cx + _sleft;
		var stop = _y - cy + _stop;
		
		$(".R99").removeClass("R99");
		for (var i = 0,len = this.selList.length; i < len; i++) {
			var sel = $(this.selList[i]);
			var sl = parseInt(sel.css("left"));
			var st = parseInt(sel.css("top"));
			var text = sel.text().trim();
			var reg = /^\d*$/gi;
			if (sleft > sl && stop > st && sleft < (sl + 40) && stop < (st + 40)) {
				if(this.isLocked(sel)){
					continue;
				}
				if(!reg.test(text)){
					continue;
				}
				//在里面
				if (!sel.hasClass('R99')) {
					sel.addClass("R99");
					continue;
				}
			}
		}
	}
	
	seatMapsControl.prototype.bindMenu = function(seatno){
		var menuJson = [
			{
				name:"改名",
				id:"menu1",
				seatno:seatno,
				callback: function(seatno) {
					// console.log(this,seatno);
					currseatno = seatno;
					var name = $("#"+seatno).text();
					var regnum = /^\d*$/;
					// && !regnum.test(name)
					if(name != "空座"){
						// $("#username").val(name);
						var newname = window.prompt("请输入名字",name);
						if(newname && !regnum.test(newname)){
	
							var seats = $("#seatcontainerId .seatdiv");
							var ish = true;
							seats.each(function(){
								var oname = $(this).text();
								if(oname == newname){
									alert(newname+"已存在"+seatno);
									ish = false;
									return false;
								}
							});
							if(ish){
								$("#"+seatno).text(newname);
							}
						}else{
							alert("名字输入错误");
						}
					}else{
						// $("#username").val('');
					}
				}
			},
			{
				name:"空座",
				id:"menu2",
				seatno:seatno,
				callback: function(seatno) {
					var num = seatno.split("-")[3];
					$("#"+seatno).html(num ||'空座');
					// $("#"+seatno).removeClass("R1 R2 R3 R4 R5 R6 R7 R8 R9 R10");
				}
			}
		];
		
		if($("#"+seatno).length > 0){
			ContextMenu.bind("#"+seatno, menuJson);
		}
	}
	
	seatMapsControl.prototype.bindContextMenu = function(){
		this.removeContainerEvent();

		var filediv = $("#seatcontainerId .seatdiv");
		for(var i = 0, len = filediv.length; i < len; i++){
			var item = filediv[i];
			this.bindMenu(item.id);
		}
	}

	seatMapsControl.prototype.removeContextMenu = function(){
		this.selectSeats();
	
		var filediv = $("#seatcontainerId .seatdiv");
		for(var i = 0, len = filediv.length; i < len; i++){
			var item = filediv[i];
			item.oncontextmenu = null;
		}
	}

	seatMapsControl.prototype.bindOneSeats = function(){
		this.removeContainerEvent();
	
		this.selList.bind("click",function(evt){
			var ele = evt.currentTarget;
			var sel = $(ele);
			if(this.isLocked(ele)){
				return;
			}
			if (!sel.hasClass("seled")) {
				sel.addClass("seled");
			} else {
				sel.removeClass("seled");
			}
		}.bind(this));
	}

	seatMapsControl.prototype.bindLockSeats = function(){
		this.removeContainerEvent();
		
		this.selList.bind("click",function(evt){
			var sel = $(this);
			if (!sel.hasClass("locked")) {
				sel.removeClass("seled");
				sel.addClass("locked");
			} else {
				sel.removeClass("locked");
			}
		});
	}

	
	seatMapsControl.prototype.isLocked = function(el){
		return $(el).hasClass("locked");
	}

	seatMapsControl.prototype.selectSeats = function(){
		this.getAllSeatsNode();
		this.bindContainerEvent();
	}

	seatMapsControl.prototype.getAllSeatsNode = function(){
		this.selList = $("#seatcontainerId .seatdiv:not(.rownumseats)");
	}

	//拖拽选区
	seatMapsControl.prototype.dragSeats = function(callback){
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

		$("#dragcontainerId").css({"width":w+"px","height":h+"px","left":l+"px","top":t+"px"});
		// $("#"+selDivId).append(seled);

		this.removeContainerEvent();

		// seled.removeClass
		$("#dragcontainerId").html(dragseats);
		$("#dragcontainerId").show();

		$("#dragcontainerId").on({
			dblclick:function(e){
				// console.log("drag dblclick");
				this.dblclickDragSeats();

				if(callback){
					callback.call(this);
				}
			}.bind(this),
			mousedown:function(e){
				var el=$(e.currentTarget);
				var os = el.offset(); dx = e.pageX-os.left, dy = e.pageY-os.top;
				$(document).on('mousemove.drag', function(e){
					el.offset({top: e.pageY-dy, left: e.pageX-dx});
					this.dragContainerMove(e);
				}.bind(this));
			}.bind(this),
			mouseup: function(e){
				$(document).off('mousemove.drag');
			}
		});
	}

	seatMapsControl.prototype.dragContainerMove = function(e){
		//获取推拽框位置
		var container = $("#dragcontainerId");

		var cx = parseInt(container.css("left"));
		var cy = parseInt(container.css("top"));

		//获取拖拽层 所有座位位置
		var seledPos = [];
		var seledIds = [];
		var seled = container.find(".seled");
		// console.log("seled------",seled)
		for(var n = 0,len = seled.length; n < len; n++){
			var x = parseInt($(seled[n]).css("left"));
			var y = parseInt($(seled[n]).css("top"));

			//相加 为了正好匹配上 原始的座区图 位置
			seledPos.push([cx+x,cy+y]);
			seledIds.push(seled[n].id);
		}
		for (var i = 0,ilen = this.selList.length; i < ilen; i++) {
			var sel = $(this.selList[i]);
			var sl = parseInt(sel.css("left"));
			var st = parseInt(sel.css("top"));

			if(this.isLocked(sel)){
				continue;
			}
			
			//是否匹配上
			var sbl = false;

			var did = "";
			// 每一个座位都跟拖拽框做匹配
			for(var j = 0, jlen = seledPos.length; j < jlen; j++){
				var xy = seledPos[j];
				// serverSeatIds , 以前有逻辑，不能匹配上 有人的座区，现在改成 如果有人就做交换
				// 唯一不能匹配的 自己那个座位
				// if(serverSeatIds && serverSeatIds.length > 0){
				// 	if(serverSeatIds.indexOf(sel.attr("id")) == -1 && Math.abs(sl-xy[0]) >= 0 && Math.abs(sl-xy[0]) <= 20 && Math.abs(st-xy[1]) >= 0 && Math.abs(st-xy[1]) <= 20){
				// 		sbl = true;
				// 		did = seledIds[j];
				// 		break;
				// 	}else{
				// 		sbl = false;
				// 	}
				// }else{
				// 	if(seledIds.indexOf(sel.attr("id")) == -1 && Math.abs(sl-xy[0]) >= 0 && Math.abs(sl-xy[0]) <= 20 && Math.abs(st-xy[1]) >= 0 && Math.abs(st-xy[1]) <= 20){
				// 		sbl = true;
				// 		did = seledIds[j];
				// 		break;
				// 	}else{
				// 		sbl = false;
				// 	}
				// }

				if(seledIds.indexOf(sel.attr("id")) == -1 && Math.abs(sl-xy[0]) >= 0 && Math.abs(sl-xy[0]) <= 20 && Math.abs(st-xy[1]) >= 0 && Math.abs(st-xy[1]) <= 20){
					sbl = true;
					did = seledIds[j];
					break;
				}else{
					sbl = false;
				}
			}
			if(sbl){
				sel.addClass("dragbg");
				//匹配上的座区，就是历史那个座区的id，赋值给did
				sel.attr("did",did);
			}else{
				sel.removeClass("dragbg");
				sel.removeAttr("did");
			}
		}
	}

	seatMapsControl.prototype.dblclickDragSeats = function(){
		// dragbg 匹配上的座区
		var dragmatch = $(".dragbg");
		var ids = [];
		for(var i = 0,len = dragmatch.length; i < len; i++){
			ids.push({"nid":dragmatch[i].id,"did":$(dragmatch[i]).attr("did")});
		}

		// alert("匹配上" + ids.join(','));
		// console.log(ids)

		var reg = /^\d*$/gi;

		//did 是拖拽的， nid 是匹配的
		ids.forEach(function(item){
			var dname = $("#" + item.did).html();
			if(reg.test(dname)){
				//空座位不做交换, 如果选中要拖拽的是空座，拖拽匹配后不做处理
				reg.lastIndex = 0;
				return;
			}
			// 先，获取拖拽 匹配上座区的 名称 用来做交换备用
			var nname = $("#" + item.nid).html();

			// 拖拽的名字，赋值给座区，并且给绑定一个把原来座区的id，绑定到sid
			$("#" + item.nid).html(dname);
			$("#" + item.nid).attr("sid",item.did);
			
			if(!reg.test(nname)){
				// 有人名, 把当前座区的名字赋值给拖拽的座区
				// 然后把这个座区的id, 赋值给拖拽座区 sid
				$("#" + item.did).html(nname);
				$("#" + item.did).attr("sid",item.nid);
			}else{
				// 如果匹配是的空座，直接原来的座区 置空
				$("#" + item.did).html(item.did.split('-')[3]);
			}
			reg.lastIndex = 0;

			// if(serverSeatIds && serverSeatIds.length > 0){
			// 	serverSeatIds.splice(serverSeatIds.indexOf(item.did),1);
			// }
			// serverSeatIds.push(item.nid);
		});

		
		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");

		this.cancelDragSeats();
	}

	seatMapsControl.prototype.cancelDragSeats = function(){
		$("#dragcontainerId").html("");
		$("#dragcontainerId").hide();
	
		$("#dragcontainerId").unbind("mousedown");
		$("#dragcontainerId").unbind("mouseup");
		$("#dragcontainerId").unbind("dblclick");
		
		$(".dragbg").removeAttr("did");
		$(".dragbg").removeClass("dragbg");
		
	
		this.bindContainerEvent();
	}

	seatMapsControl.prototype.bindContainerEvent = function(){
		this.unbindOneSeats();
	
		var $events = $(".seatcontainer").data("events");
		if($events && $events["mousedown"]){
			
		}else{
			$(".seatcontainer").bind("mousedown",this.containerMouseDown.bind(this));
			$(".seatcontainer").bind("mousemove",this.containerMouseMove.bind(this));
			$(".seatcontainer").bind("mouseup",this.containerMouseUp.bind(this));
		}
	}

	seatMapsControl.prototype.removeContainerEvent = function(){
		$("#seatcontainer").unbind("mousedown");
		$("#seatcontainer").unbind("mousemove");
		$("#seatcontainer").unbind("mouseup");
		$("#seatcontainer").unbind("dblclick");
		$("#seatcontainer").unbind("click");
		
		if(this.selList && this.selList.length > 0){
			this.selList.unbind("click");
		}

		$("#seatcontainer").unbind("dragover");
	}

	seatMapsControl.prototype.unbindOneSeats = function(){
		if(this.selList && this.selList.length > 0){
			this.selList.unbind("click");
		}
	}

	seatMapsControl.prototype.containerMouseDown = function(){

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
		selDiv.className = "selectionDiv";

		var container = $(".seatcontainer");
		if(container.length == 0){
			return;
		}
		container[0].appendChild(selDiv);


		selDiv.style.left = "-100px";
		selDiv.style.top = "-100px";
	}

	seatMapsControl.prototype.containerMouseMove = function(evt){
		evt = window.event || arguments[0];
		var _x = null;
		var _y = null;
		if (isSelect) {
			if (selDiv.style.display == "none") {
				selDiv.style.display = "";
			}
	
			if(typeof showRuleIds != "undefined"){
				if(showRuleIds.length > 0){
					showRuleIds.forEach(function(item){
						$("#" + item.seatid).removeClass('seled');
					})
					showRuleIds.length = 0;
				}
			}
	
			//鼠标位置
			_x = (evt.x || evt.clientX);
			_y = (evt.y || evt.clientY);
	
			//滚动条高度
			var _stop = document.documentElement.scrollTop || document.body.scrollTop || 0;
			var _sleft = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
	
			var container = $(".seatcontainer");
			//减去容器初始化位移,因为鼠标是屏幕坐标
			var cx = container.offset().left;
			var cy = container.offset().top;
	
			//正向框选,反向框选
			var sleft = Math.min(_x, startX) - cx + _sleft;
			var stop = Math.min(_y, startY) - cy + _stop;
			var swidth = Math.abs(_x - startX);
			var sheight = Math.abs(_y - startY);

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
			for (var i = 0,len = this.selList.length; i < len; i++) {
				var sel = $(this.selList[i]);
				var sl = parseInt(sel.css("left"));
				var st = parseInt(sel.css("top"));
	
				var sid = this.selList[i].id;
				// if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
				if (sl > _l && st > _t && (sl+seatWidth/4) < _l + _w && (st+seatWidth/4) < _t + _h) {
					// console.log("------", selList[i], sid, selList[i].className)
	
					// if(selList[i].className.indexOf("reseled") == -1){
					if(!sel.hasClass("seled")){
						//首先判断当选座位没有绑定规则
						var rclass = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10","R98","R99"];
						var isr = false;
						for(var r = 0; r < rclass.length; r++){
							if(this.selList[i].className.indexOf(rclass[r]) != -1){
								isr = true;
								continue;
							}
						}
						if(isr){
							continue;
						}
					}else{
						
					}
	
					if(this.isLocked(sel)){
						continue;
					}
	
					//在里面
					// if (selList[i].className.indexOf("seled") == -1) {
					if (!sel.hasClass("seled")) {
						//当前没选中，并且不再取消选中数组，需要选中
						//为什么要加一个取消选中判断,是为了避免取消后反复选中
						if (this.sckids.indexOf(sid) == -1) {
							//保存选中id
							if(this.ckids.indexOf(sid) == -1){
								this.ckids.push(sid);
								sel.addClass("seled");
							}  
						}
					} else {
						//当前已选中
						if (this.ckids.indexOf(sid) == -1) {
							if(this.sckids.indexOf(sid) == -1){
								this.sckids.push(sid);
								sel.removeClass("seled");
								// sel.css("background","");
								sel.removeClass("reseled R1 R2 R3 R4 R5 R6 R7 R8 R9 R10 R98 R99");
							}
						}
					}
				} else {
				}
			}
		}
	}
	
	seatMapsControl.prototype.containerMouseUp = function(evt){
		isSelect = false;
		this.ckids = [];
		this.sckids = [];
		if (selDiv) {
			// document.body.removeChild(selDiv);
			$(".selectionDiv").remove();
		}
		_x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
	}



	function Drag(){
		this.dragWrap = $("#seatcontainer");
		this.init.apply(this,arguments);
	};
	Drag.prototype = {
		constructor:Drag,
		_dom : {},
		_x : 0,
		_y : 0,
		_top :0,
		_left: 0,
		move : false,
		down : false,
		init : function () {
			this.bindEvent();
		},
		bindEvent : function () {
			var t = this;
			$('#seatcontainer').bind('mousedown',function(e){
				e && e.preventDefault();
				if ( !t.move) {
					t.mouseDown(e);
				}
			});
			$('#seatcontainer').bind('mouseup',function(e){
				t.mouseUp(e);
			});

			$('#seatcontainer').bind('mousemove',function(e){
				if (t.down) {
					t.mouseMove(e);
				}
			});
		},
		mouseMove : function (e) {
			e && e.preventDefault();
			this.move = true;
			var x = this._x - e.clientX,
				y = this._y - e.clientY,
				dom = document.documentElement;
			dom.scrollLeft = (this._left + x);
			dom.scrollTop = (this._top + y);
		},
		mouseUp : function (e) {
			e && e.preventDefault();
			this.move = false;
			this.down = false;
			this.dragWrap.css('cursor','');
		},
		mouseDown : function (e) {
			this.move = false;
			this.down = true;
			this._x = e.clientX;
			this._y = e.clientY;
			this._top = document.documentElement.scrollTop;
			this._left = document.documentElement.scrollLeft;
			// console.log(this._top,this._left)
			this.dragWrap.css('cursor','move');
		}
	};


	// $(document).bind("keydown",keyDownMoveSeats);
	// window.onmousewheel = function(){
	// 	seatMapsEditor.prototype.autoScorll();
	// }
	window.SeatMapsControl = seatMapsControl;
	window.SeatMapsDrag = Drag;

	// seatMapsContorl.prototype.loadSessionData();
})();
