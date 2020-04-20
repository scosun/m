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
    layer.msg("点击导入，导入excel模板之后，才有人员信息");
    $('#group').append('<button class="layui-btn layui-ds Intelligent" data-type="Intelligent" id="Intelligent" data="智能排序">智能排序</button>')
    $('#group').append('<button class="layui-btn layui-ds attribute" data-type="attribute" id="attribute" data="排序属性">排序属性</button>')
    $('#group').append('<button class="layui-btn layui-ds custom" data-type="custom" id="custom" data="自定义排序">自定义排序</button>')
    $('#group').append('<button class="layui-btn layui-ds exportb" data-type="exportb" id="exportb" data="导出">导出</button>')
    $('#group').append('<button class="layui-btn layui-ds importb" data-type="importb" id="importb" data="导入">导入</button>')
    $('#group').append('<button class="layui-btn layui-ds download" data-type="download" id="download" data="下载模板">下载模版</button>')
    $('#group').append('<button class="layui-btn layui-ds saveb" data-type="saveb" id="saveb" data="保存">保存</button>')

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURI(r[2]);
        return null; //返回参数值
    }

    //监听指定开关
    form.on('switch(switchTest)', function (data) {
        layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
            offset: '6px'
        });
        layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
    });

    upload.render({
        elem: '#importb'
        , url: url + '/attendeesort/attendeesort/' + id,
        // auto: false,
        exts: 'xls|xlsx',
        //bindAction: '#btn99',
        //  choose: function (obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
        //     obj.preview(function (index, file, result) {
        //         // console.log(index); //得到文件索引
        //         // console.log(file);
        //         uploadfile = file //得到文件对象
        //         // console.log(uploadfile)
        //         // console.log(result); //得到文件base64编码，比如图片
        //
        //         //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增
        //
        //         //这里还可以做一些 append 文件列表 DOM 的操作
        //
        //         //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
        //         //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
        //     });
        // },
        done: function (res) {
            if (res.code == 0) {
                window.location.reload();
            }
        }
    });

    function isEmptyObject(obj) {
        var jlength = 0;
        for (var key in obj) {
            if (key != "null") {
                jlength++;
            }
        }
        ;
        return jlength
    }

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
            },
            rowDrag: {
                autosortList:autosortList,
                trigger: '.adjustbtn', done: function (obj) {
                    if (autosortList.size==0&&!autosortList.has(obj.row.id)){
                        var rankid = autosort.config.limit * (autosort.config.page.curr - 1) + obj.newIndex
                        $.ajax({
                            url: url + "/attendeesort/autodragsort",
                            type: "get",
                            data: {

                                "sortid": id,
                                "attendeeid": obj.row.id,
                                "rankid": rankid
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (data) {
                                if (data.code == "0") {
                                    //理论上 服务器保存成功，单条就不用刷页面了
                                    // intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                } else {
                                    layer.msg('拖动失败，请稍后再试', {
                                        icon: 5
                                    });
                                    intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                }

                            },
                            error: function (error) {

                                layer.msg('删除失败，服务器错误请稍后再试', {
                                    icon: 5
                                });
                            }

                        })
                    }else {
                        var rankid = autosort.config.limit * (autosort.config.page.curr - 1) + obj.newIndex
                        var checkbox = Array.from(autosortList);
                        $.ajax({
                            url: url + "/attendeesort/autodragmultisort",
                            type: "get",
                            data: {
                                "sortid": id,
                                "attendeeids":checkbox.join(","),
                                "rankid": rankid,
                                "dragattendeeid":obj.row.id
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (data) {
                                if (data.code == "0") {
                                    layer.confirm('是否要继续拖动?', {icon: 3, title:'提示',btn:['继续拖动','取消拖动'],
                                        yes:function(index){
                                            intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                            layer.close(index);
                                        },
                                        cancel: function(index){
                                            autosortList = new Set()
                                            intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                        },
                                        btn2: function(index){
                                            autosortList = new Set()
                                            intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                        }
                                    }, );
                                } else {
                                    layer.msg('拖动失败，请稍后再试', {
                                        icon: 5
                                    });
                                    intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                }

                            },
                            error: function (error) {

                                layer.msg('删除失败，服务器错误请稍后再试', {
                                    icon: 5
                                });
                            }

                        })
                    }
                }
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
                        type: 'checkbox',
                        fixed: 'left'
                    },
                    {
                        field: 'name',
                        title: '姓名',
                        align: 'leftleft',
                    },
                    {
                        field: 'company',
                        title: '单位',
                        align: 'left',
                    }, {
                    field: 'duties',
                    align: 'left',
                    title: '职务'
                },
                    {
                        title: '详情',
                        toolbar: '#details',
                    },
                    {
                        title: '不排序',
                        toolbar: '#notorder',
                    }
                    ,
                    {
                        title: '调整',
                        toolbar: '#Adjust',
                        width: 165,
                        contextmenu: {
                            // 表头右键菜单配置

                            // 表格内容右键菜单配置
                            body: [
                                {
                                    name: '移动到上一页',
                                    click: function (obj) {
                                        console.log(obj);
                                        console.log(defaultsort.config);
                                        if (autosort.config.page.curr == 1) {
                                            return layer.msg("当前已是第一页")
                                        }

                                        var rankid = autosort.config.limit * (autosort.config.page.curr - 2)
                                        $.ajax({
                                            url: url + "/attendeesort/autodragsort",
                                            type: "get",
                                            data: {

                                                "sortid": id,
                                                "attendeeid": obj.row.id,
                                                "rankid": rankid
                                            },
                                            xhrFields: {
                                                withCredentials: true
                                            },
                                            success: function (data) {
                                                if (data.code == "0") {
                                                    intelligentsorting(autosort.config.page.curr - 1, autosort.config.limit);
                                                } else {
                                                    layer.msg('拖动失败，请稍后再试', {
                                                        icon: 5
                                                    });
                                                    intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                                }

                                            },
                                             error: function (error) {

                                                layer.msg('删除失败，服务器错误请稍后再试', {
                                                    icon: 5
                                                });
                                            }

                                        })
                                    }
                                },
                                {
                                    name: '移动到下一页',
                                    click: function (obj) {
                                        if (autosort.config.page.pages == autosort.config.page.curr) {
                                            return layer.msg("当前已是最后一页")
                                        }
                                        var rankid = autosort.config.limit * (autosort.config.page.curr)
                                        $.ajax({
                                            url: url + "/attendeesort/autodragsort",
                                            type: "get",
                                            data: {

                                                "sortid": id,
                                                "attendeeid": obj.row.id,
                                                "rankid": rankid
                                            },
                                            xhrFields: {
                                                withCredentials: true
                                            },
                                            success: function (data) {
                                                if (data.code == "0") {
                                                    intelligentsorting(autosort.config.page.curr + 1, autosort.config.limit);
                                                } else {
                                                    layer.msg('拖动失败，请稍后再试', {
                                                        icon: 5
                                                    });
                                                    intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                                }

                                            },
                                            error: function (error) {

                                                layer.msg('删除失败，服务器错误请稍后再试', {
                                                    icon: 5
                                                });
                                            }

                                        })

                                    }
                                }
                            ],
                            // 合计栏右键菜单配置
                        }

                    }
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
        },
        rowDrag: {
            //soulTable.js扩展参数，已勾选id对象，记得删除勾选的时候要remove，保证一致性
            autosortList:autosortList,
            trigger: '.adjustbtn', done: function (obj) {
                if (autosortList.size==0&&!autosortList.has(obj.row.id)){
                    var rankid = autosort.config.limit * (autosort.config.page.curr - 1) + obj.newIndex
                    $.ajax({
                        url: url + "/attendeesort/autodragsort",
                        type: "get",
                        data: {

                            "sortid": id,
                            "attendeeid": obj.row.id,
                            "rankid": rankid
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            if (data.code == "0") {
                                //理论上 服务器保存成功，单条就不用刷页面了
                                // intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                            } else {
                                layer.msg('拖动失败，请稍后再试', {
                                    icon: 5
                                });
                                intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                            }

                        },
                        error: function (error) {

                            layer.msg('删除失败，服务器错误请稍后再试', {
                                icon: 5
                            });
                        }

                    })
                }else {
                    var rankid = autosort.config.limit * (autosort.config.page.curr - 1) + obj.newIndex
                    var checkbox = Array.from(autosortList);
                    $.ajax({
                        url: url + "/attendeesort/autodragmultisort",
                        type: "get",
                        data: {
                            "sortid": id,
                            "attendeeids":checkbox.join(","),
                            "rankid": rankid,
                            "dragattendeeid":obj.row.id
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            if (data.code == "0") {
                                layer.confirm('是否要继续拖动?', {icon: 3, title:'提示',btn:['继续拖动','取消拖动'],
                                    yes:function(index){
                                        layer.close(index);
                                        intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                    },
                                    cancel: function(index){
                                        autosortList = new Set()
                                        intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                    },
                                    btn2: function(index){
                                        autosortList = new Set()
                                        intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                    }
                                }, );

                            } else {
                                layer.msg('拖动失败，请稍后再试', {
                                    icon: 5
                                });
                                intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                            }

                        },
                        error: function (error) {

                            layer.msg('删除失败，服务器错误请稍后再试', {
                                icon: 5
                            });
                        }

                    })
                }
            }
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
                    type: 'checkbox',
                    fixed: 'left'
                },
                {
                    field: 'name',
                    title: '姓名',
                    align: 'leftleft',
                },
                {
                    field: 'company',
                    title: '单位',
                    align: 'left',
                }, {
                field: 'duties',
                align: 'left',
                title: '职务'
            },
                {
                    title: '详情',
                    toolbar: '#details',
                },
                {
                    title: '不排序',
                    toolbar: '#notorder',
                }
                ,
                {
                    title: '调整',
                    toolbar: '#Adjust',
                    width: 165,
                    contextmenu: {
                        // 表头右键菜单配置

                        // 表格内容右键菜单配置
                        body: [
                            {
                                name: '移动到上一页',
                                click: function (obj) {
                                    console.log(obj);
                                    if (autosort.config.page.curr == 1) {
                                        return layer.msg("当前已是第一页")
                                    }
                                    var rankid = autosort.config.limit * (autosort.config.page.curr - 2)
                                    $.ajax({
                                        url: url + "/attendeesort/autodragsort",
                                        type: "get",
                                        data: {

                                            "sortid": id,
                                            "attendeeid": obj.row.id,
                                            "rankid": rankid
                                        },
                                        xhrFields: {
                                            withCredentials: true
                                        },
                                        success: function (data) {
                                            if (data.code == "0") {
                                                intelligentsorting(autosort.config.page.curr - 1, autosort.config.limit);
                                            } else {
                                                layer.msg('拖动失败，请稍后再试', {
                                                    icon: 5
                                                });
                                                intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                            }

                                        },
                                        error: function (error) {

                                            layer.msg('删除失败，服务器错误请稍后再试', {
                                                icon: 5
                                            });
                                        }

                                    })

                                }
                            },
                            {
                                name: '移动到下一页',
                                click: function (obj) {
                                    if (autosort.config.page.pages == autosort.config.page.curr) {
                                        return layer.msg("当前已是最后一页")
                                    }
                                    var rankid = autosort.config.limit * (autosort.config.page.curr)
                                    $.ajax({
                                        url: url + "/attendeesort/autodragsort",
                                        type: "get",
                                        data: {

                                            "sortid": id,
                                            "attendeeid": obj.row.id,
                                            "rankid": rankid
                                        },
                                        xhrFields: {
                                            withCredentials: true
                                        },
                                        success: function (data) {
                                            if (data.code == "0") {
                                                intelligentsorting(autosort.config.page.curr + 1, autosort.config.limit);
                                            } else {
                                                layer.msg('拖动失败，请稍后再试', {
                                                    icon: 5
                                                });
                                                intelligentsorting(autosort.config.page.curr, autosort.config.limit);
                                            }

                                        },
                                        error: function (error) {

                                            layer.msg('删除失败，服务器错误请稍后再试', {
                                                icon: 5
                                            });
                                        }

                                    })
                                }
                            }
                        ],
                        // 合计栏右键菜单配置
                    }

                }
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

            soulTable.render(this)
        }
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
            },
            rowDrag: {
                autosortList:defaultsortList,
                trigger: '.adjustbtn', done: function (obj) {

                    if (defaultsortList.size==0&&!defaultsortList.has(obj.row.id)){
                        var rankid = defaultsort.config.limit * (defaultsort.config.page.curr - 1) + obj.newIndex
                        $.ajax({
                            url: url + "/attendeesort/defaultdragsort",
                            type: "get",
                            data: {

                                "sortid": id,
                                "attendeeid": obj.row.id,
                                "rankid": rankid
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (data) {
                                if (data.code == "0") {
                                    page(defaultsort.config.page.curr, defaultsort.config.limit);
                                } else {
                                    layer.msg('拖动失败，请稍后再试', {
                                        icon: 5
                                    });
                                    page(defaultsort.config.page.curr, defaultsort.config.limit);
                                }

                            },
                            error: function (error) {

                                layer.msg('删除失败，服务器错误请稍后再试', {
                                    icon: 5
                                });
                            }

                        })

                    }else{
                        var rankid = defaultsort.config.limit * (defaultsort.config.page.curr - 1) + obj.newIndex
                        var checkbox = Array.from(defaultsortList);
                        $.ajax({
                            url: url + "/attendeesort/defaultdragmultisort",
                            type: "get",
                            data: {
                                "sortid": id,
                                "attendeeids":checkbox.join(","),
                                "rankid": rankid,
                                "dragattendeeid":obj.row.id
                            },
                            xhrFields: {
                                withCredentials: true
                            },
                            success: function (data) {
                                if (data.code == "0") {
                                    layer.confirm('是否要继续拖动?', {icon: 3, title:'提示',btn:['继续拖动','取消拖动'],
                                        yes:function(index){
                                            layer.close(index);
                                            page(autosort.config.page.curr, autosort.config.limit);
                                        },
                                        cancel: function(index){
                                            defaultsortList = new Set()
                                            page(autosort.config.page.curr, autosort.config.limit);
                                        },
                                        btn2: function(index){
                                            defaultsortList = new Set()
                                            page(autosort.config.page.curr, autosort.config.limit);
                                        }
                                    }, );

                                } else {
                                    layer.msg('拖动失败，请稍后再试', {
                                        icon: 5
                                    });
                                    page(autosort.config.page.curr, autosort.config.limit);
                                }

                            },
                            error: function (error) {

                                layer.msg('删除失败，服务器错误请稍后再试', {
                                    icon: 5
                                });
                            }

                        })
                    }

                }
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
                        type: 'checkbox',
                        fixed: 'left'
                    },
                    {
                        field: 'name',
                        title: '姓名',
                        align: 'leftleft',
                    },
                    {
                        field: 'company',
                        title: '单位',
                        align: 'left',
                    }, {
                    field: 'duties',
                    align: 'left',
                    title: '职务'
                },
                    {
                        title: '详情',
                        toolbar: '#details',
                    },
                    {
                        title: '不排序',
                        toolbar: '#notorder',
                    }
                    ,
                    {
                        title: '调整',
                        toolbar: '#defultsort   ',
                        width: 165,
                        contextmenu: {
                            // 表头右键菜单配置

                            // 表格内容右键菜单配置
                            body: [
                                {
                                    name: '移动到上一页',
                                    click: function (obj) {
                                        if (defaultsort.config.page.curr == 1) {
                                            return layer.msg("当前已是第一页")
                                        }
                                        var rankid = defaultsort.config.limit * (defaultsort.config.page.curr - 2)
                                        $.ajax({
                                            url: url + "/attendeesort/defaultdragsort",
                                            type: "get",
                                            data: {

                                                "sortid": id,
                                                "attendeeid": obj.row.id,
                                                "rankid": rankid
                                            },
                                            xhrFields: {
                                                withCredentials: true
                                            },
                                            success: function (data) {
                                                if (data.code == "0") {

                                                    page(defaultsort.config.page.curr - 1, defaultsort.config.limit);
                                                } else {
                                                    layer.msg('拖动失败，请稍后再试', {
                                                        icon: 5
                                                    });
                                                    page(defaultsort.config.page.curr, defaultsort.config.limit);
                                                }

                                            },
                                            error: function (error) {

                                                layer.msg('删除失败，服务器错误请稍后再试', {
                                                    icon: 5
                                                });
                                            }

                                        })

                                    }
                                },
                                {
                                    name: '移动到下一页',
                                    click: function (obj) {
                                        if (defaultsort.config.page.pages == defaultsort.config.page.curr) {
                                            // console.log(defaultsort.config.page.pages)
                                            // console.log(defaultsort.config.page.curr)
                                            return layer.msg("当前已是最后一页")
                                        }

                                        var rankid = defaultsort.config.limit * (defaultsort.config.page.curr)
                                        $.ajax({
                                            url: url + "/attendeesort/defaultdragsort",
                                            type: "get",
                                            data: {

                                                "sortid": id,
                                                "attendeeid": obj.row.id,
                                                "rankid": rankid
                                            },
                                            xhrFields: {
                                                withCredentials: true
                                            },
                                            success: function (data) {
                                                if (data.code == "0") {
                                                    page(defaultsort.config.page.curr + 1, defaultsort.config.limit);
                                                } else {
                                                    layer.msg('拖动失败，请稍后再试', {
                                                        icon: 5
                                                    });
                                                    page(defaultsort.config.page.curr, defaultsort.config.limit);
                                                }

                                            },
                                            error: function (error) {

                                                layer.msg('删除失败，服务器错误请稍后再试', {
                                                    icon: 5
                                                });
                                            }

                                        })

                                    }
                                }
                            ],
                            // 合计栏右键菜单配置
                        }

                    }
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
        },
        rowDrag: {
            autosortList:defaultsortList,
            trigger: '.adjustbtn', done: function (obj) {

                if (defaultsortList.size==0&&!defaultsortList.has(obj.row.id)){
                    var rankid = defaultsort.config.limit * (defaultsort.config.page.curr - 1) + obj.newIndex
                    $.ajax({
                        url: url + "/attendeesort/defaultdragsort",
                        type: "get",
                        data: {

                            "sortid": id,
                            "attendeeid": obj.row.id,
                            "rankid": rankid
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            if (data.code == "0") {
                                page(defaultsort.config.page.curr, defaultsort.config.limit);
                            } else {
                                layer.msg('拖动失败，请稍后再试', {
                                    icon: 5
                                });
                                page(defaultsort.config.page.curr, defaultsort.config.limit);
                            }

                        },
                        error: function (error) {

                            layer.msg('删除失败，服务器错误请稍后再试', {
                                icon: 5
                            });
                        }

                    })

                }else{
                    var rankid = defaultsort.config.limit * (defaultsort.config.page.curr - 1) + obj.newIndex
                    var checkbox = Array.from(defaultsortList);
                    $.ajax({
                        url: url + "/attendeesort/defaultdragmultisort",
                        type: "get",
                        data: {
                            "sortid": id,
                            "attendeeids":checkbox.join(","),
                            "rankid": rankid,
                            "dragattendeeid":obj.row.id
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            if (data.code == "0") {
                                layer.confirm('是否要继续拖动?', {icon: 3, title:'提示',btn:['继续拖动','取消拖动'],
                                    yes:function(index){
                                        layer.close(index);
                                        page(autosort.config.page.curr, autosort.config.limit);
                                    },
                                    cancel: function(index){
                                        defaultsortList = new Set()
                                        page(autosort.config.page.curr, autosort.config.limit);
                                    },
                                    btn2: function(index){
                                        defaultsortList = new Set()
                                        page(autosort.config.page.curr, autosort.config.limit);
                                    }
                                }, );

                            } else {
                                layer.msg('拖动失败，请稍后再试', {
                                    icon: 5
                                });
                                page(autosort.config.page.curr, autosort.config.limit);
                            }

                        },
                        error: function (error) {

                            layer.msg('删除失败，服务器错误请稍后再试', {
                                icon: 5
                            });
                        }

                    })
                }

            }
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
                    type: 'checkbox',
                    fixed: 'left'
                },
                {
                    field: 'name',
                    title: '姓名',
                    align: 'leftleft',
                },
                {
                    field: 'company',
                    title: '单位',
                    align: 'left',
                }, {
                field: 'duties',
                align: 'left',
                title: '职务'
            },
                {
                    title: '详情',
                    toolbar: '#details',
                },
                {
                    title: '不排序',
                    toolbar: '#notorder',
                }
                ,
                {
                    title: '调整',
                    toolbar: '#defultsort',
                    width: 165,
                    contextmenu: {
                        // 表头右键菜单配置

                        // 表格内容右键菜单配置
                        body: [
                            {
                                name: '移动到上一页',
                                click: function (obj) {
                                    console.log(defaultsort.config);
                                    if (defaultsort.config.page.curr == 1) {
                                        return layer.msg("当前已是第一页")
                                    }
                                    var rankid = defaultsort.config.limit * (defaultsort.config.page.curr - 2)
                                    $.ajax({
                                        url: url + "/attendeesort/defaultdragsort",
                                        type: "get",
                                        data: {

                                            "sortid": id,
                                            "attendeeid": obj.row.id,
                                            "rankid": rankid
                                        },
                                        xhrFields: {
                                            withCredentials: true
                                        },
                                        success: function (data) {
                                            if (data.code == "0") {
                                                page(defaultsort.config.page.curr - 1, defaultsort.config.limit);
                                            } else {
                                                layer.msg('拖动失败，请稍后再试', {
                                                    icon: 5
                                                });
                                                page(defaultsort.config.page.curr, defaultsort.config.limit);
                                            }

                                        },
                                        error: function (error) {

                                            layer.msg('删除失败，服务器错误请稍后再试', {
                                                icon: 5
                                            });
                                        }

                                    })
                                }
                            },
                            {
                                name: '移动到下一页',
                                click: function (obj) {
                                    if (defaultsort.config.page.pages == defaultsort.config.page.curr) {
                                        return layer.msg("当前已是最后一页")
                                    }
                                    var rankid = defaultsort.config.limit * (defaultsort.config.page.curr)
                                    $.ajax({
                                        url: url + "/attendeesort/defaultdragsort",
                                        type: "get",
                                        data: {

                                            "sortid": id,
                                            "attendeeid": obj.row.id,
                                            "rankid": rankid
                                        },
                                        xhrFields: {
                                            withCredentials: true
                                        },
                                        success: function (data) {
                                            if (data.code == "0") {
                                                page(defaultsort.config.page.curr + 1, defaultsort.config.limit);
                                            } else {
                                                layer.msg('拖动失败，请稍后再试', {
                                                    icon: 5
                                                });
                                                page(defaultsort.config.page.curr, defaultsort.config.limit);
                                            }

                                        },
                                        error: function (error) {

                                            layer.msg('删除失败，服务器错误请稍后再试', {
                                                icon: 5
                                            });
                                        }

                                    })

                                }
                            }
                        ],
                        // 合计栏右键菜单配置
                    }

                }
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
    table.on('checkbox(defaultsort)', function (obj) {

        if (!obj.checked && obj.type == 'all') {
            var data = layui.table.cache['defaultsort']
            $.each(data, function (idx, con) {
                defaultsortList.delete(con.id)
                $("#d"+con.id).attr("value","").removeClass("opacitys");

            });

        }
        if (obj.checked && obj.type == 'all') {

            $.each(table.checkStatus('defaultsort').data, function (idx, con) {
                defaultsortList.add(con.id);
                $("#d"+con.id).attr("value",con.id).addClass("opacitys");
            });
        }
        if (obj.checked && obj.type == 'one') {
            defaultsortList.add(obj.data.id);
            $("#d"+obj.data.id).attr("value",obj.data.id).addClass("opacitys");
        }
        if (!obj.checked && obj.type == 'one') {

            defaultsortList.delete(obj.data.id)
            $("#d"+obj.data.id).attr("value","").removeClass("opacitys");
        }
        console.log("d"+defaultsortList)
        // if(obj.checked){

        // 			  	}else{

        // }


    });

    window.onkeyup = function (ev) {
        var key = ev.keyCode || ev.which;
        if (key == 27) { //按下Escape
            layer.closeAll('iframe'); //关闭所有的iframe层

        }
    }

    //监听选中的复选框
    table.on('tool(test-table-operate)', function (obj) {


    })
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

        function openMsg() {
            subtips = layer.tips(_data, '#' + _id, {tips: [3, '#666'], time: 30000});
        }
    })


})