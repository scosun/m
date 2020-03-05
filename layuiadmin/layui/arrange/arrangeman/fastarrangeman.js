  layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery'], function() {
    var table = layui.table,
        admin = layui.admin,
        $ = layui.jquery;

    // #test-table-operate
    var url = "https://f.longjuli.com"
    var devices = {};
    var arrangeList = [];
    $('#group').append('<button class="layui-btn layui-ds" data-type="getCheckData" id="buttongroup">全选</button>')
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
           
              
                window.a = data
               
                
                if ($.inArray("addrule", data) != -1) {
                    $('#buttongroup').before("<button class='layui-btn layui-ds' data-type='add' id='addmeeting'>增加</button>")
                }
                if ($.inArray("emptyroom", data) != -1) {
                    $('#buttongroup').after("<button class='layui-btn layui-ds' data-type='isAll' id='emptymeet'>清空</button>");
                }
                if ($.inArray("batchroom", data) != -1) {
                    $('#buttongroup').before('<button class="layui-btn layui-ds" data-type="getCheckLength" id="batchmeet">批量删除</button>');
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
        url: url + "/ruletemplate/findAlllayuiBystatus" //数据接口
            ,

        method: 'get',
        where:{
            status:1
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
                {
                    field: 'id',
                    title: 'ID',
                    align: 'center',
                    unresize: 'false',
                },
                {
                    field: 'name',
                    title: '编排规则名称',
                    align: 'left',
                }, {
                    field: 'roomname',
                    title: '会议室名称',
                    align: 'left',
                },
                {
                    field: 'stauts',
                    title: '会议规则',
                    align: 'left',
                    templet: function(data) {
                       
                            return '快速规则'
                        
                        
                    },

                },
                {
                    field: 'modifytime',
                    title: '更新时间',
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
            arrangeList.length = 0;
            // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
            // layer.close(index);    //返回数据关闭loading
        },




    });
    window.reloads = function() {
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            url: url + "/ruletemplate/findAlllayuiBystatus" //数据接口
                ,
                where:{
                    status:1
                },
            xhrFields: {
                withCredentials: true
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
                        align: 'center',
                        unresize: 'false',
                        width: '7%'
                    },
                    {
                        field: 'name',
                        title: '编排规则名称',
                        align: 'left',
                    }, {
                        field: 'roomname',
                        title: '会议室名称',
                        align: 'left',
                    },
                    {
                        field: 'stauts',
                        title: '会议规则',
                        width: '15%',
                        align: "left",
                        templet: function(data) {
                                return '快速规则'
                            
                            
                        },

                    },
                    {
                        field: 'modifytime',
                        title: '更新时间',
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
            layer.confirm('真的删除行么', function(index) {
                $.ajax({
                    async: false,
                    type: "get",
                    url: url + "/ruletemplate/deleteruletemplate",
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    //成功的回调函数
                    data: {
                        "id": data.id
                    },
                    success: function(msg) {

                        if (msg.code == '0') {
                            layer.msg("删除成功");
                            reloads();
                        } else {
                            layer.msg("删除失败");

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
                title: '  ',
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '106%'],
                closeBtn: 1,
                offset: '-43px',
                content: 'territory_rules.html',
                success: function(layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    var roomid;
                    // 取到弹出层里的元素，并把编辑的内容放进去
                    body.find("#ruleid").val(data.id);
                    body.find("#roomid").val(data.roomid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                }
            });
        }
    });

    var $ = layui.$,
        active = {
            add: function() {
                layer.open({
                    type: 2,
                    title: '添加编排规则',
                    area: ['70%', '75%'],
                    btn: ['确定', '取消'],
                    content: 'fastgroup.html',
                    yes: function(index, layero) {
                        var submit = layero.find('iframe').contents().find("#ruleclick");
                        submit.click();

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
            getCheckLength: function() { //获取选中数目
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
                    url: url + "/ruletemplate/ruletemplateSearch" //数据接口
                        ,
                        xhrFields: {
                            withCredentials: true
                        },
                    where: {
                        "rule": $('#demoReload').val(),
                        "status":1

            
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
                                align: 'center',
                                unresize: 'false',
                                width: '7%'
                            },
                            {
                                field: 'name',
                                title: '编排规则名称',
                                align: 'center',
                            }, {
                                field: 'roomname',
                                title: '会议室名称',
                                align: 'center',
                            },
                            {
                                field: 'stauts',
                                title: '会议规则',
                                width: '15%',
                                align: "center",
                                templet: function(data) {
                                    if (data.stauts == 0) {
                                        return '标准规则'
                                    }
                                    if (data.stauts == 1) {
                                        return '快速规则'
                                    }
                                    if (data.stauts == undefined) {
                                        return ''
                                    }
                                },

                            },
                            {
                                field: 'modifytime',
                                title: '更新时间',
                                align: 'center',

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
