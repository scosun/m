
function SignControl(){

}


var SignControl = function (obj){
	this.init.apply(this,arguments);
};

SignControl.prototype = {
    constructor:SignControl,
    roomId:0,
    baseUrl:"https://f.longjuli.com",
    mbaseUrl:"https://m.longjuli.com",
    meetWs:null,
	init: function(){
        console.log("signcontrol-----init");
        this.createMeetWebSocket();

        $(window).bind("beforeunload",this.stopMeetWebSocket.bind(this));
	},
	bindEvent:function(){
       
    },
    readyMeeting:function(obj){
        console.log("obj-----",obj);

        // 3: 准备会议发送成功；-3: 准备会议失败； 
        if(obj.meetingState == 3){
            $("#" + obj.seatid).addClass("sm3");
        }else{
            $("#" + obj.seatid).addClass("sm33");
        }
    },
    startMeeting:function(obj){
        console.log("obj-----",obj);

        // 1：开始会议发送成功；-1：开始会议发送失败；
        if(obj.meetingState == 1){
            $("#" + obj.seatid).text(obj.name);
        }
    },
    stopMeeting:function(obj){
        console.log("obj-----",obj);

        // 4: 暂停会议成功；-4：暂停会议失败；
        if(obj.meetingState == 4){
            var seats = $("#seatcontainerId .seatdiv");
            seats.addClass("smstop");
        }
    },
    restoreMeeting:function(obj){
        // 5: 恢复会议成功；-5: 恢复会议失败；
        if(obj.meetingState == 5){
            var seats = $("#seatcontainerId .seatdiv");
            seats.removeClass("smstop");
        }
    },
    finishMeeting:function(obj){
        console.log("obj-----",obj);
        // 2：结束会议成功; -2:结束会议失败； 
        if(obj.meetingState == 2){
            // var seats = $("#seatcontainerId .seatdiv");
            // seats.removeClass("smstop");
        }
    },
    rebootMeeting:function(obj){
        console.log("obj-----",obj);
        // 6: 重启会议成功；-6: 重启会议失败；
        if(obj.meetingState == 6){
            // var seats = $("#seatcontainerId .seatdiv");
            // seats.removeClass("smstop");
        }
    },
    resetMeeting:function(obj){
        console.log("obj-----",obj);

        // 7: 重置桌牌成功；-7：重置桌牌失败；
        if(obj.meetingState == 7){
            // var seats = $("#seatcontainerId .seatdiv");
            // seats.removeClass("sm1 sm2 smstop");
            // seats.each(function(i,item){
            //     var id = item.id;
            //     var num = id.split('-')[3];
            //     $(item).text(num);
            // })
        }
    },


    createMeetWebSocket:function(){
        if("WebSocket" in window){
            var t = this;

            // 打开一个 web socket
            // var ws = new WebSocket("ws://f.longjuli.com/cardWebSocket/shuxian");
            var ws = new WebSocket("ws://m.longjuli.com:8083/cardWebSocket/shuxian");
            ws.onopen = function(){
                t.meetWs = ws;
                console.log("ws----open");
            }
            
            ws.onmessage = function (evt) { 
                var received_msg = evt.data || "";

                // console.log("数据已接收...",received_msg);

                // 会议状态 
                // 0：未发送； 
                // 1：开始会议发送成功；-1：开始会议发送失败； 
                // 2：结束会议成功; -2:结束会议失败； 
                // 3: 准备会议发送成功；-3: 准备会议失败； 
                // 4: 暂停会议成功；-4：暂停会议失败；  
                // 5: 恢复会议成功；-5: 恢复会议失败；
                // 6: 重启会议成功；-6: 重启会议失败；
                // 7: 重置桌牌成功；-7：重置桌牌失败；
                
                // name=测试199, seatid=2-10-10, roomid=410, meetingState=3, productKey=productKey199, deviceName=deviceName199, deviceStatus=ONLINE
                var obj = {
                    name:"测试199",
                    seatid:"s-1-1-1",
                    meetingState:3
                }
                t.startMeeting(obj);
                
                // {
                //     "name": 名字,
                //     "seatid": 1-1-1(座位号),
                //     "roomid": 70(会议室id),
                //     "meetingState": 0(会议状态),
                //     "productKey": productKey(产品key),
                //     "deviceName": deviceName(设备key),
                //     "deviceStatus": deviceStatus(设备状态)
                // }
                
                // try{
                //     layer.close(msgid);
                //     var obj = JSON.parse(received_msg);
                //     changeSeatStatus(obj);
                // }catch(ex){
                // }

            };

            //连接关闭的回调方法
            ws.onclose = function(){
                console.log("ws----close");
            }
        }else{
            // 浏览器不支持 WebSocket
            alert("您的浏览器不支持 WebSocket!");
        }
    },
    stopMeetWebSocket:function(){
        if(this.meetWs){
            this.meetWs.close();
        }else{
           // 浏览器不支持 WebSocket
           alert("您的浏览器不支持 WebSocket!");
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
    appTableSignControl:function(type){
        // | roomid | Integer | 会议室id |
        // | type   | Integer | 类型：0 准备会议，1 开始会议，2 暂停会议，3 恢复会议，
        // 4 结束会议，5 重启会议，6 重置桌牌 |
        $.ajax({
            async: true,
            type: "post",
            url: this.baseUrl +"/tableSign/appTableSignControlTest",
            // url: "http://m.longjuli.com:8083/tableSign/appTableSignControl",
            // dataType: "json",
            // roomId:this.roomId,
            data:{type:type},
            success: function(obj) {
                console.log("success")
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    },

	getCacheData:function(roomid){
        this.roomId = roomid;
        console.log(this.roomId)
        $.ajax({
            async: true,
            type: "post",
            url: this.baseUrl +"/tableSign/getCacheData?roomid="+this.roomId,
            dataType: "json",
            success: function(obj) {
                
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }
};

//页面初始化
$(function(){
	__signControl = new SignControl({});
});
