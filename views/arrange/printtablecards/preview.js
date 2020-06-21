layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form', 'table', 'jquery',], function() {
    var table = layui.table,
        admin = layui.admin,
        form = layui.form,
        setter = layui.setter,
        router = layui.router(),
        $ = layui.jquery;
    var url = setter.baseUrl;
    // var url = "http://127.0.0.1:8083";
    var devices = {};
    var deviceList = [];
    // #test-table-operate
    //渲染表格

    $('#group').append('<a class="layui-ds layui-btn-a-grey" href="javascript:;" data-type="print" id="batchmeet">设置<s></s></a>');
    $('#group').after('<div class="assistBtn"><span class="fengeline">/</span><i class="layui-icon layui-ds layui-icon-refresh-3" data-type="refresh"></i></div>')

    
    var fonts = [];
    var detector = new Detector();
    /**
     * other stuff
     */
    function font_init() {
        fonts.push(["PingFang SC","PingFang SC"]);
        fonts.push(["Hiragino Sans GB","冬青黑体"]);
        fonts.push(["microsoft yahei","微软雅黑"]);
        fonts.push(["方正小标宋简体","方正小标宋简体"]);
        fonts.push(["方正魏碑简体","方正魏碑简体"]);
        fonts.push(["黑体","黑体"]);
        fonts.push(["simsun","宋体"]);
        fonts.push(["NSimSun","新宋体"]);
        fonts.push(["FangSong","仿宋"]);
        fonts.push(["FangSong","仿宋"]);
        fonts.push(["KaiTi","楷体"]);
        fonts.push(["FangSongGB2312","仿宋GB2312"]);
        fonts.push(["KaiTiGB2312","楷体GB2312"]);
        fonts.push(["STHeiti Light","华文细黑"]);
        fonts.push(["STHeiti","华文黑体"]);
        fonts.push(["STKaiti","华文楷体"]);
        fonts.push(["STSong","华文宋体"]);
        fonts.push(["STFangsong","华文仿宋"]);
        fonts.push(["STFangsong","华文仿宋"]);
        fonts.push(["STXingkai","华文行楷"]);
        fonts.push(["STLiti","华文隶书"]);
        fonts.push(["STHupo","华文琥珀"]);
        fonts.push(["STCaiyun","华文彩云"]);
        fonts.push(["FZYaoti","方正姚体"]);
        fonts.push(["FZShuTi","方正舒体"]);
        fonts.push(["STFangsong","华文仿宋"]);
        fonts.push(["STZhongsong","华文中宋"]);
        fonts.push(["STSong","华文宋体"]);
        fonts.push(["STKaiti","华文楷体"]);
        fonts.push(["STXihei","华文细黑"]);
        fonts.push(["cursive","cursive"]);
        fonts.push(["monospace","monospace"]);
        fonts.push(["serif","serif"]);
        fonts.push(["sans-serif","sans-serif"]);
        fonts.push(["fantasy","fantasy"]);
        fonts.push(["default","default"]);
        fonts.push(["Arial","Arial"]);
        fonts.push(["Arial Black","Arial Black"]);
        fonts.push(["Arial Narrow","Arial Narrow"]);
        fonts.push(["Arial Rounded MT Bold","Arial Rounded MT Bold"]);
        fonts.push(["Bookman Old Style","Bookman Old Style"]);
        fonts.push(["Bradley Hand ITC","Bradley Hand ITC"]);
        fonts.push(["Century","Century"]);
        fonts.push(["Century Gothic","Century Gothic"]);
        fonts.push(["Comic Sans MS","Comic Sans MS"]);
        fonts.push(["Courier","Courier"]);
        fonts.push(["Courier New","Courier New"]);
        fonts.push(["Georgia","Georgia"]);
        fonts.push(["Gentium","Gentium"]);
        fonts.push(["Impact","Impact"]);
        fonts.push(["King","King"]);
        fonts.push(["Lucida Console","Lucida Console"]);
        fonts.push(["Lalit","Lalit"]);
        fonts.push(["Modena","Modena"]);
        fonts.push(["Monotype Corsiva","Monotype Corsiva"]);
        fonts.push(["Papyrus","Papyrus"]);
        fonts.push(["Tahoma","Tahoma"]);
        fonts.push(["TeX","TeX"]);
        fonts.push(["Times","Times"]);
        fonts.push(["Times New Roman","Times New Roman"]);
        fonts.push(["Trebuchet MS","Trebuchet MS"]);
        fonts.push(["Verdana","Verdana"]);
        fonts.push(["Verona","Verona"]);
        var table = document.getElementById('table');
        for (i = 0; i < fonts.length; i++) {
            var result = detector.detect(fonts[i][0]);
            console.log(result,fonts[i][0])
            if(result){
                $('#font_list').append(new Option(fonts[i][1], fonts[i][0]));
            }

            // if(data && data.length > 0){
				// $.each(data, function (index, item) {
					// 下拉菜单里添加元素
				// });
				
			// }
            // row = table.insertRow(-1);
            // col = row.insertCell(-1);
            // col.appendChild(document.createTextNode(fonts[i]))
            // col.style.fontFamily = fonts[i];
            // col = row.insertCell(-1);
            // result ? col.className = "f_green" : col.className = "f_red";
            // col.appendChild(document.createTextNode(result));
        }
        layui.form.render("select");
    }
    font_init();
    
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
         var uri = window.location.search;
        var r = uri.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2]; return null; //返回参数值
    }
    var pid = +getUrlParam("id") || null;


    var seatSignData = {};
    seatSignData.name = "主席会议室桌牌";
    seatSignData.printname = "打席签";
    
    
    seatSignData.length = "100";
    seatSignData.domheight = "100";
    seatSignData.width = "200";
    seatSignData.domwidth = "200";

    seatSignData.font = "黑体";
    // seatSignData.font = "方正小标宋简体";

    seatSignData.fontSize = "51";
    

    seatSignData.level = "5";
    seatSignData.vertical = "5";

    seatSignData.align = "aligncenter";
    seatSignData.position = "positioncenter";

    seatSignData.above = "0";
    seatSignData.domabove = "0";
    seatSignData.left = "0";
    seatSignData.domleft = "0";

    
    seatSignData.below = undefined;
    seatSignData.right = undefined;
    
    //打印字面 0:一字两面,1:一字一面 
    seatSignData.type = "0";


    //默认 200mm 100mm 字体52mm ,
    //字体 52mm 当做基准值

    //编辑
    if(pid){
        var seatdata = window.sessionStorage.getItem("_printtpl"+pid) || "";
        if(seatdata){
            seatdata = JSON.parse(seatdata);
            for(var k in seatdata){
                if(k != "below" && k != "right" && k != "modifytime"){
                    seatSignData[k] = seatdata[k];
                }
            }
            if(!seatSignData.printname){
                seatSignData.printname = "打席签";
            }
            seatSignData.id = seatdata.id;

            var hh = Math.round(+seatSignData.length*200/+seatSignData.width);
            $("#fontwh").css({"height":hh+"mm"});
            seatSignData.domheight = hh;

            $("#fontwh").removeClass("aligncenter");
            $("#fontwh").removeClass("positioncenter");
            if(seatSignData.align){
                $("#fontwh").removeClass(seatSignData.align);
            }
            if(seatSignData.position){
                $("#fontwh").removeClass(seatSignData.position);
            }
        }
    }

    changeSignHtml();
    changeSignStyle();


    $("#printname").bind("input propertychange",function(){
        var printname = this.value;
        printname = printname.split('\n').join('<br />');
        seatSignData.printname = printname;
        $("#printnametext").html(printname);
        // changeSignStyle();
    });

    $("#fontwidth").bind("input propertychange",function(){
        var width = this.value;
        var reg = /^\d+$/g;
        if(reg.test(width)){

            var hh = Math.round(+seatSignData.length*200/width);

            $("#fontwh").css({"height":hh+"mm"});

            seatSignData.width = width;
            seatSignData.domheight = hh;

            // changeSignHtml();
            changeSignStyle();
        }
    });
    $("#fontheight").bind("input propertychange",function(){
        var height = this.value;
        var reg = /^\d+$/g;
        if(reg.test(height)){
            var hh = Math.round(height*200/+seatSignData.width);
    
            $("#fontwh").css({"height":hh+"mm"});

            seatSignData.length = height;
            seatSignData.domheight = hh;
            // changeSignHtml();
            
            changeSignStyle();
        }
    });


    $("#fontsize").bind("input propertychange",function(){
        var size = +this.value;
        var reg = /^\d+$/g;
        if(reg.test(size)){
            
            if(size >= +seatSignData.length){
                size = +seatSignData.length;
                $("#fontsize").val(size);
            }

            seatSignData.fontSize = size;

            changeSignStyle();
        }
    });

    $("#letterspacing").bind("input propertychange",function(){
        var level = +this.value;
        var reg = /^\d+$/g;
        if(reg.test(level)){
            
            seatSignData.level = level;

            changeSignStyle();
        }
    });

    $("#vertical").bind("input propertychange",function(){
        var vertical = +this.value;
        var reg = /^\d+$/g;
        if(reg.test(vertical)){
            if(vertical > 0){
                seatSignData.vertical = vertical;

                changeSignStyle();
            }else{
                $("#vertical").val(0);
            }
        }
    });

    $("#alignbtn img").bind("click",function(){
        console.log($(this).attr("data"));
        var data = $(this).attr("data");
        $("#fontwh").addClass("flex");
        $("#printnametext").removeClass("border");
        if(seatSignData.align){
            $("#fontwh").removeClass(seatSignData.align);
        }
        // if(seatSignData.position){
        //     $("#fontwh").removeClass(seatSignData.position);
        // }
        seatSignData.above = 0;
        seatSignData.left = 0;
        switch(data){
            case "left":
                seatSignData.align = "";
            break;
            case "center":
                seatSignData.align = "aligncenter";
            break;
            case "right":
                seatSignData.align = "alignright";
            break;
        }
        changeSignHtml();
        changeSignStyle();
    });

    $("#positionbtn img").bind("click",function(){
        console.log($(this).attr("data"));
        var data = $(this).attr("data");
        $("#fontwh").addClass("flex");
        $("#printnametext").removeClass("border");
        if(seatSignData.position){
            $("#fontwh").removeClass(seatSignData.position);
        }
        seatSignData.above = 0;
        seatSignData.left = 0;
        switch(data){
            case "top":
                seatSignData.position = "";
            break;
            case "center":
                seatSignData.position = "positioncenter";
            break;
            case "end":
                seatSignData.position = "positionend";
            break;
        }
        changeSignHtml();
        changeSignStyle();
    });


    $("#margintop").bind("input propertychange",function(){
        var above = this.value;
        var reg = /^-?\d+$/g;
        
        if(reg.test(above)){
            $("#fontwh").removeClass("flex");
            $("#printnametext").addClass("border");
            if(seatSignData.align){
                $("#fontwh").removeClass(seatSignData.align);
            }
            if(seatSignData.position){
                $("#fontwh").removeClass(seatSignData.position);
            }

            seatSignData.align = "";
            seatSignData.position = "";

            
            seatSignData.above = above;

            changeSignStyle();
        }
    });
    $("#marginleft").bind("input propertychange",function(){
        var left = this.value;
        var reg = /^-?\d+$/g;
        if(reg.test(left)){
            $("#fontwh").removeClass("flex");
            $("#printnametext").addClass("border");
            if(seatSignData.align){
                $("#fontwh").removeClass(seatSignData.align);
            }
            if(seatSignData.position){
                $("#fontwh").removeClass(seatSignData.position);
            }
            seatSignData.align = "";
            seatSignData.position = "";

            seatSignData.left = left;
            changeSignStyle();
        }
    });

    form.on('select(font-form-select)', function(data){
        var font = data.value;

        // if(seatSignData.font){
        //     $("#fontwh").removeClass(seatSignData.font);
        // }
        seatSignData.font = font;
        changeSignStyle();
    });
    form.on('select(printtype-form-select)', function(data){
        var type = data.value;
        seatSignData.type = type;
    });


    function changeSignHtml(){
        $("#name").val(seatSignData.name);
        $("#printname").html(seatSignData.printname);
        $("#printnametext").html(seatSignData.printname);

        $("#fontwidth").val(seatSignData.width);
        $("#fontheight").val(seatSignData.length);

        $("#font_list").val(seatSignData.font);

        $("#fontsize").val(seatSignData.fontSize);

        $("#font_list").val(seatSignData.font);

        $("#letterspacing").val(seatSignData.level);
        $("#vertical").val(seatSignData.vertical);

        $("#margintop").val(seatSignData.above);
        $("#marginleft").val(seatSignData.left);

        $("#printtype_selset").val(seatSignData.type);

        layui.form.render("select");
    }
    function changeSignStyle(){
        // $("#fontwh").css({"width":seatSignData.width+"mm","height":seatSignData.length+"mm"});
        // 52 / (最新width *  height / 20000 )
        // ,"margin-left":seatSignData.left+"mm","margin-top":seatSignData.above+"mm"

       

        // var cc = (+seatSignData.width*+seatSignData.length)/coefficient;

        var fontcc = +seatSignData.length/+seatSignData.domheight;

        var domlevel = Math.round(+seatSignData.domwidth*+seatSignData.level/+seatSignData.width);
        var domleft = Math.round(+seatSignData.domwidth*+seatSignData.left/+seatSignData.width);
        var domabove = Math.round(+seatSignData.domheight*+seatSignData.above/+seatSignData.length);
        var vertical = Math.round(+seatSignData.domheight*+seatSignData.vertical/+seatSignData.length);

        $("#printnametext").css({
            "font-size":(+seatSignData.fontSize/fontcc)+"mm",
            "letter-spacing":(+domlevel)+"mm",
            "line-height":(100+vertical)+"%",
            "margin-top":(+domabove)+"mm",
            "margin-left":(+domleft)+"mm",
            "font-family":seatSignData.font || "方正小标宋简体"
        });

        $("#text_width").html(seatSignData.width+"mm");
        $("#text_height").html(seatSignData.length+"mm");

        $("#text_padding_top").html((+seatSignData.above)+"mm");
        $("#m_padding_top").height((+domabove)+"mm");

        $("#text_padding_left").html((+seatSignData.left)+"mm");
        $("#m_padding_left").width((+domleft)+"mm");

        if(seatSignData.font){
            $("#fontwh").addClass(seatSignData.font);
        }
        if(seatSignData.align){
            $("#fontwh").addClass(seatSignData.align);
        }
        if(seatSignData.position){
            $("#fontwh").addClass(seatSignData.position);
        }
    }


    function addSeatSign(){
        seatSignData.name = $("#name").val();

        $.ajax({
            async: false,
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            url: url + "/seatsgin/addseatsgin",
            dataType: "json",
            data:seatSignData,
            success: function(obj) {
                console.log("--addSeatSign---");
                if(obj.code == 0){
                    parent.layer.msg("添加成功");
                    var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                    parent.layer.close(index);
                    parent.reloads();
                }else{
                    layer.msg("添加席签模板错误");
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        });
    }

    function editSeatSign(){
        seatSignData.name = $("#name").val();
        $.ajax({
            async: false,
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            url: url + "/seatsgin/updateseatsgin",
            dataType: "json",
            data:seatSignData,
            success: function(obj) {
                console.log("--addSeatSign---");
                if(obj.code == 0){
                    parent.layer.msg("修改成功");
                    var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                    parent.layer.close(index);
                    parent.reloads();
                }else{
                    layer.msg("修改席签模板错误");
                }
            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
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

    var $ = layui.$,
    active = {
        refresh:function(){
            location.reload();
        },
        enterbtn: function() {
            if(pid){
                editSeatSign();
            }else{
                addSeatSign();
            }
        },
        cancel: function() {
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭 
        },
        close:function(){
            var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
            parent.layer.close(index); //再执行关闭 
        }
    };


    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });



    /*右侧菜单HOVER显示提示文字*/
    $('.layui-right-nav i').each(function() {
        var _id = $(this).attr('id');
        var _data = $(this).attr('data');
        $("#" + _id).hover(function() {
            openMsg();
        }, function() {
            layer.close(subtips);
        });

        function openMsg() {
            subtips = layer.tips(_data, '#' + _id, {
                tips: [3, '#666'],
                time: 30000
            });
        }
    });

    // 修改弹出方式 5.26
    $('.mytest').mouseover(function() {
        layer.tips($(this).children('span').text(), this, {
            tips: [3, "#808080"],
            offset: '200px'
        });
    });
});
