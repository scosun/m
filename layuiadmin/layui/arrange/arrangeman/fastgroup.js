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
    // var url="http://127.0.0.1:8083"
    console.log()

    $.ajax({
        async: false,
        type: "get",
        url: url + "/roomtemplate/findAll",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        data: {},
        success: function(msg) {

            var data = msg.data;
            $.each(data, function(idx, con) {

                $("#select_meet").after("<option value=" + con.id + ">" + con.name +
                    "</option>");
            })

            if ($('#meetingid').val() != '') {
                $('#select-room').val($('#meetingid').val())
            } else {


            }

        },
        //失败的回调函数
        error: function() {
            console.log("error")
        }
    })
    window.reloads = function(){
        parent.reloads()
    }

    form.render(null, 'component-form-group');

    laydate.render({
        elem: '#LAY-component-form-group-date'
    });



    /* 监听指定开关 */
    form.on('switch(component-form-switchTest)', function(data) {
        layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
            offset: '6px'
        });
        layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
    });



    /* 监听提交 */
    form.on('submit(component-form-demo1)', function(data) {


        // var rowname = $("#select-room").find("option[value='"+data.field.interest+"']").text();
        var ruletype = 0;
        if (data.field.close == "on") {
            ruletype = 1;
        }
        
        var openid = 0;
        var ruleid;
        var roomid;

        $.ajax({
            async: false,
            type: "post",
            url: url + "/ruletemplate/addruletemplate",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            data: {
                "name": data.field.user,
                "stauts": 1,
                "roomid": data.field.meeting,
                "roomname": $("#select-room option:selected").text()
            },
            success: function(msg) {
                if (msg.code == '0') {
                    var data = msg.state;
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                    open(msg);
                } else {

                }

            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })

        function open(msg) {
            
            parent.layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '  ',
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '106%'],
                closeBtn: 1,
                offset: '-43px',
                content: 'territory_rules_edit.html?ruleid=' + msg.data.id + '&roomid=' + msg.data
                    .roomid,
                success: function(layero, index) {
                    // var body = window.parent.layer.getChildFrame('body', index);
                    // console.log(body)
                    // parent.$("#ruleid").val(msg.ruleid);
                    // parent.$("#roomid").val(msg.roomid);
                    // body.find("#roomid").val(msg.roomid);
                }
            })

        }


        // if(openid == 1) {
        // 	  
        // }

        return false;
    });
    form.on('submit(component-form-demo2)', function(data) {


        // var rowname = $("#select-room").find("option[value='"+data.field.interest+"']").text();
      

        var openid = 0;
        var ruleid;
        var roomid;
      
        $.ajax({
            async: false,
            type: "post",
            url: url + "/ruletemplate/addruletemplate",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            data: {
                "name": data.field.user,
                "stauts": 1,
                "roomid": data.field.meeting,
                "roomname": $("#select-room option:selected").text()
            },
            success: function(msg) {
                if (msg.code == '0') {
                    var data = msg.state;
                    var index = parent.layer.getFrameIndex(window.name); 
                    parent.reloads()//先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭 
                    open(msg);
                } else {

                }

            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })

        function open(msg) {
            console.log(msg)
            parent.layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '  ',
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '106%'],
                closeBtn: 1,
                offset: '-43px',
                content: '../arrangeman/territory_rules_edit.html?ruleid=' + msg.data.id +
                    '&roomid=' + msg.data.roomid,
                success: function(layero, index) {
                    // var body = window.parent.layer.getChildFrame('body', index);
                    // console.log(body)
                    // parent.$("#ruleid").val(msg.ruleid);
                    // parent.$("#roomid").val(msg.roomid);
                    // body.find("#roomid").val(msg.roomid);
                },
               
            })

        }


        // if(openid == 1) {
        // 	  
        // }

        return false;
    });


});
