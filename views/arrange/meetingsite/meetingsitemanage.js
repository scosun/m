layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery','laytpl'], function() {
    var table = layui.table,
        admin = layui.admin,
        setter = layui.setter,
        tpl = layui.laytpl;
        $ = layui.jquery;

    // #test-table-operate
    var url = setter.baseUrl;
    //  var url=se;
    var devices = {};
    var arrangeList = [];

    $.ajax({
        async: false,
        type: "get",
        url: url + "/permission/getpremission",
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
            window.a = data;
            var grouphtml= groups.innerHTML;tpl(grouphtml).render(data,function (html) {
                console.log(grouphtml)
                document.getElementById("group").innerHTML= html;
            })

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
        //数据接口
        url: url + "/site",
        // data:[
        //
        // ],
        method: 'get',
        // where:{
        //     stauts:0
        // },
        xhrFields: {
            withCredentials: true
        },
        page: {
            layout: ['prev', 'page', 'next', 'count', 'skip']
        },
        cols: [
            [ //表头
                {
                    field: 'name',
                    title: '场地名称',
                    align: 'left',
                }, {
                    field: 'siteType',
                    title: '场地类型',
                    align: 'left',
                templet: function (data) {
                    // 判断下 显示灰色文字 还是 绿色文字
                    // 灰色文字
                    // return "<span>"+data.sendtime+"</span>"
                    // 绿色文字
                   if (data.siteType === "M"){
                       return "会议场地";
                   }
                    if (data.siteType === "P"){
                        return "配套场地";
                    }
                }
                }, {
                    field: 'location',
                    title: '地址',
                    align: 'left',
                templet: function (data) {
                    // 判断下 显示灰色文字 还是 绿色文字
                    // 灰色文字
                    // return "<span>"+data.sendtime+"</span>"
                    // 绿色文字
                    return data.location+data.address
                }
                }, {
                    field: 'siteProvider',
                    title: '场地提供方',
                    align: 'left',
                },
                {
                    field: 'siteProvider',
                    title: '经纬度',
                    align: 'left',
                    templet: function (data) {
                        // 判断下 显示灰色文字 还是 绿色文字
                        // 灰色文字
                        // return "<span>"+data.sendtime+"</span>"
                        return data.longitude + "，"+data.latitude
                    }

                },
                {
                    field: 'reservationPhone',
                    title: '预定电话',
                    align: 'left'

                },
                {
                    field: 'contactPerson',
                    title: '联系人姓名',
                    align: 'left'

                },
                {
                    field: 'contactPhone',
                    title: '联系人电话',
                    align: 'left'

                },
                {
                    field: 'sitePrice',
                    title: '价格',
                    align: 'left'

                },
                {
                    field: 'createTime',
                    title: '创建时间',
                    align: 'left'

                }, {
                    width: 260,
                    title: '操作',
                    toolbar: '#test-table-operate-barDemo',
                }
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
            arrangeList.length = 0;
            // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
            // layer.close(index);    //返回数据关闭loading
        },




    });
    window.reloads = function() {
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            //数据接口
            url: url + "/meetingnotice/list",
            // data:[
            //
            // ],
            method: 'get',
            // where:{
            //     stauts:0
            // },
            xhrFields: {
                withCredentials: true
            },
            page: {
                layout: ['prev', 'page', 'next', 'count', 'skip']
            },
            cols: [
                [ //表头
                    {
                        field: 'name',
                        title: '场地名称',
                        align: 'left',
                    }, {
                    field: 'siteType',
                    title: '场地类型',
                    align: 'left',
                    templet: function (data) {
                        // 判断下 显示灰色文字 还是 绿色文字
                        // 灰色文字
                        // return "<span>"+data.sendtime+"</span>"
                        // 绿色文字
                        if (data.siteType === "M"){
                            return "会议场地";
                        }
                        if (data.siteType === "P"){
                            return "配套场地";
                        }
                    }
                }, {
                    field: 'location',
                    title: '地址',
                    align: 'left',
                    templet: function (data) {
                        // 判断下 显示灰色文字 还是 绿色文字
                        // 灰色文字
                        // return "<span>"+data.sendtime+"</span>"
                        // 绿色文字
                        return data.location+data.address
                    }
                }, {
                    field: 'siteProvider',
                    title: '场地提供方',
                    align: 'left',
                },
                    {
                        field: 'siteProvider',
                        title: '经纬度',
                        align: 'left',
                        templet: function (data) {
                            // 判断下 显示灰色文字 还是 绿色文字
                            // 灰色文字
                            // return "<span>"+data.sendtime+"</span>"
                            return data.longitude + "，"+data.latitude
                        }

                    },
                    {
                        field: 'reservationPhone',
                        title: '预定电话',
                        align: 'left'

                    },
                    {
                        field: 'contactPerson',
                        title: '联系人姓名',
                        align: 'left'

                    },
                    {
                        field: 'contactPhone',
                        title: '联系人电话',
                        align: 'left'

                    },
                    {
                        field: 'sitePrice',
                        title: '价格',
                        align: 'left'

                    },
                    {
                        field: 'createTime',
                        title: '创建时间',
                        align: 'left'

                    }, {
                    width: 260,
                    title: '操作',
                    toolbar: '#test-table-operate-barDemo',
                }
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
                arrangeList.length = 0;
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
        console.log(obj)
    });
    table.on('checkbox(test-table-operate)', function(obj) {
        // console.log(obj.checked); //当前是否选中状态
        // // console.log(obj.data); //选中行的相关数据
        // console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
        // // console.log(table.checkStatus('test-table-operate').data); // 获取表格中选中行的数据
        if (obj.checked && obj.type == 'one') {
            var devi = {};
            devi = obj.data.id;
            arrangeList.push(devi)
        }
        if (!obj.checked && obj.type == 'one') {
            var index = arrangeList.indexOf(obj.data.id);
            if (index > -1) {
                arrangeList.splice(index, 1);
            }
        }
        if (!obj.checked && obj.type == 'all') {
            arrangeList.length = 0;

        }
        if (obj.checked && obj.type == 'all') {
            $.each(table.checkStatus('test-table-operate').data, function(idx, con) {
                var devi = {};
                devi = con.id;

                arrangeList.push(devi)
            });
            arrangeList = Array.from(new Set(arrangeList))
        }
        // console.log(arrangeList)

    });
    //监听工具条
    table.on('tool(test-table-operate)', function(obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            layer.msg('ID：' + data.id + ' 的查看操作');
        } else if (obj.event === 'del') {
            /**
             * @param {Object} index
             * 编排规则的借口提供之后需要接入删除
             */
            layer.confirm('真的删除行么', function (index) {
                $.ajax({
                    async: false,
                    type: "delete",
                    url: url + "/site/"+data.id,
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    //成功的回调函数
                    data: {
                        "id": data.id
                    },
                    success: function (msg) {

                        if (msg.code == '0') {
                            layer.msg("删除成功");
                            reloads();
                        } else {
                            layer.msg("删除失败");

                        }

                    },
                    //失败的回调函数
                    error: function () {
                        console.log("error")
                    }
                })
                layer.close(index);
            });
        } else if (obj.event === 'zonelist') {

            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: false,
                shadeClose: false,
                // maxmin: true,//弹出框之外的地方是否可以点击
                area: ['100%', '100%'],
                // closeBtn: 1,
                closeBtn: false,
                offset: '0',
                content: 'territory_rules.html?ruleid=' + data.id + '&roomid=' + data.roomid + "&name=" + data.name,
                success: function (layero, index) {
                    // var body = layui.layer.getChildFrame('body', index);
                    // var roomid;
                    // // 取到弹出层里的元素，并把编辑的内容放进去
                    // body.find("#ruleid").val(data.id);
                    // body.find("#roomid").val(data.roomid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                }
            });
        } else if (obj.event === 'edit') {
            layer.open({
                type: 2,
                title: '修改会议通知',
                area: ['70%', '75%'],
                btn: ['确定', '取消'],
                maxmin: true,
                content: 'modifymeetingsitemanage.html?id=' + data.id,
                yes: function (index, layero) {
                    layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;确认修改一个会议通知吗?',{title:'温馨提示'}, function () {
                        var submit = layero.find('iframe').contents().find("#click");
                        submit.click();
                    })

                },
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    // 取到弹出层里的元素，并把编辑的内容放进去
                    body.find("#name").val(data.name);
                    body.find("#siteType").val(data.siteType);
                    body.find("#siteSpecifications").val(data.siteSpecifications);
                    body.find("#location").val(data.location);
                    body.find("#address").val(data.address);
                    body.find("#siteProvider").val(data.siteProvider);
                    body.find("#isSupportingVenue").val(data.isSupportingVenue);
                    body.find("#reservationPhone").val(data.reservationPhone);
                    body.find("#contactPerson").val(data.contactPerson);
                    body.find("#contactPhone").val(data.contactPhone);
                    body.find("#longitude").val(data.longitude);//将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                    body.find("#latitude").val(data.latitude);
                    body.find("#sitePrice").val(data.sitePrice);
                }
            });
        }else if (obj.event === 'sendmail'){
            if (data.meetingStartTime != null){
                return layer.msg("当前会议已发送通知")
            }
            layer.confirm('确定要发送会议通知吗？', function (index) {
                $.ajax({
                    async: false,
                    type: "post",
                    url: url + "/meetingnotice/sendNotice",
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    //成功的回调函数
                    data: {
                        "id": data.id
                    },
                    success: function (msg) {

                        if (msg.code == '0') {
                            layer.msg("发送成功");
                            reloads();
                        } else {
                            layer.msg("发送失败");

                        }

                    },
                    //失败的回调函数
                    error: function () {
                        console.log("error")
                    }
                })
                layer.close(index);
            });
        }
        else if (obj.event === 'timing'){
            if (data.meetingStartTime != null){
                return layer.msg("当前会议已发送通知")
            }
            layer.open({
                type: 2,
                title: '定时发送',
                area: ['50%', '60%'],
                btn: ['确定', '取消'],
                maxmin: true,
                content: 'timingPop.html?id=' + data.id,
                yes: function (index, layero) {
                    layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;确认发送短信吗?',{title:'温馨提示'}, function () {
                        var submit = layero.find('iframe').contents().find("#click");
                        submit.click();
                    })

                },
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    // 取到弹出层里的元素，并把编辑的内容放进去
                    body.find("#noticeContent").val(data.noticeContent);
                    body.find("#noticeTitle").val(data.noticeTitle);
                    body.find("#sendState").val(data.sendState); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                }
            });
        }
        else  if ( obj.event === "bind"){
            layer.open({
                type: 2,
                title: '绑定会议',
                area: ['50%', '50%'],
                btn: ['确定', '取消'],
                maxmin: true,
                content: 'bindingmeetingroom.html?id=' + data.id+"&roomid=" + data.roomtemplateid,
                yes: function (index, layero) {
                    layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;确认绑定会议吗?',{title:'温馨提示'}, function () {
                        var submit = layero.find('iframe').contents().find("#click");
                        submit.click();
                    })

                },
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    // 取到弹出层里的元素，并把编辑的内容放进去
                    body.find("#noticeContent").val(data.noticeContent);
                    body.find("#noticeTitle").val(data.noticeTitle);
                    body.find("#sendState").val(data.sendState); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                }
            });
        }
        else  if (obj.event ==="personlist"){
            var index =  layer.open({
                type: 2,
                title: data.noticeTitle +'的人员列表',
                area: ['100%', '100%'],
                // btn: ['确定', '取消'],
                maxmin: true,
                content: 'personlList.html?mid=' + data.id,
                success: function (layero, index) {
                    // var body = layui.layer.getChildFrame('body', index);
                    // // 取到弹出层里的元素，并把编辑的内容放进去
                    // body.find("#noticeContent").val(data.noticeContent);
                    // body.find("#noticeTitle").val(data.noticeTitle);
                    // body.find("#sendState").val(data.sendState); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                }
            });
        } else if (obj.event === 'singup'){
            window.location = url + "/meetingnotice/singupExcel?mid="+data.id;
        }
        else if (obj.evenet === 'leave'){
            window.location = url + "/meetingnotice/leaveExceln?mid="+data.id;
        }
        // layer.full(index);
    })
    var $ = layui.$,
        active = {
            add: function() {
                layer.open({
                    type: 2,
                    title: '新建会议场地',
                    area: ['100%', '100%'],
                    btn: ['确定', '取消'],
                    maxmin: true,
                    content: 'savemeetingsitemanage.html',
                    yes: function(index, layero) {

                        layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;确认新增一个会议通知吗?',{title:'温馨提示'}, function () {
                            var submit = layero.find('iframe').contents().find("#click");
                            submit.click();
                            })
                    }
                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });

            },
            getCheckData: function() { //获取选中数据
                // var checkStatus = table.checkStatus('test-table-operate'),
                //     data = checkStatus.data;
                // layer.alert(JSON.stringify(data));
                // console.log(checkStatus.data)
                var cb = $(".layui-form-checkbox");
                $(".layui-form-checkbox").each(function() {
                    // if (flag) {
                    $(this).click();
                    // } else {
                    //     $(this).removeClass('layui-form-checked')
                    // }
                })


            },
            refresh:function(){
                    location.reload();
            },
            getCheckLength: function() { //获取选中数目
                layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;您正在执行删除规则列表操作，是否继续进行该操作？',{title:'温馨提示'}, function () {
                    $.ajax({
                        async: false,
                        type: "post",
                        url: url + "/ruletemplate/batchRemove",
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },
                        //成功的回调函数
                        data: {
                            "ruleid": arrangeList.join(",")

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

                });

            },
            isAll: function() {
                layer.confirm('您将要进行列表清空操作,执行后您的所有记录将被删除,请谨慎操作,是否确认?', function(index) {
                    $.ajax({
                        async: false,
                        type: "get",
                        url: url + "/ruletemplate/empty",
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
                }); //验证是否全选

            },
            search: function() {
                table.render({
                    elem: '#test-table-operate',
                    // height: 'full-200',
                    url: url+ "/meetingnotice/search" //数据接口
                        ,
                        xhrFields: {
                            withCredentials: true
                        },
                    where: {
                        "content": $('#demoReload').val()
                    },

                    method: 'get',
                    page: {
                        layout: ['prev', 'page', 'next', 'count', 'skip']
                    },
                    cols: [
                        [ //表头
                            {
                                field: 'noticeTitle',
                                title: '标题',
                                align: 'left',
                            }, {
                            field: 'sendState',
                            title: '方式',
                            align: 'left',
                            templet: function (data) {
                                // 判断下 显示灰色文字 还是 绿色文字
                                // 灰色文字
                                // return "<span>"+data.sendtime+"</span>"
                                // 绿色文字
                                if (data.sendState === "1"){
                                    return "钉钉通知";
                                }
                                if (data.sendState === "2"){
                                    return "短信通知";
                                }
                                if (data.sendState === "3"){
                                    return "钉钉短信通知";
                                }
                            }
                        }, {
                            field: 'personNumber',
                            title: '范围',
                            align: 'left',
                            templet: function (data) {
                                // 判断下 显示灰色文字 还是 绿色文字
                                // 灰色文字
                                // return "<span>"+data.sendtime+"</span>"
                                // 绿色文字
                                return data.personNumber+"人"
                            }
                        }, {
                            field: 'deadlineForRegistrationTime',
                            title: '报名截止',
                            align: 'left',
                        }, {
                            field: 'meetingStartTime',
                            title: '发送时间',
                            align: 'left',
                            templet: function (data) {
                                // 判断下 显示灰色文字 还是 绿色文字
                                // 灰色文字
                                // return "<span>"+data.sendtime+"</span>"
                                // 绿色文字
                                return "<span style='color:#1cf51c'>"+data.meetingStartTime+"</span>"
                            }
                        }, {
                            title: '状态',
                            toolbar: '#test-table-state-barDemo',
                        }, {
                            title: '导出',
                            toolbar: '#test-table-export-barDemo',
                        }, {
                            width: 100,
                            title: '操作',
                            toolbar: '#test-table-operate-barDemo',
                        }
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
                        arrangeList.length = 0;
                        // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                        // layer.close(index);    //返回数据关闭loading
                    },




                });

            }

        };
    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});
