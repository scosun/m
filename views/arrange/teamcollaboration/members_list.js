var indexs = 0;

layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index',//主入口模块
    soulTable: '/sourtable/soulTable',
    tableFilter: '/sourtable/tableFilter',
    excel: '/sourtable/excel',
    tableChild: '/sourtable/tableChild',
    tableMerge: '/sourtable/tableMerge'
}).use(['index', 'user', 'form', 'table', 'layedit', 'laydate', 'upload', 'soulTable', 'laypage'], function () {
    var a = {};
    var b = {};
    var $ = layui.$,
        setter = layui.setter,
        admin = layui.admin,
        form = layui.form,
        element = layui.element,
        table = layui.table,
        layer = layui.layer,
        upload = layui.upload,
        laypage = layui.laypage,
        laydate = layui.laydate,
        datas = null,
        soulTable = layui.soulTable,
        router = layui.router();
    element.render();
    //初次渲染表格
    var url = setter.baseUrl;
    // var url="http://127.0.0.1:8083";
    var id = getUrlParam("id")
    console.log(id)
     window.autosortList = new Set()
     window.defaultsortList= new Set()
    window.customList= new Set()

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]);
        return null; //返回参数值
    }
    var teamId= getUrlParam("team");
    //智能排序
    function intelligentsorting(curr, limit) {
        var autosort = table.render({
            elem: '#autosort',
            // height: 'full-200',
            url: url + "/attendeesort/selectiveByauto", //数据接口
            //    ,
            where: {
                sortattendeeid: id
            },
            xhrFields: {
                withCredentials: true
            }
            , totalRow: true,
            method: 'get',
            page: {
                curr: curr,
                limit: limit
            },
            cols: [
                [ //表头
                    {
                        field: 'name',
                        title: '姓名',
                        align: 'leftleft',
                    },
                    {
                        field: 'company',
                        title: '角色',
                        align: 'left',
                    },
                    {
                        field: 'duties',
                        align: 'left',
                        title: '加入时间'
                    },
                    {
                        title: '操作',
                        toolbar: '#test-table-operate-barDemo',
                    },
                ]
            ],

            event: true,
            limit: 15,
            skin: 'line',
            even: true,
            limits: [15, 30, 50],
            parseData: function (res, curr, count) {
                for (var i in res.data) {

                    if (autosortList.has(res.data[i].id)) {
                        //如果set集合中有的话，给rows添加check属性选中
                        res.data[i]["LAY_CHECKED"] = true;
                    }
                }
                return {
                    "code": res.code, //解析接口状态
                    "count": res.count, //解析数据长度
                    "data": res.data //解析数据列表
                };

            },
            done: function (res, curr, count) {
                console.log(autosort.config)
                soulTable.render(this)

            }
        });
    }

    var autosort =  table.render({
        elem: '#autosort',
        // height: 'full-200',
        method: 'get',
        where:{
            "teamId":teamId
        },
        xhrFields: {
            withCredentials: true
        },
        url: url + "/team/memberlist", //数据接口
        page: {
            layout: ['prev', 'page', 'next', 'count', 'skip']
        },
        cols: [
            [ //表头
                {
                    field: 'anotherName',
                    title: '昵称',
                    align: 'left',
                },
                {
                    field: 'teamStatus',
                    title: '职位',
                    align: 'left',
                    templet: function(data) {
                        if (data.teamAdmin == data.username) {
                            return '管理员'
                        }else {
                            return '成员'
                        }
                    },
                },
                {
                    title: '操作',
                    align: 'left',
                    toolbar: '#test-table-operate-barDemo',
                    width: '20%',
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

    table.on('checkbox(autosort)', function (obj) {
        console.log()
        //把id 附加到tr上面 做判断选中使用;chenxy add
        // $("#"+obj.data.id).attr("value",obj.data.id);

        console.log()
        //end

        if (!obj.checked && obj.type == 'all') {
            var data = layui.table.cache['autosort']
            $.each(data, function (idx, con) {
                autosortList.delete(con.id)
                $("#a"+con.id).attr("value","").removeClass("opacitys");

            });

        }
        if (obj.checked && obj.type == 'all') {

            $.each(table.checkStatus('autosort').data, function (idx, con) {
                autosortList.add(con.id);
                $("#a"+con.id).attr("value",con.id).addClass("opacitys");
            });
        }
        if (obj.checked && obj.type == 'one') {
            autosortList.add(obj.data.id);
            $("#a"+obj.data.id).attr("value",obj.data.id).addClass("opacitys");
        }
        if (!obj.checked && obj.type == 'one') {

            autosortList.delete(obj.data.id)
            $("#a"+obj.data.id).attr("value","").removeClass("opacitys");
        }
        console.log(autosortList)
        // if(obj.checked){

        // 			  	}else{

        // }


    });

    //默认排序列表
    function page(curr, limit) {
        var defaultsort = table.render({
            elem: '#defaultsort',
            // height: 'full-200',
            url: url + "/attendeesort/selectiveBydefault", //数据接口
            //    ,
            where: {
                sortattendeeid: id
            },
            xhrFields: {
                withCredentials: true
            }
            , totalRow: true,
            contextmenu: {
                header: false, // false 禁用右键（组织浏览器的右键菜单）
                body: false,
                total: false
            },
            method: 'get',
            page: {
                curr: curr,
                limit: limit
                // layout: ['prev', 'page', 'next', 'count', 'skip'],

            },
            cols: [
                [ //表头
                    {
                        field: 'name',
                        title: '姓名',
                        align: 'leftleft',
                    },
                    {
                        field: 'company',
                        title: '邀请角色',
                        align: 'left',
                    },
                    {
                        field: 'duties',
                        align: 'left',
                        title: '邀请时间'
                    },
                    {
                        title: '操作',
                        toolbar: '#defaultsortdetails',
                    },
                ]
            ],

            event: true,
            limit: 15,
            skin: 'line',
            even: true,
            limits: [15, 30, 50],
            parseData: function (res, curr, count) {
                for (var i in res.data) {

                    if (defaultsortList.has(res.data[i].id)) {
                        //如果set集合中有的话，给rows添加check属性选中
                        res.data[i]["LAY_CHECKED"] = true;
                    }
                }
                return {
                    "code": res.code, //解析接口状态
                    "count": res.count, //解析数据长度
                    "data": res.data //解析数据列表
                };

            },
            done: function (res, curr, count) {

                soulTable.render(this)
            }
        });
    }

    var defaultsort = table.render({
        elem: '#defaultsort',
        // height: 'full-200',
        url: url + "/attendeesort/selectiveBydefault", //数据接口
        //    ,
        where: {
            sortattendeeid: id
        },
        xhrFields: {
            withCredentials: true
        }
        , totalRow: true,
        contextmenu: {
            header: false, // false 禁用右键（组织浏览器的右键菜单）
            body: false,
            total: false
        },
        method: 'get',
        page: {
            // layout: ['prev', 'page', 'next', 'count', 'skip']
        },
        cols: [
            [ //表头
                {
                    field: 'name',
                    title: '姓名',
                    align: 'leftleft',
                },
                {
                    field: 'company',
                    title: '邀请角色',
                    align: 'left',
                },
                {
                    field: 'duties',
                    align: 'left',
                    title: '邀请时间'
                },
                {
                    title: '操作',
                    toolbar: '#defaultsortdetails',
                },
            ]
        ],

        event: true,
        page: true,
        limit: 15,
        skin: 'line',
        even: true,
        limits: [15, 30, 50],
        parseData: function (res, curr, count) {
            for (var i in res.data) {

                if (defaultsortList.has(res.data[i].id)) {
                    //如果set集合中有的话，给rows添加check属性选中
                    res.data[i]["LAY_CHECKED"] = true;
                }
            }
            return {
                "code": res.code, //解析接口状态
                "count": res.count, //解析数据长度
                "data": res.data //解析数据列表
            };

        },
        done: function (res, curr, count) {

            soulTable.render(this)
        }
    });

    window.onkeyup = function (ev) {
        var key = ev.keyCode || ev.which;
        if (key == 27) { //按下Escape
            layer.closeAll('iframe'); //关闭所有的iframe层

        }
    }

    table.on('tool(autosort)', function (obj) {
        var data = obj.data;
        if (obj.event === 'transfer') { //转让
            layer.confirm('真的转让吗？', function() {
                $.ajax({
                    url: url+"/team/transferAdmin",
                    type: "post",
                    data: {
                        "teamId":teamId,
                        "username":data.username
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.code == "0") {
                            layer.msg('成功转让', {
                                icon: 1
                            })
                            reloads();
                        } else {
                            layer.msg(data.msg, {
                                icon: 5
                            });
                        }
                    },
                    error: function(error) {
                        layer.msg('转让失败，服务器错误请稍后再试', {
                            icon: 5
                        });
                    }
                })
            });
        } else if (obj.event === 'quit') { //退出
            layer.confirm('真的退出吗？', function() {
                $.ajax({
                    url: url+"/team/quitTeam",
                    type: "get",
                    data: {
                        "teamUserId":  data.teamUserId
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.code == "0") {
                            layer.msg('成功退出', {
                                icon: 1
                            })
                            reloads();
                        } else {
                            layer.msg(data.msg, {
                                icon: 5
                            });
                        }
                    },
                    error: function(error) {
                        layer.msg('退出失败，服务器错误请稍后再试', {
                            icon: 5
                        });
                    }
                })
            });
        } else if (obj.event === 'shiftout') { //移出
            layer.confirm('真的移出吗？', function() {
                $.ajax({
                    url: url+"/team/removemember",
                    type: "get",
                    data: {
                        "teamId": teamId,
                        "teamUserId":obj.data.teamUserId
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.code == "0") {
                            layer.msg('成功移出', {
                                icon: 1
                            })
                            reloads();
                        } else {
                            layer.msg(data.msg, {
                                icon: 5
                            });
                        }
                    },
                    error: function(error) {
                        layer.msg('移出失败，服务器错误请稍后再试', {
                            icon: 5
                        });
                    }
                })
            });
        }
    });


    var active = {
        //邀请
        invite: function () {
            layer.open({
                type: 2,
                title: '邀请新的成员加入',
                content: 'inviteteam_pop.html',
                // maxmin: true,
                area: ['400px', '250px'],
                btn: ['确认', '取消'],
                yes: function (index, layero) {
                },
                success: function (layero, index) {
                }
            });
        },
        dismiss: function () {
            layer.confirm('真的解散吗？', function() {
                $.ajax({
                    // url: url+"/sortattendee/delete",
                    type: "get",
                    data: {
                        "id": obj.data.id
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function(data) {
                        if (data.code == "0") {
                            layer.msg('成功解散', {
                                icon: 1
                            })
                            reloads();
                        } else {
                            layer.msg(data.msg, {
                                icon: 5
                            });
                        }
                    },
                    error: function(error) {
                        layer.msg('解散失败，服务器错误请稍后再试', {
                            icon: 5
                        });
                    }
                })
            });
        },
    }
    //弹出层选项区

    $('.layui-ds').on('click', function () {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });

    /*右侧菜单HOVER显示提示文字*/
    $('.test-table-operate-btn button').each(function () {
        var _id = $(this).attr('id');
        var _data = $(this).attr('data');
        $("#" + _id).hover(function () {
            openMsg();
        }, function () {
            layer.close(subtips);
        });
        element.on('tab(demo)', function(elem){
            console.log(elem)
        });
        function openMsg() {
            subtips = layer.tips(_data, '#' + _id, {tips: [3, '#666'], time: 30000});
        }
    })


})
