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
    window.flag = false
    $('#group').append(
        // "<button class='layui-btn layui-ds' data-type='screening' id='screening'>筛选</button><button class='layui-btn layui-ds' data-type='detailedinfo' id='detailedinfo' style='position: relative;'>详细信息</button>"
        '<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="screening" id="screening">筛选<s></s></a><a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="detailedinfo" id="detailedinfo">详细<s></s></a>'
    )
    
    
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
    $("#searchinput").focus();
   
         $('#searchinput').blur(function () {
       
        setTimeout( function(){
            if(!flag){
                $("#searchinput").focus();
            }
              
            }, 100 );
                    
                  });
    
    form.on('select(component-form-select)', function (data) {

        ajaxs(data.value)
        window.indexs = data.value;
    });
    $(document).keyup(function(event){
        if(event.keyCode ==13){
         $('#search').click();
        }
      })

    window.ajaxs = function (value) {
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            //url: url + "/ruletemplate/findAlllayuiBystatus", //数据接口
            method: 'get',
            url: 'https://m.longjuli.com/v1/attendees',
            where: {
                meeting_id: value,

            },
            /* 测试用*/
            /*data: [
                {
                  address: "测",
                  agency_name: "",
                  agency_phone: "",
                  agency_sfz: "",
                  arrive_time: "",
                  attributes: {
                    组别: {
                      color: "",
                      name: "1组（中共、特邀）",
                      sign: ""
                    },
                    角色: {
                      color: "#669966",
                      name: "秘书长",
                      sign: "秘"
                    }
                  },
                  card_id: "1",
                  company: "测试",
                  convenornum: 0,
                  duties: "测试",
                  id: 21019,
                  image_url: "/275/7bef8ffcd7dc4954a4c7a3206809fa7a.jpg",
                  isconvenor: 0,
                  isleave: 0,
                  name: "邓海超",
                  phone1: "15621308386",
                  phone2: "1521308386",
                  report_state: 0,
                  report_time: "2020-01-20 10:16",
                  roomnum: "1",
                  sexid: 1,
                  sign_in_state: 0,
                  state: 0
                },{
                    address: "测",
                    agency_name: "",
                    agency_phone: "",
                    agency_sfz: "",
                    arrive_time: "",
                    attributes: {
                      组别: {
                        color: "",
                        name: "1组（中共、特邀）",
                        sign: ""
                      },
                      角色: {
                        color: "#669966",
                        name: "秘书长",
                        sign: "秘"
                      }
                    },
                    card_id: "1",
                    company: "测试",
                    convenornum: 0,
                    duties: "测试",
                    id: 21019,
                    image_url: "/275/7bef8ffcd7dc4954a4c7a3206809fa7a.jpg",
                    isconvenor: 0,
                    isleave: 0,
                    name: "邓海超",
                    phone1: "15621308386",
                    phone2: "1521308386",
                    report_state: 0,
                    report_time: "2020-01-20 10:16",
                    roomnum: "1",
                    sexid: 1,
                    sign_in_state: 0,
                    state: 0
                  },{
                    address: "测",
                    agency_name: "",
                    agency_phone: "",
                    agency_sfz: "",
                    arrive_time: "",
                    attributes: {
                      组别: {
                        color: "",
                        name: "1组（中共、特邀）",
                        sign: ""
                      },
                      角色: {
                        color: "#669966",
                        name: "秘书长",
                        sign: "秘"
                      }
                    },
                    card_id: "1",
                    company: "测试",
                    convenornum: 0,
                    duties: "测试",
                    id: 21019,
                    image_url: "/275/7bef8ffcd7dc4954a4c7a3206809fa7a.jpg",
                    isconvenor: 0,
                    isleave: 0,
                    name: "邓海超",
                    phone1: "15621308386",
                    phone2: "1521308386",
                    report_state: 0,
                    report_time: "2020-01-20 10:16",
                    roomnum: "1",
                    sexid: 1,
                    sign_in_state: 0,
                    state: 0
                  },{
                    address: "测",
                    agency_name: "",
                    agency_phone: "",
                    agency_sfz: "",
                    arrive_time: "",
                    attributes: {
                      组别: {
                        color: "",
                        name: "1组（中共、特邀）",
                        sign: ""
                      },
                      角色: {
                        color: "#669966",
                        name: "秘书长",
                        sign: "秘"
                      }
                    },
                    card_id: "1",
                    company: "测试",
                    convenornum: 0,
                    duties: "测试",
                    id: 21019,
                    image_url: "/275/7bef8ffcd7dc4954a4c7a3206809fa7a.jpg",
                    isconvenor: 0,
                    isleave: 0,
                    name: "邓海超",
                    phone1: "15621308386",
                    phone2: "1521308386",
                    report_state: 2,
                    report_time: "2020-01-20 10:16",
                    roomnum: "1",
                    sexid: 1,
                    sign_in_state: 0,
                    state: 0
                  },{
                    address: "测",
                    agency_name: "",
                    agency_phone: "",
                    agency_sfz: "",
                    arrive_time: "",
                    attributes: {
                      组别: {
                        color: "",
                        name: "1组（中共、特邀）",
                        sign: ""
                      },
                      角色: {
                        color: "#669966",
                        name: "秘书长",
                        sign: "秘"
                      }
                    },
                    card_id: "1",
                    company: "测试",
                    convenornum: 0,
                    duties: "测试",
                    id: 21019,
                    image_url: "/275/7bef8ffcd7dc4954a4c7a3206809fa7a.jpg",
                    isconvenor: 0,
                    isleave: 0,
                    name: "邓海超",
                    phone1: "15621308386",
                    phone2: "1521308386",
                    report_state: 1,
                    report_time: "2020-01-20 10:16",
                    roomnum: "1",
                    sexid: 1,
                    sign_in_state: 0,
                    state: 0
                  },
              ],
            */
            page: {
                layout: ['prev', 'page', 'next', 'count', 'skip']
            },

            cols: [
                [ //表头
                    {
                        field: 'card_id',
                        title: '编号',
                        width: '7%',
                        //align: 'center',
                        templet: function (data) {
                            return "<a  class = 'tplink' title='"+data.phone1+"'>"+data.card_id+"</a>"
                        },
                        style:'padding-left: 10px'
                    },
                    {
                        field: 'name',
                        title: '姓名',
                        align: 'left',
                    }, {
                        field: 'sexid',
                        title: '性别',
                        align: 'left',
                        width: '7%',
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
                        width: 80,
                        toolbar: '#test-table-operate-state'
                    },
                    {
                        field: 'sign',
                        title: '签到',
                        align: 'left',
                        width: 60,
                        toolbar: '#test-table-operate-sign'
                    },
                    {
                        field: 'address',
                        title: '驻地',
                        align: 'left',
                    },
                    {
                        field: 'roomnum',
                        title: '房间',
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
                                return datas.name
                            } else {
                                return '';
                            }
                        },
                    }, {
                        field: 'isconvenor',
                        title: '召集人',
                        align: 'left',
                    }, {
                        field: 'agency_name',
                        title: '代理人',
                        align: 'left',
                    }, {
                        field: 'report_time',
                        title: '报到时间',
                        align: 'left'
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
                flag = false;
                $("#searchinput").focus();
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
                    maxmin: true,
                    content: 'screening.html',
                    yes: function (index, layero) {
                        var submit = layero.find('iframe').contents().find("#ruleclick");
                        submit.click();
                    }

                    // content: '/gkzytb/franchiser/rigthColumnJsonList'
                });

            },
            download: function(){
                if ($('#select-room').val() == -1) {
                    return layer.msg("请选择会议后再筛选")
                }
                var id = $('#select-room').val();
                window.location="https://f.longjuli.com" + "/excel/personSignin/"+id;
            },
            detailedinfo: function () {
                if ($('#select-room').val() == -1) {
                    return layer.msg("请选择会议后再筛选")
                }
                layer.open({
                    type: 2,
                    title: '详细信息',
                    area: ['60%', '60%'],
                    maxmin: true,
                    //btn: ['确定', '取消'],
                    shadeClose: true, //点击遮罩关闭
                    content: 'detailedinfo.html?id='+$('#select-room').val(),
                    yes: function (index, layero) {
                        var submit = layero.find('iframe').contents().find("#ruleclick");
                        submit.click();
                    },
                    success: function (layero, index) {
                        var body = layui.layer.getChildFrame('body', index);
                        
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
                        q: $('#searchinput').val()
                    },

                    page: {
                        layout: ['prev', 'page', 'next', 'count', 'skip']
                    },

                    cols: [
                        [ //表头
                            {
                                field: 'card_id',
                                title: '编号',
                                width: '7%',
                                //align: 'center',
                                templet: function (data) {
                                    return "<a title='"+data.phone1+"'>"+data.card_id+"</a>"
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
                                width: 80,
                                align: 'left',
                                toolbar: '#test-table-operate-state'
                            },
                            {
                                field: 'sign',
                                title: '签到',
                                align: 'left',
                                width: 60,
                                toolbar: '#test-table-operate-sign'
                            },
                            {
                                field: 'address',
                                title: '房间',
                                align: 'left',
                            },
                            {
                                field: 'roomnum',
                                title: '房间',
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
                                        return datas.name
                                    } else {
                                        return '';
                                    }
                                },
                            }, {
                                field: 'isconvenor',
                                title: '召集人',
                                align: 'left',
                            }, {
                                field: 'agency_name',
                                title: '代理人',
                                align: 'left',
                            }, {
                                field: 'report_time',
                                title: '报到时间',
                                align: 'left',
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
                        flag = false
                        $("#searchinput").val(undefined);
                        $("#searchinput").focus();
                        
                        // layer.close(layer.index); //它获取的始终是最新弹出的某个层，值是由layer内部动态递增计算的
                        // layer.close(index);    //返回数据关闭loading
                    },
                });
            }


        };

        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "H+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        var date = new Date().Format("yyyy-MM-dd HH:mm");
    //监听工具条
    table.on('tool(test-table-operate)', function (obj) {
        var data = obj.data;
        if (obj.event === 'registerPOP') {
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title: '报到',
                shadeClose: false,
                maxmin: true,//弹出框之外的地方是否可以点击
                area: ['100%', '100%'],
                btn: ['报到', '返回'],
                closeBtn: 1,
                //offset: '-43px',
                content: 'register_pop.html?id=' + obj.data.id + "&meetingid=" + $('#select-room').val(),
                success: function (layero, index) {
                    flag = true;
                    console.log(flag);
                    var body = layui.layer.getChildFrame('body', index);
                    body.find("#names").text(obj.data.name);
                    body.find("#id").text(obj.data.card_id);
                    if (obj.data.sexid === 1) {
                        body.find("#sex").text('男');
                    }
                    if (obj.data.sexid === 2) {
                        body.find("#sex").text('女');
                    }
                    if(obj.data.isleave == 0){
                        body.find("#state").text("参会")  
                    }else if(obj.data.isleave == 1){
                        body.find("#state").text("参会") 
                    }
                    body.find("#address").text(obj.data.address)
                    body.find("#datetime").text(date)
                    body.find("#roomid").text(obj.data.roomnum);
                    body.find("#company").text(obj.data.company);
                    body.find("#duties").text(obj.data.duties);
                    if(obj.data.image_url != ""){  var img = "https://f.longjuli.com/upload" + obj.data.image_url
                    body.find("#img").attr("src", img);}
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
                    // var iframe = window['layui-layer-iframe'+index]
                    // iframe.ss();
                },
                yes: function (index, layero) {
                    flag = false
                    $("#searchinput").focus();
                    var submit = layero.find('iframe').contents().find("#click");
                    submit.click();
                   
                },
                cancel: function (index, layero) {
                    flag = false
                    $("#searchinput").focus();
                },
                btn2: function(index, layero){
                    flag = false
                    $("#searchinput").focus();
                  }
            });
        }
    });



    $('.layui-ds').on('click', function () {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });

});