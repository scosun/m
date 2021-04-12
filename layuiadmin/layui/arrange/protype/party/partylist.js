layui.config({
    base: '../../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery'], function() {
    var table = layui.table,
        admin = layui.admin,
        $ = layui.jquery;
    var url = "http://127.0.0.1:8083"
    var devices = {};
    var partyList = [];

    // #test-table-operate
    table.render({
        elem: '#test-table-operate',
        height: 'full-200',
        url: url + "/meetingpartycanhua/findAllBylayui" //数据接口
            ,

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
                    title: '分组名称',
                    align: 'center',
                }, {
                    field: 'modifytime',
                    title: '时间',
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
            partyList.length = 0;
            // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
            // layer.close(index);    //返回数据关闭loading
        },




    });

    window.reloads = function() {
        table.render({
            elem: '#test-table-operate',
            height: 'full-200',
            url: url + "/meetingpartycanhua/findAllBylayui" //数据接口
                ,

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
                        title: '分组名称',
                        align: 'center',
                    }, {
                        field: 'modifytime',
                        title: '时间',
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
                partyList.length = 0;
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
        // console.log(obj.checked); //当前是否选中状态
        // // console.log(obj.data); //选中行的相关数据
        // console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
        // // console.log(table.checkStatus('test-table-operate').data); // 获取表格中选中行的数据
        if (obj.checked && obj.type == 'one') {
            var devi = {};
            devi = obj.data.id;
            partyList.push(devi)
        }
        if (!obj.checked && obj.type == 'one') {
            var index = partyList.indexOf(obj.data.id);
            if (index > -1) {
                partyList.splice(index, 1);
            }
        }
        if (!obj.checked && obj.type == 'all') {
            partyList.length = 0;

        }
        if (obj.checked && obj.type == 'all') {
            $.each(table.checkStatus('test-table-operate').data, function(idx, con) {
                var devi = {};
                devi = con.id;

                partyList.push(devi)
            });
            partyList = Array.from(new Set(partyList))
        }
        console.log(partyList)

    });
    //监听工具条
    table.on('tool(test-table-operate)', function(obj) {
        var data = obj.data;
        if (obj.event === 'detail') {
            layer.msg('ID：' + data.id + ' 的查看操作');
        } else if (obj.event === 'del') {
            layer.confirm('真的删除行么', function(index) {
                $.ajax({
                    async: false,
                    type: "get",
                    url: url + "/meetingpartycanhua/deleteMeetingPartyCanHui",
                    dataType: "json",
                    //成功的回调函数
                    data: {
                        "id": obj.data.id
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
                title: '编辑信息',
                shadeClose: true, //弹出框之外的地方是否可以点击
                offset: '10%',
                area: ['60%', '80%'],
                btn: ['确定', '取消'],
                content: 'party_ed.html',
                yes: function(index, layero) {
                    var submit = layero.find('iframe').contents().find(
                        "#component-form-demo1");
                    submit.click();
                },
                success: function(layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    if (data) {

                        body.find("#id").val(data.id); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据

                        body.find(".partyname").val(data.name); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据

                    }
                }
            });
        }
    });

    var $ = layui.$,
        active = {
            add: function() {
                layer.open({
                    type: 2,
                    title: '添加党派',
                    shadeClose: true, //弹出框之外的地方是否可以点击
                    offset: '10%',
                    area: ['60%', '80%'],
                    content: 'party_create.html',
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        var submit = layero.find('iframe').contents().find(
                            "#component-form-demo1");
                        submit.click();
                    }
                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });

            },
            search: function() {
                table.render({
                    elem: '#test-table-operate',
                    height: 'full-200',
                    url: url + "/meetingpartycanhua/partySearch" //数据接口
                        ,
                    where: {
                        "party": $('#demoReload').val()
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
                                title: '分组名称',
                                align: 'center',
                            }, {
                                field: 'modifytime',
                                title: '时间',
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
                        partyList.length = 0;
                        // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                        // layer.close(index);    //返回数据关闭loading
                    },




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
                       url: url+"/meetingpartycanhua/batchRemove",
                       dataType: "json",
                       //成功的回调函数
                       data: {
                           "partyid":partyList.join(",")
                           
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
                          url: url+"/meetingpartycanhua/empty",
                          dataType: "json",
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
                });//验证是否全选
                
            },
        };

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});
