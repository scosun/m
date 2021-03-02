layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form', 'laydate'], function () {
    var $ = layui.$,
        setter = layui.setter,
        layer = layui.layer,
        laydate = layui.laydate,
        form = layui.form;

    var url = setter.baseUrl;

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
        success: function (msg) {
            var data = msg.data;
            $.each(data, function (idx, con) {
                $("#select_meet").after("<option value=" + con.id + ">" + con.name + "</option>");
            });
        },
        //失败的回调函数
        error: function () {
            console.log("error")
        }
    });


    form.render(null, 'component-form-group');

    // window.reloads = function(){
    //     parent.reloads();
    // }

    // laydate.render({
    //     elem: '#LAY-component-form-group-date'
    // });


    /* 监听指定开关 */
    // form.on('switch(component-form-switchTest)', function(data) {
    //     layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
    //         offset: '6px'
    //     });
    //     layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
    // });

    form.on('select(component-form-select)', function (data) {
        console.log(data);
        $.ajax({
            async: false,
            type: "get",
            url: url + "/tablesignbind/findProductByRoomId",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            data: {
                "roomId" : data.value,
            },
            success: function (msg) {
                var data = msg.data;
                $.each(data, function (idx, con) {
                    $("#product_list").after("<option value=" + con.productKey + ">" + con.productName + "</option>");
                });
                form.render(null, 'component-form-group');
            },
            //失败的回调函数
            error: function () {
                console.log("error")
            }
        });

    })
    /* 监听提交 */
    form.on('submit(component-form-demo1)', function (data) {
        $.ajax({
            async: false,
            type: "post",
            url: url + "/tablesignbind/addTablesignBind",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            data: {
                "roomid": data.field.meeting,
                "productKey": data.field.productKey,
            },
            success: function (msg) {
                if (msg.code == '0') {
                    // var data = msg.state;
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.closeAll();; //再执行关闭
                    parent.reloads();
                }
            },
            //失败的回调函数
            error: function () {
                console.log("error")
            }
        });

    });


});
