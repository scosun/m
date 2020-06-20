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
    

    $("#print").bind('click',function(){
        $("#container").jqprint({
            debug: false, 
            importCSS: true, 
            printContainer: true, 
            operaSupport: false
        });
    });

    $("#smallbtn").bind('click',function(){
        setSeatsign();
    });

    function setSeatsign(){
        var data = {};
        data.id = 123;
        data.isgrouplist = 3
        layer.open({
            type: 2,
            title: '设置',
            area: ['50%', '40%'],
            btn: ['确定', '取消'],
            maxmin: true,
            content: 'setup_pop.html',
            success: function(layero, index) {
                
            },
            yes:function (index,layero) {
                var sign = sessionStorage.getItem("__selectsign") || "";
                console.log("sign-----",sign);

                if(sign){
                    showName(JSON.parse(sign));
                }

                layer.close(index);
                // var submit = layero.find('iframe').contents().find("#click");
                // submit.click();
            }
        })
    }

    
    function showName(styles){
        // var namestr = sessionStorage.getItem("_printnames") || "";
        var textarea = document.getElementById("name");
        var value = textarea.value;
        var names = value.split("\n");

        if(names){
            var html = [];

            var namestyle = "";
            var style = "width:" + styles.width + "mm;height:" + styles.length + "mm;"
            var classtext = "preview_left_text " + styles.font;
            if(styles.position || styles.align){
                classtext += " flex ";
                if(styles.align){
                    classtext += (" " + styles.align);
                }
                if(styles.position){
                    classtext += (" " + styles.position);
                }
            }

            namestyle = " font-size:"+styles.fontSize + "mm;letter-spacing:"+styles.vertical + "mm;"
            if(styles.above || styles.left){
                namestyle += " margin-top:"+styles.above + "mm;margin-left:"+styles.left + "mm;"
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
                    html.push('<div id="fontwh" class="' + classtext + '" style="transform: rotate(180deg); ' + style + '">');
                    html.push('<span id="printnametext" class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');

                    html.push('<div>');
                    html.push('<div id="fontwh" class="' + classtext + '" style="' + style + '">');
                    html.push('<span id="printnametext" class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');
                }else{
                    html.push('<div>');
                    html.push('<div id="fontwh" class="' + classtext + '" style="' + style + '">');
                    html.push('<span id="printnametext" class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');
                    
                    
                    html.push('<div>');
                    html.push('<div id="fontwh" class="' + classtext + '" style="' + style + '">');
                    html.push('<span id="printnametext" class="printname" style="' + namestyle + '">' + name + '</span>');
                    html.push('</div>');
                    html.push('</div>');
                }
            }
            $("#container").html(html.join(''));

        }

        // control+p
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
