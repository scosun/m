layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index','laypage', 'layer'], function () {
    var laypage = layui.laypage,
        setter = layui.setter, 
        layer = layui.layer,
        $ = layui.jquery;
    var url = setter.baseUrl;

    var counts = 0;
    $.ajax({
        url: url + "/roomshop/queryroomshopBypage",
        type: "get",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        success: function (data) {
            if (data.code == "0") {
                counts = data.count
                var laypages = laypage.render({
                    elem: 'demo0',
                    count: data.count,
                    limit: 18, 
                    jump: function (obj) {
                        //模拟渲染
                        console.log(obj.count)
                    }
                });
                $.each(data.data, function (index, curr) {
                    var html = [];
                    html.push('<li id="' + curr.id + '" name="'+curr.name+'" class="layui-col-md2 layui-col-xs6">');
                    html.push('<div class="box_shadow card_style">');
                    html.push('<a href="javascript:;" class="x-admin-backlog-body">');
                    html.push('<div class="img_box"><img src='+url+"/shop"+curr.imageurl+' /></div>');
                    html.push('<h3>'+curr.name+'</h3>');
                    html.push('<p>￥<cite>'+ (curr.price || 0) +'</cite></p>');
                    html.push('</a></div></li>');

                    $("#shop").append(html.join(''));

                    bindItemClick();
                    
                    // $("#shop").append('   <div class="layui-col-md2 layui-col-sm4">\n' +
                    //     '            <div class="cmdlist-container">\n' +
                    //     '                <a href="javascript:;">\n' +
                    //     '                    <img  width="200px" height="190px" src='+url+"/shop"+curr.imageurl+'>\n' +
                    //     '                </a>\n' +
                    //     '                <a href="javascript:;">\n' +
                    //     '                    <div class="cmdlist-text">\n' +
                    //     '                        <p class="info">'+curr.name+'</p>\n' +
                    //     '                        <div class="price">\n' +
                    //     '                            <b>￥'+curr.price+'</b>\n' +
                    //     '                            <span class="flow">\n' +
                    //     '                      <i class="layui-icon layui-icon-rate"></i>\n' +
                    //     '                      433\n' +
                    //     '                    </span>\n' +
                    //     '                        </div>\n' +
                    //     '                    </div>\n' +
                    //     '                </a>\n' +
                    //     '            </div>\n' +
                    //     '        </div>')

                });
            } else {

            }
        },
        error: function (error) {

        }
    });
    //总页数低于页码总数


    function bindItemClick(){
        $("#shop > li").unbind("click");
        $("#shop > li").bind("click",function(){
            var roomid = this.id;
            var name = $(this).attr("name");
            
            layer.open({
                type: 2,
                title: false,
                shadeClose: false,
                area: ['100%', '100%'],
                closeBtn: false,
                offset: '0',
                content: 'meeting_room_zq.html?roomid=' + roomid + "&name=" + name,
                success: function (layero, index) {
                    
                }
            });
        });
    }
});