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
    $('#group').append("<button class='layui-btn layui-ds' data-type='screening' id='screening'>筛选</button><button class='layui-btn layui-ds' data-type='detailedinfo' id='detailedinfo' style='position: relative;'>详细信息</button>")

    table.render({
        elem: '#test-table-operate',
        // height: 'full-200',
        //url: url + "/ruletemplate/findAlllayuiBystatus", //数据接口
        method: 'get',
        where:{
            status:0
        },
        xhrFields: {
            withCredentials: true
        },
        data: [{
            "id": "0010"
            ,"username": "杜杜甫甫"
            ,"sex": "男"
            ,"state": "代理报到"
            ,"sign": "更改"
            ,"room": "116"
            ,"unitTitle": "济南市政协驰会常委"
            ,"group": "1组"
            ,"convener": "1召"
            ,"type": "常"
            ,"agentMan": "12312"
            ,"reportTime": "2016-10-14"
          }, {
            "id": "002"
            ,"username": "李白"
            ,"sex": "男"
            ,"state": "未报到"
            ,"sign": "报到"
            ,"room": "120"
            ,"unitTitle": "济南市部长"
            ,"group": "8组"
            ,"convener": "18召"
            ,"type": "委"
            ,"agentMan": "2"
            ,"reportTime": "2016-10-14"
          }, {
            "id": "003"
            ,"username": "李文秀"
            ,"sex": "女"
            ,"state": "本人报到"
            ,"sign": "更改"
            ,"room": "126"
            ,"unitTitle": "济南市政委副主席、党组副书记"
            ,"group": ""
            ,"convener": ""
            ,"type": "席"
            ,"agentMan": ""
            ,"reportTime": "2016-10-14"
          }],
        page: {
            layout: ['prev', 'page', 'next', 'count', 'skip']
        },
        
        cols: [
            [ //表头
                {
                    field: 'id',
                    title: '编号',
                    width:60,
                    align: 'center',
                    unresize: 'false',
                },
                {
                    field: 'username',
                    title: '姓名',
                    align: 'left',
                }, {
                    field: 'sex',
                    title: '性别',
                    align: 'left',
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
                    field: 'room',
                    title: '驻地房间',
                    align: 'left',
                },
                {
                    field: 'unitTitle',
                    title: '单位职务',
                    align: 'left',
                },
                {
                    field: 'group',
                    title: '组别',
                    align: 'left',
                },{
                    field: 'convener',
                    title: '召集人',
                    align: 'left',
                },{
                    field: 'type',
                    title: '类型',
                    align: 'left',
                    toolbar: '#test-table-operate-type'
                },{
                    field: 'agentMan',
                    title: '代理人',
                    align: 'left',
                },{
                    field: 'reportTime',
                    title: '报到时间',
                    align: 'left',
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
            // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
            // layer.close(index);    //返回数据关闭loading
        },
    });


    window.onkeyup = function(ev) {
        var key = ev.keyCode || ev.which;
        if (key == 27) { //按下Escape
            layer.closeAll('iframe'); //关闭所有的iframe层

        }
    }

    var $ = layui.$,
        active = {
            screening: function() {
                layer.open({
                    type: 2,
                    title: '参会人员筛选',
                    area: ['60%', '60%'],
                    btn: ['确定', '取消'],
                    content: 'screening.html',
                    yes: function(index, layero) {
                        var submit = layero.find('iframe').contents().find("#ruleclick");
                        submit.click();
                    }
                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });

            },
            detailedinfo: function() {
                layer.open({
                    type: 2,
                    title: '详细信息',
                    area: ['60%', '60%'],
                    //btn: ['确定', '取消'],
                    shadeClose: true, //点击遮罩关闭
                    content: 'detailedinfo.html',
                    yes: function(index, layero) {
                        var submit = layero.find('iframe').contents().find("#ruleclick");
                        submit.click();
                    }
                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });
            },
                       

        };


    //监听工具条
    table.on('tool(test-table-operate)', function(obj) {
        var data = obj.data;
        if (obj.event === 'registerPOP') {
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '报到',
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['90%', '90%'],
                btn: ['报到', '返回'],
                closeBtn: 1,
                //offset: '-43px',
                content: 'register_pop.html',
                success: function(layero, index) {
                    // var body = layui.layer.getChildFrame('body', index);
                    // var roomid;
                    // // 取到弹出层里的元素，并把编辑的内容放进去
                    // body.find("#ruleid").val(data.id);
                    // body.find("#roomid").val(data.roomid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                }
            });
        }
    });



    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});
