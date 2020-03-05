layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery'], function() {
    var table = layui.table,
        admin = layui.admin,
        $ = layui.jquery;
    var url = "https://f.longjuli.com";
    var devices = {};
    var deviceList = [];
    // #test-table-operate
    //渲染表格
    $('#group').append(
        '<button class="layui-btn layui-ds" data-type="getCheckData" id="buttongroup">全选</button>'
    )
    $.ajax({
        async: false,
        type: "get",
        url:"https://f.longjuli.com" + "/permission/getpremission",
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
                    $('#buttongroup').before(
                        "<button class='layui-btn layui-ds' data-type='add' id='addmeeting'>增加</button>"
                    )
                }
                if ($.inArray("emptymeet", data) != -1) {
                    $('#buttongroup').after(
                        "<button class='layui-btn layui-ds' data-type='isAll' id='emptymeet'>清空</button>"
                    );
                }
                if ($.inArray("batchmeet", data) != -1) {
                    $('#buttongroup').before(
                        '<button class="layui-btn layui-ds" data-type="getCheckLength" id="batchmeet">批量删除</button>'
                    );
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
        url: url + "/meeting/findAllBylayui" //数据接口
            ,

        method: 'get',
        page: {
            layout: ['prev', 'page', 'next', 'count', 'skip']
        },
        xhrFields: {
            withCredentials: true
        },
        cols: [
            [ //表头
                {
                    type: 'checkbox',
                    fixed: 'left'
                },
                {
                    field: 'id',
                    title: 'ID',
                    align: 'left',
                    unresize: 'false',
                    width: '7%'
                },
                {
                    field: 'name',
                    title: '会议名称',
                    align: 'left',
                }, {
                    field: 'address',
                    title: '会议地址',
                    align: 'left',

                },
                {
                   
                    align: 'center',
                    flxed: '2',
                    title: '座区图',
                    toolbar: '#rulezone',
                },
                {
                   
                    align: 'center',
                    flxed: '1',
                    title: '编排',
                    toolbar: '#type-list',
                }
                , {
                    field: 'meetingtime',
                    title: '时间',
                    align: 'left',

                },
                {
                    width: '10%',
                    align: 'right',
                    flxed: 'right',
                    title: '操作',
                    toolbar: '#test-table-operate-barDemo',
                }
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
    //刷新表格
    window.reloads = function() {
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            url: url + "/meeting/findAllBylayui" //数据接口
                ,

            method: 'get',
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
                    {
                        field: 'id',
                        title: 'ID',
                        align: 'left',
                        unresize: 'false',
                        width: '7%'
                    },
                    {
                        field: 'name',
                        title: '会议名称',
                        align: 'left',
                    }, {
                        field: 'address',
                        title: '会议地址',
                        align: 'left',
    
                    },
                    {
                       
                        align: 'center',
                        flxed: '2',
                        title: '座区图',
                        toolbar: '#rulezone',
                    },
                    {
                       
                        align: 'center',
                        flxed: '1',
                        title: '编排',
                        toolbar: '#type-list',
                    }
                    , {
                        field: 'meetingtime',
                        title: '时间',
                        align: 'left',
    
                    },
                    {
                        width: '10%',
                        align: 'right',
                        flxed: 'right',
                        title: '操作',
                        toolbar: '#test-table-operate-barDemo',
                    }
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
            },




        });

    }

    window.onkeyup = function(ev) {
        var key = ev.keyCode || ev.which;
        if (key == 27) { //按下Escape
            layer.closeAll('iframe'); //关闭所有的iframe层

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
    function getMyDay(date){
        var week;
        if(date.getDay()==0) week="星期日";
        if(date.getDay()==1) week="星期一";
        if(date.getDay()==2) week="星期二";
        if(date.getDay()==3) week="星期三";
        if(date.getDay()==4) week="星期四";
        if(date.getDay()==5) week="星期五";
        if(date.getDay()==6) week="星期六";
        return week;
    }

    //监听工具条
    table.on('tool(test-table-operate)', function(obj) {
        var data = obj.data;

        if (obj.event === 'detail') {
            layer.msg('ID：' + data.id + ' 的查看操作');
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function(index) {
                obj.del();

                $.ajax({
                    async: false,
                    type: "get",
                    url: url + "/meeting/deleteMeeting",
                    dataType: "json",
                    //成功的回调函数
                    data: {
                        "id": obj.data.id
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
            var addmeet = layer.open({
                type: 2,
                title: '编辑信息',
                // shadeClose: true, //弹出框之外的地方是否可以点击
                // offset: '10%',
                area: ['100%', '100%'],
                btn: ['确定', '取消'],
                content: 'form.html',
                yes: function(index, layero) {
                    var body = layui.layer.getChildFrame('body', index);
                    var date = body.find("#date").val()
                    var time = body.find("#time").val()
                    var datime = "";
                    if (time > '12:00') {
                        datime = "下午" + time;
                    } else {
                        datime = "上午" + time;
                    }
                    var newdate =date.replace('年','-').replace('月','-').slice(0,date.length-1);
                    var newdates=" ("+getMyDay(new Date(newdate))+") "
                    // console.log(newdates)
                    var datatime = date + newdates + datime;

                    $.ajax({
                        async: false,
                        type: "post",
                        url: url + "/meeting/updateByMeeting",
                        dataType: "json",
                        xhrFields: {
                            withCredentials: true
                        },

                        //成功的回调函数
                        data: {
                            "id": data.id,
                            "name": body.find(".hyname").val(),
                            "meetingtime": datatime,
                            "roomid": body.find("#meeting").val(),
                            "address": body.find("#meeting option:selected").text(),
                            "ruleid": body.find("#rule").val(),
                            "memo": body.find("#memo").val()
                        },
                        success: function(msg) {
                            if (msg.code == 0) {
                                layer.msg("修改成功");
                                layer.close(index);
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
                    layer.full(addmeet)
                },
                success: function(layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    if (data) {
                        var datatime = data.meetingtime;

                        var arrdatatime = datatime.split(" ");

                        console.log(arrdatatime)

                        // 取到弹出层里的元素，并把编辑的内容放进去
                        body.find("#meetingid").val(data.id); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                        body.find(".hyname").val(data.name); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                        body.find("#date").val(arrdatatime[0]); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                        body.find("#time").val(arrdatatime[2].substring(2)); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                        body.find("#roomid").val(data.roomid);
                        body.find("#meetingrule").val(data.ruleid);
                        body.find("#memo").val(data.memo);
                    }
                }
            });
        }
        if(obj.event === 'rulezone'){
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '  ',
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '106%'],
                closeBtn: 1,
                offset: '-43px',
                content: 'seatmap.html?ruleid=' + data.ruleid + '&roomid=' + data.roomid + '&meetingid=' + data.id,
                success: function(layero, index) {
                
                }
            })
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
                var addmeet = layer.open({
                    type: 2,
                    title: '添加会议',
                    area: ['70%', '75%'],
                    btn: ['确定', '取消'],
                    content: 'meet_create.html',
                    yes: function(index, layero) {
                        var iframeWindow = window['layui-layer-iframe' + index]
                        iframeWindow.onappent();

                    }
                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });
                layer.full(addmeet)

            },
            search: function() {
                table.render({
                    elem: '#test-table-operate',
                    // height: 'full-200',
                    url: url + "/meeting/meetingSearch" //数据接口
                        ,
                    xhrFields: {
                        withCredentials: true
                    },
                    where: {
                        "meeting": $('#demoReload').val()
                    },

                    method: 'get',
                    page: {
                        layout: ['prev', 'page', 'next', 'count', 'skip']
                    },
                    cols: [
                        [ //表头
                            {
                                type: 'checkbox',
                                fixed: 'left'
                            },
                            {
                                field: 'id',
                                title: 'ID',
                                align: 'left',
                                unresize: 'false',
                                width: '7%'
                            },
                            {
                                field: 'name',
                                title: '会议名称',
                                align: 'left',
                            }, {
                                field: 'address',
                                title: '会议地址',
                                align: 'left',
            
                            },
                            {
                               
                                align: 'center',
                                flxed: '2',
                                title: '座区图',
                                toolbar: '#rulezone',
                            },
                            {
                               
                                align: 'center',
                                flxed: '1',
                                title: '编排',
                                toolbar: '#type-list',
                            }
                            , {
                                field: 'meetingtime',
                                title: '时间',
                                align: 'left',
            
                            },
                            {
                                width: '10%',
                                align: 'right',
                                flxed: 'right',
                                title: '操作',
                                toolbar: '#test-table-operate-barDemo',
                            }
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
        };

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });
});
