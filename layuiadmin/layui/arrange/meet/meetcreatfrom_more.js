layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form', 'laydate'], function() {
    var $ = layui.$,
        admin = layui.admin,
        element = layui.element,
        layer = layui.layer,
        laydate = layui.laydate,
        setter = layui.setter,
        router = layui.router(),
        form = layui.form;
    
    var url = setter.baseUrl;
    var day2 = new Date();
    day2.setTime(day2.getTime());
    var hour = day2.getHours(); //得到小时

    var minu = day2.getMinutes(); //得到分钟

    var sec = day2.getSeconds(); //得到秒
    var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
    var s3 = hour + ":" + minu + ":" + sec;

    var ins22 = laydate.render({
        elem: '#dates',
        min: s2,
        max: '2080-10-14',
        format: 'yyyy年MM月dd日' //可任意组合
            ,
        theme: 'molv'
    });

    laydate.render({
        elem: '#times',
        type: 'time',
        format: 'HH:mm',
        btns: ['clear','now', 'confirm'],
        theme: 'molv'
    });
    laydate.render({
        elem: '#LAY-component-form-group-date'
    });


    /*chenxy add 批量添加会议室模板 */
    var meetsData = [{
        roomid:-1,
        ruleid:-1
    }];

    var allMeetData;
    var allMeetRoomRule = {};
    //查询全部会议室
    $.ajax({
        async: false,
        type: "get",
        url: url + "/roomtemplate/findByroomtemplate",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        success: function(msg) {

            if(msg.code == 0){
                var data = msg.data || [];
                allMeetData = data;
                // $.each(data, function(idx, con) {
                //     $("#select_meet").after("<option value=" + con.id + ">" + con.name +
                //         "</option>");
                // })
                
                var meetingid = $("#meetingid").val() || null;
    
                if(meetingid){
                    getMeetingRooms(meetingid);
                }else{
                    buildMeetTplHtml();
                }
            }else{
                layer.msg("获取会议室列表错误");
            }
        }
    });
    
    function buildMeetTplHtml(){
        var html = [];
        for(var i = 0,len = meetsData.length; i < len; i++){
            var meetItem = meetsData[i] || {};
            html.push('<tr>');
            html.push('<td>' + (i+1) + '</td>');
            html.push('<td>');
            html.push('<select id="meet_'+ i + '" class="meetselect" name="interest" lay-skin="select" lay-filter="meeting-form-select">');
            html.push('<option value="">请选择会议室</option>');
            
            allMeetData.forEach(function(item){
                if(item.id == meetItem.roomid && meetItem.roomid != -1){
                    html.push('<option selected value="' + item.id + '" >' + item.name + '</option>');
                }else{
                    var b = true;
                    for(var n = 0,len3 = meetsData.length; n < len3; n++){
                        if(meetsData[n].roomid == item.id){
                            b = false;
                            break;
                        }
                    }
                    if(!b){
                        html.push('<option disabled value="' + item.id + '">'+ item.name + '</option>');
                    }else{
                        html.push('<option value="' + item.id + '">'+ item.name + '</option>');
                    }
                }
            });

            html.push('</select>');
            html.push('</td>');
            html.push('<td>');
            html.push('<select id="rule_'+ i + '" name="interest" lay-skin="select" lay-filter="rule-form-select">');
            html.push('<option value="">请选择编排规则</option>');
            
            var ruleData = allMeetRoomRule[meetItem.roomid] || null;
            if(ruleData && ruleData.length > 0){
                ruleData.forEach(function(item){
                    if(item.id == meetItem.ruleid && meetItem.ruleid != -1){
                        html.push('<option selected value="' + item.id + '" >' + item.name + '</option>');
                    }else{
                        html.push('<option value="' + item.id + '" >' + item.name + '</option>');
                    }
                });
            }

            html.push('</select>');
            html.push('</td>');
            html.push('<td width="30" class="pr0">');
            if(i<len-1){
                html.push('<a href="javascript:void(0)" class="mytest"><span>下移</span><i id="pre_' + i + '" class="layui-icon layui-icon-down" style="font-size:20px;margin-left:10px"></i></a>');
            }
            html.push('</td>');
            html.push('<td width="30" class="pr0"> ');
            if(i!=0){
                html.push('<a href="javascript:void(0)" class="mytest"><span>上移</span><i id="next_' + i + '" class="layui-icon layui-icon-up" style="font-size:20px;margin-left:10px"></i></a>');
            }
            html.push('</td>');
            html.push('<td width="30" class="pr0">');
            html.push('<a href="javascript:void(0)" class="mytest"><span>删除</span><i id="del_' + i + '" class="layui-icon layui-icon-close" style="font-size:20px;margin-left:10px"></i></a>');
            html.push('</td>');
            html.push('</tr>');
        }

        $("#meettpl").html(html.join(''));
		layui.form.render();

		$(".layui-icon-close").unbind('click');
		$(".layui-icon-close").on('click',function(){
			var i = +this.id.split("_")[1];
			meetsData.splice(i,1);
			buildMeetTplHtml();
		});
		$(".layui-icon-down").unbind('click');
		$(".layui-icon-down").on('click',function(){
            var i = +this.id.split("_")[1];
            if(i == meetsData.length - 1){
                return;
            }
            var down = meetsData.splice(i,1);
            meetsData.splice(i+1,0,down[0]);
			buildMeetTplHtml();
		});
		$(".layui-icon-up").unbind('click');
		$(".layui-icon-up").on('click',function(){
            var i = +this.id.split("_")[1];
            if(i == 0){
                return;
            }
            var up = meetsData.splice(i,1);
            meetsData.splice(i-1,0,up[0]);
			buildMeetTplHtml();
		});
		form.on('select(meeting-form-select)', function(data){
            var id = +data.value;
            var eleid = +data.elem.id.split("_")[1];
            meetsData[eleid].roomid = id;
            
            if(!allMeetRoomRule[id]){
                getMeetRoomRule(id);
            }else{
                buildMeetTplHtml();
            }
		});
		form.on('select(rule-form-select)', function(data){
            var id = +data.value;
            var eleid = +data.elem.id.split("_")[1];
            meetsData[eleid].ruleid = id;
		});
    }

    $("#addMeetTplBtn").bind("click",function(){
        meetsData.push({
            roomid:-1,
            ruleid:-1
        });
        buildMeetTplHtml();
    });

    //获取会议室对应的规则
    function getMeetRoomRule(roomid) {
        $.ajax({
            async: false,
            type: "get",
            url: url + "/ruletemplate/findByruletemplate",
            dataType: "json",
            data: {
                "roomid": roomid
            },
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            success: function(msg) {
                if(msg.code == 0){
                    var data = msg.data || [];
                    if(data.length > 0){
                        allMeetRoomRule[data[0].roomid] = data;
                    
                        buildMeetTplHtml();
                    }
                }else{
                    layer.msg("查询会议室规则错误");
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
    }

    function addMultiplemeeting(data) {
        $.ajax({
            async: false,
            type: "post",
            url: url + "/meeting/Multiplemeeting",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            success: function(msg) {
                if(msg.code == 0){
                    var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                    parent.layer.close(index);
                    parent.reloads(); // 父页面刷新
                }else{
                    layer.msg("添加会议错误");
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
    }
    function updateMultiplemeeting(data) {
        $.ajax({
            async: false,
            type: "post",
            url: url + "/meeting/upMultiplemeeting",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            success: function(msg) {
                if(msg.code == 0){
                    var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                    parent.layer.close(index);
                    parent.reloads(); // 父页面刷新
                }else{
                    layer.msg("添加会议错误");
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
    }

    /* 监听提交 */
    form.on('submit(addmeeting)', function(data) {
        // data.field.time   需要进行一个时间的转换 - 判断是否大于12点？上午:下午
        console.log(data.field);

        if(!data.field.date || !data.field.time){
            layer.msg("请选择会议日期和时间");
            return;
        }

        var newdate = data.field.date.replace('年','-').replace('月','-').slice(0,data.field.date.length-1);
        var newdates =" ("+getMyDay(new Date(newdate))+") "
        var datime = "";
        if (data.field.time > '12:00') {
            datime = "下午" + data.field.time;
        } else {
            datime = "上午" + data.field.time;
        }

        var datatime = data.field.date +newdates + datime;
        console.log(datatime);

        var condi = {};
        condi.name = data.field.name;
        condi.meetingtime = datatime;
        condi.address = data.field.address;
        condi.memo = data.field.memo;
        // var room = [];
        var b = true;
        meetsData.forEach(function(item){
            if(item.roomid == -1 || item.ruleid == -1){
                b = false;
                return;
                // room.push({"roomid":+item.roomid,"ruleid":+item.ruleid});
            }
        });
        
        if(meetsData.length == 0 || !b){
            layer.msg("请选择会议室和规则模板");
            return;
        }
        condi.room = meetsData;
        
        console.log("condi----",condi)

        var meetingid = $("#meetingid").val() || null;
    
        if(meetingid){
            condi.id = meetingid;
            updateMultiplemeeting(condi);
        }else{
            addMultiplemeeting(condi);
        }

        return false;
    });


    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
         var uri = window.location.search;
        var r = uri.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2]; return null; //返回参数值
    }


    // 修改弹出方式 5.26
    $('.mytest').mouseover(function() {
        layer.tips($(this).children('span').text(), this, {
            tips: [3, "#808080"],
            offset: '200px'
        });
    });



    //日期时间选择器
    // window.reloads  = function(){
    //    $.ajax({
    //        async: false,
    //        type: "get",
    //        url: url + "/ruletemplate/findByruletemplate",
    //        dataType: "json",
    //        data: {
    //            "roomid": $('#meeting').val()
    //        },
    //        xhrFields: {
    //            withCredentials: true
    //        },
    //        //成功的回调函数
    //        success: function(msg) {
    //            var data = msg.data;
    //            $("#select_rule").parent().find("option").filter(".selectOp").remove();
    //            form.render(null, 'component-form-group');
    //            $.each(data, function(idx, con) {
                
       
    //                $("#select_rule").after("<option class='selectOp' value=" + con
    //                    .id + ">" + con.name + "</option>");
    //            })
    //            form.render(null, 'component-form-group');
       
    //            // .parent()
    //            // }
    //        },
    //        //失败的回调函数
    //        error: function() {
    //            console.log("error")
    //        }
    //     });
    //     form.render(null, 'component-form-group');
    // }

    

    function getMeetingRooms(meetingid){
        $.ajax({
            async: false,
            type: "get",
            url: url + "/meeting/findMultiplemeeting?id=" + meetingid,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            success: function(msg) {
                console.log("getMeetingRooms----",msg);
                var code = msg.code;
                if(code == 0){
                    var data = msg.data || [];
                    meetsData = [];
                    data.forEach(function(item){
                        meetsData.push({
                            roomid:item.roomid,
                            ruleid:item.ruleid
                        });

                        getMeetRoomRule(item.roomid);
                    });
                    buildMeetTplHtml();
                }else{
                    layer.msg("获取会议室数据错误")
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
    }
    
    


    // var names = getUrlParam("name");
    // var meetings = getUrlParam("meeting");
    // var  ruleids = getUrlParam("ruleid");
    // var  datess = getUrlParam("dates");
    // var  timess = getUrlParam("times");
    // var  remakes= getUrlParam("remake");

    // if (names!=""&&names!=null){
    //     $('#meetingname').val(decodeURI(names));
    // }
    // if (meetings!=""&&meetings!=null){
    //     $('#meeting').val(decodeURI(meetings));
    //     console.log(decodeURI(meetings))
    //     form.render(null, 'component-form-group');
    // }

    // if (ruleids!=""&&ruleids!=null){
    //     $.ajax({
    //         async: false,
    //         type: "get",
    //         url: url + "/ruletemplate/findByruletemplate",
    //         dataType: "json",
    //         data: {
    //             "roomid": meetings
    //         },
    //         xhrFields: {
    //             withCredentials: true
    //         },
    //         //成功的回调函数
    //         success: function(msg) {
    //             var data = msg.data;
    //             $("#select_rule").parent().find("option").filter(".selectOp").remove();
    //             form.render(null, 'component-form-group');
    //             $.each(data, function(idx, con) {


    //                 $("#select_rule").after("<option class='selectOp' value=" + con
    //                     .id + ">" + con.name + "</option>");
    //             })
    //             $('#ruleid').val(ruleids);
    //             form.render(null, 'component-form-group');

    //             // .parent()
    //             // }
    //         },
    //         //失败的回调函数
    //         error: function() {
    //             console.log("error")
    //         }
    //     })
    // }

    // if (datess!=""&&datess!=null){
    //     $('#dates').val(decodeURI(datess));
    // }
    // if (timess!=""&&timess!=null){
    //     $('#times').val(decodeURI(timess));
    // }
    // if (remakes!=""&&remakes!=null){
    //     $('#remake').val(decodeURI(remakes));
    // }
    
    // form.render(null, 'component-form-group');

    
    


    // $('#addmeeting').click(()=>{
    //     var name = $('#meetingname').val();
    //     var meeting = $('#meeting').val();
    //     var  ruleid = $('#ruleid').val();
    //     var  dates = $('#dates').val();
    //     var  times = $('#times').val();
    //     var  remake = $('#remake').val();
    //     location.href = decodeURI("./meeting_room.html?name="+name+"&meeting="+meeting+"&ruleid="+ruleid+"&dates="+dates+"&times="+times+"&remake="+remake)
    // });

    $('#addrule').click(()=>{
    
        if ($('#meeting').val() == '') {
            return layer.msg('请选择会议后再新建规则');
        }
        var name = $('#meetingname').val();
        var meeting = $('#meeting').val();
        var  ruleid = $('#ruleid').val();
        var  dates = $('#dates').val();
        var  times = $('#times').val();
        var  remake = $('#remake').val();
        location.href = decodeURI("./group.html?name="+name+"&meeting="+meeting+"&ruleid="+ruleid+"&dates="+dates+"&times="+times+"&remake="+remake)
        // var addrule =layer.open({
        //     type: 2,
        //     title: '添加编排规则',
        //     shadeClose: true, //弹出框之外的地方是否可以点击
        //     offset: '10%',
        //     // area: ['%', '75%'],
        //     btn: ['确定', '取消'],
        //     content: '../arrangeman/group.html',
        //     yes: function(index, layero) {
        //        var submit = layero.find('iframe').contents().find("#ruleclickBymeet");
        //        								submit.click();
        //     },
        //     success: function(layero, index) {
        //       var body = layui.layer.getChildFrame('body', index);
        //         body.find("#meetingid").val($('#meeting').val());
        //
        //     }
        // });
        // layer.full(addrule)
    });


    
    window.onappent = function() {
        $('#click').click();
    }

    function getMyDay(date){
        var week;
        if(date.getDay()==0) week="星期日";
        if(date.getDay()==1) week="星期一";
        if(date.getDay()==2) week="星期二";
        if(date.getDay()==3) week="星期三";
        if(date.getDay()==4) week="星期四";
        if(date.getDay()==5) week="星期五";
        if(date.getDay()==6) week="星期六";
        return week;
    }

    var active = {
        cancel:function () {
            var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
            parent.layer.close(index);
            parent.reloads(); // 父页面刷新

        }
    }

    

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });
    
});
