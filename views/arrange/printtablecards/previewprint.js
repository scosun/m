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
    
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
         var uri = window.location.search;
        var r = uri.substr(1).match(reg);  //匹配目标参数
        if (r != null) return r[2]; return null; //返回参数值
    }
    var isgrouplist = +getUrlParam("isgrouplist") || null;

    $.ajax({
        url: "https://f.longjuli.com/seatsgin/findseatsginByid?id=" + isgrouplist,
        type: "get",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(obj) {
            debugger
            console.log("findseatsginByid-----",obj);
            if(obj.code == 0){
                var styles = obj.data || {};
                showName(styles);
            }
        },
        error:function(){
            layer.closeAll();
        }
    });
    
    function showName(styles){
        var namestr = sessionStorage.getItem("_printnames") || "";
        if(namestr){
            console.log(namestr)
            var names = namestr.split(',');
            var html = [];

            var namestyle = "";
            var style = "width:" + styles.width + "mm;height:" + styles.length + "mm;"
            var classtext = "preview_left_text ";
            if(styles.position || styles.align){
                classtext += " flex ";
                if(styles.align){
                    classtext += (" " + styles.align);
                }
                if(styles.position){
                    classtext += (" " + styles.position);
                }
            }

            namestyle = " font-size:"+styles.fontSize + "mm;letter-spacing:"+styles.level + "mm;"
            if(styles.above || styles.left){
                namestyle += " margin-top:"+styles.above + "mm;margin-left:"+styles.left + "mm;"
            }
            if(styles.vertical){
                namestyle += " line-height:" +(100+(+styles.vertical))+"%;";
            }
            if(styles.font){
                namestyle += " font-family:" +styles.font +";";
            }
            if(styles.zoom || styles.spin){
                namestyle += (" transform:scale(" + (styles.spin || 1) + "," + (styles.zoom || 1) + ");");
            }
            // $("#printnametext").css({
            //     "font-size":(+seatSignData.fontSize/fontcc)+"mm",
            //     "letter-spacing":(+domlevel)+"mm",
            //     "margin-top":(+domabove)+"mm",
            //     "margin-left":(+domleft)+"mm"
            // });

            //0:一字两面,1:一字一面, 一字两面 就是 一正一反， 一字一面，就是两个一样
            //transform: rotate(180deg);
            var type = +styles.type; 

            for(var i = 0, len = names.length; i < len; i++){

                var name = names[i] || {};
                if(type == 0){
                    html.push('<div>');
                    html.push('<div class="' + classtext + '" style="transform: rotate(180deg); ' + style + '">');
                    html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');

                    html.push('<div>');
                    html.push('<div class="' + classtext + '" style="' + style + '">');
                    html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');
                }else{
                    html.push('<div>');
                    html.push('<div class="' + classtext + '" style="' + style + '">');
                    html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');
                    
                    
                    html.push('<div>');
                    html.push('<div class="' + classtext + '" style="' + style + '">');
                    html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');
                }
            }
            $("#container").html(html.join(''));

        }

        // control+p
    }

    // $("")
    // $("#seatcontainer").jqprint({
    //     debug: false, 
    //     importCSS: true, 
    //     printContainer: true, 
    //     operaSupport: false
    // });

    window.onkeyup = function(ev) {
        var key = ev.keyCode || ev.which;
        // console.log(key)
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
        //选择区域打印
        print: function() {
            
        },
        search: function() {
            

        }
    };


    $('.layui-ds').on('click', function() {
        var type = $(this).data('type');
        active[type] && active[type].call(this);
    });
});
