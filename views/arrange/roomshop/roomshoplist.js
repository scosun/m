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

    // $.ajax({
    //     url: url + "/roomshop/queryroomshopBypage",
    //     type: "get",
    //     data: {
    //         page
    //     },
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     success: function (data) {
    //         if (data.code == "0") {
    //             counts = data.count
    //             var laypages = laypage.render({
    //                 elem: 'demo0',
    //                 count: data.count,
    //                 limit: 1,
    //                 jump: function (obj) {
    //                     //模拟渲染
    //                     console.log(obj.count)
    //                 }
    //             });
    //             $.each(data.data, function (index, curr) {
    //                 var html = [];
    //                 html.push('<li id="' + curr.id + '" name="'+curr.name+'" class="layui-col-md2 layui-col-xs6">');
    //                 html.push('<div class="box_shadow card_style">');
    //                 html.push('<a href="javascript:;" class="x-admin-backlog-body">');
    //                 html.push('<div class="img_box"><img src='+url+"/shop"+curr.imageurl+' /></div>');
    //                 html.push('<h3>'+curr.name+'</h3>');
    //                 html.push('<p>￥<cite>'+ (curr.price || 0) +'</cite></p>');
    //                 html.push('</a></div></li>');
    //
    //                 $("#shop").append(html.join(''));
    //
    //                 bindItemClick();
    //
    //                 // $("#shop").append('   <div class="layui-col-md2 layui-col-sm4">\n' +
    //                 //     '            <div class="cmdlist-container">\n' +
    //                 //     '                <a href="javascript:;">\n' +
    //                 //     '                    <img  width="200px" height="190px" src='+url+"/shop"+curr.imageurl+'>\n' +
    //                 //     '                </a>\n' +
    //                 //     '                <a href="javascript:;">\n' +
    //                 //     '                    <div class="cmdlist-text">\n' +
    //                 //     '                        <p class="info">'+curr.name+'</p>\n' +
    //                 //     '                        <div class="price">\n' +
    //                 //     '                            <b>￥'+curr.price+'</b>\n' +
    //                 //     '                            <span class="flow">\n' +
    //                 //     '                      <i class="layui-icon layui-icon-rate"></i>\n' +
    //                 //     '                      433\n' +
    //                 //     '                    </span>\n' +
    //                 //     '                        </div>\n' +
    //                 //     '                    </div>\n' +
    //                 //     '                </a>\n' +
    //                 //     '            </div>\n' +
    //                 //     '        </div>')
    //
    //             });
    //         } else {
    //
    //         }
    //     },
    //     error: function (error) {
    //
    //     }
    // });
    var isding = false;
    $.ajax({
        async: false,
        type: "get",
        url: url + "/ui/getUsername",
        datatype: 'json',
        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        success: function (msg) {
            console.log(msg.code)
            if(msg.code===0){
                isding = true;
            }else{

            }
        },
        error: function (error) {
        },
    })

    window.pages={
        page: 1,
        limit: 18,
        count: 1,
    }
    load(pages);
    // window.laypages = laypage.render({
    //     elem: 'demo0',
    //     count: pages.count,
    //     limit: pages.limit,
    //     curr: pages.page,
    //     jump: function (obj,first) {
    //         pages.page = obj.curr;
    //         pages.limit = obj.limit;
    //         if (!first){
    //             load()
    //         }
    //     }
    // });
    Object.defineProperty(pages,"count", {
        set:function (value){
            window.laypages = laypage.render({
                elem: 'demo0',
                count: value,
                limit: pages.limit,
                curr: pages.page,
                jump: function (obj, first) {

                    if (!first) {
                        pages.page = obj.curr;
                        pages.limit = obj.limit;
                        console.log(pages)
                        load(pages)
                        console.log(666)
                    }
                }
            })
        }
    })
        function load(pages){
            $.ajax({
                url: url + "/roomshop/queryroomshopBypage",
                type: "get",
                data: {
                    "page": pages.page,
                    "limit": pages.limit,

                },
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    if (data.code == "0") {
                        $("#shop").empty()
                        $.each(data.data, function (index, curr) {
                            pages.count = data.count;
                            var html = [];
                            html.push('<li id="' + curr.id + '" name="'+curr.name+'" class="layui-col-md2 layui-col-xs6">');
                            html.push('<div class="box_shadow card_style">');
                            html.push('<a href="javascript:;" class="x-admin-backlog-body">');
                            html.push('<div class="img_box"><img src='+url+"/shop"+curr.imageurl+' /></div>');
                            html.push('<h3>'+curr.name+'</h3>');
                            if(isding){}else {
                                html.push('<p>￥<cite>'+ (curr.price || 0) +'</cite></p>');
                            }
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
        }
        $("#search").click(function (){
            var content = $("#demoReload").val();
            search(pages,content);
        })
    function search(pages,content){
        $.ajax({
            url: url + "/roomshop/search",
            type: "get",
            data: {
                "page": pages.page,
                "limit": pages.limit,
                "content": content
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                if (data.code == "0") {
                    $("#shop").empty()
                    $.each(data.data, function (index, curr) {
                        pages.count = data.count;
                        var html = [];
                        html.push('<li id="' + curr.id + '" name="'+curr.name+'" class="layui-col-md2 layui-col-xs6">');
                        html.push('<div class="box_shadow card_style">');
                        html.push('<a href="javascript:;" class="x-admin-backlog-body">');
                        html.push('<div class="img_box"><img src='+url+"/shop"+curr.imageurl+' /></div>');
                        html.push('<h3>'+curr.name+'</h3>');
                        if(isding){}else {
                            html.push('<p>￥<cite>'+ (curr.price || 0) +'</cite></p>');
                        }
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
    }
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
