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
        form = layui.form;
    var url = "https://f.longjuli.com";

    var day2 = new Date();
    day2.setTime(day2.getTime());
    var hour = day2.getHours(); //得到小时

    var minu = day2.getMinutes(); //得到分钟

    var sec = day2.getSeconds(); //得到秒
    var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
    var s3 = hour + ":" + minu + ":" + sec;

    //日期时间选择器

    var metid = $("#meetingid").val();






    var ins22 = laydate.render({
        elem: '#date',
        min: s2,
        max: '2080-10-14',
        format: 'yyyy年MM月dd日' //可任意组合
            ,
        theme: 'molv'
    });

    laydate.render({
        elem: '#time',
        type: 'time',
        format: 'HH:mm',
        btns: ['clear','now', 'confirm'],
        theme: 'molv'
    });


    $.ajax({
        async: false,
        type: "get",
        url: url + "/roomtemplate/findAll",
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
            $("#meeting").val($("#roomid").val())
            $.ajax({
                async: false,
                type: "get",
                url: url + "/ruletemplate/findByruletemplate",
                dataType: "json",
                xhrFields: {
                    withCredentials: true
                },
                data: {
                    "roomid": $("#meeting").val()
                },
                //成功的回调函数
                success: function(msg) {

                    var data = msg.data;

                    $.each(data, function(idx, con) {

                        $("#select_rule").after(
                            "<option class='selectOp' value=" + con.id +
                            ">" + con.name + "</option>");
                    })
                    $("#rule").val($("#meetingrule").val())


                },
                //失败的回调函数
                error: function() {
                    console.log("error")
                }
            })

        },
        //失败的回调函数
        error: function() {
            console.log("error")
        }
    })

    form.render(null, 'component-form-group');


    laydate.render({
        elem: '#LAY-component-form-group-date'
    });




    /* 监听指定开关 */
    form.on('select(component-form-select)', function(data) {
        $("#rule").val(undefined);

        $.ajax({
            async: false,
            type: "get",
            url: url + "/ruletemplate/findByruletemplate",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            data: {
                "roomid": data.value
            },
            //成功的回调函数
            success: function(msg) {
                var data = msg.data;
                // if(data.length ==0){



                console.log("1")
                // }else{
                $("#select_rule").parent().find("option").filter(".selectOp").remove();
                form.render(null, 'component-form-group');
                $.each(data, function(idx, con) {
                    console.log(con);

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



    });
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

    /* 监听提交 */
    form.on('submit(component-form-demo1)', function(data) {
        // data.field.time   需要进行一个时间的转换 - 判断是否大于12点？上午:下午
        console.log(data.field);
        var datime = "";
        if (data.field.time > '12:00') {
            datime = "下午" + data.field.time;
        } else {
            datime = "上午" + data.field.time;
        }
        var newdate = data.field.date.replace('年','-').replace('月','-').slice(0,data.field.date.length-1);
       var newdates =" ("+getMyDay(new Date(newdate))+") "
       console.log(newdates)

        var datatime = data.field.date +newdates+ datime;
        
        console.log(data.field);
        // $.ajax({
        //     async: false,
        //     type: "post",
        //     xhrFields: {
        //         withCredentials: true
        //     },
        //     url: url + "/meeting/updateByMeeting",
        //     dataType: "json",

        //     //成功的回调函数
        //     data: {
        //         "id": data.field.meetingid,
        //         "name": data.field.name,
        //         "time": datatime,
        //         "roomid": data.field.room,
        //         "roomname": data.field.rlue,
        //         "ruleid": data.field.ruleid,
        //         "memo": data.field.memo
        //     },
        //     success: function(msg) {
        //         if (msg.state == 1) {
        //             layer.msg("增加成功");
        //             var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
        //             parent.layer.close(index);
        //             parent.location.reload(); // 父页面刷新

        //         } else {
        //             layer.msg("增加失败");
        //             var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
        //             parent.layer.close(index);
        //             parent.location.reload(); // 父页面刷新


        //         }

        //     },
        //     //失败的回调函数
        //     error: function() {
        //         console.log("error")
        //     }
        // })
        return true;
    });
});
