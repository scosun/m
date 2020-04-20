layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form'], function () {
    var $ = layui.$
        , form = layui.form,
        setter = layui.setter,
        router = layui.router();
    console.log(router.search.id)
    var url = setter.baseUrl;
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    console.log(getUrlParam("add"))
    //监听提交
    form.on('submit(component-form-select)', function (data) {
        var field = data.field; //获取提交的字段
        var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引

        //提交 Ajax 成功后，关闭当前弹层并重载表格
        //$.ajax({});
        parent.layui.table.reload('test-table-operate'); //重载表格
        parent.layer.close(index); //再执行关闭
    });

    var editid = +$("#editid").val();
    if (editid) {
        //编辑
        $("#seatmapbtn").text("编辑座区图");
    }


    function editSeatMap() {
        $.ajax({
            url: url + "/roomtemplate/findByIdTemplatecode",
            type: "POST",
            data: {
                "id": editid
            },
            xhrFields: {
                withCredentials: true
            },
            success: function (data) {
                console.log("---findByIdTemplatecode----", data)
                if (data.code == "0") {
                    var templatecode = data.data.templatecode;
                    sessionStorage.setItem("_seatscomplete", templatecode);
                    // var topLayui = parent === self ? layui : top.layui;
                    // topLayui.index.openTabsPage("arrange/meeting/seatmapseditor.html", "会场编辑器");

                    parent.layer.open({
                        type: 2,
                        title: '座区图',
                        content: 'seatmapseditor.html',
                        maxmin: true,
                        area: ['100%', '100%'],
                        scrollbar: false,
                        yes: function (index, layero) {
                        },
                        success: function (layero, index) {
                            var body = layer.getChildFrame('body', index);
                        }
                    });

                } else {
                    layer.msg(data.msg, {
                        icon: 5
                    });
                }
            },
            error: function (error) {

            }
        });
    }

    $("#seatmapbtn").bind("click", function () {
        if (editid) {
            //编辑
            editSeatMap();
        } else {
            //新增
            sessionStorage.setItem("_seatscomplete", "");
            parent.layer.open({
                type: 2,
                title: '座区图',
                content: 'seatmapseditor.html',
                maxmin: true,
                area: ['100%', '100%'],
                scrollbar: false,
                yes: function (index, layero) {
                },
                success: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                }
            });
        }
    })
})