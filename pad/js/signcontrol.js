
function SignControl(){

}


var SignControl = function (obj){
	this.init.apply(this,arguments);
};

SignControl.prototype = {
    constructor:SignControl,
    roomId:0,
    meetingId:0,
    baseUrl:"https://f.longjuli.com",
    mbaseUrl:"https://m.longjuli.com",
    meetWs:null,
    meetingType:-1,
    backComplete:1,
    userName:"",
    meetingStatus:0,
    seatId:0,
	init: function(){
        console.log("signcontrol-----init");

        function getUrlParam(name) {
            //构造一个含有目标参数的正则表达式对象
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var uri = window.location.search;
            //匹配目标参数
            var r = uri.substr(1).match(reg);
            //返回参数值
            if (r != null) return r[2]; return null;
        }
        var username = getUrlParam("username") || null;
        // console.log("username----",username);
        if(!username){
            // if(typeof H5JsMeeting != "undefined"){
            //     H5JsMeeting.showTipsDialog("没有获取到username");
            // }else{
            //     alert("没有获取到username");
            // }
            // return;
        }else{
            // if(typeof H5JsMeeting != "undefined"){
            //     H5JsMeeting.showTipsDialog(username);
            // }
            this.userName = username;

            this.createMeetWebSocket(username);
        }
        // $(window).bind("beforeunload",this.stopMeetWebSocket.bind(this));
	},
	bindEvent:function(){
       
    },
    readyMeeting:function(obj){
        // 1: 准备会议发送成功；-1: 准备会议失败； 
        if(+obj.meetingState == 1){
            $("#" + obj.seatid).removeClass();
            $("#" + obj.seatid).addClass("seatdiv sm1");
        }else{
            $("#" + obj.seatid).removeClass();
            $("#" + obj.seatid).addClass("seatdiv sm11");
        }
        //当前状态已完成
        var status = +obj.status;
        if(status == 1){
            this.backComplete = 1;
            //调用native 通知会议准备完成，可以点 会议开始，重启会议，设备重置
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.finishSeatStatus(1);
            }
        }
    },
    startMeeting:function(obj){
        // 2：开始会议发送成功；-2：开始会议发送失败；
        if(+obj.meetingState == 2){
            $("#" + obj.seatid).removeClass();
            $("#" + obj.seatid).text(obj.name);
            $("#" + obj.seatid).addClass("seatdiv sm1");
        }
        //当前状态已完成
        var status = +obj.status;
        if(status == 1){
            this.backComplete = 1;
            //调用native 通知会议开始完成，可以点 会议暂停，会议结束，重启会议，设备重置
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.finishSeatStatus(2);
            }
        }
    },
    stopMeeting:function(obj){
        // 3: 暂停会议成功；-3：暂停会议失败；
        if(+obj.meetingState == 3){
            $("#" + obj.seatid).removeClass();
            $("#" + obj.seatid).addClass("seatdiv sm3");
        }else{
            $("#" + obj.seatid).removeClass();
            $("#" + obj.seatid).addClass("seatdiv sm33");
        }
        if(obj.name){
            $("#" + obj.seatid).text(obj.name);
        }
        //当前状态已完成
        var status = +obj.status;
        if(status == 1){
            this.backComplete = 1;
            //调用native 通知会议暂停完成，可以点 会议恢复，会议结束，重启会议，设备重置
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.finishSeatStatus(3);
            }
        }
    },
    restoreMeeting:function(obj){
        // 4: 恢复会议成功；-4: 恢复会议失败；
        if(+obj.meetingState == 4){
            $("#" + obj.seatid).removeClass();
            $("#" + obj.seatid).addClass("seatdiv sm1");
        }else{
            // $("#" + obj.seatid).removeClass("sm33");
        }
        if(obj.name){
            $("#" + obj.seatid).text(obj.name);
        }
        //当前状态已完成
        var status = +obj.status;
        if(status == 1){
            this.backComplete = 1;
            //调用native 通知会议恢复完成，可以点 会议暂停，会议结束，重启会议，设备重置
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.finishSeatStatus(2);
            }
        }
    },
    finishMeeting:function(obj){
        // 5：结束会议成功; -5:结束会议失败； 
        if(+obj.meetingState == 5){
            $("#" + obj.seatid).removeClass();
            $("#" + obj.seatid).addClass("seatdiv sm5");
        }else{
            $("#" + obj.seatid).removeClass();
            $("#" + obj.seatid).addClass("seatdiv sm55");
        }
        if(obj.name){
            $("#" + obj.seatid).text(obj.name);
        }
        //当前状态已完成
        var status = +obj.status;
        if(status == 1){
            this.backComplete = 1;
            //调用native 通知会议结束完成，可以点 会议开始，重启会议，设备重置
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.finishSeatStatus(5);
            }
        }
    },
    rebootMeeting:function(obj){
        var ele = $("#" + obj.seatid);
        // 6: 重启会议成功；-6: 重启会议失败；
        if(+obj.meetingState == 6){
            ele.removeClass();
            ele.addClass("seatdiv sm1");
        }else{
            ele.removeClass();
            ele.addClass("seatdiv sm11");
        }
        //当前状态已完成
        var status = +obj.status;
        if(status == 1){
            this.backComplete = 1;
            //调用native 通知会议重启完成，可以点 会议开始，重启会议，设备重置
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.finishSeatStatus(6);
            }
        }
    },
    resetMeeting:function(obj){
        var ele = $("#" + obj.seatid);
        // 7: 重置桌牌成功；-7：重置桌牌失败；
        if(obj.meetingState == 7){
            ele.removeClass("sm1 sm11 sm3 sm33 sm77 sm5 sm55");
        }else{
            ele.removeClass("sm1 sm11 sm3 sm33 sm77 sm5 sm55");
            //重置失败，要不要有颜色标识
            ele.addClass("sm77");
        }
        var id = obj.seatid || "";
        if(id){
            var num = id.split('-')[3];
            ele.text(num);
        }

        //当前状态已完成
        var status = +obj.status;
        if(status == 1){
            this.backComplete = 1;
            //调用native 通知重置桌牌完成，可以点 会议准备，设备重置
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.finishSeatStatus(7);
            }
        }
    },


    createMeetWebSocket:function(username){
        if("WebSocket" in window){
            var t = this;

            // 打开一个 web socket
            // var ws = new WebSocket("ws://f.longjuli.com/cardWebSocket/shuxian");
            // var ws = new WebSocket("ws://m.longjuli.com:8083/cardWebSocket/" + username);
            var ws = new WebSocket("wss://f.longjuli.com/cardWebSocket/" + username);

            // if(typeof H5JsMeeting != "undefined"){
            //     H5JsMeeting.showTipsDialog("wss://f.longjuli.com/cardWebSocket/" + username);
            // }

            ws.onopen = function(){
                t.meetWs = ws;
                // if(typeof H5JsMeeting != "undefined"){
                //     H5JsMeeting.showTipsDialog("ws----open");
                // }
                console.log("ws----open");
            }
            
            ws.onmessage = function (evt) {
                var received_msg = evt.data || "";
                
                // console.log("onmessage-----",received_msg)
                t.meetWebSocketMessage(received_msg);
                
                // {
                //     "name": 名字,
                //     "seatid": 1-1-1(座位号),
                //     "roomid": 70(会议室id),
                //     "meetingState": 0(会议状态),
                //     "productKey": productKey(产品key),
                //     "deviceName": deviceName(设备key),
                //     "deviceStatus": deviceStatus(设备状态)
                // }

            };

            //连接关闭的回调方法
            ws.onclose = function(){
                // console.log("ws----close");
                t.createMeetWebSocket(t.userName);
            }
        }else{
            // 浏览器不支持 WebSocket
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.showTipsDialog("您的浏览器不支持 WebSocket!");
            }
        }
    },
    stopMeetWebSocket:function(){
        if(this.meetWs){
            this.meetWs.close();
        }else{
           // 浏览器不支持 WebSocket
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.showTipsDialog("您的浏览器不支持 WebSocket!");
            }
        }
    },
    meetWebSocketMessage(received_msg){
        console.log("数据已接收...",received_msg);

        if(this.backComplete == 1){
            return;
        }

        var t = this;

        // t.backComplete = 0;


        // if(typeof H5JsMeeting != "undefined"){
        //     H5JsMeeting.showTipsDialog("ws----onmessage-----"+received_msg);
        // }
        


        // 会议状态
        // 0：未发送；
        // 1：开始会议发送成功；-1：开始会议发送失败；
        // 2：结束会议成功; -2:结束会议失败；
        // 3: 准备会议发送成功；-3: 准备会议失败；
        // 4: 暂停会议成功；-4：暂停会议失败；
        // 5: 恢复会议成功；-5: 恢复会议失败；
        // 6: 重启会议成功；-6: 重启会议失败；
        // 7: 重置桌牌成功；-7：重置桌牌失败；


        /**
         * 会议状态
         * 0：未发送；
         * 1: 准备会议发送成功；-1: 准备会议失败；
         * 2：开始会议发送成功；-2：开始会议发送失败；
         * 3: 暂停会议成功；-3：暂停会议失败；
         * 4: 恢复会议成功；-4: 恢复会议失败；
         * 5：结束会议成功; -5:结束会议失败；
         * 6: 重启会议成功；-6: 重启会议失败；
         * 7: 重置桌牌成功；-7：重置桌牌失败
         * 8: 发送名字
         */
        
        // name=测试199, seatid=2-10-10, roomid=410, meetingState=3, productKey=productKey199, deviceName=deviceName199, deviceStatus=ONLINE
        
        // 数据已接收... {"name":"王建武","seatid":"s-5-9-1","meetingid":"438","meetingState":"1","productKey":"a1WR8Q6XiEK","deviceName":"d896e0e00000f266","roomid":"334","deviceStatus":"ONLINE","status":"0"}
        // 数据已接收... {"name":"丁来杭","seatid":"s-5-1-1","meetingid":"438","meetingState":"1","productKey":"a1WR8Q6XiEK","deviceName":"d896e0e00000f28c","roomid":"334","deviceStatus":"ONLINE","status":"0"}
        // 数据已接收... {"name":"王建武","seatid":"s-5-9-1","meetingid":"438","meetingState":"1","productKey":"a1WR8Q6XiEK","deviceName":"d896e0e00000f266","roomid":"334","deviceStatus":"ONLINE","status":"0"}
        // 数据已接收... {"name":"乙晓光","seatid":"s-5-1-2","meetingid":"438","meetingState":"-1","productKey":"a1WR8Q6XiEK","deviceName":"d896e00009000688","roomid":"334","deviceStatus":"UNACTIVE"}
        // 数据已接收... {"meetingState":"1","status":"1"}

        try{
            var obj = received_msg;
            if(typeof received_msg == "string"){
                obj = JSON.parse(received_msg);
            }
            
            var meetingState = +obj.meetingState;
            if(meetingState == 1 || meetingState == -1){
                t.readyMeeting(obj);
            }else if(meetingState == 2 || meetingState == -2){
                t.startMeeting(obj);
            }else if(meetingState == 3 || meetingState == -3){
                t.stopMeeting(obj);
            }else if(meetingState == 4 || meetingState == -4){
                t.restoreMeeting(obj);
            }else if(meetingState == 5 || meetingState == -5){
                t.finishMeeting(obj);
            }else if(meetingState == 6 || meetingState == -6){
                t.rebootMeeting(obj);
            }else if(meetingState == 7 || meetingState == -7){
                t.resetMeeting(obj);
            }
            
        }catch(ex){
            if(typeof H5JsMeeting != "undefined"){
                H5JsMeeting.showTipsDialog("ws----onmessage-----catch");
            }
        }
    },
    // startMeetWebSocket(){
    //     if (this.meetWs){
    //         // Web Socket 已连接上，使用 send() 方法发送数据
    //         console.log("数据发送中...",this.roomId+"&faceTest");
    //         // var msgid = layer.msg("设备启动中...")
    //         this.meetWs.send(this.roomId+"&faceTest");
            
    //     }else{
    //        // 浏览器不支持 WebSocket
    //        alert("您的浏览器不支持 WebSocket!");
    //     }
    // },


    showStatusTip:function(msg){
        $("#errortip").html('<span>'+msg+'...</span>');

        $("#errortip").show();
        setTimeout(function(){
            $("#errortip").hide();
        },2500);
    },

    appTableSignControl:function(type){
        // -1.默认 可以点， 会议准备， 设备重启
        // 1.会议准备完成，可以点 会议准备，会议开始，重启会议，设备重置
        // 2.会议开始完成，可以点 开始完成，会议暂停，会议结束，重启会议，设备重置
        // 3.会议暂停完成，可以点 会议暂停，会议恢复，会议结束，重启会议，设备重置
        // 4.会议恢复完成，可以点 会议暂停，会议恢复，会议结束，重启会议，设备重置
        // 5.会议结束完成，可以点 会议准备，会议结束，重启会议，设备重置
        // 6.会议重启完成，可以点 会议准备，重启会议，设备重置
        // 7.重置桌牌完成，可以点 会议准备，设备重置

        // if(typeof H5JsMeeting != "undefined"){
        //     H5JsMeeting.showTipsDialog("type----"+type);
        // }

        if(this.backComplete == 0){
            if(this.meetingType === 1){
                // if(!(type === 1 || type === 2 || type === 6 || type === 7)){
                    this.showStatusTip("会议准备中");
                    return;
                // }
            }else if(this.meetingType === 2){
                // if(!(type === 2 || type === 3 || type === 5 || type === 6 || type === 7)){
                    this.showStatusTip("会议开始中");
                    return;
                // }
            }else if(this.meetingType === 3){
                // if(!(type === 3 || type === 4 || type === 5 || type === 6 || type === 7)){
                    this.showStatusTip("会议暂停中");
                    return;
                // }
            }else if(this.meetingType === 4){
                // if(!(type === 3 || type === 4 || type === 5 || type === 6 || type === 7)){
                    this.showStatusTip("会议恢复中");
                    return;
                // }
            }else if(this.meetingType === 5){
                // if(!(type === 1 || type === 5 || type === 6 || type === 7)){
                    this.showStatusTip("会议结束中");
                    return;
                // }
            }else if(this.meetingType === 6){
                // if(!(type === 1 || type === 6 || type === 7)){
                    this.showStatusTip("会议重启中");
                    return;
                // }
            }else if(this.meetingType === 7){
                // if(!(type === 1 || type === 7)){
                    this.showStatusTip("桌牌重启中");
                    return;
                // }
            }
            return;
        }

        if(this.meetingType === -1){
            if(!(type === 1 || type === 7)){
                return;
            }
        }else if(this.meetingType === 1){
            if(!(type === 1 || type === 2 || type === 6 || type === 7)){
                return;
            }
        }else if(this.meetingType === 2){
            if(!(type === 2 || type === 3 || type === 5 || type === 6 || type === 7)){
                return;
            }
        }else if(this.meetingType === 3){
            if(!(type === 3 || type === 4 || type === 5 || type === 6 || type === 7)){
                return;
            }
        }else if(this.meetingType === 4){
            if(!(type === 3 || type === 4 || type === 5 || type === 6 || type === 7)){
                return;
            }
        }else if(this.meetingType === 5){
            if(!(type === 1 || type === 5 || type === 6 || type === 7)){
                return;
            }
        }else if(this.meetingType === 6){
            if(!(type === 1 || type === 6 || type === 7)){
                return;
            }
        }else if(this.meetingType === 7){
            if(!(type === 1 || type === 7)){
                return;
            }
        }
        this.meetingType = type;
        if(type === 5){
            //会议结束
            // var seats = $("#seatcontainerId .seatdiv");
            // seats.removeClass("sm1 sm33 sm3 sm33 sm77");
        }
        if(type === 6){
            var seats = $("#seatcontainerId .seatdiv");
            seats.removeClass("sm1 sm11 sm3 sm33 sm77 sm5 sm55");
            seats.each(function(i,item){
                var id = item.id;
                var num = id.split('-')[3];
                $(item).text(num);
            });
        }

        // if(typeof H5JsMeeting != "undefined"){
        //     H5JsMeeting.showTipsDialog("type--ajax--------------"+type);
        // }
        
        this.backComplete = 0;

        $.ajax({
            async: true,
            type: "post",
            // url: this.baseUrl +"/tableSign/appTableSignControlTest",
            url: this.baseUrl +"/tableSign/appTableSignControl",
            // dataType: "json",
            data:{type:type,roomid:this.roomId,meetingid:this.meetingId,phone:this.userName},
            success: function(obj) {
                console.log("success")
            },
            //失败的回调函数
            error: function() {
                this.backComplete = 1;
                console.log("error")
            }.bind(this)
        });
    },

	getCacheData:function(roomid,meetingid){
        this.roomId = roomid;
        this.meetingId = meetingid;
        $.ajax({
            async: true,
            type: "post",
            // url: this.baseUrl +"/tableSign/getCacheData?roomid="+this.roomId,
            // url: this.baseUrl +"/tableSign/getCacheDataTest",
            url: this.baseUrl +"/tableSign/getCacheData",
            // data:{roomid:this.roomId},
            data:{roomid:roomid},
            dataType: "json",
            success: function(obj) {
                if(obj.code == 0){
                    var data = obj.data || [];
                    this.loadCacheData(data);
                }else{
                    alert("获取缓存数据失败");
                }
            }.bind(this),
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    },

    loadCacheData:function(data){
        data.forEach(function(obj,index){
            obj.status = 0;
            if(index == (data.length - 1)){
                obj.status = 1;
            }
            var meetingState = +obj.meetingState;
            if(meetingState == 1 || meetingState == -1){
                this.meetingType = 1;
                this.readyMeeting(obj);
            }else if(meetingState == 2 || meetingState == -2){
                this.meetingType = 2;
                this.startMeeting(obj);
            }else if(meetingState == 3 || meetingState == -3){
                this.meetingType = 3;
                this.stopMeeting(obj);
            }else if(meetingState == 4 || meetingState == -4){
                this.meetingType = 4;
                this.restoreMeeting(obj);
            }else if(meetingState == 5 || meetingState == -5){
                this.meetingType = 5;
                this.finishMeeting(obj);
            }else if(meetingState == 6 || meetingState == -6){
                this.meetingType = 6;
                this.rebootMeeting(obj);
            }else if(meetingState == 7 || meetingState == -7){
                this.meetingType = 7;
                this.resetMeeting(obj);
            }
        }.bind(this));

        if(typeof H5JsMeeting != "undefined"){
            H5JsMeeting.finishSeatStatus(this.meetingType);
        }
    },

    
    findDeviceDetails:function(seatid){
        this.seatId = seatid;
        // this.roomId = roomid;
        // console.log(this.roomId)
        $.ajax({
            async: true,
            type: "post",
            // url: this.baseUrl +"/tableSign/getCacheData?roomid="+this.roomId,
            // url: this.baseUrl +"/tableSign/findDeviceDetailsTest",
            url: this.baseUrl +"/tableSign/findDeviceDetails",
            data:{meetingid:this.meetingId,roomid:this.roomId,seatid:seatid},
            dataType: "json",
            success: function(obj) {
                if(obj.code == 0){
                    $("#seatInfo").show();
                    var data = obj.data || {};
                    // this.loadCacheData(data);

                    this.seatInfoHtml(data);
                }else{
                    alert("获取座区详情数据失败");
                }
            }.bind(this),
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    },

    seatInfoHtml(obj){
        var html = [];

        var deviceType = ["阿里E-ink桌牌","龙居里E-ink桌牌","龙居里LCD桌牌"];
        var communication = ["lora","蓝牙"];
        var deviceStatus = {
            ONLINE:"设备在线",
            OFFLINE:"设备离线",
            UNACTIVE:"设备未激活",
            DISABLE:"设备已禁用",
        };

        html.push('<div class="circleExitpop">');
        html.push('<div class="det-sharepop-bt">');
        html.push('<div class="ltext">');
        html.push('座位' + obj.seatid + '绑定的电子桌牌');
        html.push('</div>');
        html.push('<div id="closeInfoBtn" class="rbtn"></div>');
        html.push('</div>');

        html.push('<div class="popcontent-text2">');
        html.push('<div class="popcontent-details">');
        html.push('<div class="popcontent-details-a">');
        html.push('<img src="images/listimg.jpg" alt="">');
        html.push('</div>');
        html.push('<div class="popcontent-details-b">');
        html.push('<p>型号：'+deviceType[+obj.deviceType]+'</p>');
        html.push('<p>编号：'+obj.deviceName+'</p>');
        html.push('<p>网络：'+communication[+obj.communication]+'</p>');
        html.push('</div>');
        html.push('<div class="popcontent-details-c">');
        html.push('<p>电量：'+(obj.electricity||"")+'%</p>');
        html.push('<p>姓名：'+obj.name+'</p>');
        html.push('<p>通讯：'+deviceStatus[obj.deviceStatus]+'</p>');
        html.push('</div>');
        html.push('</div>');

        var meetingStatus = +obj.meetingStatus;
        this.meetingStatus = meetingStatus;

        /**
         * 会议状态
         * 0：未发送；
         * 1：开始会议发送成功；-1：开始会议发送失败；
         * 2：结束会议成功; -2:结束会议失败；
         * 3: 准备会议发送成功；-3: 准备会议失败；
         * 4: 暂停会议成功；-4：暂停会议失败；
         * 5: 恢复会议成功；-5: 恢复会议失败；
         * 6: 重启会议成功；-6: 重启会议失败；
         * 7: 重置桌牌成功；-7：重置桌牌失败
         */

         /**
         * 会议状态
         * 0：未发送；
         * 1: 准备会议发送成功；-1: 准备会议失败；
         * 2：开始会议发送成功；-2：开始会议发送失败；
         * 3: 暂停会议成功；-3：暂停会议失败；
         * 4: 恢复会议成功；-4: 恢复会议失败；
         * 5：结束会议成功; -5:结束会议失败；
         * 6: 重启会议成功；-6: 重启会议失败；
         * 7: 重置桌牌成功；-7：重置桌牌失败
         * 8: 发送名字
         */
        
        html.push('<ul class="popcontent-details-list clearfix">');
        html.push('<li>');
        html.push('<div class="wDIV">');
        html.push('<div class="a">');
        if(meetingStatus == 0){
            html.push('<p>会议准备：<span class="n">未发送</span></p>');
        }else if(meetingStatus == -1){
            html.push('<p>会议准备：<span class="r">不正常</span></p>');
        }else if(meetingStatus == 1 || meetingStatus == 2 || meetingStatus == 3 || meetingStatus == 4 || meetingStatus == 5 || meetingStatus == 6){
            html.push('<p>会议准备：<span >正常</span></p>');
        }else{
            html.push('<p>会议准备：<span class="n">未发送</span></p>');
        }
        html.push('<p>2020-12-16 16:51:53</p>');
        html.push('</div>');
        // if(meetingStatus == -1){
            html.push('<div class="b">');
            html.push('<a id="status_0" href="javascript:void(0);" class="popcontent-btn">重发</a>');
            html.push('</div>');
        // }
        html.push('</div>');
        html.push('</li>');
        html.push('<li>');
        html.push('<div class="wDIV">');
        html.push('<div class="a">');
        if(meetingStatus == 0){
            html.push('<p>会议开始：<span class="n">未发送</span></p>');
        }else if(meetingStatus == -2){
            html.push('<p>会议开始：<span class="r">不正常</span></p>');
        }else if(meetingStatus == 2 || meetingStatus == 3 || meetingStatus == 4 || meetingStatus == 5 || meetingStatus == 6){
            html.push('<p>会议开始：<span>正常</span></p>');
        }else{
            html.push('<p>会议开始：<span class="n">未发送</span></p>');
        }
        html.push('<p>2020-12-16 16:51:53</p>');
        html.push('</div>');
        // if(meetingStatus == -2){
            html.push('<div class="b">');
            html.push('<a id="status_1" href="javascript:void(0);" class="popcontent-btn">重发</a>');
            html.push('</div>');
        // }
        html.push('</div>');
        html.push('</li>');
        html.push('<li>');
        html.push('<div class="wDIV">');
        html.push('<div class="a">');
        if(meetingStatus == 0){
            html.push('<p>会议暂停：<span class="n">未发送</span></p>');
        }else if(meetingStatus == -3){
            html.push('<p>会议暂停：<span class="r">不正常</span></p>');
        }else if(meetingStatus == 3 || meetingStatus == 4 || meetingStatus == 5 || meetingStatus == 6){
            html.push('<p>会议暂停：<span>正常</span></p>');
        }else{
            html.push('<p>会议暂停：<span class="n">未发送</span></p>');
        }
        // html.push('<p>会议暂停：<span>' + (meetingStatus == 0 ? '未发送' : '') +'</span></p>');
        html.push('<p>2020-12-16 16:51:53</p>');
        html.push('</div>');
        // if(meetingStatus == -3){
            html.push('<div class="b">');
            html.push('<a id="status_2" href="javascript:void(0);" class="popcontent-btn">重发</a>');
            html.push('</div>');
        // }
        html.push('</div>');
        html.push('</li>');
        html.push('<li>');
        html.push('<div class="wDIV">');
        html.push('<div class="a">');
        if(meetingStatus == 0){
            html.push('<p>会议恢复：<span class="n">未发送</span></p>');
        }else if(meetingStatus == -4){
            html.push('<p>会议恢复：<span class="r">不正常</span></p>');
        }else if(meetingStatus == 4 || meetingStatus == 5 || meetingStatus == 6){
            html.push('<p>会议恢复：<span>正常</span></p>');
        }else{
            html.push('<p>会议恢复：<span class="n">未发送</span></p>');
        }
        // html.push('<p>会议恢复：<span class="r">' + (meetingStatus == 0 ? '未发送' : '') +'</span></p>');
        html.push('<p>2020-12-16 16:51:53</p>');
        html.push('</div>');
        // if(meetingStatus == -4){
            html.push('<div class="b">');
            html.push('<a id="status_3" href="javascript:void(0);" class="popcontent-btn">重发</a>');
            html.push('</div>');
        // }
        html.push('</div>');
        html.push('</li>');
        html.push('<li>');
        html.push('<div class="wDIV">');
        html.push('<div class="a">');
        if(meetingStatus == 0){
            html.push('<p>会议结束：<span class="n">未发送</span></p>');
        }else if(meetingStatus == -5){
            html.push('<p>会议结束：<span class="r">不正常</span></p>');
        }else if(meetingStatus == 5 || meetingStatus == 6){
            html.push('<p>会议结束：<span>正常</span></p>');
        }else{
            html.push('<p>会议结束：<span class="n">未发送</span></p>');
        }
        // html.push('<p>会议结束：<span>' + (meetingStatus == 0 ? '未发送' : '') +'</span></p>');
        html.push('<p>2020-12-16 16:51:53</p>');
        html.push('</div>');
        // if(meetingStatus == -5){
            html.push('<div class="b">');
            html.push('<a id="status_4" href="javascript:void(0);" class="popcontent-btn">重发</a>');
            html.push('</div>');
        // }
        html.push('</div>');
        html.push('</li>');
        html.push('<li>');
        html.push('<div class="wDIV">');
        html.push('<div class="a">');
        if(meetingStatus == 0){
            html.push('<p>会议重启：<span class="n">未发送</span></p>');
        }else if(meetingStatus == -6){
            html.push('<p>会议重启：<span class="r">不正常</span></p>');
        }else if(meetingStatus == 6){
            html.push('<p>会议重启：<span>正常</span></p>');
        }else{
            html.push('<p>会议重启：<span class="n">未发送</span></p>');
        }
        // html.push('<p>会议重启：<span class="r">' + (meetingStatus == 0 ? '未发送' : '') +'</span></p>');
        html.push('<p>2020-12-16 16:51:53</p>');
        html.push('</div>');
        // if(meetingStatus == -6){
            html.push('<div class="b">');
            html.push('<a id="status_5" href="javascript:void(0);" class="popcontent-btn">重发</a>');
            html.push('</div>');
        // }
        html.push('</div>');
        html.push('</li>');
        html.push('<li>');
        html.push('<div class="wDIV">');
        html.push('<div class="a">');
        if(meetingStatus == 0){
            html.push('<p>设备重置：<span class="n">未发送</span></p>');
        }else if(meetingStatus == -7){
            html.push('<p>设备重置：<span class="r">不正常</span></p>');
        }else if(meetingStatus == 7){
            html.push('<p>设备重置：<span>正常</span></p>');
        }else{
            html.push('<p>设备重置：<span class="n">未发送</span></p>');
        }
        // html.push('<p>设备重置：<span>' + (meetingStatus == 0 ? '未发送' : '') +'</span></p>');
        html.push('<p>2020-12-16 16:51:53</p>');
        html.push('</div>');
        // if(meetingStatus == -7){
            html.push('<div class="b">');
            html.push('<a id="status_6" href="javascript:void(0);" class="popcontent-btn">重发</a>');
            html.push('</div>');
        // }
        html.push('</div>');
        html.push('</li>');
        html.push('</ul>');
        html.push('</div>');
        html.push('</div>');

        $("#seatInfo").html(html.join(''));

        $("#closeInfoBtn").bind("click",this.closeInfoModel.bind(this));
        
        $(".popcontent-btn").unbind("click");
        $(".popcontent-btn").bind("click",this.sendOne.bind(this));
    },
    sendOne(evt){
        var id = evt.currentTarget.id;
        // console.log(this,id);
        if(id == "status_0"){
            //单发 会议准备
            console.log("status_0");
            this.sendOneNewTableSign(1);
        }else if(id == "status_1"){
            //单发 会议开始
            console.log("status_1");
            this.sendOneNewTableSign(2);
        }else if(id == "status_2"){
            //单发 会议暂停
            console.log("status_2");
            this.sendOneNewTableSign(3);
        }else if(id == "status_3"){
            //单发 会议恢复
            console.log("status_3");
            this.sendOneNewTableSign(4);
        }else if(id == "status_4"){
            //单发 会议结束
            console.log("status_4");
            this.sendOneNewTableSign(5);
        }else if(id == "status_5"){
            //单发 会议重启
            console.log("status_5");
            this.sendOneNewTableSign(6);
        }else if(id == "status_6"){
            // this.meetingStatus == -7 && 
            //单发 会议重置
            console.log("status_6");
            this.sendOneNewTableSign(7);
        }
    },
    sendOneNewTableSign:function(type){
        $.ajax({
            async: true,
            type: "post",
            url: this.baseUrl +"/tableSign/sendOneNewTableSign",
            data:{meetingid:this.meetingId,roomid:this.roomId,seatid:this.seatId,type:type},
            dataType: "json",
            success: function(obj) {
                if(obj.code == 0){
                    
                }else{
                    alert("获取座区详情数据失败");
                }
            }.bind(this),
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    },

    updatePName:function(seatid,name){
        $.ajax({
            async: true,
            type: "post",
            url: this.baseUrl +"/tableSign/updatePName",
            data:{meetingid:this.meetingId,roomid:this.roomId,seatid:seatid,name:name},
            dataType: "json",
            success: function(obj) {
                if(obj.code == 0){
                    
                }else{
                }
            }.bind(this),
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    },
    closeInfoModel(){
        $("#seatInfo").hide();
    }
};

//页面初始化
$(function(){
	__signControl = new SignControl({});
});
