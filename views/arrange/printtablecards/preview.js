layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery',], function() {
    var table = layui.table,
        admin = layui.admin,
        setter = layui.setter,
        router = layui.router(),
        $ = layui.jquery;
    var url = setter.baseUrl;
    // var url = "http://127.0.0.1:8083";
    var devices = {};
    var deviceList = [];
    // #test-table-operate
    //渲染表格

    $('#group').append('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="print" id="batchmeet">设置<s></s></a>');
    $('#group').after('<div class="assistBtn"><span class="fengeline">/</span><i class="layui-icon layui-ds layui-icon-refresh-3" data-type="refresh"></i></div>')
    
   
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
                deviceList.length=10;//先定义个假数据
                if ( deviceList.length == 0 ) {
                    return layer.msg("请选择后再批量打印！")
                }
                //获取选中数目
                layer.confirm('    是否将 12 个桌牌全部打印？',
                {
                    title:'指定区域打印',
                    skin: '',
                    btn: ['预览','取消'],
                    // 取消
                    btn2: function(){
                        layer.close();
                    },
                    // 预览
                    yes: function(index){
                        // layer.open({
                        //     type: 2,
                        //     title: '收藏管理 (考生姓名：张无忌)',
                        //     //title: false,
                        //     shadeClose: false, //弹出框之外的地方是否可以点击
                        //     area: ['100%', '100%'],
                        //     closeBtn: 1,
                        //     // maxmin: true,
                        //     closeBtn:false,
                        //     offset: '0',
                        //     content: 'seatmap.html',
                        //     success: function(layero, index) {
                        //     }
                        // })
                    }
                },
                function(index) {
                    layer.close(index);
                });
            },
            search: function() {
                

            }
        };

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });


        /*右侧菜单HOVER显示提示文字*/
        $('.layui-right-nav i').each(function() {
            var _id = $(this).attr('id');
            var _data = $(this).attr('data');
            $("#" + _id).hover(function() {
                openMsg();
            }, function() {
                layer.close(subtips);
            });

            function openMsg() {
                subtips = layer.tips(_data, '#' + _id, {
                    tips: [3, '#666'],
                    time: 30000
                });
            }
        });
});
