

function autoLogin(){
    $.ajax({
        url: "https://f.longjuli.com/loginApp",
        type: "post",
        data:{
            username:"15621308386",
            password:"admin321"
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(obj) {
            if(obj.code == 0){
                var token = obj.token;
                location.href = location.href + "&token=" + token;
            }else{
                alert("登录失败");
            }
        },
        error:function(){
        }
    });

}


$(function(){
    var baseUrl = "https://f.longjuli.com";
    var mbaseUrl = "https://m.longjuli.com";

    var seatMapsControl = new SeatMapsControl();


    function getUrlParam(name) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var uri = window.location.search;
        //匹配目标参数
        var r = uri.substr(1).match(reg);
        //返回参数值
        if (r != null) return r[2]; return null;
    }
    var meetingid = +getUrlParam("meetingid") || null;
    var token = getUrlParam("token") || null;
    
    // 座区数据
    var showSeatsData = [];

    // $("#meetingname").val(meetingname);

    //开发使用，做一次自动登录
    if(!token){
        autoLogin();
        return;
    }

    var roomId = 0;

    if(!meetingid){
        if(typeof H5JsMeeting != "undefined"){
            H5JsMeeting.showTipsDialog("没有获取到会议id");
        }else{
            alert("没有获取到会议id");
        }
        return;
    }

    $.ajax({
        url: baseUrl+"/meeting/findroomBymeetingid",
        type: "get",
        beforeSend: function(request) {
            request.setRequestHeader("token",token);
        },
        data:{
            id:meetingid
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(obj) {
            // console.log("findroomBymeetingid-----",data);
            var code = obj.code;
            if(code == 0){
                var data = obj.data || [];
                buildMeetTabHtml(data[0]);
            }else{
                if(typeof H5JsMeeting != "undefined"){
                    H5JsMeeting.showTipsDialog("获取会议会议室数据错误");
                }else{
                    alert("获取会议会议室数据错误");
                }
            }
        },
        error:function(){
        }
    });

    function buildMeetTabHtml(item){
        getRoomTemplateCode(item.roomid);
    }

    function getRoomTemplateCode(roomid){
        roomId = roomid;

        $.ajax({
            url: baseUrl+"/roomtemplate/findByIdTemplatecode",
            type: "post",
            beforeSend: function(request) {
                request.setRequestHeader("token",token);
            },
            async: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                "id": roomid,
            },
            success: function(obj) {
                console.log("findByIdTemplatecode---",obj);
                var code = obj.code;
                if(code == 0){
                    var datas = obj.data || {};
                    // $("#seatsbody").append(datas.templatecode);
                    datas.templatecode = datas.templatecode.replace('style="position: fixed;left: 25px;top: 15px;"','style="position: fixed;left: 25px;top: 125px;"')
                    datas.templatecode = datas.templatecode.replace('../../../images/leftright-ts.svg','')

                    $("#seatsbody").html(datas.templatecode);
                    
                    //获取 会议 名称
                    getMeetInfo();
                    
                    // 激活单选
                    seatMapsControl.bindOneSeats();

                    //群控缓存数据
                    // getCacheData();
                    __signControl.getCacheData(roomId);

                    // if(showSeatsData.length == 0){
                    //     // 初始化没有数据，查询show接口查名字
                    //     queryAllSeatStatusByShow();
                    // }else{
                    //     changeSeatColor(showSeatsData);
                    // }
                }else{
                    // alert("获取会议室模板错误");
                    if(typeof H5JsMeeting != "undefined"){
                        H5JsMeeting.showTipsDialog("获取会议室模板错误");
                    }
                }
            },
            error:function(){
            }
        });
    }

    function getMeetInfo(){
        $.ajax({
            url: baseUrl+"/meeting/findByMeeting",
            type: "get",
            beforeSend: function(request) {
                request.setRequestHeader("token",token);
            },
            async: true,
            xhrFields: {
                withCredentials: true
            },
            data: {
                "id": meetingid,
            },
            success: function(obj) {
                var code = obj.code;
                if(code == 0){
                    var datas = obj.data || {};
                    $("#meetingname").text(datas[0].name);
                    $("#meetingaddress").text("地点："+datas[0].address);
                    $("#meetingremark").text("备注："+datas[0].memo);
                    $("#meetingtime").text("时间："+datas[0].meetingtime);
                }
            }
        });
    }
    

    /*
    function queryAllSeatStatusByShow(){
        $.ajax({
            async: true,
            type: "get",
            url: mbaseUrl +"/v1/meetings/show?meeting_id="+meetingid,
            dataType: "json",
            success: function(obj) {
                console.log("--queryAllSeatStatusByShow---");
                // 清空拖拽排序的数据
                dragSortData = [];

                if(obj && obj.attendees){
                    // 保存show接口返回的人名数据
                    showSeatsData = obj.attendees || [];

                    changeSeatColor(obj.attendees);
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }

    function changeSeatColor(attendees){
        // debugger
        if(attendees.length > 0){

            // $("#nav-uploadseat").hide();
            // $("#nav-uploadseatbtn").show();


            // var ruleselect = $("#ruleselect").val() || "";
            var ruleselect = "";

            if(ruleselect == ""){
                for(var i = 0,len = attendees.length; i < len; i++){
                    // {"seatid":"1-1","attender":"028","id":"39"}
                    var item = attendees[i] || {};
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){
                        $("#" + item.seatid).css("background-color","");
                        $("#" + item.seatid).html(item.attender);
                    }
                }
            }else if(ruleselect == 1){
                for(var i = 0,len = attendees.length; i < len; i++){
                    // {"seatid":"1-1","attender":"028","id":"39"}
                    var item = attendees[i] || {};
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){
                        $("#" + item.seatid).css("background-color",item.bgcolor);
                        $("#" + item.seatid).html(item.attender);
                        // serverSeatIds.push(item.seatid);
                    }
                }
            }else{
                var colorsids = [];
                attendees.forEach(function(item){
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){
                        var colors = item.colors;
                        var cid = colors[ruleselect];
                        if(colorsids.indexOf(cid) == -1){
                            colorsids.push(cid);
                        }
                    }
                });
                var colorsobj = {};
                var cli = 0;
                colorsids.forEach(function(item){
                    colorsobj[item] = seatcolors[cli];
                    cli++;
                    if(cli==5){
                        cli=0;
                    }
                });

                attendees.forEach(function(item){
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){
                        var colors = item.colors;
                        var cid = colors[ruleselect];
                        var cc = colorsobj[cid];
                        $("#" + item.seatid).css("background-color",cc);
                    }
                });
            }
        }else{
            $("#nav-uploadseat").show();
            $("#nav-uploadseatbtn").hide();

            var seats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
            seats.css("background-color","");
            seats.each(function(){
                var ids = $(this).attr("id").split("-");
                $(this).text(ids[3]);
            });
        }
    }

    function changeDragSeatColor(attendees){
        if(attendees.length > 0){
            // serverSeatIds = [];
            for(var i = 0,len = attendees.length; i < len; i++){
                // {"seatid":"1-1","attender":"028","id":"39"}
                var item = attendees[i] || {};
                //多会场判断只加载当前会议室的数据
                if(item.roomtemplate_id == roomId){
                    // 拖拽完不显示颜色
                    // $("#" + item.seatid).css("background-color",item.bgcolor);
                    $("#" + item.seatid).css("background-color","");
                    $("#" + item.seatid).html(item.attender);
                    // serverSeatIds.push(item.seatid);
                }
            }
        }
    }
    
    function setSeatData(data){
        // console.log(data)
        $.ajax({
            async: true,
            type: "post",
            data: JSON.stringify(data),
            contentType: 'application/json', 
            url: mbaseUrl +"/v1/meetings/store",
            dataType: "json",
            success: function(obj) {
                // console.log("--setSeatData---",obj);
                if(obj && obj.attendees){
                    //保存完之后，要重新查一下吗
                    queryAllSeatStatusByShow();

                    // 激活单选
                    seatMapsControl.bindOneSeats();
                    
                    if(__saveTip){
                        if(typeof H5JsMeeting != "undefined"){
                            H5JsMeeting.showTipsDialog("保存成功");
                        }else{
                            alert("保存成功");
                        }
                    }
                }else{
                }

                __saveTip = false;
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }
    
    function queryAllSeatStatusByShow(){
        $.ajax({
            async: true,
            type: "get",
            url: mbaseUrl +"/v1/meetings/show?meeting_id="+meetingid,
            dataType: "json",
            success: function(obj) {
                console.log("--queryAllSeatStatusByShow---");
                // 清空拖拽排序的数据
                dragSortData = [];

                if(obj && obj.attendees){
                    // 保存show接口返回的人名数据
                    showSeatsData = obj.attendees || [];

                    changeSeatColor(obj.attendees);
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }
    */




    window.__saveDragSort = saveDragSort;
    function saveDragSort(pid,id){
        var condi = {};
        condi.meeting_id = meetingid;
        condi.room_id = +roomId;
        condi.seat_id = id;
        condi.attendee_ids = [pid];

        $.ajax({
            type: "post",
            url: mbaseUrl +"/v1/meetings/drag_sort",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(condi),
            success: function(obj) {
                console.log("pending-----",obj);
                if(obj && obj.attendees){
                    dragSortData.push(obj.attendees);

                    changeDragSeatColor(obj.attendees);
                }
            },
            error:function(obj){
                // layer.msg(obj.responseJSON.msg || "drag_sort--error");
                // console.log("drag_sort--error",obj.responseJSON.msg)
            }
        });
    }

    window.__saveSeats = saveSeats;
    function saveSeats(){
        var seats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
        var seatsobj = {
            meeting_id: +meetingid,
            attendees:[]
        };
        var ids = {};
        var names = {};
        
        showSeatsData.forEach(function(item){
            if(item.roomtemplate_id == roomId){
                ids[item.seatid] = item.id;
                names[item.seatid] = item.attender;
            }else{
                //其它会议室的数据
                seatsobj.attendees.push(item);
            }
        });
        if(dragSortData){
            dragSortData.forEach(function(sort){
                sort.forEach(function(item){
                    if(item.roomtemplate_id == roomId){
                        ids[item.seatid] = item.id;
                        names[item.seatid] = item.attender;
                    }else{
                        //其它会议室的数据
                        seatsobj.attendees.push(item);
                    }
                });
            });
        }
        // console.log(ids,names)

        seats.each(function(){
            var name = $(this).text() || "";
            var reg = /^\d+/g;
            var id = this.id;
            if(name != "" && !reg.test(name)){
                if(ids[id]){
                    //如果座位的id, 在人员数据里面, 说明这个人员不是新增的
                    if(names[id] == name){
                        seatsobj.attendees.push({id:ids[id],attender:name,seatid:id,roomtemplate_id:+roomId});
                    }else{
                        //挪动名字之后  原来的位置名字跟id对不上，就没传id
                        // seatsobj.attendees.push({attender:name,seatid:id,roomtemplate_id:+roomId});
                        var sid = $(this).attr("sid");
                        if(ids[sid]){
                            // 挪动名字需要把原来的id带回去
                            seatsobj.attendees.push({id:ids[sid],attender:name,seatid:id,roomtemplate_id:+roomId});
                        }else{
                            // 右键添加名字没有id
                            seatsobj.attendees.push({attender:name,seatid:id,roomtemplate_id:+roomId});
                        }
                    }
                }else{
                    // 新加名字  或者 挪动
                    var sid = $(this).attr("sid");
                    if(ids[sid]){
                        // 挪动名字需要把原来的id带回去
                        seatsobj.attendees.push({id:ids[sid],attender:name,seatid:id,roomtemplate_id:+roomId});
                    }else{
                        // 右键添加名字没有id
                        seatsobj.attendees.push({attender:name,seatid:id,roomtemplate_id:+roomId});
                    }
                }
            }
        });
        /*
        座区图保存规则
        1.当名字和位置都没有变化，传递原来的id,name,seatid;
        2.当把名字挪动到其它空白位置，不修改原来的名字，传递名字原来的座位id,name,新的seatid;
        3.当进行座区交换名字，应该也是传递名字原来的座位id,name,新的seatid;同2一样;

        4.当修改座位上原有名字 传递新的name 和 seatid;
        5.当使用右键在空间座区添加新名字，传递新建的name 和 seatid
        */
        setSeatData(seatsobj);
    }

    window.__deleteBingName = deleteBingName;
    function deleteBingName(){
        var seled = $("#seatcontainerId .seatdiv.seled:not(.rownumseats)");
        seled.each(function(){
            $(this).css("background-color","");
            var ids = $(this).attr("id").split("-");
            $(this).text(ids[3]);
        });
        seled.removeClass("seled");
        saveSeats();
    }



        
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
});