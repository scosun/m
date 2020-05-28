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

    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });

    
    
   

    var str = '<li class="layui-this">***主席台</li><li >主席台123</li><li >主席台4444</li>'
    $(".layui-tab-title").html(str);

    $('.layui-tab-title > li').on('click', function(title) {
        // console.log(111111111,title,$(this).text())
        // console.log(title.toElement.textContent)
    });


    /*右侧菜单HOVER显示提示文字*/
    var subtips;
    $('.layui-right-nav i').each(function(){
        var _id = $(this).attr('id');
        var _data = $(this).attr('data');
        $("#" + _id).hover(function() {
            openMsg();
        }, function() {
            if(subtips){
                layer.close(subtips);
            }
        });
        function openMsg() {
            subtips = layer.tips(_data, '#'+_id,{tips:[3,'#666'],time: 30000});
        }
    })
    /*右侧菜单HOVER显示提示文字 end*/

    var url = setter.baseUrl;
    var uri = window.location.search;
    var str = uri.substr(1);
    window.ruleid = str.substring(str.indexOf("=")+1,str.indexOf("&"));
    window.meetingid = str.substring(str.lastIndexOf("=")+1)
    window.roomid = str.substring(str.indexOf("&")+1,str.lastIndexOf("&"))
    window.newroomid = roomid.substring(roomid.indexOf("=")+1,roomid.length)
    
    var seatcolors = ['#ffffff','#b3ffaf','#fffcb6','#ffb2b9','#91dfff'];
    var seatsdata = [];

    /*右侧菜单HOVER显示提示文字 end*/
    layer.load(2);
    
    $.ajax({
        url: url+"/roomtemplate/findByIdTemplatecode",
        type: "post",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        data: {
            "id": newroomid,
            
        },
        success: function(data) {
            var datas = data.data
            $("#seatsbody").append(datas.templatecode);
            
            selectSeats();

            var condi = {
                "meeting_id": +meetingid
            };

            // importSeatsData(condi);
            queryAllSeatStatus();
            layer.closeAll();
        },
        error:function(){
            layer.closeAll();
        }
    });
    $.ajax({
        url: url+"/meeting/findByMeeting",
        type: "get",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        data: {
            "id": meetingid,
            
        },
        success: function(data) {
            var datas = data.data
            
            $("#meetingname").text(datas[0].name);
            $("#meetingaddress").text("地点："+datas[0].address);
            $("#meetingremark").text("备注："+datas[0].memo);
            $("#meetingtime").text("时间："+datas[0].meetingtime);
            
            // selectSeats();

            // var condi = {
            // 	"meeting_id": +meetingid
            // };
            // importSeatsData(condi);
            // queryAllSeatStatus(roomid, ruleid);
        }
    });

    $.ajax({
        type: "get",
        url: "https://m.longjuli.com/v1/attributes/color?meeting_id="+meetingid,
        dataType: "json",
        success: function(obj) {
            var data = obj.data || [];
            if(data && data.length > 0){
                $.each(data, function (index, item) {
                    $('#ruleselect').append(new Option(item.name, item.id));// 下拉菜单里添加元素
                });
                layui.form.render("select");
            }
        }
    });
    
    $.ajax({
        type: "get",
        url: "https://m.longjuli.com/v1/attendees/pending?meeting_id="+meetingid,
        dataType: "json",
        success: function(obj) {
            console.log("pending-----",obj)
            getAskLeaveData(obj.leave);
            getNotImportData(obj.pending);
        }
    });

    form.on('select(component-ruleselect)', function(data){
        var id = +data.value;
        // meetingId = id;
        // getRuleSetups(id);
        changeSeatColor(seatsdata);
    });



    function queryAllSeatStatus(){
        $.ajax({
            async: false,
            type: "get",
            url: "https://m.longjuli.com/v1/meetings/show?meeting_id="+meetingid,
            dataType: "json",
            success: function(obj) {
                console.log("--queryAllSeatStatus---");
                if(obj && obj.attendees){
                    seatsdata = obj.attendees;
                    changeSeatColor(obj.attendees);
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }

    function importSeatsData(condi){
        $.ajax({
            async: true,
            type: "post",
            data: JSON.stringify(condi),
            contentType: 'application/json', 
            url: "https://m.longjuli.com/v1/meetings/sort",
            dataType: "json",
            success: function(obj) {
                console.log("--importSeatsData---",condi);
                if(obj && obj.attendees){
                    seatsdata = obj.attendees;
                    changeSeatColor(obj.attendees);
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }

    function setSeatData(data){
        // console.log(data)
        $.ajax({
            async: false,
            type: "post",
            data: JSON.stringify(data),
            contentType: 'application/json', 
            url: "https://m.longjuli.com/v1/meetings/store",
            dataType: "json",
            success: function(obj) {
                console.log("--setSeatData---",obj);
                if(obj && obj.attendees){
                    layer.msg("保存成功");
                }else{
                    layer.msg("保存错误");
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }


    
    //获取请假人员列表
    function getAskLeaveData(obj){
        // console.log(data)
        // var data = [
        //     {
        //         title:"特邀出席领导同志",
        //         list:[
        //             {id:1,name:"张三1"},
        //             {id:2,name:"张三2"},
        //             {id:3,name:"张三3"},
        //             {id:4,name:"张三4"},
        //             {id:5,name:"张三5"}
        //         ]
        //     },
        //     {
        //         title:"1组",
        //         list:[
        //             {id:1,name:"张三1"},
        //             {id:2,name:"张三2"},
        //             {id:3,name:"张三3"},
        //             {id:4,name:"张三4"},
        //             {id:5,name:"张三5"}
        //         ]
        //     }
        // ];
        var data = [];
        for(var k in obj){
            data.push({
                title:k,
                list:obj[k]
            })
        }
        

        addAskLeaveHtml(data);

    }
    function addAskLeaveHtml(data){

        var li = [];
        for(var i = 0,len = data.length; i < len; i++){
            var item = data[i] || {}
            var title = item.title;
            var list = item.list;
            li.push('<li>');
            li.push('<h4>' + title + '(' + list.length + '人)<a class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></h4>')
            li.push('<ul class="list-body">')
            for(var j = 0,len2 = list.length; j < len2; j++){
                var item2 = list[j];
                var name2 = item2.name;
                var id2 = item2.id;
                li.push('<li>'+name2+'<a id="' + id2 + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></li>');
            }
            li.push('</ul>');
            li.push('</li>');
        }
        $("#askLeaveTitleList").html(li.join(''));
        
        bindStaffListEvent();
    }
    
    //获取未导入人员列表
    function getNotImportData(obj){
        // console.log(data)
        // var data = [
        //     {
        //         title:"特邀出席领导同志",
        //         list:[
        //             {id:1,name:"李四1"},
        //             {id:2,name:"李四2"},
        //             {id:3,name:"李四3"},
        //             {id:4,name:"李四4"},
        //             {id:5,name:"李四5"}
        //         ]
        //     },
        //     {
        //         title:"2组",
        //         list:[
        //             {id:1,name:"李四1"},
        //             {id:2,name:"李四2"},
        //             {id:3,name:"李四3"},
        //             {id:4,name:"李四4"},
        //             {id:5,name:"李四5"}
        //         ]
        //     }
        // ];

        var data = [];
        for(var k in obj){
            data.push({
                title:k,
                list:obj[k]
            })
        }

        addNotImportHtml(data);
    }
    function addNotImportHtml(data){

        var li = [];
        for(var i = 0,len = data.length; i < len; i++){
            var item = data[i] || {}
            var title = item.title;
            var list = item.list;
            li.push('<li>');
            li.push('<h4>' + title + '(' + list.length + '人)<a class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></h4>')
            li.push('<ul class="list-body">')
            for(var j = 0,len2 = list.length; j < len2; j++){
                var item2 = list[j];
                var name2 = item2.name;
                var id2 = item2.id;
                li.push('<li>'+name2+'<a id="' + id2 + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></li>');
            }
            li.push('</ul>');
            li.push('</li>');
        }
        $("#notImportList").html(li.join(''));
        
        bindStaffListEvent();
    }
    
    function bindStaffListEvent(){
        $(".float-right-list>li>h4").unbind('click');
        $(".float-right-list>li>h4").on("click",function(){
            $(this).addClass('active');
            $(".float-right-list>li>h4").not(this).removeClass('active');
            var next = $(this).next();
            next.slideToggle('fade');
            $('.list-body').not(next).slideUp('fast');
            return false;
        });

        var dragStaff = document.querySelectorAll(".drag-staff");
        dragStaff.forEach(function(item){
            item.ondragstart = function(evt){
                // evt.preventDefault();
                // evt.stopPropagation();
                console.log("dragstart-----------------")
                bindStaffDrap();
                // return false;
            }
            item.ondragend = function(evt){
                console.log("ondragend-----------------",evt,this);
                unbindStaffDrap();
                if($(".R99").length > 0){
                    var id = $(".R99").attr("id");
                    var pid = $(this).attr("id");
                    console.log(id,pid);
                    $(".R99").removeClass("R99");
                }
            }
        });
    
    }


    window.serverSeatIds = [];
    function changeSeatColor(attendees){
        if(attendees.length > 0){
            var ruleselect = $("#ruleselect").val() - 0;
            serverSeatIds = [];
            if(ruleselect == 1){
                for(var i = 0,len = attendees.length; i < len; i++){
                    // {"seatid":"1-1","attender":"028","id":"39"}
                    var item = attendees[i] || {};
                    
                    $("#" + item.seatid).css("background-color",item.bgcolor);
                    $("#" + item.seatid).html(item.attender);

                    serverSeatIds.push(item.seatid);
                }
            }else{
                var colorsids = [];
                attendees.forEach(function(item){
                    var colors = item.colors;
                    var cid = colors[ruleselect];
                    if(colorsids.indexOf(cid) == -1){
                        colorsids.push(cid);
                    }
                });
                var colorsobj = {};
                var cli = 0;
                colorsids.forEach(function(item){
                    colorsobj[item] = seatcolors[cli];
                    cli++;
                    if(cli==5){
                        cli=0;
                    }
                });

                attendees.forEach(function(item){
                    var colors = item.colors;
                    var cid = colors[ruleselect];
                    var cc = colorsobj[cid];
                    $("#" + item.seatid).css("background-color",cc);
                });
            }
        }
    }

    function saveSeats(){
        var seats = $("#seatcontainerId .seatdiv");
        var seatsobj = {
            meeting_id: +meetingid,
            attendees:[]
        }
        var ids = {};
        var names = {};
        seatsdata.forEach(function(item){
            ids[item.seatid] = item.id;
            names[item.seatid] = item.attender;
        });
        // console.log(ids,names)

        seats.each(function(){
            var name = $(this).text() || "";
            var reg = /^\d+/g;
            var id = this.id;
            if(name != "" && !reg.test(name)){
                if(ids[id]){
                    if(names[id] == name){
                        seatsobj.attendees.push({id:ids[id],attender:name,seatid:id});
                    }else{
                        //挪动名字之后  原来的位置名字跟id对不上，就没传id
                        seatsobj.attendees.push({attender:name,seatid:id});
                    }
                }else{
                    // 新加名字  或者 挪动
                    var sid = $(this).attr("sid");
                    if(ids[sid]){
                        // 挪动名字需要把原来的id带回去
                        seatsobj.attendees.push({id:ids[sid],attender:name,seatid:id});
                    }else{
                        // 右键添加名字没有id
                        seatsobj.attendees.push({attender:name,seatid:id});
                    }
                }
            }
        });
        /*
        座区图保存规则
        1.当名字和位置都没有变化，传递原来的id,name,seatid;
        2.当把名字挪动到其它空白位置，不修改原来的名字，传递名字原来的座位id,name,新的seatid;
        3.当修改座位上原有名字（直接拖拽其它座区名字覆盖当前名字和通过右键改名字），传递新的name 和 seatid;
        4.当使用右键在空间座区添加新名字，传递新建的name 和 seatid
        ps: 当前的座区图不支持交换操作，如需交换 可以 先把名字拖拽到空白座区，然后再做交换。
        */
        setSeatData(seatsobj);
    }
    /**
     * 打印局部div
     * @param printpage 局部div的ID
     */
    function printdiv(printpage) {
        // var headhtml = "<html><head><title></title></head><body>";
        // var foothtml = "</body>";
        // // 获取div中的html内容
        // // var newhtml = document.all.item(printpage).innerHTML;
        // // 获取div中的html内容，jquery写法如下
        // var newhtml= $("#" + printpage).html();

        // // 获取原来的窗口界面body的html内容，并保存起来
        // var oldhtml = document.body.innerHTML;

        // // 给窗口界面重新赋值，赋自己拼接起来的html内容
        // document.body.innerHTML = headhtml + newhtml + foothtml;
        // // 调用window.print方法打印新窗口
        // window.print();

        // // 将原来窗口body的html值回填展示
        // document.body.innerHTML = oldhtml;
        // return false;
    }
    
    //上传模板文件的类型判断
    /* function uploadFile(){
        var fileName = $("#upload-file").val();
        var fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
        console.log(fileType);
        if(fileType!=".docx" && fileType!=".doc"){
            alert("上传模板类型错误！")
            console.log("上传模板类型错误！");
            return false;
        }else {
            var file = document.getElementById("upload-file").files[0];
            upload(meetingid,newroomid,file);
        }
    } */
    
    $('#upload-file').on('change', function() {
        var fileName = $("#upload-file").val();
        var fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
        console.log(fileType);
        if(fileType!=".docx" && fileType!=".doc"){
            /* alert("上传模板类型错误！") */
            console.log("上传模板类型错误！");
            return false;
        }else {
            var file = document.getElementById("upload-file").files[0];
            upload(meetingid,newroomid,file);
        }
    });
    
    function upload(meetingid,newroomid,file){
        var formData = new FormData();
        console.log(meetingid+","+newroomid+","+file);
        formData.append("meetingid",meetingid);
        formData.append("roomtemplateid",newroomid);
        formData.append("file",file);
        $.ajax({
            url:"https://f.longjuli.com/wordtemplate/uploadWordTemplate",
            type:"post",
            data:formData,
            contentType: false,
            processData: false,
            success:function(data){
                if(data.code == 200){
                    layer.msg("word模板上传成功！")
                    console.log(data);
                }
            }
        })
    }
    
    var __handDrag = null;
    var inde = false;
    var inde1 = false;

    active = {
        revertbtn:function(){
            console.log("revertbtn------");
        },
        askLeave: function() {
            if (!inde) {
                setTimeout(function(){
                    $('#nav-showaskLeave').hide();
                    $('#nav-ClosedaskLeave').show();
                }, 100);
                $('#askLeave').show();
                inde = true;
            } else {
                setTimeout(function(){
                    $('#nav-showaskLeave').show();
                    $('#nav-ClosedaskLeave').hide();
                }, 100);
                $('#askLeave').hide();
                inde = false;
            }
            if(inde){
                $("#leavebtn img").attr("src","../../../images/showlist.svg");
            }else{
                $("#leavebtn img").attr("src","../../../images/Closedlist.svg");
            }
        },
        notImport: function() {
            if (!inde1) {
                setTimeout(function(){
                    $('#nav-shownotImport').hide();
                    $('#nav-ClosednotImport').show();
                }, 100);
                $('#notImport').show();
                inde1 = true;
            } else {
                setTimeout(function(){
                    $('#nav-shownotImport').show();
                    $('#nav-ClosednotImport').hide();
                }, 100);
                $('#notImport').hide();
                inde1 = false;
            }
            if(inde1){
                $("#importedbtn img").attr("src","../../../images/showlist.svg");
            }else{
                $("#importedbtn img").attr("src","../../../images/Closedlist.svg");
            }
        },
        dragcontainer:function(){
            if(__handDrag){
                __handDrag = null;
                $('#seatcontainer').unbind('mousedown');
                $('#seatcontainer').unbind('mouseup');
                $('#seatcontainer').unbind('mousemove');
                $('.toollist_li').removeClass("on");
                $("#nav-selection").addClass("on");
                selectSeats();
            }else{
                removeContainerEvent();
                __handDrag = new Drag();
            }
        },
        parallelism:function(){
            layer.open({
                type: 2,
                //title: '收藏管理 (考生姓名：张无忌)',
                title:false,
                shadeClose: false, //弹出框之外的地方是否可以点击
                area: ['100%', '100%'],
                closeBtn: 1,
                closeBtn: false,
                offset: '0',
                content: '../attender2rule/attender2rule.html',
                success: function(layero, index) {
                    // var body = layui.layer.getChildFrame('body', index);
                    // var roomid;
                    // // 取到弹出层里的元素，并把编辑的内容放进去
                    // body.find("#ruleid").val(data.id);
                    // body.find("#roomid").val(data.roomid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
                }
            });
        },
        word:function(){
            /* window.location="https://f.longjuli.com" + "/word/download/"+meetingid; */
            layer.open({
                type: 2,
                title: "下载模板列表",
                shadeClose: false,
                area: ['50%', '55%'],
                btn: ['确定', '取消'],
                closeBtn: 1,
                content: 'template_download.html',
                success: function(layero, index){
                    // 获取子页面的iframe
                    var iframe = window['layui-layer-iframe' + index];
                    // 向子页面的全局函数child传参
                    console.log(meetingid);
                    iframe.init(meetingid,newroomid);
                },
                yes: function(index, layero) {
                    
                    /* var url = "http://127.0.0.1:8083"; */
                    var url = "https://f.longjuli.com";
                    var body = layer.getChildFrame('body', index);
                    var wordid = body.find('#wordDown').val();
                    var wordname = body.find('#wordDown option:selected').text().split('-') || [];
                    wordname = wordname[0] || "";
                    if(wordid==''||wordid==null)
                    {return layer.msg("请选择word模板");}
                    console.log("meetignid="+meetingid+",wordid="+wordid);
                    window.location="https://f.longjuli.com" + "/word/download/"+meetingid+"?wordTemplateid="+wordid;
                }
            })
        },
        importData: function() {
            var condi = {
                "meeting_id": +meetingid
            };
            importSeatsData(condi);
        },
        bindLockSeats:function(){
            bindLockSeats();
        },
        selectSeats:function(){
            selectSeats();
        },
        dragSeats:function(){
            dragSeats();
        },
        bindOneSeats:function(){
            bindOneSeats();
        },
        bindContextMenu:function(){
            bindContextMenu();
        },
        removeContextMenu:function(){
            removeContextMenu();
        },
        print:function(){
            // printJS('seatcontainer', 'html');
            // printdiv("seatcontainer");
            $("#seatcontainer").jqprint({
                debug: false, 
                importCSS: true, 
                printContainer: true, 
                operaSupport: false
            });
        },
        saveseats:function(){
            saveSeats();
        },
        upload:function() {
            $("#upload-file").trigger("click");
        },
        close: function() {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭 
            // parent.reloads()
        }
    };

    $('.layui-right-nav i').on('click', function() {
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
    });


    
    function Drag(){
        this.dragWrap = $("#seatcontainer");
        this.init.apply(this,arguments);
    };
    Drag.prototype = {
        constructor:Drag,
        _dom : {},
        _x : 0,
        _y : 0,
        _top :0,
        _left: 0,
        move : false,
        down : false,
        init : function () {
            this.bindEvent();
        },
        bindEvent : function () {
            var t = this;
            $('#seatcontainer').bind('mousedown',function(e){
                e && e.preventDefault();
                if ( !t.move) {
                    t.mouseDown(e);
                }
            });
            $('#seatcontainer').bind('mouseup',function(e){
                t.mouseUp(e);
            });

            $('#seatcontainer').bind('mousemove',function(e){
                if (t.down) {
                    t.mouseMove(e);
                }
            });
        },
        mouseMove : function (e) {
            e && e.preventDefault();
            this.move = true;
            var x = this._x - e.clientX,
                y = this._y - e.clientY,
                dom = document.documentElement;
            dom.scrollLeft = (this._left + x);
            dom.scrollTop = (this._top + y);
        },
        mouseUp : function (e) {
            e && e.preventDefault();
            this.move = false;
            this.down = false;
            this.dragWrap.css('cursor','');
        },
        mouseDown : function (e) {
            this.move = false;
            this.down = true;
            this._x = e.clientX;
            this._y = e.clientY;
            this._top = document.documentElement.scrollTop;
            this._left = document.documentElement.scrollLeft;
            // console.log(this._top,this._left)
            this.dragWrap.css('cursor','move');
        }
    };
});








