layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery',], function() {
    var table = layui.table,
        admin = layui.admin,
        setter = layui.setter,
        router = layui.router(),
        $ = layui.jquery;
    var url = setter.baseUrl;
    // var url = "http://127.0.0.1:8083";
    var devices = {};
    var deviceList = [];
    // #test-table-operate
    //渲染表格

    // $('#group').append('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="print" id="batchmeet">打印<s></s></a>');
    // $('#group').after('<div class="assistBtn"><span class="fengeline">/</span><i class="layui-icon layui-ds layui-icon-refresh-3" data-type="refresh"></i></div>')
    
   

    var url = setter.baseUrl;
    var seatUrl = setter.seatBaseUrl;
    
    var uri = window.location.search;
    var str = uri.substr(1);
    // window.ruleid = str.substring(str.indexOf("=")+1,str.indexOf("&"));
    // window.meetingid = str.substring(str.lastIndexOf("=")+1)
    // window.roomid = str.substring(str.indexOf("&")+1,str.lastIndexOf("&"))
    // window.newroomid = roomid.substring(roomid.indexOf("=")+1,roomid.length);
    
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
         var uri = window.location.search;
        var r = uri.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2]; return null; //返回参数值
    }
    var meetingid = +getUrlParam("meetingid") || null;
    var isgrouplist = +getUrlParam("isgrouplist") || null;
    var roomId = 0;

    if(!meetingid){
        layer.msg("没有获取到会议id");
        return;
    }

    $.ajax({
        url: url+"/meeting/findroomBymeetingid?id=" + meetingid,
        type: "get",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(obj) {
            console.log("findroomBymeetingid-----",data);
            var code = obj.code;
            if(code == 0){
                var data = obj.data || [];
                buildMeetTabHtml(data);
            }else{
                layer.msg("获取会议会议室数据错误");
            }
        },
        error:function(){
            layer.closeAll();
        }
    });


    function buildMeetTabHtml(data){
        var str = [];
        data.forEach(function(item,i){
            if(i == 0){
                str.push('<li id="' + item.roomid + '" class="layui-this">' + item.name + '</li>');

                getRoomTemplateCode(item.roomid);
            }else{
                str.push('<li id="' + item.roomid + '">' + item.name + '</li>');
            }
            
        });
        $(".layui-tab-title").html(str);

        $('.layui-tab-title > li').on('click', function(evt) {
            var roomid = this.id;
            console.log("roomid----",roomid);

            // saveSeats();
            
            getRoomTemplateCode(roomid);
        });
    }


    function getRoomTemplateCode(roomid){
        roomId = roomid;

        layer.load(2);
    
        $.ajax({
            url: url+"/roomtemplate/findByIdTemplatecode",
            type: "post",
            async: false,
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
                    $("#seatsbody").html(datas.templatecode);

                    //注册框选事件
                    selectSeats();

                    //加载会议标题
                    getMeetInfo();

                    //查询座区人员
                    queryAllSeatStatus();
                    
                }else{
                    layer.msg("获取会议室模板错误");
                }
                
                layer.closeAll();
            },
            error:function(){
                layer.closeAll();
            }
        });
    }

    function getMeetInfo(){
        $.ajax({
            url: url+"/meeting/findByMeeting",
            type: "get",
            async: false,
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
                }else{
                    layer.msg("获取会议地址信息错误");
                }
            }
        });
    }


    function queryAllSeatStatus(){
        $.ajax({
            async: false,
            type: "get",
            url: seatUrl + "/v1/meetings/show?meeting_id="+meetingid,
            dataType: "json",
            success: function(obj) {
                console.log("--queryAllSeatStatus---");
                if(obj && obj.attendees){
                    seatsdata = obj.attendees;
                    
                    changeSeatColor(obj.attendees);
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }

    // window.serverSeatIds = [];
    function changeSeatColor(attendees){
        if(attendees.length > 0){
            // var ruleselect = $("#ruleselect").val() - 0;
            var ruleselect = 1;
            // serverSeatIds = [];
            if(ruleselect == 1){
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
        }
    }

    function getSelectedSeat(){
        var seled = $("#seatcontainerId .seled");
        var names = [];
        seled.each(function(){
            var name = $(this).text();
            //判断哪些是人名
            var reg = /^\d+$/gi;
            if(!reg.test(name)){
                names.push(name);
            }
        });
        
        return names;
    }


    window.onkeyup = function(ev) {
        var key = ev.keyCode || ev.which;
        if (key == 27) { //按下Escape
            layer.closeAll('iframe'); //关闭所有的iframe层

        }
        if (key == 13) { //按下Escape
            $('#search').click();

        }
    }


    var __handDrag = null;
    var $ = layui.$,
        active = {
            refresh:function(){
                location.reload();
            },
            //选择区域打印
            print: function() {
                var deviceList = getSelectedSeat();
                console.log(deviceList)
                // debugger
                // deviceList.length=10;//先定义个假数据
                if (deviceList.length == 0 ) {
                    return layer.msg("请选择后再批量打印！")
                }
                //获取选中数目
                layer.confirm('是否将'+deviceList.length+'个桌牌全部打印？',
                {
                    title:'指定区域打印',
                    skin: '',
                    btn: ['预览','取消'],
                    // 取消
                    btn2: function(){
                        layer.close();
                    },
                    // 预览
                    yes: function(index){
                        sessionStorage.setItem("_printnames",deviceList.join(','));
                        window.open("previewprint.html?isgrouplist="+isgrouplist,"_blank");  
                        // layer.open({
                        //     type: 2,
                        //     title: '桌牌打印',
                        //     //title: false,
                        //     shadeClose: false, //弹出框之外的地方是否可以点击
                        //     area: ['100%', '100%'],
                        //     closeBtn: 1,
                        //     // maxmin: true,
                        //     closeBtn:false,
                        //     offset: '0',
                        //     content: 'signprint.html',
                        //     success: function(layero, index) {
                        //     }
                        // })
                    }
                },
                function(index) {
                    layer.close(index);
                });
            },
            search: function() {
                

            },
            close: function() {
                var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                parent.layer.close(index); //再执行关闭 
                // parent.reloads()
            },
            dragcontainer:function(){
                if(__handDrag){
                    __handDrag = null;
                    $('#seatcontainer').unbind('mousedown');
                    $('#seatcontainer').unbind('mouseup');
                    $('#seatcontainer').unbind('mousemove');
                    // $('.toollist_li').removeClass("on");
                    // $("#nav-selection").addClass("on");
                    selectSeats();
                }else{
                    removeContainerEvent();
                    __handDrag = new Drag();
                }
            }
        };

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

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });
});
