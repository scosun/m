layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery'], function () {
    var table = layui.table,
        admin = layui.admin,
        form = layui.form,
        $ = layui.jquery;

    // #test-table-operate
    var url = "https://f.longjuli.com"
    //  var url = "http://127.0.0.1:8083"
    var devices = {};
    var arrangeList = [];
    $('#group').append("<button class='layui-btn layui-ds' data-type='screening' id='screening'>筛选</button><button class='layui-btn layui-ds' data-type='detailedinfo' id='detailedinfo' style='position: relative;'>详细信息</button>")
    $.ajax({
        async: true,
        type: "get",
        url: url + "/meeting/findAll",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        success: function (msg) {
            var data = msg;
            $.each(data.data, function (idx, con) {
                $("#select_meets").after("<option value=" + con.id + ">" + con.name +
                    "</option>");
            })
            form.render();
        },
        //失败的回调函数
        error: function () {
            console.log("error")
        }
    })
    form.on('select(component-form-select)', function (data) {

        ajaxs(data.value)
        window.indexs = data.value;
    });

    window.ajaxs = function (value) {
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            //url: url + "/ruletemplate/findAlllayuiBystatus", //数据接口
            method: 'get',
            url: 'https://m.longjuli.com/v1/attendees',
            where: {
                meeting_id: value
            },

            page: {
                layout: ['prev', 'page', 'next', 'count', 'skip']
            },

            cols: [
                [ //表头
                    {
                        field: 'id',
                        title: '编号',
                        width: '7%',
                        align: 'center',
                        templet: function (data) {
                            return "<a title='"+data.phone1+"'>"+data.id+"</a>"
                        }
                    },
                    {
                        field: 'name',
                        title: '姓名',
                        align: 'left',
                    }, {
                        field: 'sexid',
                        title: '性别',
                        align: 'left',
                        templet: function (data) {

                            if (data.sexid == 1) {
                                return '男'
                            }
                            if (data.sexid == 2) {
                                return '女'
                            }

                        },
                    },
                    {
                        field: 'state',
                        title: '状态',
                        align: 'left',
                        toolbar: '#test-table-operate-state'
                    },
                    {
                        field: 'sign',
                        title: '签到',
                        align: 'left',
                        toolbar: '#test-table-operate-sign'
                    },
                    {
                        field: 'roomnum',
                        title: '驻地房间',
                        align: 'left',
                    },
                    {
                        field: 'company',
                        title: '单位职务',
                        align: 'left',
                    },
                    {
                        field: 'group',
                        title: '组别',
                        align: 'left',
                        templet: function (data) {

                            var datas = data.attributes.组别;
                            if (datas != undefined) {
                                return data.name
                            } else {
                                return '';
                            }

                        },

                    }, {
                        field: 'isconvenor',
                        title: '召集人',
                        align: 'left',
                    },

                    , {
                        field: 'agency_name',
                        title: '代理人',
                        align: 'left',
                    }, {
                        field: 'report_time',
                        title: '报到时间',
                        align: 'left',
                        width: '15%'
                    }
                ]
            ],

            event: true,
            page: true,
            limit: 15,
            skin: 'nob',
            limits: [5, 10, 15],
            done: function (res, curr, count) {
                table_data = res.data;
                layer.closeAll('loading');
                // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                // layer.close(index);    //返回数据关闭loading
            },
        });

    }


    window.onkeyup = function (ev) {
        var key = ev.keyCode || ev.which;
        if (key == 27) { //按下Escape
            layer.closeAll('iframe'); //关闭所有的iframe层

        }
    }

    var $ = layui.$,
        active = {
            screening: function () {
                layer.open({
                    type: 2,
                    title: '参会人员筛选',
                    area: ['60%', '60%'],
                    btn: ['确定', '取消'],
                    content: 'screening.html',
                    yes: function (index, layero) {
                        var submit = layero.find('iframe').contents().find("#ruleclick");
                        submit.click();
                    }

                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });

            },
            detailedinfo: function () {
                if ($('#select-room').val() == -1) {
                    return layer.msg("请选择会议后再筛选")
                }
                layer.open({
                    type: 2,
                    title: '详细信息',
                    area: ['60%', '60%'],
                    //btn: ['确定', '取消'],
                    shadeClose: true, //点击遮罩关闭
                    content: 'detailedinfo.html',
                    yes: function (index, layero) {
                        var submit = layero.find('iframe').contents().find("#ruleclick");
                        submit.click();
                    },
                    success: function (layero, index) {
                        var body = layui.layer.getChildFrame('body', index);
                        $.ajax({
                            async: false,
                            type: "get",
                            url: url + "/meetingcanhui/statistical",
                            dataType: "json",
                            xhrFields: {
                                withCredentials: true
                            },
                            data: {
                                meetingId:$('#select-room').val(),
                               

                            },
                            //成功的回调函数
                            success: function (msg) {
                                body.find('#total').text(msg.total)
                                body.find('#totals').text(msg.total)
                                body.find('#report').text(msg.report)
                                body.find('#ben').text(msg.ben)
                                body.find('#dai').text(msg.dai)
                                body.find('#wei').text(msg.wei)
                                body.find('#rate').text(msg.rate+"%")
                            },
                            //失败的回调函数
                            error: function () {
                                console.log("error")
                            }
                        })
                    }
                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });
            },
            search: function () {
                if ($('#select-room').val() == -1) {
                    return layer.msg("请选择会议后再筛选")
                }
                
                table.render({
                    elem: '#test-table-operate',
                    // height: 'full-200',
                    //url: url + "/ruletemplate/findAlllayuiBystatus", //数据接口
                    method: 'get',
                    url: 'https://m.longjuli.com/v1/attendees',
                    where: {
                        meeting_id: $('#select-room').val(),
                        q: $('#demoReload').val()
                    },

                    page: {
                        layout: ['prev', 'page', 'next', 'count', 'skip']
                    },

                    cols: [
                        [ //表头
                            {
                                field: 'id',
                                title: '编号',
                                width: '7%',
                                align: 'center',
                                unresize: 'false',
                            },
                            {
                                field: 'name',
                                title: '姓名',
                                align: 'left',
                            }, {
                                field: 'sexid',
                                title: '性别',
                                align: 'left',
                                templet: function (data) {

                                    if (data.sexid == 1) {
                                        return '男'
                                    }
                                    if (data.sexid == 2) {
                                        return '女'
                                    }

                                },
                            },
                            {
                                field: 'state',
                                title: '状态',
                                align: 'left',
                                toolbar: '#test-table-operate-state'
                            },
                            {
                                field: 'sign',
                                title: '签到',
                                align: 'left',
                                toolbar: '#test-table-operate-sign'
                            },
                            {
                                field: 'roomnum',
                                title: '驻地房间',
                                align: 'left',
                            },
                            {
                                field: 'company',
                                title: '单位职务',
                                align: 'left',
                            },
                            {
                                field: 'group',
                                title: '组别',
                                align: 'left',
                                templet: function (data) {

                                    var datas = data.attributes.组别;
                                    if (datas != undefined) {
                                        return data.name
                                    } else {
                                        return '';
                                    }

                                },

                            }, {
                                field: 'isconvenor',
                                title: '召集人',
                                align: 'left',
                            },

                            , {
                                field: 'agency_name',
                                title: '代理人',
                                align: 'left',
                            }, {
                                field: 'report_time',
                                title: '报到时间',
                                align: 'left',
                                width: '15%'
                            }
                        ]
                    ],

                    event: true,
                    page: true,
                    limit: 15,
                    skin: 'nob',
                    limits: [5, 10, 15],
                    done: function (res, curr, count) {
                        table_data = res.data;
                        layer.closeAll('loading');
                        // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                        // layer.close(index);    //返回数据关闭loading
                    },
                });
            }


        };


    //监听工具条
    table.on('tool(test-table-operate)', function (obj) {
        var data = obj.data;
        if (obj.event === 'registerPOP') {
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '报到',
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '100%'],
                btn: ['报到', '返回'],
                closeBtn: 1,
                //offset: '-43px',
                content: 'register_pop.html?id=' + obj.data.id + "&meetingid=" + $('#select-room').val(),
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    body.find("#names").text(obj.data.name);
                    body.find("#id").text(obj.data.id);
                    if (obj.data.sexid === 1) {
                        body.find("#sex").text('男');
                    }
                    if (obj.data.sexid === 2) {
                        body.find("#sex").text('女');
                    }
                    body.find("#roomid").text(obj.data.roomnum);
                    body.find("#company").text(obj.data.company);
                    body.find("#duties").text(obj.data.duties);
                    var img = "https://f.longjuli.com/upload" + obj.data.image_url
                    body.find("#img").attr("src", img);
                    body.find("#phone1").val(obj.data.phone1);
                    body.find("#phone2").val(obj.data.phone2);
                    // console.log( obj.data.report_state===0)
                    if (obj.data.report_state === 0) {
                        body.find("#wei").attr('checked', 'checked')
                    }
                    if (obj.data.report_state === 1) {
                        body.find("#ben").attr('checked', 'checked')
                    }
                    if (obj.data.report_state === 2) {
                        body.find("#dai").attr('checked', 'checked')
                        body.find("#dailiren").show();
                        body.find("#aname").val(obj.data.agency_name);
                        body.find("#aphone").val(obj.data.agency_phone);
                        body.find("#asfz").val(obj.data.agency_sfz);


                    }
                    if (obj.data.report_time != "") {
                        var datetime = obj.data.report_time.split(" ");
                        body.find("#date").val(datetime[0]);
                        body.find("#time").val(datetime[1]);
                    }
                },
                yes: function (index, layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                }
            });
        }
    });



    $('.layui-ds').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});