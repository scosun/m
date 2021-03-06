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

    //日期时间选择器
    window.reloads  = function(){
       $.ajax({
           async: false,
           type: "get",
           url: url + "/ruletemplate/findByruletemplate",
           dataType: "json",
           data: {
               "roomid": $('#meeting').val()
           },
           xhrFields: {
               withCredentials: true
           },
           //成功的回调函数
           success: function(msg) {
               var data = msg.data;
               $("#select_rule").parent().find("option").filter(".selectOp").remove();
               form.render(null, 'component-form-group');
               $.each(data, function(idx, con) {


                   $("#select_rule").after("<option class='selectOp' value=" + con
                       .id + ">" + con.name + "</option>");
               })
               form.render(null, 'component-form-group');

               // .parent()
               // }
           },
           //失败的回调函数
           error: function() {
               console.log("error")
           }
       })
    form.render(null, 'component-form-group');

    }

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

            var data = msg.data;

            $.each(data, function(idx, con) {

                $("#select_meet").after("<option value=" + con.id + ">" + con.name +
                    "</option>");
            })
        }
    })
    var names = getUrlParam("name");
    var meetings = getUrlParam("meeting");
    var  ruleids = getUrlParam("ruleid");
    var  datess = getUrlParam("dates");
    var  timess = getUrlParam("times");
    var  remakes= getUrlParam("remake");
    if (names!=""&&names!=null){
        $('#meetingname').val(decodeURI(names));
    }
    if (meetings!=""&&meetings!=null){
                $('#meeting').val(decodeURI(meetings));
                console.log(decodeURI(meetings))
                form.render(null, 'component-form-group');
    }
    if (ruleids!=""&&ruleids!=null){
        $.ajax({
            async: false,
            type: "get",
            url: url + "/ruletemplate/findByruletemplate",
            dataType: "json",
            data: {
                "roomid": meetings
            },
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            success: function(msg) {
                var data = msg.data;
                $("#select_rule").parent().find("option").filter(".selectOp").remove();
                form.render(null, 'component-form-group');
                $.each(data, function(idx, con) {


                    $("#select_rule").after("<option class='selectOp' value=" + con
                        .id + ">" + con.name + "</option>");
                })
                $('#ruleid').val(ruleids);
                form.render(null, 'component-form-group');

                // .parent()
                // }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
    }
    if (datess!=""&&datess!=null){
        $('#dates').val(decodeURI(datess));
    }
    if (timess!=""&&timess!=null){
        $('#times').val(decodeURI(timess));
    }
    if (remakes!=""&&remakes!=null){
        $('#remake').val(decodeURI(remakes));
    }
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
         var uri = window.location.search;
        var r = uri.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2]; return null; //返回参数值
    }
    form.render(null, 'component-form-group');

    laydate.render({
        elem: '#LAY-component-form-group-date'
    });

 $('#addmeeting').click(()=>{
      var name = $('#meetingname').val();
     var meeting = $('#meeting').val();
     var  ruleid = $('#ruleid').val();
     var  dates = $('#dates').val();
     var  times = $('#times').val();
     var  remake = $('#remake').val();
      location.href = decodeURI("./meeting_room.html?name="+name+"&meeting="+meeting+"&ruleid="+ruleid+"&dates="+dates+"&times="+times+"&remake="+remake)
 })
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
 })


    /* 监听指定开关 */
    form.on('select(component-form-select)', function(data) {
        $.ajax({
            async: false,
            type: "get",
            url: url + "/ruletemplate/findByruletemplate",
            dataType: "json",
            data: {
                "roomid": data.value
            },
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            success: function(msg) {
                var data = msg.data;
                $("#select_rule").parent().find("option").filter(".selectOp").remove();
                form.render(null, 'component-form-group');
                $.each(data, function(idx, con) {


                    $("#select_rule").after("<option class='selectOp' value=" + con
                        .id + ">" + con.name + "</option>");
                })
                form.render(null, 'component-form-group');

                // .parent()
                // }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
        // })
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
            parent.layer.closeAll();;
            parent.reloads(); // 父页面刷新

        }
    }
    /* 监听提交 */
    form.on('submit(addmeeting)', function(data) {
        // data.field.time   需要进行一个时间的转换 - 判断是否大于12点？上午:下午
       console.log(data.field);

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

        // console.log(data.field.addressd);


        $.ajax({
            async: false,
            type: "post",
            url: url+"/meeting/addMeeting",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            data: {
                "name": data.field.name,
                "meetingtime": datatime,
                "roomid": data.field.meeting,
                "address":$("#meeting option:selected").text(),
                "ruleid": data.field.rule,
                "memo": data.field.memo
            },
            success: function(msg) {
                if (msg.code == 0) {
                    parent.layer.msg("增加成功");
                    var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                    parent.layer.closeAll();;
                    parent.reloads(); // 父页面刷新

                } else {
                    layer.msg("增加失败");
                    var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                    parent.layer.closeAll();;
                    // parent.location.reload(); // 父页面刷新


                }

            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
        return false;
    });
    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });
});
