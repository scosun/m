(function () {
    
    document.onmousedown = function () {
        var selList = [];
        //选中ids
        var ckids = [];
        //取消选中ids
        var sckids = [];

        if(showRuleIds.length > 0){
            showRuleIds.forEach(function(item){
                $("#" + item.seatid).removeClass('seled');
            })
            showRuleIds.length = 0;
        }
        
        var fileNodes = document.getElementsByTagName("div");
        for (var i = 0; i < fileNodes.length; i++) {
            if (fileNodes[i].className.indexOf("fileDiv") != -1) {
                // var classname = fileNodes[i].className.replace("fileDiv","");
                // fileNodes[i].className = classname + " fileDiv"; 
                selList.push(fileNodes[i]);
            }
        }

        

        var isSelect = true;
        var evt = window.event || arguments[0];
        var startX = (evt.x || evt.clientX);
        var startY = (evt.y || evt.clientY);
        var selDiv = document.createElement("div");
        // selDiv.style.cssText = "position:absolute;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1000;filter:alpha(opacity:60);opacity:0.6;display:none;";
        selDiv.style.cssText = "position:fixed;width:0px;height:0px;font-size:0px;margin:0px;padding:0px;border:1px dashed #0099FF;background-color:#C3D5ED;z-index:1;filter:alpha(opacity:60);opacity:0.6;display:none;";
        selDiv.id = "selectDiv";
        
        if($(".outline").length == 0){
            return;
        }
        $(".outline")[0].appendChild(selDiv);
        

        // selDiv.style.left = startX + "px";
        // selDiv.style.top = startY + "px";
        selDiv.style.left = "-100px";
        selDiv.style.top = "-100px";

        var _x = null;
        var _y = null;
        clearEventBubble(evt);



        document.onmousemove = function () {
            evt = window.event || arguments[0];
            if (isSelect) {
                if (selDiv.style.display == "none") {
                    selDiv.style.display = "";
                }
                _x = (evt.x || evt.clientX);
                _y = (evt.y || evt.clientY);

                var _stop = document.documentElement.scrollTop || document.body.scrollTop || 0;
                var _sleft = document.documentElement.scrollLeft || document.body.scrollLeft || 0;
                // _x = _x + _sleft;
                // _y = _y + _stop;

                selDiv.style.left = Math.min(_x, startX) + "px";
                selDiv.style.top = Math.min(_y, startY) + "px";
                selDiv.style.width = Math.abs(_x - startX) + "px";
                selDiv.style.height = Math.abs(_y - startY) + "px";
                if(Math.abs(_x - startX) < 5 && Math.abs(_y - startY) < 5){
                    return;
                }

                // ---------------- 关键算法 ---------------------  
                var _l = selDiv.offsetLeft+_sleft, _t = selDiv.offsetTop+_stop;
                var _w = selDiv.offsetWidth, _h = selDiv.offsetHeight;
                for (var i = 0; i < selList.length; i++) {
                    var sl = selList[i].offsetWidth + selList[i].offsetLeft;
                    var st = selList[i].offsetHeight + selList[i].offsetTop;
                    // console.log(selList[i].offsetWidth + selList[i].offsetLeft,sl,selList[i].offsetHeight + selList[i].offsetTop,st)
                    var sid = selList[i].id;
                    if (sl > _l && st > _t && selList[i].offsetLeft < _l + _w && selList[i].offsetTop < _t + _h) {
                        // console.log("------", sid, selList[i].className)

                        if(selList[i].className.indexOf("reseled") == -1){
                            //首先判断当选座位没有绑定规则
                            var rclass = ["R1","R2","R3","R4","R5","R6","R7","R8","R9","R10"];
                            var isr = false;
                            for(var r = 0; r < rclass.length; r++){
                                if(selList[i].className.indexOf(rclass[r]) != -1){
                                    isr = true;
                                    continue;
                                }
                            }
                            if(isr){
                                continue;
                            }
                        }

                        //在里面
                        if (selList[i].className.indexOf("seled") == -1) {
                            //当前没选中，需要选中
                            if (sckids.indexOf(sid) == -1) {
                                ckids.indexOf(sid) == -1 && ckids.push(sid);

                                //取消选中
                                // var classname = selList[i].className.replace("reseled", "");
                                // selList[i].className = classname + " seled"; 

                                selList[i].className = selList[i].className + " seled"; 
                            }
                        } else {
                            //当前已选中
                            if (ckids.indexOf(sid) == -1) {
                                // console.log("www---", sid, ckids);
                                sckids.indexOf(sid) == -1 && sckids.push(sid);
                                //取消选中
                                var classname = selList[i].className.replace("reseled", "");
                                classname = classname.replace("seled", "");
                                classname = classname.replace("R1", "");
                                classname = classname.replace("R2", "");
                                classname = classname.replace("R3", "");
                                classname = classname.replace("R4", "");
                                classname = classname.replace("R5", "");
                                classname = classname.replace("R6", "");
                                classname = classname.replace("R7", "");
                                classname = classname.replace("R8", "");
                                classname = classname.replace("R9", "");
                                classname = classname.replace("R10", "");
                                selList[i].className = classname;
                            }
                        }
                    } else {
                        // if (sid) {
                        //  console.log(ckids, sid, selList[i].className)
                        // }
                        if (sid && selList[i].className.indexOf("seled") != -1 && ckids.indexOf(sid) != -1) {
                            // ckids = ckids.filter(function(t){
                            //   return t != sid;
                            // })
                            var classname = selList[i].className.replace("seled","");
                            classname = classname.replace("fileDiv","");
                            selList[i].className = classname + "fileDiv";
                        }
                    }
                }

            }
            clearEventBubble(evt);
        }

        document.onmouseup = function () {
            isSelect = false;
            ckids = [];
            if (selDiv) {
                // document.body.removeChild(selDiv);
                $("#selectDiv").remove();
                showSelDiv(selList);
            }
            selList = null, _x = null, _y = null, selDiv = null, startX = null, startY = null, evt = null;
        }
    }
})();
function clearEventBubble(evt) {
    if (evt.stopPropagation)
        evt.stopPropagation();
    else
        evt.cancelBubble = true;
    // if (evt.preventDefault)
    //  evt.preventDefault();
    // else
    //  evt.returnValue = false;
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
function setSeatRule(){
    var ruleid = $("#ruleselect").val();
    var isincrement = $("#isincrement").val() - 0;

    if(isaddrule){
        if(ckids_now && ckids_now.length > 0){
            var rule = [];
            for(var i = 0,len = ckids_now.length; i < len; i++){
                rule.push({"seatid":ckids_now[i],"attender":""});
            }
            this.saveSeatRule(rule,ruleid,temp_ruletemplateid,roomtemplateid,isincrement);
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
                this.resetChangeSeartIds();
            }else{
                // alert("没有选择任何座位")
            }
        }else{
            if(changeRuleZone && changeRuleZone.length > 0){
                // changeRuleZone.forEach(function(item){
                //  item.ruleid = ruleid;
                // })
                this.updateSeatRule(changeRuleZone,ruleid,isincrement);
            }
        }
        
    }
}

function saveSeatRule(rule,ruleid,temp_ruletemplateid,roomtemplateid,isincrement){
    // var rule = [];
    // rule.push({"seatid":"1-1","ruleid":"1"});
    var temp_ruletemplateid=sessionStorage.getItem("id");
    var roomtemplateid=sessionStorage.getItem("roomid");

    var data = {};
    data.action = "add";
    data.rule = rule;
    data.ruleid = ruleid;
    data.temp_ruletemplateid = temp_ruletemplateid;
    data.roomtemplateid = roomtemplateid;
    data.isincrement = isincrement;

    $.ajax({
        type: "POST",
        url: "https://www.longjuli.com/ruletemplate_add_next_do.php",
        data: data,
        dataType:'json',
        success: function(data){
            // console.log(data)
            // $("#myDiv").html('<h2>'+data+'</h2>');
            if(data.state){
                for(var i = 0,len = ckids_now.length; i < len; i++){
                    // console.log($("#" + ckids_now[i]).attr("class"))
                    $("#" + ckids_now[i]).removeClass('seled');
                    $("#" + ckids_now[i]).addClass(ruleid);
                    // console.log($("#" + ckids_now[i]).attr("class"))
                }

                // window.frames["mainid"].contentWindow.location.reload();
                $('#example23').DataTable().ajax.reload();
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
        url: "https://www.longjuli.com/ruletemplate_add_next_do.php",
        data: data,
        dataType:'json',
        success: function(data){
            // console.log(data)
            // $("#myDiv").html('<h2>'+data+'</h2>');
            if(data.state){
                for(var i = 0,len = rule.length; i < len; i++){
                    // console.log($("#" + ckids_now[i]).attr("class"))
                    $("#" + rule[i].seatid).removeClass(oldruleid);
                    $("#" + rule[i].seatid).addClass(ruleid);
                    // console.log($("#" + ckids_now[i]).attr("class"))
                }
                //window.frames["mainid"].contentWindow.location.reload();
                $('#example23').DataTable().ajax.reload();
            }else{
                alert("设置失败");
            }
        }
    });   
}


function queryAllSeatStatus(){
    var data = {};
    data.action = "s";
//  var temp_ruletemplateid = 0;
// var roomtemplateid = 0;
    data.rule_id=sessionStorage.getItem("id");
    data.room_id=sessionStorage.getItem("roomid");

    // data.rule_id = temp_ruletemplateid;
    // data.room_id = roomtemplateid;
    // rule_id=180&room_id=67
    $.ajax({
        type: "POST",
        url: "https://www.longjuli.com/ruletemplate_add_next_do.php",
        data: data,
        dataType:'json',
        success: function(data){
            if(data && data instanceof Array){
                console.log(data)
                setSeatStatus(data);
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
        url: "https://www.longjuli.com/ruletemplate_add_next_do.php",
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


function setSeatStatus(data){
    console.log("001----显示颜色");
    if(data && data instanceof Array){
        for(var i = 0,len = data.length; i < len; i++){
            var items = data[i] || [];
            items.forEach(function(item){
                $("#" + item.seatid).addClass(items[0].ruleid);
            });
        }
    }
    
}

var showRuleIds = [];
function querySeatById(rulezone){
    resetChangeSeartIds();

    

    // if(showRuleIds.length > 0){
    //  showRuleIds.forEach(function(item){
    //      $("#" + item.seatid).removeClass('seled');
    //  });
    // }
    console.log("点击选区成功");
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
            $("#" + item.seatid).removeClass();
            $("#" + item.seatid).addClass('fileDiv');
        });
    }
}


var changeRuleZone = [];
var rulerecordid = 0;
var oldruleid = 0;
var oldisincrement = 0;
function changeSeatRuleById(id,rulezone,ruleid,isincrement){
    console.log("changeSeatRuleById----",id,rulezone,ruleid);

    resetChangeSeartIds();

    $("#dialog").css('display','block');
    $("#dialogbk").css('display','block');

    // var $modal = $('#doc-modal-1');
    // $modal.modal('toggle');

    isaddrule = false;
    changeRuleZone = rulezone || [];
    rulerecordid = id;
    oldruleid = ruleid;
    oldisincrement = isincrement;
    $("#ruleselect").val(ruleid);
    $("#isincrement").val(isincrement);
}

var changeSeatIds = [];
function changeSeatRuleArea(id,rulezone,ruleid,isincrement){
    console.log("changeSeatRuleArea----",id,rulezone,ruleid);

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

function resetChangeSeartIds(){
    $(".seled").removeClass("seled");
    if(changeSeatIds.length > 0){
        changeSeatIds.forEach(function(item){
            $("#" + item).removeClass('reseled');
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
$(function(){
    temp_ruletemplateid = getCookie("temp_ruletemplateid") - 0 || 0;
    roomtemplateid = GetQueryString("roomtemplateid") - 0;

    queryAllSeatStatus();
    
    $("#enterbtn").bind('click',function(evt){
        // var $modal = $('#dialog');
        // $modal.modal('close');
        $("#dialog").css('display','none');
        $("#dialogbk").css('display','none');
        // $modal.css();
        
        if (evt.stopPropagation)
            evt.stopPropagation();
        else
            evt.cancelBubble = true;
        if (evt.preventDefault)
            evt.preventDefault();
        else
            evt.returnValue = false;

        setSeatRule();
    });


    // WebSocketInit();
});

function WebSocketInit(){
    //主机地址
    var wsUrl = "ws://221.214.51.75:9000/video";
    //视频流地址
    var rtspUrl = "rtsp://192.168.10.45/user=admin&password=&channel=1&stream=0.sdp?";
    //websocket连接
    var ws = wsUrl + "?url=" + encodeURIComponent(rtspUrl);

    console.info(ws);
    
    var output;

    //初始化操作
    // testWebSocket();

    function testWebSocket() {
        websocket = new WebSocket(ws);
        websocket.onopen = function(evt) {
            onOpen(evt)
        };
        websocket.onclose = function(evt) {
            onClose(evt)
        };
        websocket.onmessage = function(evt) {
            onMessage(evt)
        };
        websocket.onerror = function(evt) {
            onError(evt)
        };
    }

    function onOpen(evt) {
        writeToScreen("CONNECTED");
        doSend("WebSocket rocks");
    }

    function onClose(evt) {
        writeToScreen("DISCONNECTED");
    }

    //收到消息
    function onMessage(evt) {
        // var obj = eval('(' + evt.data + ')');
        // image = obj['data']['face']['image'];
        // if(obj['type']=='recognized' || obj['type']=='unrecognized'){
        //  writeFace(obj['type']+'</br><img height="100" width="100" src="data:image/png;base64,' + image + '"/>');
        // }
        //关闭连接
        //websocket.close();
    }

    function onError(evt) {
        writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
    }

    function doSend(message) {
        writeToScreen("SENT: " + message);
        websocket.send(message);
    }

    //输出识别结果到屏幕
    function writeFace(message) {
        // var result = document.getElementById("msg");
        // var pre = document.createElement("div");
        // //pre.style.wordWrap = "break-word";
        // pre.style.display="inline-block";
        // pre.style.margin="10px";
        // pre.innerHTML = message;
        // output.appendChild(pre);
    }
    function writeToScreen(message) {
        console.log("-----",message)
        // var result = document.getElementById("test");
        // var pre = document.createElement("p");
        // pre.style.wordWrap = "break-word";       
        // pre.innerHTML = message;
        // output.appendChild(pre);
    }
}

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

