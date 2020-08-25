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
            // console.log(result,fonts[i][0])
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
    var pid = getUrlParam("id") || null;


    
    var seatSignIndex = 0;
    var seatSignArray = [];

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

    seatSignData.zoom = 1;
    seatSignData.spin = 1;

    seatSignData.fontweight = "0";

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

    seatSignData.memo = "";


    //默认 200mm 100mm 字体52mm ,
    //字体 52mm 当做基准值


    //编辑
    if(pid){
        var seatdata = window.sessionStorage.getItem("_printtpl"+pid) || "";
        if(seatdata){
            seatdata = JSON.parse(seatdata);
            for(var k in seatdata){
                if(k == "name" || k == "length" || k == "width" || k == "type" || k == "memo"){
                    seatSignData[k] = seatdata[k];
                    if(k == "length"){
                        var hh = Math.round(seatdata[k]*200/+seatdata.width);
                        seatSignData.domheight = hh;
                    }
                    if(k == "width"){
                        var hh = Math.round(+seatdata.length*200/seatdata[k]);
                        seatSignData.domwidth = hh;
                    }
                }
            }

            seatSignData.id = seatdata.id;

            var styles = seatdata.style;
            if(styles){
                seatSignArray = JSON.parse(styles);
            }

            // if(!seatSignData.printname){
            //     seatSignData.printname = "打席签";
            // }

            // var hh = Math.round(+seatSignData.length*200/+seatSignData.width);
            // $("#fontwh").css({"height":hh+"mm"});
            // seatSignData.domheight = hh;

            // $("#fontwh").removeClass("aligncenter");
            // $("#fontwh").removeClass("positioncenter");
            // if(seatSignData.align){
            //     $("#fontwh").removeClass(seatSignData.align);
            // }
            // if(seatSignData.position){
            //     $("#fontwh").removeClass(seatSignData.position);
            // }
        }
    }else{
        newFont();
    }


    // $("#fontweight").attr("checked",true);
    // $("#fontweight").attr("checked",false);

    // layui.form.render();
    
    function newFont(){
        var font = {};
        font.id = "print_" + seatSignIndex;
        font.style = JSON.parse(JSON.stringify(seatSignData));
        
        if(seatSignIndex > 0){
            font.style.align = "";
            font.style.position = "";
        }

        seatSignArray.push(font);

        
        changeSignHtml(true);
        changeSignStyle();
    }

    function bindFontClick(){
        $(".printname").unbind("click");
        $(".printname").bind("click",function(){
            var id = this.id;
            var idx = +id.split("_")[1];
            
            seatSignIndex = idx;

            changeSignHtml(false);
            changeSignStyle();
        });
    }
    
    $("#newfontbtn").bind("click",function(){
        seatSignIndex++;
        newFont();
    });


    $("#printname").bind("input propertychange",function(){
        var printname = this.value;
        printname = printname.split('\n').join('<br />');

        if(printname.length == 2){
            printname = printname.split("").join("　");
        }

        var obj = seatSignArray[seatSignIndex]||{};
        var seatSignData = obj.style || null;

        seatSignData.printname = printname;
        $("#" + obj.id).html(printname);
        // changeSignStyle();
    });

    $("#fontwidth").bind("input propertychange",function(){
        var width = this.value;
        var reg = /^\d+$/g;
        if(reg.test(width)){
            var obj = seatSignArray[seatSignIndex]||{};
            var style = obj.style || null;

            var hh = Math.round(+style.length*200/width);

            $("#fontwh").css({"height":hh+"mm"});

            style.width = width;
            style.domheight = hh;

            seatSignData.width = width;
            seatSignData.domheight = hh;

            changeSignStyle();

            if(seatSignArray.length > 1){
                for(var i = 0; i < seatSignArray.length; i++){
                    if(i != seatSignIndex){
                        var data = seatSignArray[i].style || null;
                        var hh = Math.round(+data.length*200/width);
                        data.width = width;
                        data.domheight = hh;

                        changeSignStyle(i);
                    }
                }
            }
        }
    });
    $("#fontheight").bind("input propertychange",function(){
        var height = this.value;
        var reg = /^\d+$/g;
        if(reg.test(height)){
            var obj = seatSignArray[seatSignIndex]||{};
            var style = obj.style || null;

            var hh = Math.round(height*200/+style.width);
    
            $("#fontwh").css({"height":hh+"mm"});

            style.length = height;
            style.domheight = hh;
            
            seatSignData.length = height;
            seatSignData.domheight = hh;

            changeSignStyle();

            if(seatSignArray.length > 1){
                for(var i = 0; i < seatSignArray.length; i++){
                    if(i != seatSignIndex){
                        var data = seatSignArray[i].style || null;
                        var hh = Math.round(height*200/+data.width);
                        data.length = height;
                        data.domheight = hh;

                        changeSignStyle(i);
                    }
                }
            }
        }
    });


    $("#fontsize").bind("input propertychange",function(){
        var size = +this.value;
        var reg = /^\d+$/g;
        if(reg.test(size)){
            var obj = seatSignArray[seatSignIndex]||{};
            var seatSignData = obj.style || null;

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
        var reg = /^-?\d+$/g;
        
        if(reg.test(level)){
            var obj = seatSignArray[seatSignIndex]||{};
            var seatSignData = obj.style || null;

            seatSignData.level = level;

            changeSignStyle();
        }
    });

    $("#vertical").bind("input propertychange",function(){
        var vertical = +this.value;
        var reg = /^\d+$/g;
        if(reg.test(vertical)){
            var obj = seatSignArray[seatSignIndex]||{};
            var seatSignData = obj.style || null;

            if(vertical > 0){
                seatSignData.vertical = vertical;

                changeSignStyle();
            }else{
                $("#vertical").val(0);
            }
        }
    });

    $("#scale").bind("input propertychange",function(){
        var scale = +this.value;
        var reg = /^([0-9]*|\d*.\d{1}?\d*)$/g;
        if(reg.test(scale)){
            var obj = seatSignArray[seatSignIndex]||{};
            var seatSignData = obj.style || null;

            if(scale > 0){
                seatSignData.zoom = scale;

                changeSignStyle();
            }else{
                $("#scale").val(0);
            }
        }
    });

    $("#rotate").bind("input propertychange",function(){
        var rotate = +this.value;
        var reg = /^([0-9]*|\d*.\d{1}?\d*)$/g;
        if(reg.test(rotate)){
            var obj = seatSignArray[seatSignIndex]||{};
            var seatSignData = obj.style || null;

            if(rotate > 0){
                seatSignData.spin = rotate;

                changeSignStyle();
            }else{
                $("#rotate").val(0);
            }
        }
    });

    form.on('checkbox(weight-form-checkbox)', function(data){
        var b = $("#fontweight").is(":checked");
        var fw = b ? "1" : "0";

        var obj = seatSignArray[seatSignIndex]||{};
        var seatSignData = obj.style || null;

        seatSignData.fontweight = fw;

        changeSignStyle();
    });

    $("#alignbtn img").bind("click",function(){
        var obj = seatSignArray[seatSignIndex]||{};
        var seatSignData = obj.style || null;

        var data = $(this).attr("data");
        // $("#fontwh").addClass("flex");
        $("#" + obj.id).removeClass("border");
        
        if(seatSignData.align){
            $("#" + obj.id).removeClass(seatSignData.align);
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

        changeSignStyle();
    });

    $("#positionbtn img").bind("click",function(){
         var obj = seatSignArray[seatSignIndex]||{};
        var seatSignData = obj.style || null;

        var data = $(this).attr("data");
        // $("#fontwh").addClass("flex");
        $("#" + obj.id).removeClass("border");

        // if(seatSignData.position){
        //     $("#fontwh").removeClass(seatSignData.position);
        // }
        if(seatSignData.position){
            $("#" + obj.id).removeClass(seatSignData.position);
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

        changeSignStyle();
    });


    $("#margintop").bind("input propertychange",function(){
        var above = this.value;
        var reg = /^-?\d+$/g;
        
        if(reg.test(above)){
            var obj = seatSignArray[seatSignIndex]||{};
            var seatSignData = obj.style || null;

            $("#fontwh").removeClass("flex");
            $("#" + obj.id).addClass("border");
            if(seatSignData.align){
                $("#" + obj.id).removeClass(seatSignData.align);
            }
            if(seatSignData.position){
                $("#" + obj.id).removeClass(seatSignData.position);
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
            var obj = seatSignArray[seatSignIndex]||{};
            var seatSignData = obj.style || null;

            $("#fontwh").removeClass("flex");
            $("#" + obj.id).addClass("border");
            if(seatSignData.align){
                $("#" + obj.id).removeClass(seatSignData.align);
            }
            if(seatSignData.position){
                $("#" + obj.id).removeClass(seatSignData.position);
            }
            seatSignData.align = "";
            seatSignData.position = "";

            seatSignData.left = left;
            changeSignStyle();
        }
    });
    $("#name").bind("input propertychange",function(){
        var obj = seatSignArray[seatSignIndex]||{};
        var style = obj.style || null;
        style.name = this.value;

        if(seatSignArray.length > 1){
            for(var i = 0; i < seatSignArray.length; i++){
                if(i != seatSignIndex){
                    var data = seatSignArray[i].style || null;
                    data.name = this.value;
                }
            }
        }
        seatSignData.name = this.value;
    });
    $("#memo").bind("input propertychange",function(){
        var obj = seatSignArray[seatSignIndex]||{};
        var style = obj.style || null;
        style.memo = this.value;

        if(seatSignArray.length > 1){
            for(var i = 0; i < seatSignArray.length; i++){
                if(i != seatSignIndex){
                    var data = seatSignArray[i].style || null;
                    data.memo = this.value;
                }
            }
        }

        seatSignData.memo = this.value;
    });

    form.on('select(font-form-select)', function(data){
        var font = data.value;

        var obj = seatSignArray[seatSignIndex]||{};
        var seatSignData = obj.style || null;

        // if(seatSignData.font){
        //     $("#fontwh").removeClass(seatSignData.font);
        // }
        seatSignData.font = font;
        changeSignStyle();
    });
    form.on('select(printtype-form-select)', function(data){
        var obj = seatSignArray[seatSignIndex]||{};
        var style = obj.style || null;

        var type = data.value;
        style.type = type;

        if(seatSignArray.length > 1){
            for(var i = 0; i < seatSignArray.length; i++){
                if(i != seatSignIndex){
                    var data = seatSignArray[i].style || null;
                    data.type = type;
                }
            }
        }

        seatSignData.type = type;
    });


    function changeSignHtml(create){
        var obj = seatSignArray[seatSignIndex]||{};
        var seatSignData = obj.style || null;
        if(!seatSignData){
            return;
        }

        console.log("------",seatSignData)
        if(create){
            $("#fontwh").append('<span id="' + obj.id + '" class="printname ">'+seatSignData.printname+'</span>');
        }

        $("#name").val(seatSignData.name);
        $("#printname").html(seatSignData.printname);
        // $("#printnametext").html(seatSignData.printname);

        $("#fontwidth").val(seatSignData.width);
        $("#fontheight").val(seatSignData.length);

        $("#font_list").val(seatSignData.font);

        $("#fontsize").val(seatSignData.fontSize);

        $("#font_list").val(seatSignData.font);

        $("#letterspacing").val(seatSignData.level);
        $("#vertical").val(seatSignData.vertical);

        $("#scale").val(seatSignData.zoom || 1);
        $("#rotate").val(seatSignData.spin || 1);

        $("#fontweight").prop("checked",+seatSignData.fontweight ? true : false);

        $("#margintop").val(seatSignData.above);
        $("#marginleft").val(seatSignData.left);

        $("#printtype_selset").val(seatSignData.type);

        $("#memo").val(seatSignData.memo);

        layui.form.render();

        bindFontClick();
    }
    function changeSignStyle(index){
        var obj = seatSignArray[seatSignIndex]||{};
        if(index != undefined){
            obj = seatSignArray[index]||{};
        }
        
        var seatSignData = obj.style || null;
        if(!seatSignData){
            return;
        }
        var fontId =  $("#" + obj.id);

        var fontcc = +seatSignData.length/+seatSignData.domheight;

        var domlevel = Math.round(+seatSignData.domwidth*+seatSignData.level/+seatSignData.width);
        var domleft = Math.round(+seatSignData.domwidth*+seatSignData.left/+seatSignData.width);
        var domabove = Math.round(+seatSignData.domheight*+seatSignData.above/+seatSignData.length);
        var vertical = Math.round(+seatSignData.domheight*+seatSignData.vertical/+seatSignData.length);
        
        var scale = +seatSignData.domheight*+seatSignData.zoom/+seatSignData.length || 1;
        var rotate = +seatSignData.domheight*+seatSignData.spin/+seatSignData.length || 1;
        // var rotate = Math.round(+seatSignData.domheight*+seatSignData.spin/+seatSignData.length);

        fontId.css({
            "font-size":(+seatSignData.fontSize/fontcc)+"mm",
            "letter-spacing":(+domlevel)+"mm",
            "font-weight":+seatSignData.fontweight ? "bold" : "normal",
            "line-height":(100+vertical)+"%",
            "margin-top":(+domabove)+"mm",
            "margin-left":(+domleft)+"mm",
            // "transform": "scale(" + rotate + "," + scale + ")",
            "font-family":seatSignData.font || "方正小标宋简体"
        });

        if(seatSignData.align){
            fontId.addClass(seatSignData.align);
        }
        if(seatSignData.position){
            fontId.addClass(seatSignData.position);
        }

        
        if(fontId.hasClass("aligncenter") && fontId.hasClass("positioncenter")){
            fontId.css("transform","translate(-50%,-50%) " + "scale(" + rotate + "," + scale + ")");
        }else if(fontId.hasClass("aligncenter")){
            fontId.css("transform","translateX(-50%) " + "scale(" + rotate + "," + scale + ")");
        }else if(fontId.hasClass("positioncenter")){
            fontId.css("transform","translateY(-50%) " + "scale(" + rotate + "," + scale + ")");
        }else{
            fontId.css("transform","scale(" + rotate + "," + scale + ")");
        }

        $("#text_width").html(seatSignData.width+"mm");
        $("#text_height").html(seatSignData.length+"mm");

        $("#text_padding_top").html((+seatSignData.above)+"mm");
        $("#m_padding_top").height((+domabove)+"mm");

        $("#text_padding_left").html((+seatSignData.left)+"mm");
        $("#m_padding_left").width((+domleft)+"mm");

        if(seatSignData.font){
            // $("#fontwh").addClass(seatSignData.font);
        }
        
    }


    function addSeatSign(){
        // seatSignData.name = $("#name").val();
        // seatSignData.memo = $("#memo").val();
        
        // seatSignData.zoom = +seatSignData.zoom;
        var printtemplate = {};
        printtemplate.name = seatSignData.name;
        printtemplate.length = seatSignData.length;
        printtemplate.width = seatSignData.width;
        printtemplate.type = seatSignData.type;
        printtemplate.memo = seatSignData.memo;
        printtemplate.style = JSON.stringify(seatSignArray);


        $.ajax({
            async: false,
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            // url: url + "/seatsgin/addseatsgin",
            url: url + "/printtemplate/save",
            dataType: "json",
            // data:seatSignData,
            data:printtemplate,
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
        // seatSignData.name = $("#name").val();
        // seatSignData.memo = $("#memo").val();
        
        // seatSignData.zoom = +seatSignData.zoom;
        
        var printtemplate = {};
        printtemplate.name = seatSignData.name;
        printtemplate.length = seatSignData.length;
        printtemplate.width = seatSignData.width;
        printtemplate.type = seatSignData.type;
        printtemplate.memo = seatSignData.memo;
        printtemplate.style = JSON.stringify(seatSignArray);

        console.log(printtemplate)
        $.ajax({
            async: false,
            type: "POST",
            xhrFields: {
                withCredentials: true
            },
            // url: url + "/seatsgin/updateseatsgin",
            url: url + "/printtemplate/modify",
            dataType: "json",
            data:printtemplate,
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
