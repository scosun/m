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
    var isgrouplist = getUrlParam("isgrouplist") || null;

    $.ajax({
        url: url + "/printtemplate/selectSeletive?id=" + isgrouplist,
        type: "get",
        async: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(obj) {
            // console.log("findseatsginByid-----",obj);
            if(obj.code == 0){
                var data = obj.data || [];
                var sign = data[0] || {};
                var styles = sign.style;
                if(styles){
                    styles = JSON.parse(styles) || {};
                    var style = styles[0].style || "";
                    if(style){
                        showName(style);
                    }else{
                        layer.msg("获取席签模板错误");
                    }
                }
                else{
                    layer.msg("获取席签模板错误");
                }
            }else{
                layer.msg("获取席签模板错误");
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
            var containerStyle = "width:" + styles.width + "mm;height:" + styles.height + "mm;"
            // var classtext = "preview_left_text ";
            // if(styles.position || styles.align){
            //     classtext += " flex ";
            //     if(styles.align){
            //         classtext += (" " + styles.align);
            //     }
            //     if(styles.position){
            //         classtext += (" " + styles.position);
            //     }
            // }

            namestyle = " font-size:"+styles.fontSize + "mm;letter-spacing:"+styles.level + "mm;";
            if(styles.top){
                namestyle += " top:"+styles.top + "mm;";
            }
            if(styles.left){
                namestyle += " left:"+styles.left + "mm;";
            }
            if(styles.bottom){
                namestyle += " bottom:"+styles.bottom + "mm;";
            }
            if(styles.right){
                namestyle += " right:"+styles.right + "mm;";
            }
            
            if(styles.vertical){
                namestyle += " line-height:" +(100+(+styles.vertical))+"%;";
            }
            if(styles.font){
                namestyle += " font-family:" +styles.font +";";
            }
            if(+styles.fontweight){
                namestyle += " font-weight:" + (+styles.fontweight ? "bold" : "normal") +";";
            }
            if(styles.zoom || styles.spin){
                namestyle += (" transform:scale(" + (styles.spin || 1) + "," + (styles.zoom || 1) + ");");
            }

            //0:一字两面,1:一字一面, 一字两面 就是 一正一反， 一字一面，就是两个一样
            //transform: rotate(180deg);
            var type = +styles.type; 

            for(var i = 0, len = names.length; i < len; i++){

                var name = names[i] || {};
                if(name.length == 2){
                    //两个字人名 中间添加空格
                    name = name.split("").join("　");
                }
                if(type == 0){
                    html.push('<div>');
                    html.push('<div class="preview_left_text" style="transform: rotate(180deg); ' + containerStyle + '">');
                    html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');

                    html.push('<div>');
                    html.push('<div class="preview_left_text" style="' + containerStyle + '">');
                    html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');

                }else if(type == 1){
                    html.push('<div>');
                    html.push('<div class="preview_left_text"  style="' + containerStyle + '">');
                    html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');
                    
                    
                    html.push('<div>');
                    html.push('<div class="preview_left_text"  style="' + containerStyle + '">');
                    html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');
                }else{
                    html.push('<div>');
                    html.push('<div class="preview_left_text"  style="' + containerStyle + '">');
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
