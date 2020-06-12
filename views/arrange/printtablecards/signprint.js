layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form', 'table', 'jquery',], function() {
    var table = layui.table,
        admin = layui.admin,
        form = layui.form,
        setter = layui.setter,
        router = layui.router(),
        $ = layui.jquery;
    var url = setter.baseUrl;
    // var url = "http://127.0.0.1:8083";
    
    var namestr = sessionStorage.getItem("_printnames") || "";
    console.log("namestr",namestr)
    if(namestr){
        $.ajax({
            url: url+"/printseatsgin/printSeatsginname?name=" + namestr,
            type: "get",
            async: false,
            xhrFields: {
                withCredentials: true
            },
            success: function(obj) {
                console.log("printSeatsginname-----",data);

                if(obj.code == 0){
                    var data = obj.data || [];
                    $('#name').val(data.join(''));
                }
            },
            error:function(){
                layer.closeAll();
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
            
        },
        search: function() {
            

        }
    };


    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });
});
