
// var seatContainerClass = "seatcontainer";
// var seatcontainerId = "seatcontainerId";
// var dragcontainerId = "dragcontainerId";
// var dargseatsId = "dargseatsId";
// var seatNodeClass = "seatdiv";
// var seatWidth = 40;
// var seatHeight = 40;
// var seledClass = "seled";
// var lockClass = "locked";
// var selDivClass = "selectionDiv";


var __longEvent = false;
var __keydownMoveUp = false;
var __keydownMoveDown = false;
var __keydownMoveLeft = false;
var __keydownMoveRight = false;
var __activeRight = false;
var __handDrag = null;

(function(){
	var seatWidth = 40;
	var seatHeight = 40;

	var keyDownSelectAll = true;

	//座区
	var selList = [];
	//选中ids
	var ckids = [];
	//取消选中ids
	var sckids = [];

	var showRuleIds = [];
	
	var startX,startY;

	//座区分组
	var group = 1;
	
	var serverUrl = "https://m.longjuli.com";
	// var serverUrl = "http://81.70.37.92";

	//id---拼接 含义 分类-组-行-列 s-11-1-4
	// (s-矩形,c-圆形,r-跑道,p-多边形,o-椭圆) - 分组 - 行 - 列

	// parseFloat($("#movecontainerId").css("left"));
	// parseFloat($("#movecontainerId").css("top"));

	var seatMapsEditor = function(obj){
		this.init.apply(this,arguments);
	}

	seatMapsEditor.prototype = {
		constructor:seatMapsEditor,
		currseatno:null,

		

		selDiv:null,
		isSelect:false,

		sTop:110,
		sLeft:50,
		boxCreate:false,

		delSeatsData:[],
		init:function(){

		}
	}

	seatMapsEditor.prototype.hideMeetTitle = function(){
		$("#meetingname").hide();
		$("#meetingaddress").hide();
		$("#meetingtime").hide();
		$("#meetingremark").hide();
	}

	seatMapsEditor.prototype.clearCompleteSeats = function(){
		sessionStorage.setItem("_seatscomplete","");
	}

	seatMapsEditor.prototype.loadSessionData = function(){
		var html = sessionStorage.getItem("_seatscomplete") || "";
		// console.log(html)
		if(html){
			html = html.replace('style="position: fixed;left: 25px;top: 15px;"','style="position: fixed;left: 25px;top: 80px;"')
		
			$("#seatcontainer").prop("outerHTML",html);

			$("#seatcontainer").css({"width":"3000px","height":"3000px"});
			// var time = new Date().getTime() + "-s";
			// var seats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
			// seats.each(function(){
			// 	var id = this.id;
			// 	var ids = id.split('-');
			// 	var gp = $(this).attr("group") || group;
			// 	if(ids.length == 2){
			// 		$(this).attr("id","s-" + gp + "-" + ids[0] + "-" + ids[1]);
			// 	}else{
			// 		$(this).attr("id",ids[0] + "-" + gp + "-" + ids[1] + "-" + ids[2]);
			// 	}
				
			// });

			//恢复之后计算一下groupid不能从1开始
			var seats = $("#seatcontainer .seatdiv:not(.rownumseats)");
			seats.each(function(){
				var id = this.id;
				var ids = id.split('-');
				var gp = +ids[1];
				if(gp >= group){
					group++;
				}
			});

			this.clearCompleteSeats();
			this.hideMeetTitle();
		}
	}

	seatMapsEditor.prototype.countMaxWidth = function(issave){
		this.hideMeetTitle();
		
		var seats = $("#seatcontainerId .seatdiv");
		var tops = [];
		var lefts = [];
		seats.each(function(item){
			let left = parseFloat($(this).css("left"));
			let top = parseFloat($(this).css("top"));
			tops.push(top);
			lefts.push(left);
		});
		lefts = lefts.sort(function(a,b){return a - b;});
		tops = tops.sort(function(a,b){return a - b;});

		// var width = lefts[lefts.length - 1] - lefts[0];
		// var height = tops[tops.length - 1] - tops[0];
		var width = lefts[lefts.length - 1] + 42;
		var height = tops[tops.length - 1];

		var minwidth = lefts[0];

		//可视区域 宽高，如果座区图比 可视区域还小，就用可视区域作为宽高
		var clientwidth = document.documentElement.clientWidth;
		var clientheight = document.documentElement.clientHeight - 290;
		if(clientwidth > (width + minwidth)){
			width = clientwidth;
		}
		if(height < clientheight){
			height = clientheight;

			$("#meetingaddress").css({"bottom":"","top":height+150+"px"});
			$("#meetingtime").css({"bottom":"","top":height+150+"px"});
			$("#meetingremark").css({"bottom":"","top":height+180+"px"});
		}
		
		// __maxWidth = width + 150;
		// if(issave){
		if(width == clientwidth){
			$("#seatcontainer").width(width);
		}else{
			$("#seatcontainer").width(width + minwidth);
		}
		// }
		// $("#seatcontainer").height(height + 250);
		$("#seatcontainer").height(height + 210);
	}


	seatMapsEditor.prototype.setSeatsScale = function(){
		var ele = $("#seatcontainer").children();
		$(ele[0]).hide();

		var seatcontainer = $("#seatcontainer");
		var width = seatcontainer.width();
		var height = seatcontainer.height();
		seatcontainer.css({"width":Math.ceil(width/3.8)+"px","height":Math.ceil(height/3.8)+"px"})

		var seatsele = $("#seatcontainerId").children();

		seatsele.each(function(){
			var left = Math.ceil(Math.ceil(parseInt($(this).css("left"))) / 3.8);
			var top = Math.ceil(Math.ceil(parseInt($(this).css("top"))) / 3.8);
			$(this).css({"width":"10px","height":"10px","left":left+"px","top":top+"px","border":"","background-color":"#ccc"});
			// if(!$(this).hasClass("rownumseats")){
				$(this).text("");
			// }
		});


		$("#meetingname").hide();
		$("#meetingaddress").hide();
		$("#meetingtime").hide();
		$("#meetingremark").hide();

		// $("#meetingname").css({"padding-top":"10px","font-size":"12px"});
		// $("#meetingaddress").css({"bottom":"30px","left":"10px","font-size":"12px"});
		// $("#meetingtime").css({"bottom":"30px","right":"10px","font-size":"12px"});
		// $("#meetingremark").css({"bottom":"10px","left":"10px","font-size":"12px"});
	}


	seatMapsEditor.prototype.isRow = function(seledgroup,d,h){
		for(var k in seledgroup){
			if(+k >= d && +k <= h){
				return k;
			}
		}
		return false;
	}
	seatMapsEditor.prototype.isCol = function(seledgroup,d,h){
		for(var k in seledgroup){
			if(+k >= d && +k <= h){
				return k;
			}
		}
		return false;
	}

	seatMapsEditor.prototype.isLocked = function(el){
		return $(el).hasClass('locked');
	}

	seatMapsEditor.prototype.unbindOneSeats = function(){
		selList.unbind("click");
	}

	seatMapsEditor.prototype.getAllSeatsNode = function(){
		// selList = $("#seatcontainerId .seatdiv").find(".seatdiv");
		selList = $("#seatcontainerId .seatdiv");
	}
	
	seatMapsEditor.prototype.containerMouseUp = function(evt){
		this.isSelect = false;
		// console.log("-------2----------",this.isSelect)
		ckids = [];
		sckids = [];
		if (this.selDiv) {
			// document.body.removeChild(this.selDiv);
			$(".selectionDiv").remove();
			
			// showSelDiv(selList);
		}
		// selList = null, 
		// _x = null, _y = null, 
		this.selDiv = null, startX = null, startY = null, evt = null;
	}

	seatMapsEditor.prototype.selectSeats = function(on){
		//框选
		this.getAllSeatsNode();
		this.bindContainerEvent();
	
		if($("#nav-selection").length > 0 && !on){
			setTimeout(function(){
				$('.toollist_li').removeClass("on");
				$("#nav-selection").addClass("on");
			},500);
		}
	}

	seatMapsEditor.prototype.removeContainerEvent = function(){
		$("#circlemousexyId").hide();
		$("#circlemouseline").attr({"x1":0,"y1":0,"x2":0,"y2":0});
		$("#seatcontainer").unbind("mousedown");
		$("#seatcontainer").unbind("mousemove");
		$("#seatcontainer").unbind("mouseup");
		$("#seatcontainer").unbind("dblclick");
		$("#seatcontainer").unbind("click");

		$("#seatcontainer").unbind("dragover");

		$("#movecontainerId").unbind("dblclick");
		$("#movecontainerId").unbind("mousedown");
		$("#movecontainerId").unbind("mouseup");

	}

	seatMapsEditor.prototype.unDragMoveSeats = function(){
		$("#movecontainerId").hide();
		$("#movecontainerId").html('');
		
		this.selectSeats(true);
	}

	seatMapsEditor.prototype.selectSeatAll = function(){
		var allseats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
		allseats.addClass("seled");
	}

	seatMapsEditor.prototype.unSelectSeatAll = function(){
		var allseats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
		allseats.removeClass("seled");
	}
	
	seatMapsEditor.prototype.selectSeatRow = function(){
		var seled = $("#seatcontainerId .seled");
		var seledgroup = {};
		for(var i = 0,len = seled.length; i < len; i++){
			// var sl = $(seled[i]).position().left;
			var st = $(seled[i]).position().top;

			var w = $(seled[i]).width();
			var id = seled[i].id;
			var kid = this.isRow(seledgroup,(st - w/2),(st + w/2));
			if(kid){
				seledgroup[kid].push(id);
			}else{
				seledgroup[st] = [];
				seledgroup[st].push(id);
			}
		}
		var allseats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
		for(var gk in seledgroup){
			allseats.each(function(){
				var st2 = parseInt($(this).css("top"));
				var st2w = $(this).width();
				var std = st2 - st2w/2;
				var sth = st2 + st2w/2;
				if(+gk >= std && +gk <= sth){
					$(this).addClass("seled");
				}
			});
		}
	}
	
	seatMapsEditor.prototype.selectSeatCol = function(){
		var seled = $("#seatcontainerId .seled");
		var seledgroup = {};
		for(var i = 0,len = seled.length; i < len; i++){
			var sl = $(seled[i]).position().left;

			var w = $(seled[i]).width();
			var id = seled[i].id;
			var kid = this.isRow(seledgroup,(sl - w/2),(sl + w/2));
			if(kid){
				seledgroup[kid].push(id);
			}else{
				seledgroup[sl] = [];
				seledgroup[sl].push(id);
			}
		}
		var allseats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
		for(var gk in seledgroup){
			allseats.each(function(){
				var st2 = parseInt($(this).css("left"));
				var st2w = $(this).width();
				var std = st2 - st2w/2;
				var sth = st2 + st2w/2;
				if(+gk >= std && +gk <= sth){
					$(this).addClass("seled");
				}
			});
		}
	}

	seatMapsEditor.prototype.selectSeatGroup = function(){
		var seled = $("#seatcontainerId .seled");
		var seledgroup = {};
		for(var i = 0,len = seled.length; i < len; i++){
			var id = $(seled[i]).attr("id");
			var pids = id.split('-');
			var p = pids[0] + "-" + pids[1];
			seledgroup[p] = 1;
		}

		for(var gk in seledgroup){
			var allseats = $("#seatcontainerId .seatdiv:not(.rownumseats)[id^='" + gk + "']");
			allseats.addClass("seled");
		}
	}

	seatMapsEditor.prototype.selectSameSeats = function(){
		var seled = $("#seatcontainerId .seled");
		var idtype = [];
		seled.each(function(){
			var id = this.id.split("-")[0];
			if(idtype.indexOf(id) == -1){
				idtype.push(id);
			}
		});
		idtype.forEach(function(item){
			var seled = $("#seatcontainerId .seatdiv:not(.rownumseats)[id^='" + item + "']");
			seled.addClass("seled");
		});
	}

	seatMapsEditor.prototype.mergeSeatsGrop = function(){
		var seled = $("#seatcontainerId .seled");

		var iss = true;
		//首先判断是不是 只选择了非矩形区域,只考虑矩形座区
		for(let i = 0,len = seled.length; i < len; i++){
			var id = $(seled[0]).attr("id");
			var ids = id.split("-");
			var tid = ids[0];
			if(tid != "s"){
				iss = false;
				alert("合并组只能选择矩形座区");
				break;
			}
		}
		if(!iss){
			return;
		}

		//得到矩形座区数据
		var seled = $("#seatcontainerId .seatdiv.seled:not(.rownumseats)[id^='s']");

		if(seled.length == 0){
			return;
		}

		var seledgroup = {};
		var seledrowv = [];
		for(var i = 0,len = seled.length; i < len; i++){
			var st = $(seled[i]).position().top;
			var h = $(seled[i]).height();
			var id = seled[i].id;
			var kid = this.isRow(seledgroup,(st - h/2),(st + h/2));
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
			
			var oae = this.oddAndEven(col.length);
			var seatsnum = [];
			seatsnum = oae.asc;

			col.forEach(function(oid,colid){
				// var oid = col[ck];
				$("#" + oid).html(seatsnum[colid]);
				$("#" + oid).attr("group",group);
				$("#" + oid).attr("title","s-"+group+"-"+(rowid+1)+"-"+(seatsnum[colid]));
				$("#" + oid).attr("id","s-"+group+"-"+(rowid+1)+"-"+(seatsnum[colid]));
			});
		}.bind(this));

		// seled.each(function(){
		// 	var ids = this.id.split("-");
		// 	$(this).attr("group",group);
		// 	$(this).attr("title",ids[0] + "-" + group + "-" + ids[2] + "-" + ids[3]);
		// 	$(this).attr("id",ids[0] + "-" + group + "-" + ids[2] + "-" + ids[3]);
		// });
		seled.removeClass("seled");
		group++;
		alert("合并完成");

		// var idtype = [];
		// seled.each(function(){
		// 	var id = this.id.split("-")[0];
		// 	if(idtype.indexOf(id) == -1){
		// 		idtype.push(id);
		// 	}
		// });
		// idtype.forEach(function(item){
		// 	var seled = $("#seatcontainerId .seatdiv:not(.rownumseats)[id^='" + item + "']");
		// 	seled.addClass("seled");
		// });
	}


	seatMapsEditor.prototype.hiddenScorll = function(){
		$("body").css("overflow","hidden");
	}

	seatMapsEditor.prototype.autoScorll = function(){
		$("body").css("overflow","auto");
	}

	seatMapsEditor.prototype.leftMoveSeats = function(px){
		px = px || 1;
		var seled = $("#seatcontainerId .seled");

		seled.each(function(){
			var left = parseFloat($(this).css("left"));
			$(this).css("left",left-px+"px");
		});
	}

	seatMapsEditor.prototype.rightMoveSeats = function(px){
		px = px || 1;
		var seled = $("#seatcontainerId .seled");

		seled.each(function(){
			var left = parseFloat($(this).css("left"));
			$(this).css("left",left+px+"px");
		});
	}

	seatMapsEditor.prototype.topMoveSeats = function(px){
		px = px || 1;
		var seled = $("#seatcontainerId .seled");

		seled.each(function(){
			var top = parseFloat($(this).css("top"));
			$(this).css("top",top-px+"px");
		});
	}

	seatMapsEditor.prototype.bottomMoveSeats = function(px){
		px = px || 1;
		var seled = $("#seatcontainerId .seled");

		seled.each(function(){
			var top = parseFloat($(this).css("top"));
			$(this).css("top",top+px+"px");
		});
	}
	
	
	seatMapsEditor.prototype.xAvgSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");

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
			var kid = this.isRow(seledgroup,(st - h/2),(st + h/2));
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

	seatMapsEditor.prototype.yAvgSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");

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
			var kid = this.isRow(seledgroup,(sl - w/2),(sl + w/2));
			if(kid){
				seledgroup[kid].push(id);
			}else{
				seledgroup[sl] = [];
				seledgroup[sl].push(id);
			}
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

	seatMapsEditor.prototype.xCenterSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");

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
			var kid = this.isRow(seledgroup,(st - h/2),(st + h/2));
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

	seatMapsEditor.prototype.yCenterSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");

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
			var kid = this.isRow(seledgroup,(sl - w/2),(sl + w/2));
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

	seatMapsEditor.prototype.leftSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");
		
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
			var kid = this.isRow(seledgroup,(st - h/2),(st + h/2));
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

	seatMapsEditor.prototype.rightSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");
		
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
			var kid = this.isRow(seledgroup,(st - h/2),(st + h/2));
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

	seatMapsEditor.prototype.topSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");
		
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
			var kid = this.isRow(seledgroup,(sl - w/2),(sl + w/2));
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
				// console.log(i)
				$("#" + _id).css("top", (t + 50*i) +"px");
			});
		}

	}

	seatMapsEditor.prototype.bottomSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");
		seled.removeClass("seled");
		
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
			var kid = this.isRow(seledgroup,(sl - w/2),(sl + w/2));
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

	seatMapsEditor.prototype.deleteSeats = function(){
		var seled = $("#seatcontainerId .seled");
		if(seled.length == 0){return;}

		seled.removeClass("seled");
		this.delSeatsData.push(seled);

		seled.remove();
		// seled.css("display","none");
	}
	
	seatMapsEditor.prototype.resetSeats = function(){
		if(__longEvent){
			return;
		}
		var pop = this.delSeatsData.pop();
		if(pop && pop.length > 0){
			$("#seatcontainerId").append(pop);

			//恢复座区,重新获取一次座区数据
			this.getAllSeatsNode();
		}
	}

	seatMapsEditor.prototype.revertSeats = function(){
		if(__longEvent){
			return;
		}
		var seled =  $("#seatcontainerId .seled");
		if(seled.length == 0){return;}
		seled.removeClass("seled");
		seled.each(function(){
			var id = this.id;
			$(this).removeClass("rownumseats");
			var num = id.split("-");
			$(this).html(num[3]);
		});
	}

	seatMapsEditor.prototype.setRowNum = function(){
		
		var seleds =  $("#seatcontainerId .seled");
		if(seleds.length == 0){return;}
		
		// (s-矩形,c-圆形,r-跑道,p-多边形,o-椭圆) - 分组 - 行 - 列

		var seatsgroup = {
			"s":[],
			"c":[],
			"r":[],
			"p":[],
			"o":[]
		};
		//先分类
		seleds.each(function(){
			var id = this.id;
			var t = id.split('-')[0];
			seatsgroup[t].push(id);
		});

		for(var sgk in seatsgroup){
			var seled = seatsgroup[sgk];
			if(seled.length > 0 && sgk == "s"){
				//再按left 分组
				var seledgroup = {};
				var seledrowv = [];
				for(var i = 0,len = seled.length; i < len; i++){
					var ele = $("#"+seled[i]);
					var sl = ele.position().left;
					// var st = $(seled[i]).position().top;

					var w = ele.width();

					
					// var kid = id.split('-')[0]+"-";
					var kid = this.isCol(seledgroup,(sl - w/2),(sl + w/2));
					if(kid){
						seledgroup[kid].push(ele);
					}else{
						seledgroup[sl] = [];
						seledgroup[sl].push(ele);
						seledrowv.push(sl);
					}
				}

				seledrowv.forEach(function(skey){
					var eles = seledgroup[skey] || [];
					//分组之后,按top排序
					eles.sort(function(a,b){
						var topa = parseFloat(a.css("top"));
						var topb = parseFloat(b.css("top"));
						return topa - topb;
					});

					eles.forEach(function(item,index){
						item.removeClass("seled");
						item.addClass("rownumseats");
						item.html((index+1) + "排");
					});
				});
			}else {
				//原型 按group 分组
				var seledgroup = {};
				var seledrowv = [];
				for(var i = 0,len = seled.length; i < len; i++){
					var id = seled[i];
					var ele = $("#"+seled[i]);
					var gid = id.split('-')[1];
					if(seledgroup[gid]){
						seledgroup[gid].push(ele);
					}else{
						seledgroup[gid] = [];
						seledgroup[gid].push(ele);
						seledrowv.push(gid);
					}
				}
				seledrowv.forEach(function(skey){
					var eles = seledgroup[skey] || [];
					//分组之后,按left排序
					eles.sort(function(a,b){
						var lefta = parseFloat(a.css("left"));
						var leftb = parseFloat(b.css("left"));
						return lefta - leftb;
					});

					eles.forEach(function(item,index){
						item.removeClass("seled");
						item.addClass("rownumseats");
						item.html((index+1) + "排");
					});
				});
			}
		}
	}

	seatMapsEditor.prototype.setOnlyRowNum = function(){
		
		var seleds =  $("#seatcontainerId .seled");
		if(seleds.length == 0){return;}
		
		// (s-矩形,c-圆形,r-跑道,p-多边形,o-椭圆) - 分组 - 行 - 列

		var seatsgroup = {
			"s":[],
			"c":[],
			"r":[],
			"p":[],
			"o":[]
		};
		//先分类
		seleds.each(function(){
			var id = this.id;
			var t = id.split('-')[0];
			seatsgroup[t].push(id);
		});

		for(var sgk in seatsgroup){
			var seled = seatsgroup[sgk];
			if(seled.length > 0 && sgk == "s"){
				//再按left 分组
				var seledgroup = {};
				var seledrowv = [];
				for(var i = 0,len = seled.length; i < len; i++){
					var ele = $("#"+seled[i]);
					var sl = ele.position().left;
					// var st = $(seled[i]).position().top;

					var w = ele.width();

					
					// var kid = id.split('-')[0]+"-";
					var kid = this.isCol(seledgroup,(sl - w/2),(sl + w/2));
					if(kid){
						seledgroup[kid].push(ele);
					}else{
						seledgroup[sl] = [];
						seledgroup[sl].push(ele);
						seledrowv.push(sl);
					}
				}


				var idrow = 0;
				function changerow(seledgroup,seledrowv){
					var eles = seledgroup[seledrowv[idrow]] || null;
					if(seledrowv.length > idrow){
						//分组之后,按top排序
						eles.sort(function(a,b){
							var topa = parseFloat(a.css("top"));
							var topb = parseFloat(b.css("top"));
							return topa - topb;
						});

						var idx = 0;
						function change(){
							var item = eles[idx] || null;
							if(eles.length > idx){
								item.removeClass("seled");
								// item.addClass("onlynum");
								changeSeatNum(item);
								idx++;
							}else{
								idx = 0;
								idrow++;
								changerow(seledgroup,seledrowv);
							}
						}

						function changeSeatNum(item){
							var ids = item.attr("id").split("-");
							var text = ids[2] + "-" + ids[3];
							var newno = window.prompt("请输入" + text + "排号");
							if(newno){
								item.text(newno);
								// item.removeClass("onlynum");
								item.addClass("rownumseats");
								setTimeout(function(){
									change();
								}.bind(this),50);
							}
						}
						change();
					}else{
						idrow = 0;
					}
				}
				changerow(seledgroup,seledrowv);
			}else {
				//原型 按group 分组
				var seledgroup = {};
				var seledrowv = [];
				for(var i = 0,len = seled.length; i < len; i++){
					var id = seled[i];
					var ele = $("#"+seled[i]);
					var gid = id.split('-')[1];
					if(seledgroup[gid]){
						seledgroup[gid].push(ele);
					}else{
						seledgroup[gid] = [];
						seledgroup[gid].push(ele);
						seledrowv.push(gid);
					}
				}
				// seledrowv.forEach(function(skey){
				// 	var eles = seledgroup[skey] || [];
				// 	//分组之后,按left排序
				// 	eles.sort(function(a,b){
				// 		var lefta = parseFloat(a.css("left"));
				// 		var leftb = parseFloat(b.css("left"));
				// 		return lefta - leftb;
				// 	});

				// 	eles.forEach(function(item,index){
				// 		item.removeClass("seled");
				// 		item.addClass("rownumseats");
				// 		item.html((index+1) + "排");
				// 	});
				// });

				
				var idrow = 0;
				function changerow(seledgroup,seledrowv){
					var eles = seledgroup[seledrowv[idrow]] || null;
					if(seledrowv.length > idrow){
						//分组之后,按top排序
						eles.sort(function(a,b){
							var lefta = parseFloat(a.css("left"));
							var leftb = parseFloat(b.css("left"));
							return lefta - leftb;
						});

						var idx = 0;
						function change(){
							var item = eles[idx] || null;
							if(eles.length > idx){
								item.removeClass("seled");
								// item.addClass("onlynum");
								changeSeatNum(item);
								idx++;
							}else{
								idx = 0;
								idrow++;
								changerow(seledgroup,seledrowv);
							}
						}

						function changeSeatNum(item){
							var ids = item.attr("id").split("-");
							var text = ids[2] + "-" + ids[3];
							var newno = window.prompt("请输入" + text + "排号");
							if(newno){
								item.text(newno);
								// item.removeClass("onlynum");
								item.addClass("rownumseats");
								setTimeout(function(){
									change();
								}.bind(this),50);
							}
						}
						change();
					}else{
						idrow = 0;
					}
				}
				changerow(seledgroup,seledrowv);
			}
		}
	}
	
	seatMapsEditor.prototype.copySeats = function(){
		this.iscopy = true;
		this.dragMoveSeats();
	}

	seatMapsEditor.prototype.dragMoveSeats = function(){
		if(__longEvent){
			return;
		}

		var seled = $("#seatcontainerId .seled");

		if(seled.length == 0){
			return;
		}

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
		$("#movecontainerId").css({"width":w+"px","height":h+"px","left":l+"px","top":t+"px"});
		$("#movecontainerId").html(moveseats);
		$("#movecontainerId").show();

		this.removeContainerEvent();

		$("#movecontainerId").on({
			dblclick:function(e){
				this.dblclickMoveSeats();
				this.selectSeats();
			}.bind(this),
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

	seatMapsEditor.prototype.dblclickMoveSeats = function(){

		$("#movecontainerId").hide();

		var eleft = parseFloat($("#movecontainerId").css("left"));
		var etop = parseFloat($("#movecontainerId").css("top"));

		var cleft = moveStartLeft - eleft;
		var ctop = moveStartTop-etop;
		var seled = $("#seatcontainerId .seled");
		
		var iscopy = this.iscopy;
		
		// console.log(group)
		seled.each(function(){
			var left = parseFloat($(this).css("left"));
			var top = parseFloat($(this).css("top"));
			if(iscopy){
				//复制
				var clone = $(this).clone();
				$(clone).css({"left":left - cleft + "px","top":top-ctop+"px"});
				$(clone).removeClass("seled");
				var id = this.id;
				var ids = id.split('-');
				$(clone).attr("group",group);
				$(clone).attr("title",ids[0] + "-" + group + "-" + ids[2] + "-" + ids[3]);
				$(clone).attr("id",ids[0] + "-" + group + "-" + ids[2] + "-" + ids[3]);
				$("#seatcontainerId").append(clone);
			}else{
				$(this).css({"left":left - cleft + "px","top":top-ctop+"px"});
			}
		});
		seled.removeClass("seled");

		$("#movecontainerId").html('');
		this.iscopy = false;
		group++;
	}

	seatMapsEditor.prototype.oddAndEven = function(n){
		//求偶奇数
		var str1="",str2="",n1=0,n2=0;
		var nums = {
			odd:[],
			even:[],
			desc:[],
			asc:[]
		};
		for(var i=n; i>=1; i--){
			if(i%2!=0){
				str1 = str1 + i + ","; //将奇数连到一个字符串中
			}else{
				str2 = str2 + i + ","; //将偶数连到一个字符串中
			}
			nums.desc.push(i);
		}
		nums.asc = JSON.parse(JSON.stringify(nums.desc)).reverse();
		nums.odd = str1.substr(0,str1.length-1).split(',');
		nums.even = str2.substr(0,str2.length-1).split(',');
		return nums;
	}

	seatMapsEditor.prototype.bindContextMenu = function(){
		this.removeContainerEvent();

		var filediv = $("#seatcontainerId").find(".seatdiv");
		for(var i = 0, len = filediv.length; i < len; i++){
			var item = filediv[i];
			this.bindMenu(item.id);
		}
	}

	seatMapsEditor.prototype.removeContextMenu = function(){
		this.selectSeats(true);

		var filediv = $("#seatcontainerId").find(".seatdiv");
		for(var i = 0, len = filediv.length; i < len; i++){
			var item = filediv[i];
			item.oncontextmenu = null;
		}
	}

	seatMapsEditor.prototype.bindMenu = function(seatno){
		var menuJson = [
			{
				name:"修改行列号",
				id:"menu0",
				seatno:seatno,
				callback: function(seatno) {
					var cid = $("[cid="+seatno+"]").attr("cid") || "";
					if(cid){
						seatno = $("[cid="+seatno+"]").attr("id");
					}
					this.currseatno = seatno;
	
					var ids = seatno.split("-");
	
					var newno = window.prompt("请输入编号X-Y");
					var newno2 = ids[0] + "-" + ids[1] + "-" + newno;
					var reg = /^\d+\-\d+$/g;
					if(newno){
						if(reg.test(newno)){
							if($("#"+newno).length == 0 && $("#"+newno2).length == 0){
								var id = newno.split("-");
								$("#"+seatno).attr("id",newno2);
								if(!cid){
									$("#"+newno2).attr("cid",seatno);
								}
								$("#"+newno2).attr("title",newno2);
								$("#"+newno2).text(id[1]);
	
								// console.log($("[cid=1-1]").length)
							}else{
								alert("编号已存在");
							}
						}else{
							alert("编号输入不合法");
						}
					}
				}.bind(this)
			},
			// {
			// 	name:"编排",
			// 	id:"menu4",
			// 	seatno:seatno,
			// 	callback: function(seatno) {
			// 		var cid = $("[cid="+seatno+"]").attr("cid") || "";
			// 		if(cid){
			// 			seatno = $("[cid="+seatno+"]").attr("id");
			// 		}
			// 		this.currseatno = seatno;
			// 		var newno = window.prompt("请输入排号");
			// 		if(newno){
			// 			$("#"+seatno).text(newno);
			// 			$("#"+seatno).addClass("rownumseats");
			// 		}
			// 	}.bind(this)
			// }
		];
		
		if($("#"+seatno).length > 0){
			ContextMenu.bind("#"+seatno, menuJson);
		}
	}
		
	seatMapsEditor.prototype.containerMouseDown = function(){

		if(showRuleIds.length > 0){
			showRuleIds.forEach(function(item){
				$("#" + item.seatid).removeClass('seled');
			})
			showRuleIds.length = 0;
		}
		
		var evt = window.event || arguments[0];
		//框选起点位置
		startX = (evt.x || evt.clientX);
		startY = (evt.y || evt.clientY);

		this.isSelect = true;
		// console.log("-------1----------",this.isSelect)
		this.selDiv = document.createElement("div");
		// this.selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
		this.selDiv.style.cssText = "position:absolute;width:0px;height:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1;filter:alpha(opacity:60);opacity:0.6;display:none;";
		this.selDiv.className = "selectionDiv";

		var container = $(".seatcontainer");
		if(container.length == 0){
			return;
		}
		container[0].appendChild(this.selDiv);


		this.selDiv.style.left = "-100px";
		this.selDiv.style.top = "-100px";
	}

	seatMapsEditor.prototype.containerMouseMove = function(evt){
		evt = window.event || arguments[0];
		var _x = null;
		var _y = null;
		if (this.isSelect) {
			if (this.selDiv.style.display == "none") {
				this.selDiv.style.display = "";
			}
			//鼠标位置
			_x = (evt.x || evt.clientX);
			_y = (evt.y || evt.clientY);

			//滚动条高度
			var _stop = document.documentElement.scrollTop || document.body.scrollTop || 0;
			var _sleft = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
			// _x = _x + _sleft;
			// _y = _y + _stop;

			var container = $(".seatcontainer");
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
			this.selDiv.style.left = sleft + "px";
			this.selDiv.style.top = stop + "px";

			this.selDiv.style.width = swidth + "px";
			this.selDiv.style.height = sheight + "px";

			if(this.boxCreate){
				var colnum = Math.floor(swidth/50);
				var rownum = Math.floor(sheight/50);
				this.creatSeats2(rownum,colnum,sleft,stop);
				return;
			}

			//框选宽度小于10px 矩形 就直接返回
			if(Math.abs(_x - startX) < 10 && Math.abs(_y - startY) < 10){
				return;
			}

			// ---------------- 关键算法 ---------------------  
			// var _l = this.selDiv.offsetLeft+_sleft, _t = this.selDiv.offsetTop+_stop;
			// var _w = this.selDiv.offsetWidth, _h = this.selDiv.offsetHeight;
			var _l = sleft - seatWidth/2, _t = stop - seatHeight/2;
			var _w = swidth + seatWidth/2, _h = sheight + seatHeight/2;
			for (var i = 0,len = selList.length; i < len; i++) {
				var sel = $(selList[i]);
				var sl = parseInt(sel.css("left"));
				var st = parseInt(sel.css("top"));

				var sid = selList[i].id;
				// if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
				if (sl > _l && st > _t && (sl+seatWidth/4) < _l + _w && (st+seatHeight/4) < _t + _h) {
					if(this.isLocked(sel)){
						continue;
					}

					//在里面
					// if (selList[i].className.indexOf("seled") == -1) {
					if (!sel.hasClass('seled')) {
						//当前没选中，并且不再取消选中数组，需要选中
						//为什么要加一个取消选中判断,是为了避免取消后反复选中
						if (sckids.indexOf(sid) == -1) {
							//保存选中id
							if(ckids.indexOf(sid) == -1){
								ckids.push(sid);
								sel.addClass('seled');
							}  
						}
					} else {
						//当前已选中
						if (ckids.indexOf(sid) == -1) {
							if(sckids.indexOf(sid) == -1){
								sckids.push(sid);
								sel.removeClass('seled');
							}
						}
					}
				} else {
				}
			}
		}else{
			
		}
	}

	seatMapsEditor.prototype.bindContainerEvent = function(){
		this.unbindOneSeats();
		this.removeContainerEvent();

		$("#seatcontainer").bind("mousedown",this.containerMouseDown.bind(this));
		$("#seatcontainer").bind("mousemove",this.containerMouseMove.bind(this));
		$("#seatcontainer").bind("mouseup",function(){
			this.containerMouseUp();
			if(this.boxCreate){
				var seats = $("#mousecontainerId .seatdiv");
				// var group = group;
				// seats.each(function(){
				// 	var id = this.id;
				// 	var ids = id.split('-');
				// 	$(this).attr(ids[0] + "-" + group + "-" + ids[2] + "-" + ids[3]);
				// });
				
				$("#seatcontainerId").append($("#mousecontainerId").html());
				$("#mousecontainerId").html('');

				group++;

				// countMaxWidth();
				this.clearCompleteSeats();
				this.selectSeats();

				if($("#nav-selection").length > 0){
					$('.toollist_li').removeClass("on");
					$("#nav-selection").addClass("on");
				}
			}
			this.boxCreate = false;
		}.bind(this));

	}

	seatMapsEditor.prototype.creatSeats = function(rownum,colnum,mleft,mtop,ism){
		// countMaxWidth(+rownum,+colnum);
		this.bulidSeatsContainer(rownum,colnum,mleft,mtop,ism);
	
		if(!ism){
			// countMaxWidth();
			this.clearCompleteSeats();
			this.selectSeats();
		}
	}

	seatMapsEditor.prototype.creatSeats2 = function(rownum,colnum,mleft,mtop){
		// countMaxWidth();
		this.appendSeatsContainer(rownum,colnum,mleft,mtop);
		this.getAllSeatsNode();
	}
		
	// $("div[id$=-1]")
	// 获取 id -1结尾的div
	seatMapsEditor.prototype.bulidSeatsContainer = function (rownum,colnum,mleft,mtop,ism){
		var seathtml = [];
		
		mleft = mleft || 0;
		mtop = mtop || 0;

		var stop = this.sTop;
		var sleft = this.sLeft;

		if(ism){
			stop = mtop;
			sleft = mleft;
		}

		for(var j = 1; j <= +rownum; j++){
			for(var i = 0; i < +colnum; i ++){
				// seathtml.push('<div class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="' + (j) + '-' + (i+1) + '-' + new Date().getTime() +'-' + 's" >' + (i+1) + '</div>');
				// id 规则 分类-组-行-列
				seathtml.push('<div class="seatdiv" group='+group+' style="top:' + stop + 'px; left:'+ sleft + 'px;" id="s-' + group + '-' + (j) + '-' + (i+1) + '"  title="s-' + group + '-' + (j) + '-' + (i+1) + '" >' + (i+1) + '</div>');
				sleft = sleft + 50;
			}
			sleft = this.sLeft;
			if(ism){
				sleft = mleft;
			}
			stop = stop + 50;
		}
		this.sTop = stop;
		// console.log(sleft,stop)

		group++;
		$("#seatcontainerId").append(seathtml.join(''));
	}

	seatMapsEditor.prototype.appendSeatsContainer = function(rownum,colnum,mleft,mtop){
		var seathtml = [];
		
		var stop = mtop;
		var sleft = mleft;
	
		for(var j = 1; j <= +rownum; j++){
			for(var i = 0; i < +colnum; i ++){
				// seathtml.push('<div class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="' + (j) + '-' + (i+1) + '-' + new Date().getTime() +'-' + 's" >' + (i+1) + '</div>');
				// id 规则 分类-组-行-列
				seathtml.push('<div class="seatdiv" group='+group+' style="top:' + stop + 'px; left:'+ sleft + 'px;" id="s-' + group + '-' + (j) + '-' + (i+1) + '" title="s-' + group + '-' + (j) + '-' + (i+1) + '" >' + (i+1) + '</div>');
				sleft = sleft + 50;
			}
			sleft = mleft;
			stop = stop + 50;
		}
		$("#mousecontainerId").html(seathtml.join(''));
	}
	
	seatMapsEditor.prototype.bindOneSeats = function(){
		if(__longEvent){
			return;
		}
		if(!selList.unbind){
			return;
		}

		this.removeContainerEvent();
		
		selList.unbind("click");
		selList.bind("click",function(evt){
			var ele = evt.currentTarget;
			var sel = $(ele);
			if(this.isLocked(ele)){
				return;
			}
			if (!sel.hasClass('seled')) {
				sel.addClass('seled');
			} else {
				sel.removeClass('seled');
			}
		}.bind(this));
	}

	seatMapsEditor.prototype.mouseCreateMapAxis = function(mt,seatnum,select_ruleid,edges){
		this.removeContainerEvent();
		$("#circlemousexyId").show();

		var hasPoint = false;
		$("#seatcontainer").bind({
			dblclick:function(e){
				this.removeContainerEvent();
				
				var sl = $("#seatcontainer").offset().left - 18;
				var st = $("#seatcontainer").offset().top - 18;

				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				var x = event.x - sl + scrollX - 3;
				var y = event.y - st + scrollY - 3;
				var x1 = parseInt($("#circlemousexyId").css("left")) + 3;
				var y1 = parseInt($("#circlemousexyId").css("top")) + 3;
				var point = {x1:x1,y1:y1,x:x,y:y};
				point.seatnum = seatnum;
				point.select_ruleid = select_ruleid;
				point.edges = edges;
				if(mt=="oval"){
					window.sessionStorage.setItem("__ovalaxisxy",JSON.stringify(point));
					window.__createOval();
				}else if(mt=="polygon"){
					window.sessionStorage.setItem("__polygonaxisxy",JSON.stringify(point));
					window.__createPolygon();
				}
				// callback.call(x1,y1,x,y);
				// console.log(x1,y1,x,y)
			}.bind(this),
			click:function(e){
				if(!hasPoint){
					hasPoint = true;
				}
			},
			mousemove:function(e){
				var sl = $("#seatcontainer").offset().left - 18;
				var st = $("#seatcontainer").offset().top - 18;

				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				var x = event.x - sl + scrollX - 3;
				var y = event.y - st + scrollY - 3;
				if(!hasPoint){
					$("#circlemousexyId").css({"top":y+"px","left":x+"px"});
				}else{
					var x1 = parseInt($("#circlemousexyId").css("left")) + 3;
					var y1 = parseInt($("#circlemousexyId").css("top")) + 3;
					$("#circlemouseline").attr({"x1":x1,"y1":y1,"x2":x,"y2":y});

					// var angle = Math.atan2((y1-y), (x1-x)) //弧度  0.6435011087932844
					// var theta = Math.abs(angle*(180/Math.PI));

					// var r1 = Math.sqrt(Math.pow(x-x1,2) + Math.pow(y-y1,2));
					// if(mt == 1){
					// 	this.createCircleSeatMap(x1 - 20,y1 - 18,r1,seatnum,ruleid,1);
					// }else{
					// 	this.createRunSeatMap(x1 - 20,y1 - 18,r1,seatnum,centernum,ruleid,1);
					// }
					
				}
			}.bind(this)
		});
	}

	seatMapsEditor.prototype.mouseCreateSeatMap = function(mt,seatnum,centernum,ruleid){
		this.removeContainerEvent();
		$("#circlemousexyId").show();

		var hasCircle = false;
		$("#seatcontainer").bind({
			dblclick:function(e){
				this.removeContainerEvent();
				
				var ids = [];
				var ruleid = 1;
				var seled = $("#mousecontainerId .seatdiv:not(.rownumseats)");
				seled.each(function(){
					ids.push(this.id);
				});
				ruleid = ids[0].split('-')[2];

				$("#seatcontainerId").append($("#mousecontainerId").html());
				$("#mousecontainerId").html('');

				if(mt == 1){
					this.autoCircleCode(ruleid,ids);
				}else{
					this.autoRunCode(ruleid,ids);
				}
				
				group++;

				// countMaxWidth();
				// clearCompleteSeats();

				this.selectSeats();
			}.bind(this),
			click:function(e){
				if(!hasCircle){
					hasCircle = true;
				}
			},
			mousemove:function(e){
				var sl = $("#seatcontainer").offset().left - 18;
				var st = $("#seatcontainer").offset().top - 18;

				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				var x = event.x - sl + scrollX - 3;
				var y = event.y - st + scrollY - 3;
				if(!hasCircle){
					$("#circlemousexyId").css({"top":y+"px","left":x+"px"});
				}else{
					var x1 = parseInt($("#circlemousexyId").css("left")) + 3;
					var y1 = parseInt($("#circlemousexyId").css("top")) + 3;
					$("#circlemouseline").attr({"x1":x1,"y1":y1,"x2":x,"y2":y});

					// var angle = Math.atan2((y1-y), (x1-x)) //弧度  0.6435011087932844
					// var theta = Math.abs(angle*(180/Math.PI));

					var r1 = Math.sqrt(Math.pow(x-x1,2) + Math.pow(y-y1,2));

					// $("#seatcontainerId").html('');
					if(mt == 1){
						this.createCircleSeatMap(x1 - 20,y1 - 18,r1,seatnum,ruleid,1);
					}else{
						this.createRunSeatMap(x1 - 20,y1 - 18,r1,seatnum,centernum,ruleid,1);
					}
					
				}
			}.bind(this)
		});
	}

	seatMapsEditor.prototype.creatMinCircleSeatMap = function(ccx,ccy,r1,seatnum,ruleid,ism){
		//长半径,//高半径, 两个半径一样就是圆形
		// var r1 = +$("#r1").val() || 400;
		if(ism){
			r1 = r1 + 30;
		}

		//每个座位的宽高,用来计算位置偏移
		var seatw = 40;
		var seath = 40;
		var seatnum = 4;
		
		var seathtml = [];

		var ids = [];
		var row = ruleid;

		for (var i = 0; i < seatnum; i++) {
			var sleft = ccx;
			var stop = ccy;
			if(i == 0){
				sleft = ccx - 20;
				stop = ccy - 61;
			}else if(i == 1){
				sleft = ccx + 21;
				stop = ccy - 20;
			}else if(i == 2){
				sleft = ccx - 20;
				stop = ccy + 21;
			}else if(i == 3){
				sleft = ccx - 61;
				stop = ccy - 20;
			}
			var j = 1;
			// row 采用的编号规则id
			var time = new Date().getTime();
			seathtml.push('<div class="seatdiv" group='+group+' style="top:' + stop + 'px; left:'+ sleft + 'px;" id="s-' + group + '-' + (j) + '-' + (i+1) + '" title="s-' + group + '-' + (j) + '-' + (i+1) + '" >' + (i+1) + '</div>');
			
			//用来编号
			ids.push("c-" + time + '-' + (j) + '-' + (i+1));
		}
		if(!ism){
			$("#seatcontainerId").append(seathtml.join(''));
			group++;
			this.autoCircleCode(ruleid,ids);
		}else{
			$("#mousecontainerId").html(seathtml.join(''));
		}
	}

	seatMapsEditor.prototype.createCircleSeatMap = function(ccx,ccy,r1,seatnum,ruleid,ism){
		
		if(r1 > 20){
			this.bulidCircleSeatsContainer(ccx,ccy,r1,seatnum,ruleid,ism);
		}else{
			this.creatMinCircleSeatMap(ccx,ccy,r1,seatnum,ruleid,ism);
		}

		// this.bulidLayersCircleSeatsContainer(ccx,ccy,r1,seatnum,ruleid,ism,3);
		
		if(!ism){
			// countMaxWidth();
			// clearCompleteSeats();
			this.selectSeats();
		}
	}

	seatMapsEditor.prototype.bulidLayersCircleSeatsContainer = function(ccx,ccy,r1,seatnum,ruleid,ism,layers){
		//长半径,//高半径, 两个半径一样就是圆形
		// var r1 = +$("#r1").val() || 400;
		if(ism){
			r1 = r1 + 30;
		}

		//每个座位的宽高,用来计算位置偏移
		var seatw = 40;
		var seath = 40;

		//开始角度,默认3点方向,为0度
		var startage = 270;

		var angleSpace = 360/seatnum;

		// __circleRow = __circleRow - 0 + 1;
		var seathtml = [];
		
		// console.log(ccx,ccy)
		// $("#seatcontainerId").append("<div style='position:absolute;width:1px;height:1px;background:red;left:"+(ccx)+"px;top:"+(ccy)+"px;'></div>");

		
		var ids = [];
		var row = ruleid;
		for(var l = 0; l < layers; l++){
			var time = new Date().getTime() + l * 1000;
			for (var i = 0; i < seatnum; i++) {
				var sang = i * angleSpace + startage;
				var x = ccx + (r1 + (l*50)) * Math.cos((sang)/180 * Math.PI) - seatw/2;
				var y = ccy + (r1 + (l*50)) * Math.sin((sang)/180 * Math.PI) - seath/2;

				var ang = i * angleSpace - 270;
				if(ang == 0 || ang >= 180){
					ang = ang + 90;
				}else{
					ang = ang - 90;
				}
				// seathtml.push('<div r="' + r1 + '" circle="'+(ccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (__circleRow) + '-' + (i+1) + '-c">' + (i+1) + '辛海涛' + '</div>');
				// seathtml.push('<div r="' + r1 + '" circle="'+(ccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (row) + '-' + (i+1) + '-' + new Date().getTime() + '-c" >' + (i+1) + '</div>');
				// row 采用的编号规则id
				seathtml.push('<div ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="c-' + time + '-' + (row) + '-' + (i+1) + '" >' + (i+1) + '</div>');
				
				//用来编号
				ids.push("c-" + time + '-' + (row) + '-' + (i+1));
			}
		}

		if(!ism){
			$("#seatcontainerId").append(seathtml.join(''));
			group++;
			this.autoCircleCode(ruleid,ids);
		}else{
			$("#mousecontainerId").html(seathtml.join(''));
		}
		
	}

	seatMapsEditor.prototype.bulidCircleSeatsContainer = function(ccx,ccy,r1,seatnum,ruleid,ism){
		//长半径,//高半径, 两个半径一样就是圆形
		// var r1 = +$("#r1").val() || 400;
		if(ism){
			r1 = r1 + 30;
		}

		//每个座位的宽高,用来计算位置偏移
		var seatw = 40;
		var seath = 40;

		//开始角度,默认3点方向,为0度
		var startage = 270;

		var angleSpace = 360/seatnum;

		// __circleRow = __circleRow - 0 + 1;
		var seathtml = [];
		
		// console.log(ccx,ccy)
		// $("#seatcontainerId").append("<div style='position:absolute;width:1px;height:1px;background:red;left:"+(ccx)+"px;top:"+(ccy)+"px;'></div>");

		
		var ids = [];
		var row = ruleid;
		for (var i = 0; i < seatnum; i++) {
			var sang = i * angleSpace + startage;
			var x = ccx + (r1) * Math.cos((sang)/180 * Math.PI) - seatw/2;
			var y = ccy + (r1) * Math.sin((sang)/180 * Math.PI) - seath/2;

			var ang = i * angleSpace - 270;
			if(ang == 0 || ang >= 180){
				ang = ang + 90;
			}else{
				ang = ang - 90;
			}
			// seathtml.push('<div r="' + r1 + '" circle="'+(ccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (__circleRow) + '-' + (i+1) + '-c">' + (i+1) + '辛海涛' + '</div>');
			// seathtml.push('<div r="' + r1 + '" circle="'+(ccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (row) + '-' + (i+1) + '-' + new Date().getTime() + '-c" >' + (i+1) + '</div>');
			// row 采用的编号规则id
			var time = new Date().getTime();
			seathtml.push('<div ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="c-' + time + '-' + (row) + '-' + (i+1) + '" >' + (i+1) + '</div>');
			
			//用来编号
			ids.push("c-" + time + '-' + (row) + '-' + (i+1));
		}
		if(!ism){
			$("#seatcontainerId").append(seathtml.join(''));
			group++;
			this.autoCircleCode(ruleid,ids);
		}else{
			$("#mousecontainerId").html(seathtml.join(''));
		}
		
	}
		
	seatMapsEditor.prototype.autoCircleCode = function(ruleid,seatids){
		var rowid = 0;
		var seled = $("#seatcontainerId .seatdiv:not(.rownumseats)[id^='c']");
		
		/**/
		//这一段是给计算圆形上下两排排号
		var oldids = [];
		seled.each(function(){
			if(seatids.indexOf(this.id) == -1){
				var max = this.id.split('-')[2];
				oldids.push(max);
			}
		});
		oldids = oldids.sort(function(a,b){
			return b - a;
		});
		rowid = +oldids[0] || 0;
		

		//获取到这一组座位所有的id
		// var seatids = seledgroup[ik];
		//现在要分成上下两个部分
		var up = [];
		var down = [];
		seatids.forEach(function(id){
			var ang = +$("#" + id).attr("ang");
			// console.log(ang)
			if(ang > 360 && ang < 540){
				down.push(id);
			}else{
				up.push(id);
			}
		});
		// console.log(up,down,seatids)

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
		
		var oae = this.oddAndEven(up.length);
		var seatsnum = [];
		if(+ruleid == 1){
			seatsnum = oae.odd.concat(oae.even.reverse());
		}else if(+ruleid == 2){
			seatsnum = oae.even.concat(oae.odd.reverse());
		}else if(ruleid == 3){
			//从左到右
			seatsnum = oae.asc;
		}else if(ruleid == 4){
			//从右到左
			seatsnum = oae.desc;
		}
		up.forEach(function(oid,colid){
			// var oid = col[ck];
			$("#" + oid).html(seatsnum[colid]);
			// $("#" + oid).css("background","#ff0000");
			//id="c-' + group + '-' + (row) + '-' + (i+1) + '"
			// $("#" + oid).attr("id",(rowid+1)+"-"+(seatsnum[colid])+"-0-c");
			$("#" + oid).attr("group",group);
			$("#" + oid).attr("title","c-" + group + "-" + (rowid+1) + "-" + (seatsnum[colid]));
			$("#" + oid).attr("id","c-" + group + "-" + (rowid+1) + "-" + (seatsnum[colid]));
		}.bind(this));

		var oae = this.oddAndEven(down.length);
		var seatsnum = [];
		if(+ruleid == 1){
			seatsnum = oae.odd.concat(oae.even.reverse());
		}else if(+ruleid == 2){
			seatsnum = oae.even.concat(oae.odd.reverse());
		}else if(ruleid == 3){
			//从左到右
			seatsnum = oae.asc;
		}else if(ruleid == 4){
			//从右到左
			seatsnum = oae.desc;
		}
		down.forEach(function(oid,colid){
			// var oid = col[ck];
			$("#" + oid).html(seatsnum[colid]);
			// $("#" + oid).attr("id",(rowid+2)+"-"+(seatsnum[colid])+"-0-c");
			$("#" + oid).attr("group",group);
			$("#" + oid).attr("title","c-" + group + "-" + (rowid+2) + "-" + (seatsnum[colid]));
			$("#" + oid).attr("id","c-" + group + "-" + (rowid+2) + "-" + (seatsnum[colid]));
		}.bind(this));
	}

	// var __runRow = 0;
	seatMapsEditor.prototype.createRunSeatMap = function(ccx,ccy,r1,seatnum,centernum,ruleid,ism){

		// this.bulidRunSeatsContainer(ccx,ccy,r1,seatnum,centernum,ruleid,ism);
		if(r1 > 40){
			this.bulidRunSeatsContainer(ccx,ccy,r1,seatnum,centernum,ruleid,ism);
		}else{
			this.creatMinRunSeatMap(ccx,ccy,r1,seatnum,centernum,ruleid,ism);
		}

		if(!ism){
			// countMaxWidth();
			// clearCompleteSeats();
			this.selectSeats();
		}
	}

	seatMapsEditor.prototype.creatMinRunSeatMap = function(ccx,ccy,r1,seatnum,ruleid,ism){
		//长半径,//高半径, 两个半径一样就是圆形
		// var r1 = +$("#r1").val() || 400;
		if(ism){
			r1 = r1 + 30;
		}

		//每个座位的宽高,用来计算位置偏移
		var seatw = 40;
		var seath = 40;
		var seatnum = 6;
		
		var seathtml = [];

		var ids = [];
		var row = ruleid;

		for (var i = 0; i < seatnum; i++) {
			var sleft = ccx;
			var stop = ccy;
			if(i == 0){
				sleft = ccx - 41;
				stop = ccy - 61;
			}else if(i == 1){
				sleft = ccx;
				stop = ccy - 61;
			}else if(i == 2){
				sleft = ccx + 41;
				stop = ccy - 20;
			}else if(i == 3){
				sleft = ccx;
				stop = ccy + 21;
			}else if(i == 4){
				sleft = ccx - 41;
				stop = ccy + 21;
			}else if(i == 5){
				sleft = ccx - 82;
				stop = ccy - 20;
			}
			var j = 1;
			// row 采用的编号规则id
			var time = new Date().getTime();
			seathtml.push('<div class="seatdiv" group='+group+' style="top:' + stop + 'px; left:'+ sleft + 'px;" id="s-' + group + '-' + (j) + '-' + (i+1) + '" title="s-' + group + '-' + (j) + '-' + (i+1) + '" >' + (i+1) + '</div>');
			
			//用来编号
			ids.push("c-" + time + '-' + (j) + '-' + (i+1));
		}
		if(!ism){
			$("#seatcontainerId").append(seathtml.join(''));
			group++;
			this.autoRunCode(ruleid,ids);
		}else{
			$("#mousecontainerId").html(seathtml.join(''));
		}
	}
	
	seatMapsEditor.prototype.bulidRunSeatsContainer = function(ccx,ccy,r1,seatnum,centernum,ruleid,ism){
		//长半径,//高半径, 两个半径一样就是圆形
		// var r1 = +$("#r1").val() || 400;
		centernum = Math.ceil(centernum/2);
		
		// if(ism){
			ccx = ccx - ((centernum-1)*50+20)/2;
		// }

		//每个座位的宽高,用来计算位置偏移
		var seatw = 40;
		var seath = 40;
		
		// __runRow = __runRow  - 0 + 1;

		var seathtml = [];
		
		//先画跑道上下座位

		var sleft = Math.ceil(ccx - 20);
		var stop = Math.ceil(ccy - r1 - 20);

		var ids = [];
		var row = ruleid;

		var padding = 10;
		// console.log(r1,centernum*50/2);
		var r0 = centernum*50/2;
		if(r1 > r0){
			padding = padding + (Math.ceil(r1 - r0) / (centernum/2));
			padding = Math.ceil(padding);

			stop = stop + Math.ceil(padding/20);
		}
		// console.log(padding)
		for(var aa = 1; aa <= 2; aa++){
			var ang = 270 + ((aa-1)*180);
			for(var bb = 0; bb < +centernum; bb++){
				// seathtml.push('<div r="' + r1 + '" ang="' + ang + '" class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="' + (__runRow) + '-' + (bb+1+(aa-1)*centernum) + '-c">' + (bb+1+(aa-1)*centernum) + '</div>');
				// seathtml.push('<div r="' + r1 + '" ang="' + ang + '" class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="' + (row) + '-' + (bb+1+(aa-1)*centernum) + '-' + new Date().getTime() + '-r">' + (bb+1+(aa-1)*centernum) + '</div>');
				var time = new Date().getTime();
				// seathtml.push('<div ang="' + ang + '" class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="' + (row) + '-' + (bb+1+(aa-1)*centernum) + '-' + time + '-r">' + (bb+1+(aa-1)*centernum) + '</div>');
				seathtml.push('<div ang="' + ang + '" class="seatdiv" style="top:' + stop + 'px; left:'+ sleft + 'px;" id="r-' + time + '-' + (row) + '-' + (bb+1+(aa-1)*centernum) + '">' + (bb+1+(aa-1)*centernum) + '</div>');
				
				// stop = stop + 50;
				sleft = sleft + 40 + padding;

				//用来编号
				ids.push("r-" + time + '-' + (row) + '-' + (bb+1+(aa-1)*centernum));
			}
			sleft = ccx - 20;
			stop = stop + r1*2;
		}

		// $("#seatcontainerId").append("<div style='position:absolute;width:1px;height:1px;background:red;left:"+(ccx)+"px;top:"+(ccy)+"px;'></div>");

		var rightseats = Math.ceil(seatnum/2) + 1;
		var rightccx = ccx + (centernum - 1)*(40+padding);
		//每个座位所占的角度,按平均算
		var angleSpace = 180/rightseats;
		//开始角度,3点方向,为0度,270就是12点
		var startage = 270;
		for (var i = 1; i < rightseats; i++) {
			var sang = i * angleSpace + startage;
			var x = rightccx + (r1) * Math.cos((sang)/180 * Math.PI) - seatw/2;
			var y = ccy + (r1) * Math.sin((sang)/180 * Math.PI) - seath/2;

			var ang = i * angleSpace - 270;
			if(ang == 0 || ang >= 180){
				ang = ang + 90;
			}else{
				ang = ang - 90;
			}
			// seathtml.push('<div r="' + r1 + '" circle="'+(rightccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (__runRow) + '-' + (i) + '-r">' + (i) + '辛海涛' + '</div>');
			
			// seathtml.push('<div r="' + r1 + '" circle="'+(rightccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (row) + '-' + (i) + '-' + new Date().getTime() + '_r-r">' + (i) + '</div>');
			var time = new Date().getTime() + "_r";
			seathtml.push('<div ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="r-' + time + '-' + (row) + '-' + (i) + '" >' + (i) + '</div>');
			
			//用来编号
			ids.push("r-" + time + '-' + (row) + '-' + (i));
		}
		var leftseats = Math.ceil(seatnum/2) + 1;
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
			// seathtml.push('<div r="' + r1 + '" circle="'+(rightccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (__runRow) + '-' + (n) + '-l">' + (n) + '辛海涛' + '</div>');
			// seathtml.push('<div r="' + r1 + '" circle="'+(rightccx+"-"+ccy)+'" ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (row) + '-' + (n) + '-' + new Date().getTime() + '_l-r">' + (n) + '</div>');
			// seathtml.push('<div ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="' + (row) + '-' + (n) + '-' + new Date().getTime() + '_l-r">' + (n) + '</div>');
			var time = new Date().getTime() + "_l";
			seathtml.push('<div ang="'+sang+'" class="seatdiv" style="transform: rotate('+ang+'deg);transform-origin:50% 50%;'+'top:' + y + 'px; left:'+ x + 'px;" id="r-' + time + '-' + (row) + '-' + (n) + '" >' + (n) + '</div>');
			
			//用来编号
			// ids.push(row + '-' + (n) + '-' + new Date().getTime() + '_l-r');
			ids.push("r-" + time + '-' + (row) + '-' + (n));
		}
		if(!ism){
			$("#seatcontainerId").append(seathtml.join(''));
			group++;
			this.autoRunCode(ruleid,ids);
		}else{
			$("#mousecontainerId").html(seathtml.join(''));
		}
	}
	
		
	seatMapsEditor.prototype.bulidSeverPolygonContainer = function(data,type){
		
		// var maxwidth = data.width || 1000;
		// var maxheight = data.height || 500;


		// $("#seatcontainer").width(maxwidth);
		// $("#seatcontainer").height(maxheight);

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
			// seathtml.push('<div class="seatdiv" style="transform: rotate('+seat.rotate+'deg);transform-origin:50% 50%;'+'top:' + seat.top + 'px; left:'+ seat.left + 'px;" id="' + seat.seatid + '">' + (i+1) + '辛海涛' + '</div>');
			//  分类-组-行-列 s-11-1-4
			if(type == 0){
				// type为0时多边形，type为1是椭圆形；
				seat.seatid = "p-" + group + "-" + seat.seatid;
			}else{
				seat.seatid = "o-" + group + "-" + seat.seatid;
			}
			var text = seat.seatid.split('-')[3];
			seathtml.push('<div class="seatdiv" group='+group+' style="transform: rotate('+seat.rotate+'deg);transform-origin:50% 50%;'+'top:' + seat.top + 'px; left:'+ seat.left + 'px;" id="' + seat.seatid + '" title="' + seat.seatid + '" >' + text + '</div>');
			
		}
		group++;
		$("#seatcontainerId").append(seathtml.join(''));
	}

	seatMapsEditor.prototype.autoRunCode = function(ruleid,seatids){
		var rowid = 0;
		// var seled = $("#seatcontainerId .seatdiv:not(.rownumseats)[id$='r']");
		var seled = $("#seatcontainerId .seatdiv:not(.rownumseats)[id^='r']");

		var oldids = [];
		seled.each(function(){
			if(seatids.indexOf(this.id) == -1){
				var max = this.id.split('-')[0];
				oldids.push(max);
			}
		});
		oldids = oldids.sort(function(a,b){
			return b - a;
		});
		rowid = +oldids[0] || 0;


		//获取到这一组座位所有的id
		// var seatids = seledgroup[ik];
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
		// console.log(up,down,seatids)

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
		
		var oae = this.oddAndEven(up.length);
		var seatsnum = [];
		if(ruleid == 1){
			seatsnum = oae.odd.concat(oae.even.reverse());
		}else if(ruleid == 2){
			seatsnum = oae.even.concat(oae.odd.reverse());
		}else if(ruleid == 3){
			//从左到右
			seatsnum = oae.asc;
		}else if(ruleid == 4){
			//从右到左
			seatsnum = oae.desc;
		}
		up.forEach(function(oid,colid){
			// var oid = col[ck];
			$("#" + oid).html(seatsnum[colid]);
			// $("#" + oid).attr("id",(rowid+1)+"-"+(seatsnum[colid])+"-0-c");
			$("#" + oid).attr("group",group);
			$("#" + oid).attr("title","r-" + group + "-" + (rowid+1) + "-" + (seatsnum[colid]));
			$("#" + oid).attr("id","r-" + group + "-" + (rowid+1) + "-" + (seatsnum[colid]));
		}.bind(this));

		var oae = this.oddAndEven(down.length);
		var seatsnum = [];
		if(ruleid == 1){
			seatsnum = oae.odd.concat(oae.even.reverse());
		}else if(ruleid == 2){
			seatsnum = oae.even.concat(oae.odd.reverse());
		}else if(ruleid == 3){
			//从左到右
			seatsnum = oae.asc;
		}else if(ruleid == 4){
			//从右到左
			seatsnum = oae.desc;
		}
		down.forEach(function(oid,colid){
			// var oid = col[ck];
			$("#" + oid).html(seatsnum[colid]);
			// $("#" + oid).attr("id",(rowid+2)+"-"+(seatsnum[colid])+"-0-c");
			$("#" + oid).attr("group",group);
			$("#" + oid).attr("title","r-" + group + "-" + (rowid+2) + "-" + (seatsnum[colid]));
			$("#" + oid).attr("id","r-" + group + "-" + (rowid+2) + "-" + (seatsnum[colid]));
		}.bind(this));
	}

	seatMapsEditor.prototype.autoCode = function(ruleid){
		//得到矩形座区数据
		var seled = $("#seatcontainerId .seatdiv:not(.rownumseats)[id^='s']");

		// 历史代码感觉没有意义
		// if(seled.length == 0){
		// 	var time = new Date().getTime() + "-s";
		// 	var seats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
		// 	seats.each(function(){
		// 		var id = this.id;
		// 		$(this).attr("id",id+"-"+time);
		// 	});
		// }

		var seledgroup = {};
		var seledrowv = [];
		for(var i = 0,len = seled.length; i < len; i++){
			var sl = $(seled[i]).position().left;
			var st = $(seled[i]).position().top;

			var h = $(seled[i]).height();

			var id = seled[i].id;
			// var kid = id.split('-')[0]+"-";
			var kid = this.isRow(seledgroup,(st - h/2),(st + h/2));
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
			
			var oae = this.oddAndEven(col.length);
			var seatsnum = [];
			if(ruleid == 1){
				seatsnum = oae.odd.concat(oae.even.reverse());
			}else if(ruleid == 2){
				seatsnum = oae.even.concat(oae.odd.reverse());
			}else if(ruleid == 3){
				//从左到右
				seatsnum = oae.asc;
			}else if(ruleid == 4){
				//从右到左
				seatsnum = oae.desc;
			}
			col.forEach(function(oid,colid){
				// var oid = col[ck];
				$("#" + oid).html(seatsnum[colid]);
				var groupid = +oid.split('-')[1] + group;
				// $("#" + oid).attr("id","s-"+new Date().getTime()+"-"+(rowid+1)+"-"+(seatsnum[colid]));
				$("#" + oid).attr("title","s-"+groupid+"-"+(rowid+1)+"-"+(seatsnum[colid]));
				$("#" + oid).attr("id","s-"+groupid+"-"+(rowid+1)+"-"+(seatsnum[colid]));
			});
		}.bind(this));
	}

	seatMapsEditor.prototype.autoGroupCode = function(ruleid){
		//得到矩形座区数据
		var seled = $("#seatcontainerId .seatdiv.seled:not(.rownumseats)[id^='s']");

		//首先判断是不是 只选择了一个组,并且只考虑矩形座区
		var groups = [];
		seled.each(function(){
			var id = $(this).attr("id");
			var ids = id.split("-");
			var gid = ids[1];
			if(groups.indexOf(gid) == -1){
				groups.push(gid);
			}
		});
		if(groups.length > 1){
			alert("选择了多个组的座区，请重新选择");
			return;
		}

		var seled = $("#seatcontainerId .seatdiv:not(.rownumseats)[id^='s-" + (+groups[0]) + "']");
		var seledgroup = {};
		var seledrowv = [];
		for(var i = 0,len = seled.length; i < len; i++){
			var sl = $(seled[i]).position().left;
			var st = $(seled[i]).position().top;

			var h = $(seled[i]).height();

			var id = seled[i].id;
			// var kid = id.split('-')[0]+"-";
			var kid = this.isRow(seledgroup,(st - h/2),(st + h/2));
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
			
			var oae = this.oddAndEven(col.length);
			var seatsnum = [];
			if(ruleid == 1){
				seatsnum = oae.odd.concat(oae.even.reverse());
			}else if(ruleid == 2){
				seatsnum = oae.even.concat(oae.odd.reverse());
			}else if(ruleid == 3){
				//从左到右
				seatsnum = oae.asc;
			}else if(ruleid == 4){
				//从右到左
				seatsnum = oae.desc;
			}
			col.forEach(function(oid,colid){
				// var oid = col[ck];
				$("#" + oid).html(seatsnum[colid]);
				var groupid = +oid.split('-')[1] + group;
				// $("#" + oid).attr("id","s-"+new Date().getTime()+"-"+(rowid+1)+"-"+(seatsnum[colid]));
				$("#" + oid).attr("title","s-"+groupid+"-"+(rowid+1)+"-"+(seatsnum[colid]));
				$("#" + oid).attr("id","s-"+groupid+"-"+(rowid+1)+"-"+(seatsnum[colid]));
			});
		}.bind(this));
	}

	seatMapsEditor.prototype.boxCreateSeats = function(){
		//鼠标拉宽绘制
		this.boxCreate = true;
		this.selectSeats(true);
	}

	seatMapsEditor.prototype.regroupSeats = function(){
		var seats = $("#seatcontainerId .seled");
		
		
		seats.each(function(){
			var id = this.id;
			var ids = id.split('-');
			$(this).attr("group",group);
			$(this).attr("title",ids[0] + "-" + group + "-" + ids[2] + "-" + ids[3]);
			$(this).attr("id",ids[0] + "-" + group + "-" + ids[2] + "-" + ids[3]);
		});
		group++;
	}

	seatMapsEditor.prototype.rotationSeats = function(center,rotate){
		if(!center){
			alert("没有传旋转中心点");
			return;
		}
		if(!rotate && rotate !== 0){
			alert("没有传旋转角度");
			return;
		}
		var seats = $("#seatcontainerId .seled");
		if(seats.length == 0){
			alert("没有选择需要旋转的座区");
			return;
		}

		var groupId = [];
		var seatsdata = [];

		seats.each(function(){
			var id = this.id;
			var ids = id.split('-');
			var gid = ids[1];
			if(groupId.indexOf(gid) == -1){
				groupId.push(gid);
			}

			// parseFloat($("#movecontainerId").css("left"));
			// parseFloat($("#movecontainerId").css("top"));

			var seat = {};
			seat.seatid = id;
			seat.top = parseFloat($(this).css("top"));
			seat.left = parseFloat($(this).css("left"));
			seat.rotate = parseFloat($(this).attr("rotate")) || 0;

			seatsdata.push(seat);
		});

		
		if(groupId.length > 1){
			alert("只能选择一个组");
		}else{
			// console.log(seatsdata);
			var condi = {};
			condi.center = center;
			condi.rotate = rotate;
			condi.seats = seatsdata;
			this.getSeatsRotation(condi);
		}
	}
	
	seatMapsEditor.prototype.getSeatsRotation = function(condi){
		$.ajax({
			async: true,
			type: "post",
			data: JSON.stringify(condi),
			contentType: 'application/json', 
			url: serverUrl + "/v1/editor/rotate",
			dataType: "json",
			success: function(obj) {
				// console.log(obj);
				if(obj && obj.seats){
					var seats = obj.seats || [];
					for (var i = 0,len = seats.length; i < len; i++) {
						var seat = seats[i] || {};
						//  分类-组-行-列 s-11-1-4
						// var seatnum = seat.seatid.split('-')[3];
						// seathtml.push('<div class="seatdiv" style="transform: rotate('+seat.rotate+'deg);transform-origin:50% 50%;'+'top:' + seat.top + 'px; left:'+ seat.left + 'px;" id="' + seat.seatid + '">' + seatnum + '</div>');
						$("#"+seat.seatid)[0].style.cssText = 'transform: rotate('+(+seat.rotate)+'deg);transform-origin:50% 50%;'+'top:' + seat.top + 'px; left:'+ seat.left + 'px;';
						
						$("#"+seat.seatid).attr("rotate",seat.rotate);
						$("#"+seat.seatid).removeClass("seled");
					}
					// $("#seatcontainerId").html(seathtml.join(''));
				}
			},
			//失败的回调函数
			error: function() {
				console.log("error");
			}
		});
	}

	seatMapsEditor.prototype.completeSeats = function(){
		this.countMaxWidth(1);


		$("#meetingname").show();
		$("#meetingaddress").show();
		$("#meetingtime").show();
		$("#meetingremark").show();

		$("#seatcontainerId .seled").removeClass("seled");
		
		var seats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
		// seats.each(function(){
		// 	var id = this.id;
		// 	var arr = id.split("-");
		// 	var nid = arr[2] + "-" + arr[3];
		// 	var idtype = arr[0] || "";
		// 	if(idtype && idtype != "s"){
		// 		nid = idtype + "-" + nid;
		// 		$(this).attr("id",nid);
		// 	}else{
		// 		$(this).attr("id",nid);
		// 	}
		// });
		var rownum = $("#seatcontainerId .rownumseats");
		// console.log(seats,seats.html(),rownum,rownum.html())
		$("#seatcontainerId").html('');
		$("#seatcontainerId").append(seats);
		$("#seatcontainerId").append(rownum);
		
		this.saveCompleteSeats();
	}

	seatMapsEditor.prototype.saveCompleteSeats = function(){
		// var seathtml = $("#seatcontainer").html().trim();
		var copyhtml = $("#seatcontainer").prop("outerHTML").trim();
		copyhtml = copyhtml.replace('style="position: fixed;left: 25px;top: 80px;"','style="position: fixed;left: 25px;top: 15px;"')
		// var flag = copyText(copyhtml); //传递文本
		// alert(flag ? "复制成功！" : "复制失败！");
		var allseats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
	
		sessionStorage.setItem("_seatnum",allseats.length);
		sessionStorage.setItem("_seatscomplete",copyhtml);
	}
	
	seatMapsEditor.prototype.saveFileData = function(){
		var seats = $("#seatcontainerId .seatdiv");
		var seatsdata = [];
		seats.each(function(){
			var item = {};
			item.class = this.className;
			item.style = this.style.cssText;
			item.id = this.id;
			item.text = $(this).text();
			item.ang = $(this).attr("ang");
			seatsdata.push(item);
		});

		window.localStorage.setItem("__seatsfiledata",JSON.stringify(seatsdata));
	}

	seatMapsEditor.prototype.loadFileData = function(){
		var filedata = window.localStorage.getItem("__seatsfiledata") || "";
		if(filedata){
			var seatsdata = JSON.parse(filedata);
			var seathtml = [];
			seatsdata.forEach(function(item){
				// ang="'+sang+'"
				var ang = "";
				
				if(item.ang || (+item.ang === 0 && item.ang != "")){
					ang = 'ang="' + item.ang + '"';
				}
				seathtml.push('<div ' + ang + ' class="' + item.class + '" style="' + item.style + '" id="' + item.id + '" >' + item.text + '</div>');
			});

			$("#seatcontainerId").append(seathtml.join(''));
		}
	}

	seatMapsEditor.prototype.unbindStaffDrap = function(){
		this.removeContainerEvent();
	}

	seatMapsEditor.prototype.bindStaffDrap = function(){
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
			clearTimeout(tout);
			tout = setTimeout(function(){
				this.matchStaffDrap(_x,_y,cx,cy,_sleft,_stop);
			}.bind(this),100);
		}.bind(this));
	}

	seatMapsEditor.prototype.matchStaffDrap = function(_x,_y,cx,cy,_sleft,_stop){
		
		var sleft = _x - cx + _sleft;
		var stop = _y - cy + _stop;
		
		$(".R99").removeClass("R99");
		for (var i = 0,len = selList.length; i < len; i++) {
			var sel = $(selList[i]);
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

	seatMapsEditor.prototype.mouseClosedCurveMap = function(){
		this.removeContainerEvent();
		
		$("#mousepointline").attr("points","");

		var point = [];
		$("#seatcontainer").bind({
			dblclick:function(e){
				this.removeContainerEvent();
				
				point.push([point[0][0],point[0][1]]);
				if(point.length > 3){
					var path = "";
					point.forEach(function(item){
						path += item[0]+","+item[1]+ " "
					});
					$("#mousepointline").attr("points",path);

					$("#circlemouseline").attr({"x1":0,"y1":0,"x2":0,"y2":0});
				}
				$("#mousepointId").hide();
			}.bind(this),
			click:function(e){
				var sl = $("#seatcontainer").offset().left - 18;
				var st = $("#seatcontainer").offset().top - 18;

				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				var x = event.x - sl + scrollX - 3;
				var y = event.y - st + scrollY - 3;

				$("#mousepointId").css({"top":y+"px","left":x+"px"});

				var maxlen = point.length - 1;
				if(maxlen > 0 && (x+3) == point[maxlen][0] && (y+3) == point[maxlen][1]){
					return;
				}
				point.push([x + 3,y + 3]);
				if(point.length > 1){
					var path = "";
					point.forEach(function(item){
						path += item[0]+","+item[1]+ " "
					});
					$("#mousepointline").attr("points",path);

					$("#circlemouseline").attr({"x1":0,"y1":0,"x2":0,"y2":0});
				}
				
			},
			mousemove:function(e){
				$("#mousepointId").show();

				var sl = $("#seatcontainer").offset().left - 18;
				var st = $("#seatcontainer").offset().top - 18;

				var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
				var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
				var x = event.x - sl + scrollX - 3;
				var y = event.y - st + scrollY - 3;
				if(point.length == 0){
					$("#mousepointId").css({"top":y+"px","left":x+"px"});
				}else{
					var x1 = parseInt($("#mousepointId").css("left")) + 3;
					var y1 = parseInt($("#mousepointId").css("top")) + 3;
					$("#circlemouseline").attr({"x1":x1,"y1":y1,"x2":x + 3,"y2":y + 3});

				}
			}.bind(this)
		});
	}
	
	

	function keyDownMoveSeats(evt){
		var keycode = evt.keyCode;
		// console.log("keyDownMoveSeats-----",evt,keycode,evt.ctrlKey,evt.altKey);

		if(evt.ctrlKey){
			if(keycode == 67){
				//ctrl + c
				seatMapsEditor.prototype.copySeats();
			}else if(keycode == 86){
				//ctrl + v
			}
		}

		
		if(keycode != 65){
			keyDownSelectAll = true;
		}
		switch(keycode){
			case 65:
				if(evt.ctrlKey){
					// 全选/取消全选	Ctrl+A/Ctrl+A
					evt.preventDefault();
					evt.stopPropagation();
					if(keyDownSelectAll){
						keydownToolEvent("selectall");
						keyDownSelectAll = false;
					}else{
						keydownToolEvent("unselectall");
						// console.log(00000,keyDownSelectAll)
						keyDownSelectAll = true;
					}
				}
			break;
			case 82:
				if(evt.ctrlKey){
					// 单选	Ctrl+R
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-radio");
				}
			break;
			case 32:
				if(evt.shiftKey && evt.ctrlKey){
					// 拖拽画布	space
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("drag-container");
				}
			break;
			case 76:
				if(evt.shiftKey){
					// 行选	Shift+space
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("selectrow");
				}else if(evt.ctrlKey){
					// 列选	Ctrl+space
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("selectcol");
				}
			break;
			case 49:
				if(evt.ctrlKey && evt.shiftKey){
					// 组选	Ctrl+Shift+1
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("selectgroup");
				}else if(evt.ctrlKey){
					// 左对齐	Ctrl+1
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-align-left");
				}else if(evt.altKey){
					// 旋转	alt + 1
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("rotationbtn");
				}
			break;
			case 50:
				if(evt.ctrlKey && evt.shiftKey){
					// 组选	Ctrl+Shift+2
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("selectsame");
				}else if(evt.ctrlKey){
					// 右对齐	Ctrl+2
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-align-right");
				}else if(evt.altKey){
					// 旋转	alt + 2
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("autocodegroupbtn");
				}
			break;
			case 51:
				if(evt.ctrlKey && evt.shiftKey){
					// 组选	Ctrl+Shift+3
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("mergegroup");
				}else if(evt.ctrlKey){
					// 左右对齐	Ctrl+3
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-align-center");
				}else if(evt.altKey){
					// 旋转	alt + 3
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("autocodebtn");
				}
			break;
			case 52:
				if(evt.ctrlKey){
					// 上对齐	Ctrl+4
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-align-up");
				}else if(evt.altKey){
					// 旋转	alt + 4
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("completebtn");
				}
			break;
			case 53:
				if(evt.ctrlKey){
					// 下对齐	Ctrl+5
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-align-down");
				}
			break;
			case 54:
				if(evt.ctrlKey){
					// 上下对齐	Ctrl+6
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-align-center-v");
				}
			break;
			case 70:
				if(evt.ctrlKey){
					// 框选	Ctrl+F
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-selection");
				}
			break;
			case 78:
				if(evt.ctrlKey && evt.altKey){
					evt.preventDefault();
					evt.stopPropagation();
					
					// 圆形座区	Ctrl+alt+N
					keydownToolEvent("create-circle-down");
				}else if(evt.shiftKey && evt.altKey){
					evt.preventDefault();
					evt.stopPropagation();
					
					// 跑道座区	Ctrl+Shift+N 有冲突
					keydownToolEvent("create-run-down");
				}else if(evt.shiftKey){
					evt.preventDefault();
					evt.stopPropagation();
					// 矩形座区	Ctrl+N  有冲突
					keydownToolEvent("nav-down");
				}
			break;
			case 81:
				if(evt.ctrlKey){
					// 快速绘制	Ctrl+Q
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-add");
				}
			break;
			case 87:
				if(evt.shiftKey){
					// 多边形绘制	Ctrl+W 有冲突
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("polygonbtn");
				}
			break;
			case 69:
				if(evt.ctrlKey){
					// 椭圆形	Ctrl+E
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("ovalbtn");
				}
			break;
			case 83:
				if(evt.ctrlKey){
					// 位移	Ctrl+S
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("keydownmove");
				}
			break;
			case 71:
				if(evt.ctrlKey){
					// 垂直分布	Ctrl+G
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-horizontal-c");
				}
			break;
			case 72:
				if(evt.ctrlKey){
					// 横向分布	Ctrl+H
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-vertical-c");
				}
			break;
			case 68:
				if(evt.ctrlKey){
					// 删除	Ctrl+D
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-delete");
				}
			break;
			case 90:
				if(evt.ctrlKey){
					// 恢复删除	Ctrl+Z
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-rollback");
				}
			break;
			case 66:
				if(evt.ctrlKey){
					// 恢复座区	Ctrl+B
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-forward");
				}
			break;
			case 84:
				if(evt.shiftKey){
					// 文字编辑	Ctrl+T
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-mark");
				}else if(evt.altKey){
					// 手动文字编辑	Alt+T
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-mark-only");
				}
			break;
			case 89:
				if(evt.ctrlKey){
					// 拖拽	Ctrl+Y
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("nav-drag");
				}
			break;
			case 77:
				if(evt.ctrlKey){
					// 鼠标右键	Ctrl+M
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("rightbtn");
				}
			break;
			case 74:
				if(evt.ctrlKey && evt.altKey){
					// 向心点列表	Ctrl+Alt+J
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("centerpoint-list");
				}else if(evt.ctrlKey){
					// 向心点设置	Ctrl+J
					evt.preventDefault();
					evt.stopPropagation();
					keydownToolEvent("set-centerpoint");
				}
			break;
		}


		if(!__keydownMoveUp && !__keydownMoveDown && !__keydownMoveLeft && !__keydownMoveRight){
			return;
		}
		
		switch(keycode){
			case 38:
				//上
				if(__keydownMoveUp){
					seatMapsEditor.prototype.hiddenScorll();
					if(evt.shiftKey){
						event.preventDefault();
						event.stopPropagation();
						seatMapsEditor.prototype.topMoveSeats(10);
					}else{
						event.preventDefault();
						event.stopPropagation();
						seatMapsEditor.prototype.topMoveSeats(1);
					}
				}
			break;
			case 40:
				//下
				if(__keydownMoveDown){
					seatMapsEditor.prototype.hiddenScorll();
					if(evt.shiftKey){
						event.preventDefault();
						event.stopPropagation();
						seatMapsEditor.prototype.bottomMoveSeats(10);
					}else{
						seatMapsEditor.prototype.bottomMoveSeats(1);
					}
				}
			break;
			case 37:
				//左
				if(__keydownMoveLeft){
					seatMapsEditor.prototype.hiddenScorll();
					if(evt.shiftKey){
						event.preventDefault();
						event.stopPropagation();
						seatMapsEditor.prototype.leftMoveSeats(10);
					}else{
						event.preventDefault();
						event.stopPropagation();
						seatMapsEditor.prototype.leftMoveSeats(1);
					}
				}
			break;
			case 39:
				//右
				if(__keydownMoveRight){
					seatMapsEditor.prototype.hiddenScorll();
					if(evt.shiftKey){
						seatMapsEditor.prototype.rightMoveSeats(10);
					}else{
						seatMapsEditor.prototype.rightMoveSeats(1);
					}
				}
			break;
		}
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

	
	
	$(document).bind("keydown",keyDownMoveSeats);
	window.onmousewheel = function(){
		seatMapsEditor.prototype.autoScorll();
	}
	window.SeatMapsEditor = seatMapsEditor;
	window.SeatMapsDrag = Drag;

	seatMapsEditor.prototype.loadSessionData();
})();





(function(){
	var closeP = false;
	var cFlag = false;
	var cirChange = false;
	var cir1X,cir1Y,cir2X,cir2Y;
	var cLength = 0;
	var cId = null;
	var cIdChange = false;

	var poPositions = [];

	var drawPath = function () {
		let configCan = document.getElementById("configCan");
		let ctx = configCan.getContext("2d");
		let maxwidth = $("#seatcontainer").width();
		let maxheight = $("#seatcontainer").height();
		
		//清空画布
		ctx.clearRect(0, 0, maxwidth, maxheight);
		let poCan = document.getElementsByClassName("point-can");
		poPositions = [];
		for(let i = 0;i<poCan.length;i++){
			let position = {x:0,y:0};
			position.x = poCan[i].offsetLeft + 4 + 18;
			position.y = poCan[i].offsetTop + 4 + 18;
			poPositions.push(position);
		}
		//获取锚点坐标
		let cirCanP = [];
		for(let i = 0;i<poCan.length;i++){
			let targetId = parseInt(poCan[i].id.substring(2));
			let cir = document.getElementsByClassName("cir-can"+targetId);
			let cirP ;
			if(cir.length){
				cirP = [];
				for(let j = 0;j<2;j++){
					let position = {x:0,y:0};
					position.x = cir[j].offsetLeft + 4;
					position.y = cir[j].offsetTop + 4;
					cirP.push(position);
				}
			}
			cirCanP[i] = cirP;
		}
		//获取圆点坐标
		for(let i = 0;i<poPositions.length;i++){
			if(poPositions[i]&&cirCanP[i]){
				ctx.beginPath();
				ctx.strokeStyle = "#1984ec";
				ctx.moveTo(cirCanP[i][0].x,cirCanP[i][0].y);
				ctx.lineTo(poPositions[i].x,poPositions[i].y);
				ctx.lineTo(cirCanP[i][1].x,cirCanP[i][1].y);
				ctx.stroke();
			}
		}
		//绘制已存在圆点与其对应锚点的直线

		// for(let i = 0;i<poPositions.length;i++){
		//     if(poPositions[i]&&cirCanP[i]){
		//         ctx.beginPath();
		//         ctx.strokeStyle = "red";
		//         ctx.moveTo(cirCanP[i][0].x,cirCanP[i][0].y);
		//         ctx.lineTo(cirCanP[i][0].x,poPositions[i].y);
		//         ctx.lineTo(cirCanP[i][1].x,poPositions[i].y);
		//         ctx.lineTo(cirCanP[i][1].x,cirCanP[i][1].y);
		//         ctx.stroke();
		//     }
		// }
		ctx.beginPath();
		ctx.strokeStyle = "#1984ec";
		ctx.moveTo(poPositions[0].x, poPositions[0].y);
		if(cirCanP[0]){//如果第一个锚点的圆点存在
			if(!cirCanP[1]){//且第二个锚点的圆点不存在，则绘制二次贝塞尔曲线
				ctx.quadraticCurveTo(cirCanP[0][1].x,cirCanP[0][1].y,poPositions[1].x,poPositions[1].y);
			}else{//且第二个锚点的圆点存在，则绘制三次贝塞尔曲线
				ctx.bezierCurveTo(cirCanP[0][1].x, cirCanP[0][1].y, cirCanP[1][0].x,cirCanP[1][0].y, poPositions[1].x, poPositions[1].y);
			}
			for(let i = 1;i<poPositions.length;i++){
				if(i===(poCan.length-1)){
					if(cirCanP[i]){//如果最后一个锚点的圆点存在
						if(cirCanP[(i-1)]){//且倒数第二个锚点的圆点存在，则绘制三次贝塞尔曲线
							ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[0][0].x,cirCanP[0][0].y, poPositions[0].x, poPositions[0].y);
							ctx.stroke();
							return;
						}else{//且倒数第二个锚点不存在
							ctx.quadraticCurveTo(cirCanP[i][0].x,cirCanP[i][0].y,poPositions[i].x, poPositions[i].y);//先绘制倒数第二个锚点与倒数第三个点的二次贝塞尔曲线
							ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[0][0].x,cirCanP[0][0].y, poPositions[0].x, poPositions[0].y);//再绘制最后一个锚点与第一个锚点的三次贝塞尔曲线
							ctx.stroke();
							return;
						}

					}else{//如果最后一个锚点不存在
						if(cirCanP[(i-1)]){//且倒数第二个锚点存在，则绘制第一个锚点与最后一个锚点的二次贝塞尔曲线
							ctx.quadraticCurveTo(cirCanP[0][0].x,cirCanP[0][0].y,poPositions[0].x, poPositions[0].y);
							ctx.stroke();
							return;
						}else{//且倒数第二个锚点不存在
							ctx.lineTo(poPositions[i-1].x, poPositions[i-1].y);//绘制第二个锚点
							ctx.lineTo(poPositions[i].x, poPositions[i].y);//绘制最后一个锚点
							ctx.quadraticCurveTo(cirCanP[0][0].x,cirCanP[0][0].y,poPositions[0].x, poPositions[0].y);//绘制最后一个锚点到第一个锚点的二次贝塞尔曲线
							ctx.stroke();
							return;
						}
					}
				}
				if(cirCanP[i]){//如果当前锚点存在小圆点
					if(cirCanP[i-1]){//且前一个锚点小圆点存在
						if(cirCanP[i+1]){//且后一个锚点小圆点存在
							ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, poPositions[i+1].x, poPositions[i+1].y);//绘制当前锚点与下一个锚点的三次贝塞尔曲线
						}else{//且后一个锚点小圆点不存在
							ctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, poPositions[i+1].x, poPositions[i+1].y);//绘制当前锚点与下一个锚点的二次贝塞尔曲线
						}
					}else if(cirCanP[i+1]){//且后一个锚点小圆点存在，此时前一个锚点不存在小圆点
						ctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, poPositions[i].x, poPositions[i].y);//则绘制前一个锚点与当前锚点的二次贝塞尔曲线
						ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, poPositions[i+1].x, poPositions[i+1].y);//绘制当前锚点与后一个锚点的三次贝塞尔曲线
					}else{//前一个锚点与后一个锚点都不存在小圆点
						ctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, poPositions[i].x, poPositions[i].y);//绘制前一个锚点的与当前锚点的二次贝塞尔曲线
						ctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, poPositions[i+1].x, poPositions[i+1].y);//绘制当前锚点与后一个锚点的二次贝塞尔曲线
					}
				}else{//如果当前锚点不存在小圆点
					ctx.lineTo(poPositions[i].x, poPositions[i].y);//则绘制当前锚点
				}
			}
		}else{//第一个锚点的小圆点不存在的情况，其余同上
			for(let i = 1;i<poPositions.length;i++){
				if(i===(poCan.length-1)){
					if(cirCanP[i]){
						if(cirCanP[i-1]){
							ctx.quadraticCurveTo(cirCanP[i][1].x,cirCanP[i][1].y,poPositions[0].x, poPositions[0].y);
							ctx.stroke();
							return;
						}else{
							ctx.lineTo(poPositions[i-1].x, poPositions[i-1].y);
							ctx.quadraticCurveTo(cirCanP[i][0].x,cirCanP[i][0].y,poPositions[i].x, poPositions[i].y);
							ctx.quadraticCurveTo(cirCanP[i][1].x,cirCanP[i][1].y,poPositions[0].x, poPositions[0].y);
							ctx.stroke();
							return;
						}
					}
				}
				if(cirCanP[i]){
					if(cirCanP[i-1]){
						if(cirCanP[i+1]){
							ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, poPositions[i+1].x, poPositions[i+1].y);
						}else{
							ctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, poPositions[i+1].x, poPositions[i+1].y);
						}

					}else if(cirCanP[i+1]){
						ctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, poPositions[i].x, poPositions[i].y);
						ctx.bezierCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, cirCanP[i+1][0].x,cirCanP[i+1][0].y, poPositions[i+1].x, poPositions[i+1].y);
					}else{
						ctx.quadraticCurveTo(cirCanP[i][0].x, cirCanP[i][0].y, poPositions[i].x, poPositions[i].y);
						ctx.quadraticCurveTo(cirCanP[i][1].x, cirCanP[i][1].y, poPositions[i+1].x, poPositions[i+1].y);
					}
				}else{
					ctx.lineTo(poPositions[i].x, poPositions[i].y);
				}

			}
		}
		if(closeP){//如果闭合路径状态为true，则闭合路径
			ctx.closePath();
		}
		ctx.stroke();
	};

	var drawCir = function () {
		//圆点的事件注册
		let miniCirs = document.getElementsByClassName("mini-cir");
		let ccurrentX,ccurrentY;
		let cthat = null;
		let changeId;//记录当前圆点是否发生变化
		let targetId = 0;
		for (let i = 0; i < miniCirs.length; i++) {
			$("#"+miniCirs[i].id).off('click').on('click',function (e) {
				cFlag = false;
				$(".mini-cir").removeClass("mini-cir-down");//移除所有选中状态
			}).off('mousedown').on('mousedown',function (e) {
				cFlag = true;//圆点移动标记
				if(cthat===null){
					cthat = e;
				}
				ccurrentX = e.pageX - parseInt($("#"+e.currentTarget.id).css("left"));
				ccurrentY = e.pageY - parseInt($("#"+e.currentTarget.id).css("top"));
				targetId = parseInt(e.target.id.substring(3));
			});
		}
		$("#drawLine").on('mousemove',function (e) {
			if (cFlag) {
				if(cthat===null){
					return;
				}
				if(window.event.altKey&&cthat){//点击圆点并按下alt键
					let x = e.pageX - ccurrentX;//移动时根据鼠标位置计算控件左上角的绝对位置
					let y = e.pageY - ccurrentY;
					$("#"+cthat.target.id).css({top: y, left: x});//选中圆点的新位置
					$("#"+cthat.target.id).addClass("mini-cir-down");//添加选中状态
					let ctarget = targetId;//获取当前点击的圆点ID
					let po,cX,cY;

					if(ctarget%2){//根据圆点ID获取与其成对的另一个圆点的坐标
						po = document.getElementById("po"+(ctarget+1)/2);
						cX = parseInt($("#cir"+(ctarget+1)).css('left')) - parseInt($("#po"+(ctarget+1)/2).css('left'));
						cY = parseInt($("#cir"+(ctarget+1)).css('top')) - parseInt($("#po"+(ctarget+1)/2).css('top'));
						changeId = ctarget+1;
					}else{
						po = document.getElementById("po"+ctarget/2);
						cX = parseInt($("#cir"+(ctarget-1)).css('left')) - parseInt($("#po"+ctarget/2).css('left'));
						cY = parseInt($("#cir"+(ctarget-1)).css('top')) - parseInt($("#po"+ctarget/2).css('top'));
						changeId = ctarget-1;
					}
					let X = parseInt(cthat.target.offsetLeft) -  parseInt(po.offsetLeft);//当前点击圆点与锚点的距离
					let Y = parseInt(cthat.target.offsetTop) - parseInt(po.offsetTop);
					let sLength = Math.sqrt(X*X + Y*Y);//计算当前圆点与锚点的长度
					if(cId === null){
						cId = ctarget;
					}
					if(cId !== ctarget){//判断当前的圆点ID是否发生变化来确定是否重新计算成对圆点的长度
						cId = ctarget;
						cIdChange = true;
					}else{
						cIdChange = false;
					}
					if(cLength===0||cIdChange){
						cLength = parseInt(Math.sqrt(cX*cX + cY*cY));//计算与当前点击圆点成对的另一个圆点与锚点的长度
					}
					let mul1 = (X/sLength).toFixed(2);//省略小数以减小误差
					let mul2 = (Y/sLength).toFixed(2);
					if(X>0){//根据当前圆点相对于锚点的位置设置与之对应的圆点的坐标，使得当前圆点与对应圆点永远在一条直线上
						if(mul2<0){
							$("#cir"+changeId).css({top:(po.offsetTop-(cLength*mul2)),left:(po.offsetLeft-(cLength*mul1))});
						}else{
							$("#cir"+changeId).css({top:(po.offsetTop-(cLength*mul2)),left:(po.offsetLeft-(cLength*mul1))});
						}
					}else{
						if(mul2<0){
							$("#cir"+changeId).css({top:(po.offsetTop-(cLength*mul2)),left:(po.offsetLeft-(cLength*mul1))});
						}else{
							$("#cir"+changeId).css({top:(po.offsetTop-(cLength*mul2)),left:(po.offsetLeft-(cLength*mul1))});
						}
					}
				}
				if(window.event.ctrlKey&&cthat){//点击圆点并按住ctrl键
					let target = parseInt(cthat.target.id.substring(3));
					$(".mini-cir").removeClass("mini-cir-down");
					let x = e.pageX - ccurrentX;//移动时根据鼠标位置计算控件左上角的绝对位置
					let y = e.pageY - ccurrentY;
					$("#cir"+target).css({left:x,top:y});//此时只改变当前圆点的坐标
					$("#cir"+target).addClass("mini-cir-down");
				}

				drawPath();
			}
		}).off('mouseup').on('mouseup',function (e) {
			cthat = null;
			cFlag = false;
		});
	};


	var drawAll = function () {
		$("#point").css('visibility', 'visible');
		
		drawPath();

		let miniBoxs = document.getElementsByClassName("point-can");
		//圆点移动的标志
		let cmove = false;
		//锚点移动的标志
		let flag = false;
		//第一个锚点的状态
		let po1State = false;
		//删除状态
		let delState = true;
		//存储当前坐标
		let currentX,currentY;
		let that;
		$("#drawLine").css("z-index",999);
		for (let i = 0; i < miniBoxs.length; i++) {
			//为每一个锚点注册事件
			$("#"+miniBoxs[i].id).off('click').on('click',function (e) {
				//判断路径是否闭合
				if(closeP){
					//这是第一次点击第一个锚点，此时触发的事件为闭合路径
					if(po1State === false){
						//修改第一个锚点的状态为true
						po1State =true;
						flag = false;
						cmove = false;
						return;
					}
					//判断是否删除锚点
					if(delState){
						//如果锚点数=2，就不可再删除
						if(miniBoxs.length===2){
							return;
						}
						//删除锚点
						$("#"+e.currentTarget.id).remove();
						let target = parseInt(e.currentTarget.id.substring(2));
						//删除当前锚点下已存在的圆点
						$(".cir-can"+target).remove();
						delState = false;
						//重新绘制路径
						drawPath();
					}
				}
				//路径未闭合状态
				if(miniBoxs.length>1&&delState){
					if (e.currentTarget.id ==="po1"){
						return;
					}else{
						$("#"+e.currentTarget.id).remove();
						let target = parseInt(e.currentTarget.id.substring(2));
						$(".cir-can"+target).remove();
						delState = false;
						drawPath();
					}
				}
			}).off('mousedown').on('mousedown',function (e) {
				cmove = true;
				//设置圆点改变状态为true，表示此时圆点的状态已经改变
				cirChange = true;
				$(".mini-box").removeClass("mini-box-down");
				$(".mini-cir").removeClass("mini-cir-down");
				that = null;
				//点击锚点并按住ctrl键
				if(window.event.ctrlKey) {
					//设置删除状态为false
					delState = false;
					//移动标志
					flag = true;
					that = e;
				}else{
					delState = true;
				}
				//点击锚点并按住alt键
				if(window.event.altKey){
					that = e;
				}
				if(that===null){
					that = e;
				}
				$("#"+e.target.id).addClass("mini-box-down");
				currentX = e.pageX - parseInt($("#"+e.currentTarget.id).css("left"));
				currentY = e.pageY - parseInt($("#"+e.currentTarget.id).css("top"));
				if(e.currentTarget.id === "po1"&&!po1State){
					//第一次点击 第一个生成的锚点，闭合路径
					//设置闭合路径的状态为true
					closeP = true;
					$("#po1").removeClass("closeP");
					$("#po1").addClass("mini-box-down delP");
					$("#po1").removeAttr("title");
					$("#po1").attr("title","删除锚点");
					$("#po"+miniBoxs.length).removeClass("mini-box-down");
					//移除上一个锚点的选中状态
					drawPath();
				}
			}).off('mouseup').on('mouseup',function (e) {
				flag = false;
				cmove = false;
				that = null;
			});
		}

		$("#drawLine").on('mousemove',function (e) {
			let targetId;
			//获取当前点击的锚点ID
			if(that){
				targetId = "#"+that.target.id;
			}
			if(window.event.ctrlKey&&flag&&that) {
				delState = false;
				if (flag) {
					//移动时根据鼠标位置计算控件左上角的绝对位置
					var x = e.pageX - currentX;
					var y = e.pageY - currentY;
					//控件新位置
					$(targetId).css({top: y, left: x});
					//添加选中状态
					$(targetId).addClass("mini-box-down");
					let target = parseInt(that.target.id.substring(2));
					var cir = document.getElementsByClassName("cir-can"+target);
					if(cir.length){
						//判断与上次相比，圆点是否发生变化
						if(cirChange){
							cir1X = cir[0].offsetLeft - x;
							cir1Y = cir[0].offsetTop - y;
							cir2X = cir[1].offsetLeft - x;
							cir2Y = cir[1].offsetTop - y;
						}
						if(cir1X){
							$(cir[0]).css({top:y+cir1Y,left:x+cir1X});
							$(cir[1]).css({top:y+cir2Y,left:x+cir2X});

						}else{
							$(cir[0]).css({top:(y),left:(x)});
							$(cir[1]).css({top:(y),left:(x)});
						}
					}
					drawPath();
					cirChange = false;
				}
				return;
			}
			//点击锚点并按住alt键
			if(window.event.altKey&&cmove&&that){
				delState = false;
				$(targetId).addClass("mini-box-down");
				let target = parseInt(that.target.id.substring(2));

				let cirCans = document.getElementsByClassName("cir-can"+target);
				//判断圆点是否存在，否则创建
				if(!cirCans.length){
					let cirs = [];
					let cirDiv1 = $('<div></div>');
					cirDiv1.attr({"class": "mini-cir cir-can"+target,"id":"cir"+(2*target-1)});
					cirs.push(cirDiv1);
					let cirDiv2 = $('<div></div>');
					cirDiv2.attr({"class": "mini-cir cir-can"+target,"id":"cir"+(target*2)});
					cirs.push(cirDiv2);
					$("#"+that.target.id).after(cirs);
					drawCir();
				}
				//移动时根据鼠标位置计算控件左上角的绝对位置
				let x = e.pageX - currentX;
				let y = e.pageY - currentY;
				//根据鼠标位置改变奇数圆点即此锚点的第一个圆点坐标
				$("#cir"+(target*2-1)).css({left:x,top:y});
				$("#cir"+(target*2-1)).addClass("mini-cir-down");
				let po = document.getElementById("po"+target);
				let X = x - parseInt(po.offsetLeft);
				let Y = y - parseInt(po.offsetTop);
				$("#cir"+target*2).css({left:(po.offsetLeft-X),top:(po.offsetTop-Y)});
				drawPath();
				return;
			}
			that = null;
		});
	};


	function removeContainerEvent(){
		$("#circlemousexyId").hide();
		$("#circlemouseline").attr({"x1":0,"y1":0,"x2":0,"y2":0});
		$("#seatcontainer").unbind("mousedown");
		$("#seatcontainer").unbind("mousemove");
		$("#seatcontainer").unbind("mouseup");
		$("#seatcontainer").unbind("dblclick");
		$("#seatcontainer").unbind("click");

		$("#seatcontainer").unbind("dragover");

		$("#movecontainerId").unbind("dblclick");
		$("#movecontainerId").unbind("mousedown");
		$("#movecontainerId").unbind("mouseup");
	}

	function bessenlCurve(){
		removeContainerEvent();

		let currentX1,currentY1;
		$("#seatcontainer").click(function () {
		
		}).mousedown(function (e) {
			let length = document.getElementsByClassName("point-can").length;
			// if(length===20){
			//     alert("锚点不能超过20个");
			//     return;
			// }

			let poDiv;
			//获取当前鼠标位置
			currentX1 = e.offsetX;
			currentY1 = e.offsetY;

			if(length){
				//判断当前是否是第一个锚点
				let poCan = document.getElementsByClassName("point-can");
				let targetId = parseInt(poCan[(length-1)].id.substring(2));
				poDiv = $('<div></div>');
				poDiv.attr({"class": "mini-box point-can delP mini-box-down","id":"po"+(targetId+1),"title": "删除锚点"});
				let poId = "#po"+targetId;
				$(poId).removeClass("mini-box-down");
				$(poId).after(poDiv);
			}else{
				poDiv = $('<div></div>');
				poDiv.attr({"class": "mini-box point-can closeP mini-box-down","id":"po1","title": "闭合路径"});
				$("#point").html(poDiv);
			}
			//锚点位置为当前点击位置
			$("#"+poDiv[0].id).css({top:currentY1,left:currentX1});

			//注册事件的方法
			drawAll();
		});
	}

	window.BessenlCurve = bessenlCurve;

	// 添加锚点的操作，未完善
	// var addpo = function () {
	//     let length = document.getElementsByClassName("point-can").length;
	//     if(length === 20){
	//         $("#addpo").attr("disabled",true);
	//         return;
	//     }else{
	//         $("#addpo").attr("disabled",false);
	//         $("#reducepo").attr("disabled",false);
	//     }
	//     let poDiv = $('<div></div>');
	//     poDiv.attr({"class": "mini-box point-can","id":"po"+(length+1)});
	//     $("#"+poDiv[0].id).css({top:10,left:10});
	//     $("#po"+length).after(poDiv);
	//     drawAll();
	//
	// };

	// var reducePo = function () {
	// 	let poCan = document.getElementsByClassName("point-can");
	// 	let length = poCan.length;
	// 	let targetId = parseInt(poCan[(length-1)].id.substring(2));
	// 	if(length === 3){
	// 		$("#reducePo").attr("disabled",true);
	// 		return;
	// 	}else{
	// 		$("#reducePo").attr("disabled",false);
	// 		$("#addpo").attr("disabled",false);
	// 	}
	// 	$("#po"+targetId).remove();
	// 	$(".cir-can"+targetId).remove();
	// 	drawAll();
	// };
})();