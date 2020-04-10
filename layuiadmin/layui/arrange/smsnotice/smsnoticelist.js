layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index', //主入口模块
    dropdown: '/dropdown/dropdown'
}).use(['index', 'table', 'jquery','dropdown'], function () {
    var table = layui.table,
        admin = layui.admin,
        $ = layui.jquery,
        dropdown = 'dropdown';
    // dropdown = layui.dropdown;
    var url = "https://f.longjuli.com";
    // var url = "http://127.0.0.1:8083";
    var devices = {};
    var deviceList = [];
    // #test-table-operate
    //渲染表格

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
        where: {
            status: 0
        },
        xhrFields: {
            withCredentials: true
        },
        url: url + "/smsstatistics/findAll", //数据接口
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
                //     field: 'id',
                //     title: 'ID',
                //     width: 60,
                //     //align: 'center',
                //     unresize: 'false',
                // },
                {
                    field: 'title',
                    title: '通知标题',
                    align: 'left',
                }, {
                field: 'succeednotice',
                title: '成功通知',
                align: 'left',
            },
                {
                    field: 'canhui',
                    title: '确认参会',
                    align: 'left',
                },
                {
                    field: 'leave',
                    title: '确认请假',
                    align: 'left',
                },
                {
                    field: 'noreply',
                    title: '未反馈',
                    align: 'left',
                },
                {
                    field: 'nosend',
                    title: '发送失败',
                    align: 'left',
                },
                {
                    title: '操作',
                    align: 'left',
                    width: 140,
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
        done: function (res, curr, count) {
            table_data = res.data;

            layer.closeAll('loading');
            deviceList.length = 0;
            // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
            // layer.close(index);    //返回数据关闭loading
        },
    });
    //刷新表格
    window.reloads = function () {
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            //url: url + "/meeting/findAllBylayui", //数据接口
            method: 'get',
            where: {
                status: 0
            },
            xhrFields: {
                withCredentials: true
            },
            url: url + "/smsstatistics/findAll", //数据接口
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
                    //     field: 'id',
                    //     title: 'ID',
                    //     width: 60,
                    //     //align: 'center',
                    //     unresize: 'false',
                    // },
                    {
                        field: 'title',
                        title: '通知标题',
                        align: 'left',
                    }, {
                    field: 'succeednotice',
                    title: '成功通知',
                    align: 'left',
                },
                    {
                        field: 'canhui',
                        title: '确认参会',
                        align: 'left',
                    },
                    {
                        field: 'leave',
                        title: '确认请假',
                        align: 'left',
                    },
                    {
                        field: 'noreply',
                        title: '未反馈',
                        align: 'left',
                    },
                    {
                        field: 'nosend',
                        title: '发送失败',
                        align: 'left',
                    },
                    {
                        title: '操作',
                        align: 'left',
                        toolbar: '#test-table-operate-barDemo',
                        width: 140,
                    },

                ]
            ],
            event: true,
            page: true,
            limit: 15,
            skin: 'line',
            even: true,
            limits: [5, 10, 15],
            done: function (res, curr, count) {
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
    table.on('checkbox(test-table-operate)', function (obj) {
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
            $.each(table.checkStatus('test-table-operate').data, function (idx, con) {
                var devi = {};
                devi = con.id;

                deviceList.push(devi)
            });
            deviceList = Array.from(new Set(deviceList))
        }

    });

    //监听工具条
    table.on('tool(test-table-operate)', function (obj) {
        var data = obj.data;
        if (obj.event === 'sendmail') {
            layer.confirm('请确认信息正确并点击确认按钮后，短信会立即发送', function (index) {
                $.ajax({
                    async: false,
                    type: "post",
                    url: url + "/smsnotice/sendmail",
                    datatype: 'json',
                    data: {
                        statistics: obj.data.id,
                        random:obj.data.random
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    //成功的回调函数
                    success: function (msg) {
                        if (msg.code == 0) {
                            layer.msg(msg.msg)
                            // var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                            // layer.close(index);
                            reloads();
                        } else {
                            layer.msg(msg.msg)
                        }

                    },
                    error: function (error) {
                        console.log(error)
                    },
                })
                layer.close(index);
            });

        } else if (obj.event === 'personedit') {
            if (obj.data.issendmail == 1) {
                return layer.msg('当前会议已发送');
            }
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '选择人员',
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['60%', '80%'],
                maxmin: true,
                btn: ['确认', '取消'],
                closeBtn: 1,
                //offset: '-43px',
                content: 'smsnoticebyMeetingadd.html?meetingid=' + obj.data.meetingid+"&id="+obj.data.id,
                success: function (layero, index) {},
                yes: function (index, layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                }
            });
        } else if (obj.event === 'particulars') {
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '人员详情',
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '100%'],
                btn: ['刷新', '返回'],
                closeBtn: 1,
                //offset: '-43px',
                //  content: $('#show-view'),
                content: 'smsnoticebyMeeting.html?meetingid=' + obj.data.id+"&ids="+obj.data.random+"&meetid="+obj.data.meetingid,
                success: function (layero, index) {},
                yes:function (index,layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                }

            });
        } else if (obj.event === 'record') {
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '短信发送记录',
                maxmin: true,
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '100%'],
                btn: ['刷新', '返回'],
                closeBtn: 1,
                //offset: '-43px',
                //  content: $('#show-view'),
                content: 'smsrecordlist.html?meetingid=' + obj.data.random,
                success: function (layero, index) {},
                yes:function (index,layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                }

            });
        } else if (obj.event === 'edit') {
            if (data.issendmail == 1) {
                return layer.msg('当前短信已发送无法修改')
            }
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '选择人员',
                maxmin: true,
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '100%'],
                btn: ['确认', '取消'],
                closeBtn: 1,
                //offset: '-43px',
                //  content: $('#show-view'),
                content: 'smsnoticeupdate.html?meetingid=' + obj.data.meetingid + '&notice=' + obj.data.noticeid + '&apply=' + obj.data.applyid,
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    var iframeWin = window[layero.find('iframe')[0]['name']]
                    iframeWin.child(obj.data.id);
                    var datetime = obj.data.time.split(' ');
                    var date = datetime[0].replace('-', '年').replace('-', '月') + "日"
                    console.log(date);
                    // 取到弹出层里的元素，并把编辑的内容放进去
                    body.find("#dates").val(date);
                    body.find("#times").val(datetime[1]);
                    body.find("#title").val(obj.data.title); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                },
                yes: function (index, layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                }

            });
        } else if (obj.event === 'del') {
            layer.confirm('确认删除吗？', function (index) {
                $.ajax({
                    async: false,
                    type: "get",
                    url: url + "/smsstatistics/delete",
                    datatype: 'json',
                    data: {
                        id: obj.data.id,
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    //成功的回调函数
                    success: function (msg) {
                        if (msg.code == 0) {
                            layer.msg(msg.msg)
                            // var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                            // layer.close(index);
                            reloads();
                        } else {
                            layer.msg(msg.msg)
                        }

                    },
                    error: function (error) {
                        console.log(error)
                    },
                })
                layer.close(index);
            });

        } else if (obj.event === 'nosend') {
            if (obj.data.issendmail != 1) {
                return layer.msg('当前未发送短信');
            }
            layer.confirm('确认要通知吗？', function (index) {
                $.ajax({
                    async: false,
                    type: "get",
                    url: url + "/smsstatistics/nosend",
                    datatype: 'json',
                    data: {
                        id: obj.data.id,
                        sid: obj.data.meetingid,
                        extno:obj.data.random
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    //成功的回调函数
                    success: function (msg) {
                        if (msg.code == 0) {
                            layer.msg(msg.msg)
                            // var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                            // layer.close(index);
                            reloads();
                        } else {
                            layer.msg(msg.msg)
                        }

                    },
                    error: function (error) {
                        console.log(error)
                    },
                })
                layer.close(index);

            });
        }
    });
    // form.on('submit(component-form-search)', function(data) {
    //     alert(1);
    // })
    var $ = layui.$,

        active = {
            //全选
            getCheckData: function () { //获取选中数据
                // var checkStatus = table.checkStatus('test-table-operate'),
                //     data = checkStatus.data;
                // layer.alert(JSON.stringify(data));
                // console.log(checkStatus.data)
                var cb = $(".layui-form-checkbox");
                // $('.layui-cell-checkbox').click();

                $(".layui-form-checkbox").each(function () {
                    // if (flag) {

                    $(this).click();

                    // } else {
                    //     $(this).removeClass('layui-form-checked')
                    // }
                })


            },
            //批量删除
            getCheckLength: function () {
                if (deviceList.length == 0) {
                    return layer.msg("请选择会议后再批量删除")
                }
                //获取选中数目
                layer.confirm('真的删除吗？', function () {
                    $.ajax({
                        async: false,
                        type: "post",
                        url: url + "/meeting/batchRemove",
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        //成功的回调函数
                        data: {
                            "meetingid": deviceList.join(",")

                        },
                        success: function (msg) {
                            if (msg.code == 0) {
                                layer.msg("删除成功");
                                reloads(); // 父页面刷新

                            } else {
                                layer.msg(msg.msg);


                            }

                        },
                        //失败的回调函数
                        error: function () {
                            console.log("error")
                        }
                    })
                })
            },
            //批量删除
            isAll: function () { //验证是否全选

                layer.confirm('您将要进行列表清空操作,执行后您的所有记录将被删除,请谨慎操作,是否确认?', function (index) {
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
                        success: function (msg) {
                            if (msg.code == 0) {
                                layer.msg("清空成功");
                                reloads(); // 父页面刷新

                            } else {
                                layer.msg(msg.msg);


                            }

                        },
                        //失败的回调函数
                        error: function () {
                            console.log("error")
                        }
                    })
                    layer.close(index);
                });


            },
            add: function () {
                layer.open({
                    type: 2,
                    //title: '收藏管理 (考生姓名：张无忌)',
                    title: '新建短信通知',
                    maxmin: true,
                    shadeClose: false, //弹出框之外的地方是否可以点击
                    area: ['100%', '100%'],
                    btn: ['确认', '取消'],
                    closeBtn: 1,
                    //offset: '-43px',
                    content: 'smsnoticelist_add.html',
                    success: function (layero, index) {
                        // var body = layui.layer.getChildFrame('body', index);
                        // var roomid;
                        // // 取到弹出层里的元素，并把编辑的内容放进去
                        // body.find("#ruleid").val(data.id);
                        // body.find("#roomid").val(data.roomid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                    },
                    yes: function (index, layero) {
                        var submit = layero.find('iframe').contents().find("#click");
                        submit.click();
                    }
                });
            },
            search: function () {
                table.render({
                    elem: '#test-table-operate',
                    // height: 'full-200',
                    //url: url + "/meeting/findAllBylayui", //数据接口
                    method: 'get',
                    where: {
                        content: $('#demoReload').val()
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    url: url + "/smsstatistics/selectSearch", //数据接口
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
                            //     field: 'id',
                            //     title: 'ID',
                            //     width: 60,
                            //     //align: 'center',
                            //     unresize: 'false',
                            // },
                            {
                                field: 'title',
                                title: '通知标题',
                                align: 'left',
                            }, {
                            field: 'succeednotice',
                            title: '成功通知',
                            align: 'left',
                        },
                            {
                                field: 'canhui',
                                title: '确认参会',
                                align: 'left',
                            },
                            {
                                field: 'leave',
                                title: '确认请假',
                                align: 'left',
                            },
                            {
                                field: 'noreply',
                                title: '未反馈',
                                align: 'left',
                            },
                            {
                                field: 'nosend',
                                title: '发送失败',
                                align: 'left',
                            },
                            {
                                title: '操作',
                                align: 'left',
                                toolbar: '#test-table-operate-barDemo',
                                width: 140,
                            },

                        ]
                    ],
                    event: true,
                    page: true,
                    limit: 15,
                    skin: 'line',
                    even: true,
                    limits: [5, 10, 15],
                    done: function (res, curr, count) {
                        table_data = res.data;

                        layer.closeAll('loading');
                        deviceList.length = 0;
                        // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                        // layer.close(index);    //返回数据关闭loading
                    },
                });
            }
        };

    $('.layui-ds').on('click', function () {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });

});