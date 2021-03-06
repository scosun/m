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
    var roomid = getUrlParam("roomid")


    form.on('submit(addlounge)', function(data) {
        $.ajax({
            async: false,
            url: url + "/lounge/modifylounge",
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            data: {
                "id":indexs,
                "loungename":data.field.name
            } ,
            success: function (res) {
                if (res.code == '0') {
                    parent.layer.msg('修改成功');
                    var index = parent.layer.getFrameIndex(window.name)
                    parent.layer.closeAll();
                    parent.ajaxs(roomid)
                } else {
                    layer.msg(res.msg, {
                        icon: 5
                    });
                    var index = parent.layer.getFrameIndex(window.name)
                    parent.layer.closeAll();
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
