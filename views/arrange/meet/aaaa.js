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

    var seatcolors = ['#ffffff','#b3ffaf','#fffcb6','#ffb2b9','#91dfff'];
    var seatsdata = [];

    var url = setter.baseUrl;
    var seatUrl = setter.seatBaseUrl;

    var uri = window.location.search;
    var str = uri.substr(1);
    var roomtemplateid;
    // window.ruleid = str.substring(str.indexOf("=")+1,str.indexOf("&"));
    // window.meetingid = str.substring(str.lastIndexOf("=")+1)
    // window.roomid = str.substring(str.indexOf("&")+1,str.lastIndexOf("&"))
    // window.newroomid = roomid.substring(roomid.indexOf("=")+1,roomid.length);
    
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
         var uri = window.location.search;
        var r = uri.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2]; return null; //返回参数值
    }
    var meetingid = +getUrlParam("meetingid") || null;
    var roomId = 0;

    if(!meetingid){
        layer.msg("没有获取到会议id");
        return;
    }

    $.ajax({
        url: url+"/meeting/findroomBymeetingid?id=" + meetingid,
        type: "get",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(obj) {
            console.log("findroomBymeetingid-----",data);
            var code = obj.code;
            if(code == 0){
                var data = obj.data || [];
                buildMeetTabHtml(data);
            }else{
                layer.msg("获取会议会议室数据错误");
            }
        },
        error:function(){
            layer.closeAll();
        }
    });


    function buildMeetTabHtml(data){
        var str = [];
        data.forEach(function(item,i){
            if(i == 0){
                str.push('<li id="' + item.roomid + '" class="layui-this">' + item.name + '</li>');

                getRoomTemplateCode(item.roomid);
            }else{
                str.push('<li id="' + item.roomid + '">' + item.name + '</li>');
            }
            
        });
        $(".layui-tab-title").html(str);

        $('.layui-tab-title > li').on('click', function(evt) {
            var roomid = this.id;
            console.log("roomid----",roomid);

            saveSeats();
            
            getRoomTemplateCode(roomid);
        });
    }


    function getRoomTemplateCode(roomid){
        roomId = roomid;

        layer.load(2);
    
        $.ajax({
            url: url+"/roomtemplate/findByIdTemplatecode",
            type: "post",
            async: false,
            xhrFields: {
                withCredentials: true
            },
            data: {
                "id": roomid,
            },
            success: function(obj) {
                console.log("findByIdTemplatecode---",obj);
                var code = obj.code;
                if(code == 0){
                    var datas = obj.data || {};
                    // $("#seatsbody").append(datas.templatecode);
                    $("#seatsbody").html(datas.templatecode);
                    
                    selectSeats();

                    getMeetInfo();

                    if(seatsdata.length == 0){
                        queryAllSeatStatus();
                    }else{
                        changeSeatColor(seatsdata);
                    }
                }else{
                    layer.msg("获取会议室模板错误");
                }
                
                layer.closeAll();
            },
            error:function(){
                layer.closeAll();
            }
        });
    }

    function queryAllSeatStatus(){
        $.ajax({
            async: false,
            type: "get",
            url: seatUrl +"/v1/meetings/show?meeting_id="+meetingid,
            dataType: "json",
            success: function(obj) {
                console.log("--queryAllSeatStatus---");
                dragSortData = null;

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

    
    function getMeetInfo(){
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
            success: function(obj) {
                var code = obj.code;
                if(code == 0){
                    var datas = obj.data || {};
                    $("#meetingname").text(datas[0].name);
                    $("#meetingaddress").text("地点："+datas[0].address);
                    $("#meetingremark").text("备注："+datas[0].memo);
                    $("#meetingtime").text("时间："+datas[0].meetingtime);
                }else{
                    layer.msg("获取会议地址信息错误");
                }
            }
        });
    }

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

    
    
    
    $.ajax({
        type: "get",
        url: seatUrl +"/v1/attributes/color?meeting_id="+meetingid,
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
        url: seatUrl +"/v1/attendees/pending?meeting_id="+meetingid,
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



    





    function importSeatsData(condi){
        $.ajax({
            async: true,
            type: "post",
            data: JSON.stringify(condi),
            contentType: 'application/json', 
            url: seatUrl +"/v1/meetings/sort",
            dataType: "json",
            success: function(obj) {
                console.log("--importSeatsData---",condi);
                if(obj && obj.attendees){
                    seatsdata = obj.attendees;
                    
                    //导入数据是全部的数据，重新获取模板加载人员
                    getRoomTemplateCode(roomId);
                }else{
                    layer.msg("没有可导入的人员数据");
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }

    function setSeatData(data){
        console.log(data)
        $.ajax({
            async: false,
            type: "post",
            data: JSON.stringify(data),
            contentType: 'application/json', 
            url: seatUrl +"/v1/meetings/store",
            dataType: "json",
            success: function(obj) {
                console.log("--setSeatData---",obj);
                if(obj && obj.attendees){
                    //保存完之后，要重新查一下吗
                    queryAllSeatStatus();

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


    
    var groupids = {};

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
            });

            groupids[k] = [];
            obj[k].forEach(function(item){
                groupids[k].push(item.id);
            });
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
            li.push('<h4>' + title + '(<span>' + list.length + '人)</span><a data="' + title + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></h4>')
            li.push('<ul class="list-body">')
            for(var j = 0,len2 = list.length; j < len2; j++){
                var item2 = list[j];
                var name2 = item2.name;
                var id2 = item2.id;
                li.push('<li id="pa_' + id2 + '" >'+name2+'<a id="' + id2 + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></li>');
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
            });
            groupids[k] = [];
            obj[k].forEach(function(item){
                groupids[k].push(item.id);
            });
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
            // li.push('<h4>' + title + '(<span>' + list.length + '</span>人)<a data="' + title + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></h4>')
            li.push('<h4><a data="' + title + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a>' + title + '(<span>' + list.length + '</span>人)</h4>')
            li.push('<ul class="list-body">')
            for(var j = 0,len2 = list.length; j < len2; j++){
                var item2 = list[j];
                var name2 = item2.name;
                var id2 = item2.id;
                // li.push('<li id="pa_' + id2 + '">'+name2+'<a id="' + id2 + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></li>');
                li.push('<li id="pa_' + id2 + '"><a id="' + id2 + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a>'+name2+'</li>');
            }
            li.push('</ul>');
            li.push('</li>');
        }
        $("#notImportList").html(li.join(''));
        
        bindStaffListEvent();
    }
    
    function bindStaffListEvent(){
        $("#askLeaveTitleList>li>h4").unbind('click');
        $("#askLeaveTitleList>li>h4").on("click",function(){
            $(this).addClass('active');
            $("#askLeaveTitleList>li>h4").not(this).removeClass('active');
            var next = $(this).next();
            next.slideToggle('fade');
            $('#askLeaveTitleList .list-body').not(next).slideUp('fast');
            return false;
        });
        $("#notImportList>li>h4").unbind('click');
        $("#notImportList>li>h4").on("click",function(){
            $(this).addClass('active');
            $("#notImportList>li>h4").not(this).removeClass('active');
            var next = $(this).next();
            next.slideToggle('fade');
            $('#notImportList .list-body').not(next).slideUp('fast');
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
                console.log("ondragend-----------------",evt,this.id);
                
                unbindStaffDrap();
                if($(".R99").length > 0){
                    var id = $(".R99").attr("id");
                    $(".R99").removeClass("R99");

                    var condi = {};
                    condi.meeting_id = meetingid;
                    condi.room_id = +roomId;
                    condi.seat_id = id;

                    var pid = this.id;

                    if(!pid){
                        //组拖拽
                        var pkey = $(this).attr("data");
                        condi.attendee_ids = groupids[pkey];
                    }else{
                        condi.attendee_ids = [+pid];
                    }
                    console.log(id,pid,condi);
                    saveDragSort(condi);
                }
            }
        });
    
    }

    function dragSaveChangeStaffHtml(attendees){
        var ids = [];
        attendees.forEach(function(item){
            var id = item.id;
            ids.push("#pa_"+id);
        });
        $(ids.join(",")).addClass("drag-hide");

        
        //如果组下面没人员了 隐藏组
        $('#askLeaveTitleList > li').each(function(item){
            var list = this.find(".list-body");
            var len = list.children("li:not(.drag-hide)").length;

            list.prev().find("span").html(len);
            if(len == 0){
                this.hide();
            }
        });
        $('#notImportList > li').each(function(){
            var list = $(this).find(".list-body");
            var len = list.children("li:not(.drag-hide)").length;
            list.prev().find("span").html(len);
            if(len == 0){
                $(this).hide();
            }
        });
    }


    dragSortData=null;

    function saveDragSort(data){
        $.ajax({
            type: "post",
            url: seatUrl +"/v1/meetings/drag_sort",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            success: function(obj) {
                console.log("pending-----",obj)
                // getAskLeaveData(obj.leave);
                // getNotImportData(obj.pending);
                if(obj && obj.attendees){
                    dragSortData = obj.attendees;

                    changeDragSeatColor(obj.attendees);

                    dragSaveChangeStaffHtml(obj.attendees);
                }
            },
            error:function(obj){
                layer.msg(obj.responseJSON.msg || "drag_sort--error");
                console.log("drag_sort--error",obj.responseJSON.msg)
            }
        });
    }

    function changeDragSeatColor(attendees){
        if(attendees.length > 0){
            // serverSeatIds = [];
            for(var i = 0,len = attendees.length; i < len; i++){
                // {"seatid":"1-1","attender":"028","id":"39"}
                var item = attendees[i] || {};
                //多会场判断只加载当前会议室的数据
                if(item.roomtemplate_id == roomId){

                    $("#" + item.seatid).css("background-color",item.bgcolor);
                    $("#" + item.seatid).html(item.attender);
                    // serverSeatIds.push(item.seatid);
                }
            }
        }
    }

    function cancelDragSort(){
        var attendees = dragSortData;
        if(attendees && attendees.length > 0){
            // serverSeatIds = [];
            for(var i = 0,len = attendees.length; i < len; i++){
                // {"seatid":"1-1","attender":"028","id":"39"}
                var item = attendees[i] || {};

                $("#" + item.seatid).css("background-color","");
                $("#" + item.seatid).html(item.seatid.split('-')[1]);
                
                $("#pa_" + item.id).removeClass("drag-hide");
            }

            //如果组下面没人员了 隐藏组
            $('#askLeaveTitleList > li').each(function(item){
                var list = this.find(".list-body");
                var len = list.children("li:not(.drag-hide)").length;
                list.prev().find("span").html(len);
                if(len > 0){
                    this.show();
                }
            });
            $('#notImportList > li').each(function(){
                var list = $(this).find(".list-body");
                var len = list.children("li:not(.drag-hide)").length;
                list.prev().find("span").html(len);
                if(len > 0){
                    $(this).show();
                }
            });
        }
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
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){

                        $("#" + item.seatid).css("background-color",item.bgcolor);
                        $("#" + item.seatid).html(item.attender);
                        
                        serverSeatIds.push(item.seatid);
                    }
                }
            }else{
                var colorsids = [];
                attendees.forEach(function(item){
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){
                        var colors = item.colors;
                        var cid = colors[ruleselect];
                        if(colorsids.indexOf(cid) == -1){
                            colorsids.push(cid);
                        }
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
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){
                        var colors = item.colors;
                        var cid = colors[ruleselect];
                        var cc = colorsobj[cid];
                        $("#" + item.seatid).css("background-color",cc);
                    }
                });
            }
        }
    }

    function saveSeats(){
        
        var seats = $("#seatcontainerId .seatdiv");
        var seatsobj = {
            meeting_id: +meetingid,
            attendees:[]
        };

        var ids = {};
        var names = {};
        seatsdata.forEach(function(item){
            if(item.roomtemplate_id == roomId){
                ids[item.seatid] = item.id;
                names[item.seatid] = item.attender;
            }else{
                //其它会议室的数据
                seatsobj.attendees.push(item);
            }
        });
        if(dragSortData){
            dragSortData.forEach(function(item){
                if(item.roomtemplate_id == roomId){
                    ids[item.seatid] = item.id;
                    names[item.seatid] = item.attender;
                }else{
                    //其它会议室的数据
                    seatsobj.attendees.push(item);
                }
            });
        }
        // console.log(ids,names)

        seats.each(function(){
            var name = $(this).text() || "";
            var reg = /^\d+/g;
            var id = this.id;
            if(name != "" && !reg.test(name)){
                if(ids[id]){
                    //如果座位的id, 在人员数据里面, 说明这个人员不是新增的
                    if(names[id] == name){
                        seatsobj.attendees.push({id:ids[id],attender:name,seatid:id,roomtemplate_id:+roomId});
                    }else{
                        //挪动名字之后  原来的位置名字跟id对不上，就没传id
                        seatsobj.attendees.push({attender:name,seatid:id,roomtemplate_id:+roomId});
                    }
                }else{
                    // 新加名字  或者 挪动
                    var sid = $(this).attr("sid");
                    if(ids[sid]){
                        // 挪动名字需要把原来的id带回去
                        seatsobj.attendees.push({id:ids[sid],attender:name,seatid:id,roomtemplate_id:+roomId});
                    }else{
                        // 右键添加名字没有id
                        seatsobj.attendees.push({attender:name,seatid:id,roomtemplate_id:+roomId});
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
    
    // $('#upload-file').on('change', function() {
    //     var fileName = $("#upload-file").val();
    //     var fileType = fileName.substr(fileName.lastIndexOf(".")).toLowerCase();
    //     console.log(fileType);
    //     if(fileType!=".docx" && fileType!=".doc"){
    //         /* alert("上传模板类型错误！") */
    //         console.log("上传模板类型错误！");
    //         return false;
    //     }else {
    //         var file = document.getElementById("upload-file").files[0];
    //         uploads(meetingid,roomId,file);
    //     }
    // });
    upload.render({
        elem: '#nav-upload'
        , url:  url+"/wordtemplate/uploadWordTemplate",
        data:{
            "meetingid":meetingid,
            "roomtemplateid":roomId

        },
        // auto: false,
        exts: 'doc|docx',
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
            if (res.code == 200) {
               parent.layer.msg(res.msg)
            }
        }
    });
    
    // function uploads(meetingid,newroomid,file){
    //     var formData = new FormData();
    //     console.log(meetingid+","+newroomid+","+file);
    //     formData.append("meetingid",meetingid);
    //     formData.append("roomtemplateid",roomId);
    //     formData.append("file",file);
    //     $.ajax({
    //         url: url+"/wordtemplate/uploadWordTemplate",
    //         type:"post",
    //         data:formData,
    //         contentType: false,
    //         processData: false,
    //         success:function(data){
    //             if(data.code == 200){
    //                 layer.msg("word模板上传成功！")
    //                 console.log(data);
    //             }
    //         }
    //     })
    // }
    
    var __handDrag = null;
    var inde = false;
    var inde1 = false;

    active = {
        revertbtn:function(){
            console.log("revertbtn------");
            cancelDragSort();
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
                $("#leavebtn img").attr("src","../../../images/leave.svg");
            }else{
                $("#leavebtn img").attr("src","../../../images/Closedleave.svg");
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
                $("#importedbtn img").attr("src","../../../images/user-group.svg");
            }else{
                $("#importedbtn img").attr("src","../../../images/Closeduser-group.svg");
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
                content: '../attender2rule/attender2rule.html?meetingid='+meetingid,
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
            window.location=seatUrl +"/v1/wordtemplates/download?meeting_id="+meetingid+"&roomtemplate_id="+roomId;
            // layer.open({
            //     type: 2,
            //     title: "下载模板列表",
            //     shadeClose: false,
            //     area: ['50%', '55%'],
            //     btn: ['确定', '取消'],
            //     closeBtn: 1,
            //     content: 'template_download.html',
            //     success: function(layero, index){
            //         // 获取子页面的iframe
            //         var iframe = window['layui-layer-iframe' + index];
            //         // 向子页面的全局函数child传参
            //         console.log(meetingid);
            //         iframe.init(meetingid,roomId);
            //     },
            //     yes: function(index, layero) {
            //
            //         /* var url = "http://127.0.0.1:8083"; */
            //         var body = layer.getChildFrame('body', index);
            //         var wordid = body.find('#wordDown').val();
            //         var wordname = body.find('#wordDown option:selected').text().split('-') || [];
            //         wordname = wordname[0] || "";
            //         if(wordid==''||wordid==null)
            //         {return layer.msg("请选择word模板");}
            //         console.log("meetignid="+meetingid+",wordid="+wordid);
            //         window.location="https://f.longjuli.com" + "/word/download/"+meetingid+"?wordTemplateid="+wordid;
            //     }
            // })
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








