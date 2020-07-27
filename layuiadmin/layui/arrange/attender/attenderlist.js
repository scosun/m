var indexs = 0;

layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'user', 'form', 'table','upload','laytpl'], function () {
    var a = {};
    var b = {};

    var $ = layui.$,
        setter = layui.setter,
        admin = layui.admin,
        form = layui.form,
        element = layui.element,
        table = layui.table,
        tpl = layui.laytpl;
        layer = layui.layer,
        upload = layui.upload,
        datas = null,
        router = layui.router();
    element.render();
    //初次渲染表格
    var url = setter.baseUrl;
    var devices = {};
    var attenderList = [];
    var ids = -1
    layer.msg("上方下拉框选择会议后自动加载相关人员");
    $.ajax({
        async: false,
        type: "get",
        url: url + "/permission/getpremission",
        datatype: 'json',

        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        success: function (msg) {
            var data = msg.data;
			console.log(data);
            if (msg.code != 0) {
                location.href = "user/login.html"
            }
            if (isEmptyObject(data) != 0) {

                window.a = data
                var grouphtml= groups.innerHTML;tpl(grouphtml).render(data,function (html) {
                    console.log(grouphtml)
                    document.getElementById("group").innerHTML= html;
                })

            } else {


            }
        },
        error: function (error) {
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
    upload.render({
        elem: '#leave'
        , url: url+'/meetingcanhui/leave',
        // auto: false,
        exts:'xls|xlsx',
        data:{
            meeting:function(){
                return $('#select-room').val();
            }
        },
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
           layer.msg(res.msg)
            ajaxs(window.indexs);

        }
    });

    //渲染下拉框的ajax
    $.ajax({
        async: true,
        type: "get",
        url: url + "/meeting/findByMeeting",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        success: function (msg) {
            var data = msg;
            console.log(data)
            $.each(data.data.reverse(), function (idx, con) {
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
    //选中以后更新表的ajax
    window.ajaxs = function (value) {

        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            url: url + "/meetingcanhui/findMeetingCanHuiBylayui" //数据接口
                ,
            xhrFields: {
                withCredentials: true
            },
            where: {
                "meetingId": value
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
                    // {
                    //     field: 'id',
                    //     title: 'ID',
                    //     align: 'left',
                    //     unresize: 'false',
                    //     width: 80
                    // },
                    {
                        field: 'name',
                        title: '姓名',
                        align: 'leftleft',
                    },
                    {
                        field: 'duties',
                        // width: '25%',
                        title: '单位职务',
                        align: 'left',
                    }, {
                        field: 'phone1',
                        align: 'left',
                        title: '联系电话'
                    },
                    {
                        width: 80,
                        field: 'isleave',
                        align: 'left',
                        title: '是否请假',
                        templet: function(data) {
                            if (data.isleave == 0) {
                                return '参会'
                            }
                            if (data.isleave == 1) {
                                return '请假'
                            }
                            if (data.isleave == undefined) {
                                return ''
                            }
                        },
                    },

                    {
                        field: 'modifytime',
                        title: '时间',
                        align: 'left',

                    },
                    {
                        width: 140,
                        //align: 'right',
                        //flxed: 'right',
                        title: '操作',
                        toolbar: '#table-content-list',
                    }
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
                attenderList.length = 0;
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
    //监听下拉框选中
    form.on('select(component-form-select)', function (data) {

        ajaxs(data.value)
        window.indexs = data.value;
    });
    //监听选中的复选框
    table.on('checkbox(test-table-operate)', function (obj) {
        if (obj.checked && obj.type == 'one') {
            var devi = {};
            devi = obj.data.id;
            attenderList.push(devi)
        }
        if (!obj.checked && obj.type == 'one') {
            var index = attenderList.indexOf(obj.data.id);
            if (index > -1) {
                attenderList.splice(index, 1);
            }
        }
        if (!obj.checked && obj.type == 'all') {
            attenderList.length = 0;

        }
        if (obj.checked && obj.type == 'all') {
            $.each(table.checkStatus('test-table-operate').data, function (idx, con) {
                var devi = {};
                devi = con.id;

                attenderList.push(devi)
            });
            attenderList = Array.from(new Set(attenderList))
        }
        console.log(attenderList)

    });

    table.on('tool(test-table-operate)', function (obj) {
        var age = obj.data;
		console.log(age);
        if (obj.event === 'edit') {
            layer.open({
                type: 2,
                title: '信息维护',
                content: 'attender_upform.html',
                maxmin: true,
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
                    body.find('#viproom').val(age.viproomId)
                    body.find('#isstagger').val(age.isstage)
                    body.find('#roomnum').val(age.roomnum)
                    body.find('#address').val(age.address)
                    body.find('#szm').val(age.szx)
                    var a = indexs + "";
                    body.find('#meetingid').val(indexs)
                    body.find('#id').val(age.id)
					if(age.imageUrl!=null){
						var html = '<img src="'+url+"/upload"+age.imageUrl+'" style="width: 130px; height: 150px;" />';
						body.find('#test-upload-image').append(html);
					}
                }
            });
        }  else if (obj.event === 'del') {
            layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;您正在执行删除参会人员操作,执行删除操作后，与参会人员相关联座区自动编排数据也将一并被删除,是否确认继续进行该操作？？',{title:'温馨提示'}, function () {
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
        } else if(obj.event === 'jia'){
            layer.open({
                type: 2,
                title: '人员请假',
                content: 'attender_leave.html',
                area: ['45%', '40%'],
                maxmin: true,
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var body = layer.getChildFrame('body', index);
                    $.ajax({
                        url: url+ "/meetingcanhui/updateMeetingCanHui",
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
                success:function(layero,index) {
                    var body = layer.getChildFrame('body', index);
                    body.find('#status').val(age.isleave);
                    
                }


            })
        }



    })

    //弹出层区

    var active = {
        add: function () {
            //  console.log($('#select-room').val())
            if ($('#select-room').val() == '-1') {
                return layer.msg("请选择会议后再添加人员")
            }

            layer.open({
                type: 2,
                title: '<p style="">新增人员</p>',
                content: 'attender_form.html',
                maxmin: true,
                area: ['60%', '80%'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                },
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    var a = indexs + "";
                    body.find('#meetingid').val(indexs)
                }
            });

        },
        upload: function () {
            layer.open({
                type: 2,
                title: '<p style="">批量导入</p>',
                content: 'uploadattender.html',
                maxmin: true,
                area: ['40%', '40%'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                },
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    // console.log($('#select-room').val())

                    body.find('#meetingid').val($('#select-room').val())
                }
            })
        },
        download: function () {
            layer.open({
                type: 2,
                title: '<p style="">下载模板</p>',
                content: 'downloadattender.html',
                maxmin: true,
                area: ['60%', '75%'],
                btn: ['确定', '取消'],
                yes: function (index, layero) {
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                },
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    var a = indexs + "";
                    body.find('#meetingid').val(indexs)
                }
            })
        },
        uploadphoto: function () {
            if($('#select-room').val() ==-1){
                return layer.msg("请先选择会议再上传图片")
            }
            layer.open({
                type: 2,
                title: '批量上传参会人员信息',
                content: 'uploadphotos.html',
                 maxmin: true,
                area: ['60%', '71%'],
                btn: ['提交', '取消'],
                yes: function (index, layero) {},
                success: function (layero, index) {
                    var body = layui.layer.getChildFrame('body', index);
                    // console.log($('#select-room').val())

                    body.find('#meetingid').val($('#select-room').val())
                }
            });
        },
        search: function () {
            if ($('#select-room').val() == '-1') {
                return layer.msg("请选中会议后再搜索")
            }
            table.render({
                elem: '#test-table-operate',
                // height: 'full-200',
                url: url + "/meetingcanhui/selectSeatch" //数据接口
                    ,
                where: {
                    "name": $('#demoReload').val(),
                    "meetingId": $('#select-room').val(),
                },

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
                        // {
                        //     field: 'id',
                        //     title: 'ID',
                        //     align: 'left',
                        //     unresize: 'false',
                        //     width: 80
                        // },
                        {
                            field: 'name',
                            title: '姓名',
                            align: 'leftleft',
                        },
                        {
                            field: 'duties',
                            // width: '25%',
                            title: '单位职务',
                            align: 'left',
                        }, {
                            field: 'phone1',
                            align: 'left',
                            title: '联系电话'
                        },
                        {
                            width: 80,
                            field: 'isleave',
                            align: 'left',
                            title: '是否请假',
                            templet: function(data) {
                                if (data.isleave == 0) {
                                    return '参会'
                                }
                                if (data.isleave == 1) {
                                    return '请假'
                                }
                                if (data.isleave == undefined) {
                                    return ''
                                }
                            },
                        },

                        {
                            field: 'modifytime',
                            title: '时间',
                            align: 'left',

                        },
                        {
                            width: 140,
                            //align: 'right',
                            //flxed: 'right',
                            title: '操作',
                            toolbar: '#table-content-list',
                        }
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
                    attenderList.length = 0;
                    // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                    // layer.close(index);    //返回数据关闭loading
                },




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
            layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;您正在执行删除参会人员操作,执行删除操作后，与参会人员相关联座区自动编排数据也将一并被删除,是否确认继续进行该操作？？',{title:'温馨提示'}, function (index) {

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
                    data: {

                    },
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
            subtips = layer.tips(_data, '#' + _id, { tips: [3, '#666'], time: 30000 });
        }
    })


})