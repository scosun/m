layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery'], function() {
    var table = layui.table,
        setter = layui.setter,
        $ = layui.jquery;
    var url = setter.baseUrl;;
    // var url = "http://127.0.0.1:8083";
    var devices = {};
    var deviceList = [];
    // #test-table-operate
    //渲染表格

    // 20.04.06 dh 下行有修改 
    // $('#group').append(
    //     '<button class="layui-btn layui-ds" data-type="getCheckData" id="buttongroup">全选</button>'
    // )
    $('#group').append('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="getCheckData" id="buttongroup">全选<s></s></a>')

    $.ajax({
        async: false,
        type: "get",
        url:url+ "/permission/getpremission",
        datatype: 'json',

        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        success: function(msg) {
            var data = msg.data;
            
            if (msg.code != 0) {
                location.href = "user/login.html"
            }
                window.a = data
                if ($.inArray("addmeet", data) != -1) {
                    // 20.04.06 dh 下行有修改 
                    $('#buttongroup').before("<button class='layui-ds gradient-block-diagonal' data-type='add' id='addmeeting'>新建</button>")
                }
                if ($.inArray("emptymeet", data) != -1) {
                    // 20.04.06 dh 下行有修改 
                    $('#buttongroup').after('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="isAll" id="emptymeet">清空<s></s></a>');
                }
                if ($.inArray("batchmeet", data) != -1) {
                    // 20.04.06 dh 下行有修改 
                    $('#buttongroup').after('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="getCheckLength" id="batchmeet">删除<s></s></a>');
                }
                      
        },
        error: function(error) {
            console.log(error)
        },
    })
    
    function isEmptyObject(obj) {

        var jlength = 0;
        for (var key in obj) {
            if (key != "null") {
                jlength++;
            }
        };
        return jlength
    };
    table.render({
        elem: '#test-table-operate',
        // height: 'full-200',
        //url: url + "/meeting/findAllBylayui", //数据接口
        method: 'get',
        url:url+'/smstemplate/findAllPage',
        where:{
            status:0
        },
        xhrFields: {
            withCredentials: true
        },
        page: {
            layout: ['prev', 'page', 'next', 'count', 'skip']
        },
        
        cols: [
            [ //表头
                {
                    type: 'checkbox',
                    fixed: 'left'
                },
                // {
                //     field: 'smsTemplateId',
                //     title: 'ID',
                //     width:60,
                //     //align: 'center',
                //     unresize: 'false',
                // },
                {
                    field: 'smsTemplateName',
                    title: '模版名称',
                    align: 'left',
                    width: 150,
                }, {
                    field: 'smsTemplateContent',
                    title: '模版内容',
                    align: 'left',
                },
                {
                    field: 'smsTemplateType',
                    title: '模版类型',
                    templet: function(data) {
                        if (data.smsTemplateType == 0) {
                            return '<span class="layui-badge layui-bg-orange">通知模版</span>'
                        }
                        if (data.smsTemplateType == 1) {
                            return '<span class="layui-badge layui-bg-blue">报名模板</span>'
                        }
                        if (data.smsTemplateType == undefined) {
                            return ''
                        }
                    },
                    width:100,
                },
                {
                    width: 100,
                    title: '操作',
                    align: 'left',
                    toolbar: '#test-table-operate-barDemo'
                },
                
            ]
        ],
        event: true,
        page: true,
        limit: 15,
        skin: 'line',
        even: true,
        limits: [5, 10, 15],
        done: function(res, curr, count) {
            table_data = res.data;

            layer.closeAll('loading');
            deviceList.length = 0;
            // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
            // layer.close(index);    //返回数据关闭loading
        },
    });
    //刷新表格
    window.reloads = function() {
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            //url: url + "/meeting/findAllBylayui", //数据接口
            method: 'get',
            url:url+'/smstemplate/findAllPage',
            where:{
                status:0
            },
            xhrFields: {
                withCredentials: true
            },
            page: {
                layout: ['prev', 'page', 'next', 'count', 'skip']
            },
            
            cols: [
                [ //表头
                    {
                        type: 'checkbox',
                        fixed: 'left'
                    },
                    // {
                    //     field: 'smsTemplateId',
                    //     title: 'ID',
                    //     width:60,
                    //     align: 'center',
                    //     unresize: 'false',
                    // },
                    {
                        field: 'smsTemplateName',
                        title: '模版名称',
                        align: 'left',
                    }, {
                        field: 'smsTemplateContent',
                        title: '模版内容',
                        align: 'left',
                    },
                    {
                        field: 'smsTemplateType',
                        title: '模版类型',
                        templet: function(data) {
                            if (data.smsTemplateType == 0) {
                                return '<span class="layui-badge layui-bg-orange">通知模版</span>'
                            }
                            if (data.smsTemplateType == 1) {
                                return '<span class="layui-badge layui-bg-blue">报名模板</span>'
                            }
                            if (data.smsTemplateType == undefined) {
                                return ''
                            }
                        },
                    },
                    {
                        title: '操作',
                        align: 'left',
                        toolbar: '#test-table-operate-barDemo'
                    },
                    
                ]
            ],
            event: true,
            page: true,
            limit: 15,
            skin: 'nob',
            limits: [5, 10, 15],
            done: function(res, curr, count) {
                table_data = res.data;
    
                layer.closeAll('loading');
                deviceList.length = 0;
                // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                // layer.close(index);    //返回数据关闭loading
            },
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

    //监听表格复选框选择
    table.on('checkbox(test-table-operate)', function(obj) {
        // console.log(obj.checked); //当前是否选中状态
        // // console.log(obj.data); //选中行的相关数据
        // console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
        // // console.log(table.checkStatus('test-table-operate').data); // 获取表格中选中行的数据
        if (obj.checked && obj.type == 'one') {
            var devi = {};
            devi = obj.data.id;
            deviceList.push(devi)
        }
        if (!obj.checked && obj.type == 'one') {
            var index = deviceList.indexOf(obj.data.id);
            if (index > -1) {
                deviceList.splice(index, 1);
            }
        }
        if (!obj.checked && obj.type == 'all') {
            deviceList.length = 0;

        }
        if (obj.checked && obj.type == 'all') {
            $.each(table.checkStatus('test-table-operate').data, function(idx, con) {
                var devi = {};
                devi = con.id;

                deviceList.push(devi)
            });
            deviceList = Array.from(new Set(deviceList))
        }

    });

    //监听工具条
    table.on('tool(test-table-operate)', function(obj) {
        var data = obj.data;
         if (obj.event === 'del') {
            layer.confirm('确认删除这条短信模板', function(index) {
                obj.del();

                $.ajax({
                    async: false,
                    type: "post",
                    url: url + "/smstemplate/delete",
                    dataType: "json",
                    //成功的回调函数
                    data: {
                        "id": obj.data.smsTemplateId
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(msg) {

                        if (msg.code == 0) {
                            layer.msg("删除成功");
                            reloads();
                        } else {
                            layer.msg(msg.msg);
                        }
                    },
                    //失败的回调函数
                    error: function() {
                        console.log("error")
                    }
                })
                layer.close(index);
            });
        } else if (obj.event === 'edit') {
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '新建通知模版',
                shadeClose: false, //弹出框之外的地方是否可以点击
                maxmin: true,
                btn: ['确认', '取消'],
                area: ['60%', '60%'],
                content: 'smstemplate_update.html?id='+data.smsTemplateId,
                success: function(layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    // 取到弹出层里的元素，并把编辑的内容放进去
                    body.find("#name").val(data.smsTemplateName);
                    body.find("#content").val(data.smsTemplateContent); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                },
                yes: function(index,layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                        submit.click();
                }
            });
        }
    });

    // form.on('submit(component-form-search)', function(data) {
    //     alert(1);
    // })
    var $ = layui.$,

        active = {
            //全选
            getCheckData: function() { //获取选中数据
                // var checkStatus = table.checkStatus('test-table-operate'),
                //     data = checkStatus.data;
                // layer.alert(JSON.stringify(data));
                // console.log(checkStatus.data)
                var cb = $(".layui-form-checkbox");
                // $('.layui-cell-checkbox').click();

                $(".layui-form-checkbox").each(function() {
                    // if (flag) {

                    $(this).click();

                    // } else {
                    //     $(this).removeClass('layui-form-checked')
                    // }
                })


            },
            //批量删除
            getCheckLength: function() {
                if ( deviceList.length == 0 ) {
                    return layer.msg("请选择会议后再批量删除")
                }
                //获取选中数目
                layer.confirm('真的删除吗？', function() {
                    $.ajax({
                        async: false,
                        type: "post",
                        maxmin: true,
                        url: url + "/meeting/batchRemove",
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        //成功的回调函数
                        data: {
                            "meetingid": deviceList.join(",")

                        },
                        success: function(msg) {
                            if (msg.code == 0) {
                                layer.msg("删除成功");
                                reloads(); // 父页面刷新

                            } else {
                                layer.msg(msg.msg);


                            }

                        },
                        //失败的回调函数
                        error: function() {
                            console.log("error")
                        }
                    })
                })
            },
            //批量删除
            isAll: function() { //验证是否全选
            
                layer.confirm('您将要进行列表清空操作,执行后您的所有记录将被删除,请谨慎操作,是否确认?', function(index) {
                    $.ajax({
                        async: false,
                        type: "get",
                        url: url + "/meeting/empty",
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        //成功的回调函数
                        data: {

                        },
                        success: function(msg) {
                            if (msg.code == 0) {
                                layer.msg("清空成功");
                                reloads(); // 父页面刷新

                            } else {
                                layer.msg(msg.msg);


                            }

                        },
                        //失败的回调函数
                        error: function() {
                            console.log("error")
                        }
                    })
                    layer.close(index);
                });


            },
            add: function() {
                layer.open({
                    type: 2,
                    title: '新建通知模版',
                    area: ['60%', '60%'],
                    maxmin: true,
                    btn: ['确认', '取消'],
                    content: 'smstemplate_add.html',
                    yes: function(index, layero) {
                        var submit = layero.find('iframe').contents().find("#click");
                        submit.click();
                    }
                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });
            },
            search: function() {
                table.render({
                    elem: '#test-table-operate',

                    method: 'get',
                    url:url+'/smstemplate/search',
                    where:{
                        content:$("#demoReload").val()
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    page: {
                        layout: ['prev', 'page', 'next', 'count', 'skip']
                    },

                    cols: [
                        [ //表头
                            {
                                type: 'checkbox',
                                fixed: 'left'
                            },
                            // {
                            //     field: 'smsTemplateId',
                            //     title: 'ID',
                            //     width:60,
                            //     //align: 'center',
                            //     unresize: 'false',
                            // },
                            {
                                field: 'smsTemplateName',
                                title: '模版名称',
                                align: 'left',
                                width: 150,
                            }, {
                            field: 'smsTemplateContent',
                            title: '模版内容',
                            align: 'left',
                        },
                            {
                                field: 'smsTemplateType',
                                title: '模版类型',
                                templet: function(data) {
                                    if (data.smsTemplateType == 0) {
                                        return '<span class="layui-badge layui-bg-orange">通知模版</span>'
                                    }
                                    if (data.smsTemplateType == 1) {
                                        return '<span class="layui-badge layui-bg-blue">报名模板</span>'
                                    }
                                    if (data.smsTemplateType == undefined) {
                                        return ''
                                    }
                                },
                                width:100,
                            },
                            {
                                width: 100,
                                title: '操作',
                                align: 'left',
                                toolbar: '#test-table-operate-barDemo'
                            },

                        ]
                    ],
                    event: true,
                    page: true,
                    limit: 15,
                    skin: 'line',
                    even: true,
                    limits: [5, 10, 15],
                    done: function(res, curr, count) {
                        table_data = res.data;

                        layer.closeAll('loading');
                        deviceList.length = 0;
                        // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                        // layer.close(index);    //返回数据关闭loading
                    },
                });
            }
        };

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });
});
