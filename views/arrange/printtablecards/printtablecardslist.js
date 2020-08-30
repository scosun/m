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

    $('#group').append('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="getCheckData" id="buttongroup">全选<s></s></a>')
    $('#buttongroup').after('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="getCheckLength" id="batchmeet">批量打印桌牌<s></s></a>');
    $('#group').after('<div class="assistBtn"><span class="fengeline">/</span><i class="layui-icon layui-ds layui-icon-refresh-3" data-type="refresh"></i></div>')
    $.ajax({
        async: false,
        type: "get",
        url:url + "/permission/getpremission",
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
                // if ($.inArray("addmeet", data) != -1) {
                //     $('#buttongroup').before("<button class='layui-ds gradient-block-diagonal' data-type='add' id='addmeeting'>新建</button>")
                // }
                // if ($.inArray("emptymeet", data) != -1) {
                //     $('#buttongroup').after('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="isAll" id="emptymeet">清空<s></s></a>');
                // }
                // if ($.inArray("batchmeet", data) != -1) {
                //     $('#buttongroup').after('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="getCheckLength" id="batchmeet">删除<s></s></a>');
                // }

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
        url: url + "/printseatsgin/selectSeatsginListPage" //数据接口
            ,

        method: 'get',
        page: {
            layout: ['prev', 'page', 'next', 'count']
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
                    field: 'name',
                    title: '会议名称',
                    align: 'left',
                },
                {
                    field: 'address',
                    title: '人员数量',
                    align: 'left',
                },
                {
                    field: 'roomname',
                    title: '桌牌模版',
                    align: 'left',
                },
                {
                    width: 80,
                    flxed: '2',
                    title: '查看',
                    toolbar: '#rulezone',
                },
                {
                    width: 130,
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
            url: url + "/printseatsgin/selectSeatsginListPage" //数据接口
            ,

            method: 'get',
            page: {
                layout: ['prev', 'page', 'next', 'count']
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
                        field: 'name',
                        title: '会议名称',
                        align: 'left',
                    },
                    {
                        field: 'address',
                        title: '人员数量',
                        align: 'left',
                    },
                    {
                        field: 'roomname',
                        title: '桌牌模版',
                        align: 'left',
                    },
                    {
                        width: 80,
                        flxed: '2',
                        title: '查看',
                        toolbar: '#rulezone',
                    },
                    {
                        width: 130,
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
        if (obj.event === 'print') {
            layer.confirm('    是否将 '+ data.id +' 个桌牌全部打印？',
                {
                    title:'打印桌牌',
                    skin: '',
                    btn: ['预览','取消'],
                    // 取消
                    btn2: function(){
                        //layer.close();
                        parent.layer.close();
                    },
                    // 预览
                    yes: function(index){
                        layer.open({
                            type: 2,
                            title: '收藏管理 (考生姓名：张无忌)',
                            //title: false,
                            shadeClose: false, //弹出框之外的地方是否可以点击
                            area: ['100%', '100%'],
                            closeBtn: 1,
                            // maxmin: true,
                            closeBtn:false,
                            offset: '0',
                            content: 'seatmap.html?ruleid=' + data.ruleid + '&roomid=' + data.roomid + '&meetingid=' + data.id,
                            success: function(layero, index) {
                            
                            }
                        })
                    }
                },
                function(index) {
                    layer.close(index);
                });
        }
        if(obj.event === 'setup'){
            layer.open({
                type: 2,
                title: '设置',
                area: ['550px', '360px'],
                btn: ['确定', '取消'],
                maxmin: true,
                // content: 'setup_pop.html?meetid='+obj.data.id+'&templateid='+obj.data.isgrouplist,
                content: 'setup_pop.html?meetid='+obj.data.id+'&templateid='+obj.data.memo,
                success: function(layero, index) {
                },
                yes:function (index,layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                }
            })
        }
        if(obj.event === 'rulezone'){
            layer.open({
                type: 2,
                title: false,
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '100%'],
                closeBtn: 1,
                // maxmin: true,
                closeBtn:false,
                offset: '0',
                //拷贝 meeting_room_zq.html
                //content: 'meeting_room_zq.html?roomid='+age.id
                // content: 'print_room_zq.html?meetingid='+obj.data.id+"&isgrouplist="+obj.data.isgrouplist,
                content: 'print_room_zq.html?meetingid='+obj.data.id+"&isgrouplist="+obj.data.memo,
                success: function(layero, index) {
                
                }
            })
        }
        
    });
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
            refresh:function(){
                    location.reload();
            },
            //批量删除
            getCheckLength: function() {
                console.log("name",deviceList);
                var printSum = 0;
                deviceList.forEach(ele => {
                    //var parseIntsun = parseInt(ele)
                    printSum += parseInt(ele)
                });
                if ( deviceList.length == 0 ) {
                    return layer.msg("请选择后再批量打印！")
                }
                //获取选中数目
                layer.confirm('    是否将 '+ deviceList.length +' 个桌牌全部打印？',
                {
                    title:'打印桌牌',
                    skin: '',
                    btn: ['预览','取消'],
                    // 取消
                    btn2: function(){
                        //layer.close();
                        parent.layer.close();
                    },
                    // 预览
                    yes: function(index){
                        layer.open({
                            type: 2,
                            title: '收藏管理 (考生姓名：张无忌)',
                            //title: false,
                            shadeClose: false, //弹出框之外的地方是否可以点击
                            area: ['100%', '100%'],
                            closeBtn: 1,
                            // maxmin: true,
                            closeBtn:false,
                            offset: '0',
                            content: 'seatmap.html',
                            success: function(layero, index) {
                            }
                        })
                    }
                },
                function(index) {
                    layer.close(index);
                });
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
                    area: ['75%', '85%'],
                    maxmin: true,
                    // btn: ['确定', '取消'],
                    content: 'meet_create.html',
                    yes: function(index, layero) {
                        var submit = layero.find('iframe').contents().find("#click");
                        submit.click();

                    }
                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });

            },
            reloads:function(){
                location.reload();
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
                                field: 'name',
                                title: '会议名称',
                                align: 'left',
                            },
                            {
                                field: 'name',
                                title: '会议人员',
                                align: 'left',
                            },
                            {
                                width: 80,
                                flxed: '2',
                                title: '查看',
                                toolbar: '#rulezone',
                            },
                            {
                                width: 130,
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
