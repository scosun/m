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
                    
                    // selectSeats();

                    getMeetInfo();

                    // if(seatsdata.length == 0){
                    //     queryAllSeatStatus();
                    // }
                    
                    // changeSeatColor(seatsdata);
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

    

    window.onkeyup = function(ev) {
        var key = ev.keyCode || ev.which;
        if (key == 27) { //按下Escape
            layer.closeAll('iframe'); //关闭所有的iframe层

        }
        if (key == 13) { //按下Escape
            $('#search').click();

        }
    }
    var $ = layui.$,
        active = {
            refresh:function(){
                location.reload();
            },
            //选择区域打印
            print: function() {
                deviceList.length=10;//先定义个假数据
                if ( deviceList.length == 0 ) {
                    return layer.msg("请选择后再批量打印！")
                }
                //获取选中数目
                layer.confirm('    是否将 12 个桌牌全部打印？',
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
                        // layer.open({
                        //     type: 2,
                        //     title: '收藏管理 (考生姓名：张无忌)',
                        //     //title: false,
                        //     shadeClose: false, //弹出框之外的地方是否可以点击
                        //     area: ['100%', '100%'],
                        //     closeBtn: 1,
                        //     // maxmin: true,
                        //     closeBtn:false,
                        //     offset: '0',
                        //     content: 'seatmap.html',
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
                

            }
        };

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });
});
