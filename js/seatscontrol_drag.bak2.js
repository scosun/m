


var isDrop = false;
var meetingid  = 0;


var areas = [];

// var maxSeatNum = 0;
function creatSeats(rownum,colnum){
	// if(colnum > maxSeatNum){
	// 	maxSeatNum = colnum;
	// }
	countMaxWidth(+rownum,+colnum);
	bulidSeatsContainer(rownum,colnum);

	// getAllSeatsNode();

	clearCompleteSeats();
	selectSeats();
}

var maxWidth;
function countMaxWidth(rownum,colnum){
	maxWidth = colnum*50 + 200;
	$(".seatcontainer").width(colnum*50 + 200);
	$(".seatcontainer").height(rownum*50 + 300);

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

var sTop = 150;
var sLeft = 100;
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
		sleft = 100;
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


var isSelect = false;


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
		// pop.each(function(){
		// 	$(this).css("display","block");
		// });
	}

	// var seled =  $("#seatcontainerId ."+seledClass);
	// if(seled.length == 0){return;}
	// seled.removeClass(seledClass);
	// seled.each(function(){
	// 	var id = this.id;
	// 	$(this).removeClass("aisleseats");
	// 	var num = id.split("-");
	// 	$(this).html(num[1])
	// });
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

		// var id = seled[i].id;
		// var kid = id.split('-')[0]+"-";
		// if(seledgroup[kid]){
		// 	seledgroup[kid].push(id);
		// }else{
		// 	seledgroup[kid] = [];
		// 	seledgroup[kid].push(id);
		// }
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
		$(this).css("left",left-10+"px");
	});
}
function rightMoveSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	seled.each(function(){
		var left = parseFloat($(this).css("left"));
		$(this).css("left",left+10+"px");
	});
}
function topMoveSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	seled.each(function(){
		var top = parseFloat($(this).css("top"));
		$(this).css("top",top-10+"px");
	});
}
function bottomMoveSeats(){
	var seled = $("#seatcontainerId ."+seledClass);

	seled.each(function(){
		var top = parseFloat($(this).css("top"));
		$(this).css("top",top+10+"px");
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

	
	
	// var topLayui = parent === self ? layui : top.layui;
	// if(topLayui){
	// 	topLayui.index.openTabsPage("arrange/meeting/meeting_room.html", "会场列表");
	// }else{
	// 	alert("数据已保存");
	// }

	// location.href = "meeting_room.html";
	// var html = '<div id="seatcontainerId">' + seats.html() + rownum.html() + '</div>';
	// localStorage.setItem("_completeSeats",html);
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




