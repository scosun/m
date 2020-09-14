layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form', 'laydate'], function() {
    var $ = layui.$,
        setter = layui.setter,
        layer = layui.layer,
        laydate = layui.laydate,
        form = layui.form;

    var url = setter.baseUrl;
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);//匹配目标参数
        if (r != null) return decodeURI(r[2]); return null; //返回参数值
    }
    var ruleid = getUrlParam("ruleid");
    var meetingid = getUrlParam("roomid");
    var productKey = getUrlParam("productKey")
    console.log(meetingid);
    console.log(productKey);
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
                $("#select_meet").after("<option value=" + con.id + ">" + con.name + "</option>");
            });
            $("#select-room").val(meetingid)
        },
        //失败的回调函数
        error: function() {
            console.log("error")
        }
    });
    $.ajax({
        async: false,
        type: "get",
        url: url + "/tablesignproduct/selectProduct",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        data: {},
        success: function(msg) {
            var data = msg.data;
            $.each(data, function(idx, con) {
                $("#product_list").after("<option value=" + con.productKey + ">" + con.productName + "</option>");
            });
            $("#product_key").val(productKey)
        },
        //失败的回调函数
        error: function() {
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


    /* 监听提交 */
    form.on('submit(component-form-demo1)', function(data) {
        $.ajax({
            async: false,
            type: "post",
            url: url + "/tablesignbind/updateTablesignBind",
            dataType: "json",
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            data: {
                "id" : ruleid,
                "roomid": data.field.meeting,
                "productKey": data.field.productKey,
            },
            success: function(msg) {
                if (msg.code == '0') {
                    // var data = msg.state;
                    var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
                    parent.layer.close(index); //再执行关闭
                    parent.reloads();
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });

    });


});
