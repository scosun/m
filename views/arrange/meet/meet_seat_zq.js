// var indexs = 0;

layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index',//主入口模块
    // soulTable: '/sourtable/soulTable',
    // tableFilter: '/sourtable/tableFilter',
    // excel: '/sourtable/excel',
    // tableChild: '/sourtable/tableChild',
    // tableMerge: '/sourtable/tableMerge'
}).use(['index', 'form', 'upload'], function () {
    // var a = {};
    // var b = {};
    var $ = layui.$,
        setter = layui.setter,
        form = layui.form,
        layer = layui.layer,
        upload = layui.upload,
        router = layui.router();

    $('.layui-ds,.layui-right-nav i').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this,arguments);
    });

    var seatMapsControl = new SeatMapsControl();

    var url = setter.baseUrl;
    var seatUrl = setter.seatBaseUrl;

    function getUrlParam(name) {
        //构造一个含有目标参数的正则表达式对象
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var uri = window.location.search;
        //匹配目标参数
        var r = uri.substr(1).match(reg);
        //返回参数值
        if (r != null) return r[2]; return null;
    }
    var meetingid = +getUrlParam("meetingid") || null;
    // var meetingname = getUrlParam("name") || null;


    var roomId = 0;
    var ruleId = 0;


    // var uri = window.location.search;
    // var str = uri.substr(1);
    // var roomtemplateid;


    if(!meetingid){
        layer.msg("没有获取到会议id");
        return;
    }

    var seatcolors = ['#ffffff','#b3ffaf','#fffcb6','#ffb2b9','#91dfff'];
    // 座区数据
    var showSeatsData = [];

    // 规则数据
    var showRuleData = [];

    var dragSortData=[];

    $.ajax({
        type: "get",
        url: seatUrl +"/v1/attributes/color?meeting_id="+meetingid,
        dataType: "json",
        success: function(obj) {
            var data = obj.data || [];
            if(data && data.length > 0){
                $.each(data, function (index, item) {
                    // 下拉菜单里添加元素
                    $('#ruleselect').append(new Option(item.name, item.id));
                });
                layui.form.render("select");
            }
        }
    });

    layer.load(2);
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



    upload.render({
        elem: '#nav-upload',
        url:  url+"/wordtemplate/uploadWordTemplate",
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

    $("#nav-uploadseat").bind("click",function(evt){
        evt.preventDefault();
        evt.stopPropagation();
        return false;
    });

    upload.render({
        elem: '#nav-uploadseat',
        url:  seatUrl + "/v1/wordtemplates/import?meeting_id=" + meetingid + "&roomtemplate_id=" + roomId,
        // auto: false,
        exts: 'doc|docx',
        before:function(){
            layer.load(2);
        },
        done: function (res) {
            layer.closeAll();
            // console.log(res)
            if(res.status == 0){
                layer.msg('上传成功');
                queryAllSeatStatusByShow();
                // $("#filepath").html(res.PATH.replace("/ADMINM/uploadFiles/file",""));
                // filePath = res.PATH;
                // if(!isEdit){
                //     fileId = res.ID;
                // }
            }else{
                layer.msg('上传失败');
            }
        }
    });


    function buildMeetTabHtml(data){
        var str = [];
        data.forEach(function(item,i){
            if(i == 0){
                str.push('<li id="' + item.roomid + '_' + item.ruleid +'" class="layui-this">' + item.name + '</li>');

                getRoomTemplateCode(item.roomid,item.ruleid);
            }else{
                str.push('<li id="' + item.roomid + '_' + item.ruleid + '">' + item.name + '</li>');
            }
        });
        $(".layui-tab-title").html(str);

        $('.layui-tab-title > li').on('click', function(evt) {
            var ids = this.id.split('_');
            var roomid = ids[0];
            var ruleid = ids[1];

            console.log("roomid----",roomid);

            saveSeats();

            getRoomTemplateCode(roomid,ruleid);
        });
    }

    function getRoomTemplateCode(roomid,ruleid){
        roomId = roomid;
        ruleId = ruleid;

        queryAllSeatStatus(roomid,ruleid);

        layer.load(2);
        $.ajax({
            url: url+"/roomtemplate/findByIdTemplatecode",
            type: "post",
            async: true,
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
                    datas.templatecode = datas.templatecode.replace('style="position: fixed;left: 25px;top: 15px;"','style="position: fixed;left: 25px;top: 125px;"')

                    $("#seatsbody").html(datas.templatecode);

                    // 激活框选功能
                    seatMapsControl.selectSeats();

                    //获取 会议 名称
                    getMeetInfo();

                    if(showSeatsData.length == 0){
                        // 初始化没有数据，查询show接口查名字
                        queryAllSeatStatusByShow();
                    }else{
                        changeSeatColor(showSeatsData);
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


    function queryAllSeatStatus(roomid, ruleid) {
        var data = {};
        data.action = "s";
        data.ruletemplateid= ruleid;
        data.roomtemplateid = roomid;

        $.ajax({
            type: "get",
            url: url+"/rulesetup/show",
            data: data,
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            success: function(data) {
                var datas = data.data;
                if (datas && datas instanceof Array) {
                    showRuleData = datas;
                    // setSeatStatus(datas);
                }
            }
        });
    }

    function getMeetInfo(){
        $.ajax({
            url: url+"/meeting/findByMeeting",
            type: "get",
            async: true,
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
                    $("#meetingname2").html(datas[0].name);
                    $("#meetingaddress").text("地点："+datas[0].address);
                    $("#meetingremark").text("备注："+datas[0].memo);
                    $("#meetingtime").text("时间："+datas[0].meetingtime);
                }else{
                    layer.msg("获取会议地址信息错误");
                }
            }
        });
    }

    function queryAllSeatStatusByShow(){
        $.ajax({
            async: true,
            type: "get",
            url: seatUrl +"/v1/meetings/show?meeting_id="+meetingid,
            dataType: "json",
            success: function(obj) {
                console.log("--queryAllSeatStatusByShow---");
                // 清空拖拽排序的数据
                dragSortData = [];

                if(obj && obj.attendees){
                    // 保存show接口返回的人名数据
                    showSeatsData = obj.attendees || [];

                    changeSeatColor(obj.attendees);
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }

    // window.serverSeatIds = [];
    function changeSeatColor(attendees){
        // debugger
        if(attendees.length > 0){

            $("#nav-uploadseat").hide();
            $("#nav-uploadseatbtn").show();


            var ruleselect = $("#ruleselect").val() || "";
            // serverSeatIds = [];

            if(ruleselect == ""){
                for(var i = 0,len = attendees.length; i < len; i++){
                    // {"seatid":"1-1","attender":"028","id":"39"}
                    var item = attendees[i] || {};
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){
                        $("#" + item.seatid).css("background-color","");
                        $("#" + item.seatid).html(item.attender);
                    }
                }
            }else if(ruleselect == 1){
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
            }else{
                var colorsids = [];
                attendees.forEach(function(item){
                    //多会场判断只加载当前会议室的数据
                    if(item.roomtemplate_id == roomId){
                        var colors = item.colors || {};
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
        }else{
            $("#nav-uploadseat").show();
            $("#nav-uploadseatbtn").hide();

            var seats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
            seats.css("background-color","");
            seats.each(function(){
                var ids = $(this).attr("id").split("-");
                $(this).text(ids[3]);
            });
        }
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
    });
    /*右侧菜单HOVER显示提示文字 end*/


    form.on('select(component-ruleselect)', function(data){
        // var id = +data.value;
        // meetingId = id;
        // getRuleSetups(id);

        $(".seatdiv").removeClass("R1 R2 R3 R4 R5 R6 R7 R8 R9 R10 R11 R99");
        if(showSeatsData && showSeatsData.length > 0){
            changeSeatColor(showSeatsData);
        }else{
            if(showRuleData && showRuleData.length > 0 && +data.value == 1){
                setSeatStatus(showRuleData);
            }else{
                changeSeatColor(showSeatsData);
            }
        }
    });

    function setSeatStatus(data) {
        console.log("001----显示颜色");
        // console.log(data);
        if (data && data instanceof Array) {
            for (var i = 0, len = data.length; i < len; i++) {
                var items = data[i] || null;
                if(items){
                    items = JSON.parse(items);
                    items.forEach(function(item) {
                        $("#" + item.seatid).addClass(item.ruleid);
                    });
                }
            }
        }
    }


    var attributestatus = false;
    var attrcurrent = "";
    $("#setattribute").bind("click",function(){
        if(attributestatus){
            $("#attributelist").hide();
            attributestatus = false;
        }else{
            $("#attributelist").show();
            attributestatus = true;
        }
    });


    // var deleteSeats = [];
    function deleteBingName(){
        var names = [];
        var seled = $("#seatcontainerId .seatdiv.seled:not(.rownumseats)");
        seled.each(function(){
            // var id = $(this).attr("id");

            // var seat = showSeatsData.filter(function(item){
            //     return item.seatid == id;
            // })[0] || null;

            // if(seat){
            //     names.push(seled);
            //     var num = id.split('-')[3];
            //     $(this).html(num);
            //     $(this).css("background-color","");
            // }

            $(this).css("background-color","");
            var ids = $(this).attr("id").split("-");
            $(this).text(ids[3]);
        });
        seled.removeClass("seled");
        saveSeats();
        // deleteSeats = names;
        // console.log(names);
    }


    function importSeatsDataBySort(condi){
        $.ajax({
            async: true,
            type: "post",
            data: JSON.stringify(condi),
            contentType: 'application/json',
            url: seatUrl +"/v1/meetings/sort",
            dataType: "json",
            success: function(obj) {
                console.log("--importSeatsDataBySort---",condi);
                if(obj && obj.attendees){
                    showSeatsData = obj.attendees;

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
        // console.log(data)
        $.ajax({
            async: true,
            type: "post",
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: seatUrl +"/v1/meetings/store",
            dataType: "json",
            success: function(obj) {
                // console.log("--setSeatData---",obj);
                if(obj && obj.attendees){
                    //保存完之后，要重新查一下吗
                    queryAllSeatStatusByShow();

                    //保存完之后，要重新查一下未导入人员列表
                    getPending(attrcurrent);

                    // 激活框选功能
                    seatMapsControl.selectSeats();
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


    getPending();

    var groupids = {};

    // 获取未导入人员列表
    function getPending(attr){
        attr = attr || "";
        $.ajax({
            type: "get",
            url: seatUrl +"/v1/attendees/pending?meeting_id="+meetingid+"&filter_attribute="+attr,
            dataType: "json",
            success: function(obj) {
                console.log("pending-----",obj)
                getAskLeaveData(obj.leave);
                getNotImportData(obj.pending);

                //分类
                var attribute_kinds = obj.attribute_kinds || [];
                setAttributeHtml(attribute_kinds);


                // $($("#notImportList > li")[1]).find("h4").trigger("click");
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
            li.push('<h4 >' + title + '(<span>' + list.length + '人)</span><a data="' + title + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a></h4>')
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
            li.push('<h4 ><a data="' + title + '" class="drag-staff" href="javascript:;"><img height="16" src="../../../images/toolkit/hand.svg"></a>' + title + '(<span>' + list.length + '</span>人)</h4>')
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

    function setAttributeHtml(data){
        var html = [];
        data.forEach(function(item,index){
            html.push('<div class="layui-form-item">');
            if(item == attrcurrent || (index == 0 && !attrcurrent)){
                html.push('<input id="_attr' + index + '" type="radio" name="attrkinds" value="' + item + '" checked >');
            }else{
                html.push('<input id="_attr' + index + '" type="radio" name="attrkinds" value="' + item + '" >');
            }
            html.push('<label for="_attr' + index + '" style="margin-left: 5px;">' + item + '</label>');
            html.push('</div>');
        });
        $("#radiolist").html(html.join(''));

        $("[type='radio'][name='attrkinds']").bind("change",function(){
            var attr = $(this).val();
            attrcurrent = attr;

            saveSeats();

            getPending(attr);
            $("#attributelist").hide();
            attributestatus = false;
        });
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
                // console.log("dragstart-----------------")
                seatMapsControl.bindStaffDrap();
                // return false;
            }
            item.ondragend = function(evt){
                // console.log("ondragend-----------------",evt,this.id);

                seatMapsControl.unbindStaffDrap();
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
                    // console.log(id,pid,condi);
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
                // debugger
                if(obj && obj.attendees){
                    // dragSortData = obj.attendees;
                    dragSortData.push(obj.attendees);

                    changeDragSeatColor(obj.attendees);

                    //每次拖拽都保存一下数据, 不保存也行
                    // saveSeats();

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
                    // 拖拽完不显示颜色
                    // $("#" + item.seatid).css("background-color",item.bgcolor);
                    $("#" + item.seatid).css("background-color","");
                    $("#" + item.seatid).html(item.attender);
                    // serverSeatIds.push(item.seatid);
                }
            }
        }
    }

    function cancelDragSort(){
        // var attendees = dragSortData;
        var attendees = dragSortData.pop() || [];
        if(attendees && attendees.length > 0){
            // serverSeatIds = [];
            for(var i = 0,len = attendees.length; i < len; i++){
                // {"seatid":"1-1","attender":"028","id":"39"}
                var item = attendees[i] || {};

                $("#" + item.seatid).css("background-color","");
                $("#" + item.seatid).html(item.seatid.split('-')[3]);

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



    function saveSeats(){
        var seats = $("#seatcontainerId .seatdiv:not(.rownumseats)");
        var seatsobj = {
            meeting_id: +meetingid,
            attendees:[]
        };
        var ids = {};
        var names = {};

        showSeatsData.forEach(function(item){
            if(item.roomtemplate_id == roomId){
                ids[item.seatid] = item.id;
                names[item.seatid] = item.attender;
            }else{
                //其它会议室的数据
                seatsobj.attendees.push(item);
            }
        });
        if(dragSortData){
            dragSortData.forEach(function(sort){
                sort.forEach(function(item){
                    if(item.roomtemplate_id == roomId){
                        ids[item.seatid] = item.id;
                        names[item.seatid] = item.attender;
                    }else{
                        //其它会议室的数据
                        seatsobj.attendees.push(item);
                    }
                });
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
                        // seatsobj.attendees.push({attender:name,seatid:id,roomtemplate_id:+roomId});
                        var sid = $(this).attr("sid");
                        if(ids[sid]){
                            // 挪动名字需要把原来的id带回去
                            seatsobj.attendees.push({id:ids[sid],attender:name,seatid:id,roomtemplate_id:+roomId});
                        }else{
                            // 右键添加名字没有id
                            seatsobj.attendees.push({attender:name,seatid:id,roomtemplate_id:+roomId});
                        }
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
        3.当进行座区交换名字，应该也是传递名字原来的座位id,name,新的seatid;同2一样;

        4.当修改座位上原有名字 传递新的name 和 seatid;
        5.当使用右键在空间座区添加新名字，传递新建的name 和 seatid
        */
        setSeatData(seatsobj);
    }







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
                seatMapsControl.selectSeats();
            }else{
                seatMapsControl.removeContainerEvent();
                __handDrag = new SeatMapsDrag();
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
        bindLockSeats:function(){
            seatMapsControl.bindLockSeats();
        },
        bindOneSeats:function(){
            seatMapsControl.bindOneSeats();
        },
        selectSeats:function(){
            seatMapsControl.selectSeats();
        },
        dragSeats:function(){
            seatMapsControl.dragSeats(saveSeats);
        },
        bindContextMenu:function(){
            seatMapsControl.bindContextMenu();
        },
        removeContextMenu:function(){
            seatMapsControl.removeContextMenu();
        },
        navDelete:function(){
            deleteBingName();
        },
        navClear:function(){
            var condi = {
                "meeting_id": meetingid,
                "attendees": []
            }
            setSeatData(condi);
        },
        saveseats:function(){
            saveSeats();
        },
        importData: function() {
            var condi = {
                "meeting_id": +meetingid
            };
            importSeatsDataBySort(condi);
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
        uploadseatbtn:function(){
            layer.msg("不能重复导入人员");
        },
        upload:function() {
            $("#upload-file").trigger("click");
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
        close: function() {
            // alert('6666');
            // var index = parent.layer.getFrameIndex(window.name) || 0; //先得到当前iframe层的索引
            // parent.layer.close(index); //再执行关闭

            parent.layer.closeAll();

            parent.reloads()
        }
    };

    // function Drag(){
    //     this.dragWrap = $("#seatcontainer");
    //     this.init.apply(this,arguments);
    // };
    // Drag.prototype = {
    //     constructor:Drag,
    //     _dom : {},
    //     _x : 0,
    //     _y : 0,
    //     _top :0,
    //     _left: 0,
    //     move : false,
    //     down : false,
    //     init : function () {
    //         this.bindEvent();
    //     },
    //     bindEvent : function () {
    //         var t = this;
    //         $('#seatcontainer').bind('mousedown',function(e){
    //             e && e.preventDefault();
    //             if ( !t.move) {
    //                 t.mouseDown(e);
    //             }
    //         });
    //         $('#seatcontainer').bind('mouseup',function(e){
    //             t.mouseUp(e);
    //         });

    //         $('#seatcontainer').bind('mousemove',function(e){
    //             if (t.down) {
    //                 t.mouseMove(e);
    //             }
    //         });
    //     },
    //     mouseMove : function (e) {
    //         e && e.preventDefault();
    //         this.move = true;
    //         var x = this._x - e.clientX,
    //             y = this._y - e.clientY,
    //             dom = document.documentElement;
    //         dom.scrollLeft = (this._left + x);
    //         dom.scrollTop = (this._top + y);
    //     },
    //     mouseUp : function (e) {
    //         e && e.preventDefault();
    //         this.move = false;
    //         this.down = false;
    //         this.dragWrap.css('cursor','');
    //     },
    //     mouseDown : function (e) {
    //         this.move = false;
    //         this.down = true;
    //         this._x = e.clientX;
    //         this._y = e.clientY;
    //         this._top = document.documentElement.scrollTop;
    //         this._left = document.documentElement.scrollLeft;
    //         // console.log(this._top,this._left)
    //         this.dragWrap.css('cursor','move');
    //     }
    // };
});








