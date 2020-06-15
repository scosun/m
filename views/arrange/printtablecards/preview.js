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

    

    var seatSignData = {};
    seatSignData.name = "主席会议室桌牌";
    seatSignData.printname = "辛海涛";
    
    
    seatSignData.length = "100";
    seatSignData.domheight = "100";
    seatSignData.width = "200";
    seatSignData.domwidth = "200";

    seatSignData.font = "fangzhengyaoti";

    seatSignData.fontSize = "52";
    

    seatSignData.level = "0";
    seatSignData.vertical = "0";

    seatSignData.align = "aligncenter";
    seatSignData.position = "positioncenter";

    seatSignData.above = "0";
    seatSignData.domabove = "0";
    seatSignData.left = "0";
    seatSignData.domleft = "0";

    
    seatSignData.below = "";
    seatSignData.right = "";
    
    
    seatSignData.type = "";


    //默认 200mm 100mm 字体52mm ,
    //字体 52mm 当做基准值
    //系数 默认就是 200*100 = 20000, 按面积算 当 宽高发生变化之后，改变系数
    var coefficient = 20000;
    // 字体计算法法 52 / (最新width *  height / 20000 )

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
            var hh = Math.round(100*200/width);
    
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
            var ww = Math.round(100*200/height);
    
            $("#fontwh").css({"width":ww+"mm"});

            seatSignData.length = height;
            seatSignData.domwidth = ww;
            // changeSignHtml();
            
            changeSignStyle();
        }
    });


    $("#fontsize").bind("input propertychange",function(){
        var size = +this.value;
        var reg = /^\d+$/g;
        if(reg.test(size)){
            

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

    $("#alignbtn img").bind("click",function(){
        console.log($(this).attr("data"));
        var data = $(this).attr("data");
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

        if(seatSignData.font){
            $("#fontwh").removeClass(seatSignData.font);
        }
        seatSignData.font = font;
        changeSignStyle();
    });


    function changeSignHtml(){
        $("#name").val(seatSignData.name);
        $("#printname").html(seatSignData.printname);

        $("#fontwidth").val(seatSignData.width);
        $("#fontheight").val(seatSignData.length);

        $("#letterspacing").val(seatSignData.level);
        $("#vertical").val(seatSignData.vertical);

        $("#margintop").val(seatSignData.above);
        $("#marginleft").val(seatSignData.left);
    }
    function changeSignStyle(){
        // $("#fontwh").css({"width":seatSignData.width+"mm","height":seatSignData.length+"mm"});
        // 52 / (最新width *  height / 20000 )
        // ,"margin-left":seatSignData.left+"mm","margin-top":seatSignData.above+"mm"

       

        // var cc = (+seatSignData.width*+seatSignData.length)/coefficient;

        var fontcc = +seatSignData.length / +seatSignData.domheight;

        var domlevel = Math.round(+seatSignData.domwidth*+seatSignData.level/+seatSignData.width);
        var domleft = Math.round(+seatSignData.domwidth*+seatSignData.left/+seatSignData.width);
        var domabove = Math.round(+seatSignData.domheight*+seatSignData.above/+seatSignData.length);

        $("#fontwh > p").css({
            "font-size":(+seatSignData.fontSize/fontcc)+"mm",
            "letter-spacing":(+domlevel)+"mm",
            "margin-top":(+domabove)+"mm",
            "margin-left":(+domleft)+"mm"
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
        $.ajax({
            async: false,
            type: "POST",
            url: url + "/seatsgin/addseatsgin",
            dataType: "json",
            data:seatSignData,
            success: function(obj) {
                console.log("--addSeatSign---");
                // if(obj && obj.attendees){
                //     seatsdata = obj.attendees;
                    
                //     changeSeatColor(obj.attendees);
                // }
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
            debugger
            addSeatSign();
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
