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
    var url = "https://f.longjuli.com"
    // var url="http://127.0.0.1:8083";
    var id = getUrlParam("id")
    console.log(id)
    var autosortList = new Set()
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
                trigger: '.adjustbtn', done: function (obj) {
                    if (autosortList.size!=0&&!autosortList.has(obj.row.id)){
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
                                    intelligentsorting(autosort.config.page.curr, autosort.config.limit);
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
                    }else {}

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
                console.log(6666)
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
                if (autosortList.size!=0&&!autosortList.has(obj.row.id)){
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
                                intelligentsorting(autosort.config.page.curr, autosort.config.limit);
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
                }else {}
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
            console.log(6666)
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
        
        //把id 附加到tr上面 做判断选中使用;chenxy add
        $(obj.tr[0]).attr("id",obj.data.id);
        //end

        if (!obj.checked && obj.type == 'all') {
            var data = layui.table.cache['autosort']
            $.each(data, function (idx, con) {
                autosortList.delete(con.id)
            });

        }
        if (obj.checked && obj.type == 'all') {

            $.each(table.checkStatus('autosort').data, function (idx, con) {
                obj.removeClass("adjustbtn")
                autosortList.add(con.id);
            });
        }
        if (obj.checked && obj.type == 'one') {
            autosortList.add(obj.data.id);
        }
        if (!obj.checked && obj.type == 'one') {

            autosortList.delete(obj.data.id)
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
                trigger: '.adjustbtn', done: function (obj) {
                    // 完成时（松开时）触发
                    // 如果拖动前和拖动后无变化，则不会触发此方法
                    // console.log(obj.row) // 当前行数据
                    // console.log(obj.cache) // 改动后全表数据
                    // console.log(obj.oldIndex) // 原来的数据索引
                    // console.log(obj.newIndex) // 改动后数据索引
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
                console.log(6666)
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
            trigger: '.adjustbtn', done: function (obj) {
                // 完成时（松开时）触发
                // 如果拖动前和拖动后无变化，则不会触发此方法
                console.log(obj.row) // 当前行数据
                console.log(obj.cache) // 改动后全表数据
                console.log(obj.oldIndex) // 原来的数据索引
                console.log(obj.newIndex) // 改动后数据索引
                console.log(defaultsort.config) // 改动后数据索引
                console.log(obj.row.id)
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
            console.log(6666)
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
    window.ajaxs = function (data) {
        //     table.render({
        //         elem: '#test-table-operate',
        //         // height: 'full-200',
        //         //url: url + "/meetingcanhui/findMeetingCanHuiBylayui" //数据接口
        //         //    ,
        //         xhrFields: {
        //             withCredentials: true
        //         },
        //        data:data.data,
        //         rowDrag: {trigger: '.adjustbtn',done: function(obj) {
        //         // 完成时（松开时）触发
        //         // 如果拖动前和拖动后无变化，则不会触发此方法
        //         console.log(obj.row) // 当前行数据
        //         console.log(obj.cache) // 改动后全表数据
        //         console.log(obj.oldIndex) // 原来的数据索引
        //         console.log(obj.newIndex) // 改动后数据索引
        //     }}
        // ,totalRow: true,
        //         method: 'get',
        //         page: {
        //             layout: ['prev', 'page', 'next', 'count', 'skip']
        //         },
        //         cols: [
        //             [ //表头
        //                 {
        //                     type: 'checkbox',
        //                     fixed: 'left'
        //                 },
        //                 {
        //                     field: 'id',
        //                     title: '序号',
        //                     align: 'left',
        //                     unresize: 'false',
        //                     width: 80
        //                 },
        //                 {
        //                     field: 'name',
        //                     title: '姓名',
        //                     align: 'leftleft',
        //                 },
        //                 {
        //                     field: 'company',
        //                     title: '单位',
        //                     align: 'left',
        //                 }, {
        //                     field: 'duties',
        //                     align: 'left',
        //                     title: '职务'
        //                 },
        //                 {
        //                     title: '详情',
        //                     toolbar: '#details',
        //                 },
        //                 {
        //                     title: '不排序',
        //                     toolbar: '#notorder',
        //                 }
        //                 ,
        //                 {
        //                     title: '调整',
        //                     toolbar: '#Adjust',
        //                 }
        //             ]
        //         ],
        //
        //         event: true,
        //         page: true,
        //         limit: 15,
        //         skin: 'line',
        //         even: true,
        //         limits: [5, 10, 15],
        //         parseData: function (res, curr, count) {
        //             console.log(6666)
        //             res = data
        //             return {
        //                 "code": res.code, //解析接口状态
        //                 "count": res.count, //解析数据长度
        //                 "data": res.data //解析数据列表
        //             };
        //
        //         },
        //         done:function () {
        //             soulTable.render(this)
        //         }
        //     });
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            url: url + "/attendeesort/selectSelect", //数据接口
            //    ,
            where: {
                sortattendeeid: id
            },
            xhrFields: {
                withCredentials: true
            },
            rowDrag: {
                trigger: '.adjustbtn', done: function (obj) {
                    // 完成时（松开时）触发
                    // 如果拖动前和拖动后无变化，则不会触发此方法
                    // console.log(obj.row) // 当前行数据
                    // console.log(obj.cache) // 改动后全表数据
                    // console.log(obj.oldIndex) // 原来的数据索引
                    // console.log(obj.newIndex) // 改动后数据索引
                }
            }
            , totalRow: true,
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
                        title: '序号',
                        align: 'left',
                        unresize: 'false',
                        width: 80
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
                    }
                ]
            ],

            event: true,
            page: false,
            limit: 15,
            skin: 'line',
            even: true,
            limits: [5, 10, 15],
            parseData: function (res, curr, count) {
                return {
                    "code": res.code, //解析接口状态
                    "count": res.count, //解析数据长度
                    "data": res.data //解析数据列表
                };

            },
            done: function () {
                soulTable.render(this)
            }
        });
    }

    window.onkeyup = function (ev) {
        var key = ev.keyCode || ev.which;
        if (key == 27) { //按下Escape
            layer.closeAll('iframe'); //关闭所有的iframe层

        }
    }

    //监听选中的复选框
    table.on('tool(test-table-operate)', function (obj) {
        var age = obj.data;
        console.log(age);
        if (obj.event === 'edit') {
            layer.open({
                type: 2,
                title: '信息维护',
                content: 'attender_upform.html',
                // maxmin: true,
                area: ['60%', '80%'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var submit = layero.find('iframe').contents().find("#upclick");
                    submit.click();
                },
                success: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    if (age.isconvenor == "1") {
                        body.find('#convenornum_list').show();
                    }
                    body.find('#name').val(age.name)
                    body.find('#meetingid').val(age.meetingid)
                    body.find('#company').val(age.company)
                    body.find('#duties').val(age.duties)
                    body.find('#phone1').val(age.phone1)
                    body.find('#sexid').val(age.sexid)
                    body.find('#phone2').val(age.phone2)
                    body.find('#groupid').val(age.groupid)
                    body.find('#partyid').val(age.partyid)
                    body.find('#differentid').val(age.differentid)
                    body.find('#isconvenor').val(age.isconvenor)
                    body.find('#specialid').val(age.specialid)
                    body.find('#contacts').val(age.contacts)
                    body.find('#contactsphone').val(age.contactsPhone)
                    body.find('#contacts').val(age.contacts)
                    body.find('#cardid').val(age.cardId)
                    body.find('#convenornum').val(age.convenornum)
                    body.find('#isconvenor_list').val(age.isconvenor)
                    body.find('#specialid').val(age.specialid)
                    var a = indexs + "";
                    body.find('#meetingid').val(indexs)
                    body.find('#id').val(age.id)
                    if (age.imageUrl != null) {
                        var html = '<img src="' + url + "/upload" + age.imageUrl + '" style="width: 130px; height: 150px;" />';
                        body.find('#test-upload-image').append(html);
                    }
                }
            });
        } else if (obj.event === 'del') {
            layer.confirm('真的删除吗？', function () {
                $.ajax({
                    url: url + "/meetingcanhui/deleteMeetingCanHui",
                    type: "get",
                    data: {

                        "id": age.id,
                        "url": age.imageUrl
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (data) {
                        if (data.code == "0") {
                            layer.msg('成功删除', {
                                icon: 1
                            })
                            ajaxs(age.meetingId);


                        } else {
                            layer.msg('删除失败，请稍后再试', {
                                icon: 5
                            });
                        }

                    },
                    error: function (error) {

                        layer.msg('删除失败，服务器错误请稍后再试', {
                            icon: 5
                        });
                    }

                })

            });
        } else if (obj.event === 'jia') {
            layer.open({
                type: 2,
                title: '人员请假',
                content: 'attender_leave.html',
                area: ['45%', '40%'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    $.ajax({
                        url: url + "/meetingcanhui/updateMeetingCanHui",
                        type: "post",
                        data: {

                            "id": age.id,
                            "isleave": body.find('#status').val()
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            if (data.code == "0") {
                                layer.msg('修改成功', {
                                    icon: 1
                                })
                                layer.close(index);
                                ajaxs(age.meetingId);


                            } else {
                                layer.msg('删除失败，请稍后再试', {
                                    icon: 5
                                });
                            }

                        },
                        error: function (error) {

                            layer.msg('删除失败，服务器错误请稍后再试', {
                                icon: 5
                            });
                        }

                    })


                },
                success: function (layero, index) {
                    var body = layer.getChildFrame('body', index);
                    body.find('#status').val(age.isleave);

                }


            })
        }


    })

    //弹出层区
    var active = {
        //排序属性
        attribute: function () {
            layer.open({
                type: 2,
                title: '<p style="">排序属性</p>',
                content: 'attribute_pop.html',
                // maxmin: true,
                area: ['60%', '80%'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                },
                success: function (layero, index) {
                }
            });

        },
        custom: function () {
            layer.open({
                type: 2,
                title: '<p style="">自定义排序</p>',
                content: 'custom_pop.html',
                maxmin: true,
                area: ['60%', '80%'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {

                },
                success: function (layero, index) {
                }
            })
        },
        exportb: function () {
            console.log(JSON.parse(storage.getItem("data")));
        },
        download: function () {
            window.location = url + "/attendeesort/download";
        },
        Intelligent: function () {
            $.ajax({
                type: "get",
                url: url + "/attendeesort/autosort",
                data: {
                    "id": id
                },
                success: function (data) {
                    // console.log(data)
                    // $("#myDiv").html('<h2>'+data+'</h2>');
                    if (data.code == 0) {
                        layer.msg("智能排序成功");

                        intelligentsorting(1, 15);
                    } else {
                        layer.msg("智能排序失败");
                    }
                }
            });

        },
        getCheckData: function () { //获取选中数据

            if ($('#select-room').val() == '-1') {
                return layer.msg("请选择会议后再添加人员")
            }
            var cb = $(".layui-form-checkbox");
            $(".layui-form-checkbox").each(function () {

                $(this).click();

            })


        },
        getCheckLength: function () { //获取选中数目
            if ($('#select-room').val() == '-1') {
                return layer.msg("请选择会议后再删除人员")
            }
            if (attenderList.length == 0) {
                return layer.msg("请选择要删除的人员")
            }
            layer.confirm('确定要批量删除吗?', function (index) {

                $.ajax({
                    async: false,
                    type: "post",
                    url: url + "/meetingcanhui/batchRemove",
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    //成功的回调函数
                    data: {
                        "meetingcanhuiid": attenderList.join(",")

                    },
                    success: function (msg) {
                        if (msg.code == 0) {
                            layer.msg("删除成功");
                            ajaxs($('#select-room').val()); // 父页面刷新

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
        isAll: function () { //验证是否全选
            layer.confirm('您将要进行列表清空操作,执行后您的所有记录将被删除,请谨慎操作,是否确认?', function (index) {
                $.ajax({
                    async: false,
                    type: "get",
                    url: url + "/meetingcanhui/empty",
                    dataType: "json",
                    xhrFields: {
                        withCredentials: true
                    },
                    //成功的回调函数
                    data: {},
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

        function openMsg() {
            subtips = layer.tips(_data, '#' + _id, {tips: [3, '#666'], time: 30000});
        }
    })


})