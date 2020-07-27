layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form','upload','tree'], function(){
    var $ = layui.$
        ,upload = layui.upload
        ,form = layui.form,
        setter = layui.setter,
        tree = layui.tree
    var url = setter.baseUrl;
    var attributes =[];
    var uploadfile = null;
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var uri = window.location.search;
        var r = uri.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2]; return null; //返回参数值
    }
    var indexs = getUrlParam("id")
    console.log(indexs);
    //渲染会议下拉框的ajax
    $.ajax({
        async: false,
        type: "get",
        url: url+"/meeting/findAll",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        data: {

        },
        success: function(msg) {

            var data = msg.data.reverse();

            $.each(data, function(idx, con) {
                $("#select_meet").after("<option value=" + con.id + ">" + con.name + "</option>");

            })

            $("#meeting_list").val($("#meetingid").val());


        },
        //失败的回调函数
        error: function() {
            console.log("error")
        }
    })

    form.on('submit(addlounge)', function(data) {
        $.ajax({
            async: false,
            url: url + "/lounge/addlounge",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {
                "roomid":indexs,
                "loungename":data.field.name
            } ,
            success: function (res) {
                if (res.code == '0') {
                    parent.layer.msg('添加成功');
                    var index = parent.layer.getFrameIndex(window.name)
                    parent.layer.close(index)
                    parent.ajaxs(indexs)
                } else {
                    layer.msg(res.msg, {
                        icon: 5
                    });
                    var index = parent.layer.getFrameIndex(window.name)
                    parent.layer.close(index)
                }
            },
            error: function (error) {
                layer.msg('添加失败，服务器错误请稍后再试', {
                    icon: 5
                });
                layer.close(index);
            }
        });

    });
})