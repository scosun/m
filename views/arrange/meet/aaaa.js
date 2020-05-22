var indexs = 0;

layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index',//主入口模块
    soulTable: '/sourtable/soulTable',
    tableFilter: '/sourtable/tableFilter',
    excel: '/sourtable/excel',
    tableChild: '/sourtable/tableChild',
    tableMerge: '/sourtable/tableMerge'
}).use(['index', 'user', 'form', 'table', 'layedit', 'laydate', 'upload', 'soulTable', 'laypage'], function () {
    var a = {};
    var b = {};
    var $ = layui.$,
        setter = layui.setter,
        admin = layui.admin,
        form = layui.form,
        element = layui.element,
        table = layui.table,
        layer = layui.layer,
        upload = layui.upload,
        laypage = layui.laypage,
        laydate = layui.laydate,
        datas = null,
        soulTable = layui.soulTable,
        router = layui.router();
    element.render();

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });

    var inde = true;
    var inde1 = true;
    
    var active = {
        askLeave: function() {
            if (!inde) {
                setTimeout(function(){
                    $('#nav-showaskLeave').hide();
                    $('#nav-ClosedaskLeave').show();
                }, 100);
                $('#askLeave').show();
                inde = true;
            } else {
                setTimeout(function(){
                    $('#nav-showaskLeave').show();
                    $('#nav-ClosedaskLeave').hide();
                }, 100);
                $('#askLeave').hide();
                inde = false;
            }
        },
        notImport: function() {
            if (!inde1) {
                setTimeout(function(){
                    $('#nav-shownotImport').hide();
                    $('#nav-ClosednotImport').show();
                }, 100);
                $('#notImport').show();
                inde1 = true;
            } else {
                setTimeout(function(){
                    $('#nav-shownotImport').show();
                    $('#nav-ClosednotImport').hide();
                }, 100);
                $('#notImport').hide();
                inde1 = false;
            }
        },
    }

    /*右侧菜单HOVER显示提示文字*/
    var subtips;
    $('.layui-right-nav i').each(function(){
        var _id = $(this).attr('id');
        var _data = $(this).attr('data');
        $("#" + _id).hover(function() {
            openMsg();
        }, function() {
            if(subtips){
                layer.close(subtips);
            }
        });
        function openMsg() {
            subtips = layer.tips(_data, '#'+_id,{tips:[3,'#666'],time: 30000});
        }
    })
    /*右侧菜单HOVER显示提示文字 end*/

})