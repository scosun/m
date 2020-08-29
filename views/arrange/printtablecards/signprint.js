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
        printContainer();
    });


    $(document).bind("keydown",bodyOnKeyDown);

    function bodyOnKeyDown(){
        //Function Key
        if(event.ctrlKey){
            if(event.keyCode == 80){
                printContainer();
                event.keyCode = 0;
                event.returnValue = false;
            }
        }
    }

    $("#smallbtn").bind('click',function(){
        setSeatsign();
    });
    $("#preview").bind('click',function(){
        showName(signData);
    });
    $("#cancel").bind('click',function(){
        $("#name").val("");
    });

    function printContainer(){
        window.print()
        // $("#container").jqprint({
        //     debug: false, 
        //     importCSS: false, 
        //     printContainer: true, 
        //     operaSupport: false
        // });
    }

    var signData;
    function setSeatsign(){
        // var data = {};
        // data.id = 123;
        // data.isgrouplist = 3;
        layer.open({
            type: 2,
            title: '设置',
            area: ['550px', '360px'],
            btn: ['确定', '取消'],
            maxmin: true,
            content: 'setup_pop.html',
            success: function(layero, index) {
                
            },
            yes:function (index,layero) {
                var sign = sessionStorage.getItem("__selectsign") || "";
                console.log("sign-----",sign);

                if(sign){
                    var data = JSON.parse(sign);

                    $("#smallbtn").html(data.name);

                    var styles = data.style;
                    if(styles){
                        var obj = JSON.parse(styles);

                        signData = obj;
                        showName(obj);
                    }else{
                        layer.msg("没有获取到席签模板样式");
                    }
                    
                }else{
                    $("#smallbtn").html("设置席签模板");
                }

                layer.close(index);
                // var submit = layero.find('iframe').contents().find("#click");
                // submit.click();
            }
        })
    }

    
    function showName(fontStyles){
        // var namestr = sessionStorage.getItem("_printnames") || "";
        var textarea = document.getElementById("name");
        var value = textarea.value;
        var names = value.split("\n");
        
        if(!fontStyles){
            layer.msg("请选择席签模板");
            return;
        }

        if(names.length > 0 && fontStyles){
            var html = [];

            var nameFontStyles = [];
            var containerStyle = "";
            //0:单页双面,1:单页单面(2页), 2:单页单面(1页);单页双面 就是 一正一反;单页单面(2页) 就是两个一样;单页单面(1页) 就是 一个名字

            //transform: rotate(180deg);
            var type = 0; 

            fontStyles.forEach(function(fb){
                var styles = fb.style;
                var namestyle = "";
                if(!containerStyle){
                    containerStyle = "width:" + styles.width + "mm;height:" + styles.height + "mm;";

                    type = +styles.type; 
                }
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

                namestyle = " font-size:"+styles.fontSize + "mm;letter-spacing:"+styles.level + "mm;"
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

                nameFontStyles.push(namestyle);
            });
            

            // $("#printnametext").css({
            //     "font-size":(+seatSignData.fontSize/fontcc)+"mm",
            //     "letter-spacing":(+domlevel)+"mm",
            //     "margin-top":(+domabove)+"mm",
            //     "margin-left":(+domleft)+"mm"
            // });

            for(var i = 0, len = names.length; i < len; i++){
                var name = names[i] || "";
                //多段文本
                var moname = name.split(",");
                    
                if(name && moname.length > 0){
                    if(type == 0){
                        html.push('<div>');
                        html.push('<div class="preview_left_text" style="transform: rotate(180deg); ' + containerStyle + '">');
                        moname.forEach(function(name,idx){
                            var namestyle = nameFontStyles[idx];
                            if(name.length == 2){
                                //两个字人名 中间添加空格
                                name = name.split("").join("　");
                            }
                            html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                        });
                        html.push('</div>');
                        html.push('</div>');

                        html.push('<div>');
                        html.push('<div class="preview_left_text" style="' + containerStyle + '">');
                        moname.forEach(function(name,idx){
                            var namestyle = nameFontStyles[idx];
                            if(name.length == 2){
                                //两个字人名 中间添加空格
                                name = name.split("").join("　");
                            }
                            html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                        });
                        html.push('</div>');
                        html.push('</div>');

                    }else if(type == 1){
                        html.push('<div>');
                        html.push('<div class="preview_left_text"  style="' + containerStyle + '">');
                        moname.forEach(function(name,idx){
                            var namestyle = nameFontStyles[idx];
                            if(name.length == 2){
                                //两个字人名 中间添加空格
                                name = name.split("").join("　");
                            }
                            html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                        });
                        html.push('</div>');
                        html.push('</div>');
                        
                        
                        html.push('<div>');
                        html.push('<div class="preview_left_text"  style="' + containerStyle + '">');
                        moname.forEach(function(name,idx){
                            var namestyle = nameFontStyles[idx];
                            if(name.length == 2){
                                //两个字人名 中间添加空格
                                name = name.split("").join("　");
                            }
                            html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                        });
                        html.push('</div>');
                        html.push('</div>');
                    }else{
                        html.push('<div>');
                        html.push('<div class="preview_left_text"  style="' + containerStyle + '">');
                        moname.forEach(function(name,idx){
                            var namestyle = nameFontStyles[idx];
                            if(name.length == 2){
                                //两个字人名 中间添加空格
                                name = name.split("").join("　");
                            }
                            html.push('<span class="printname" style="' + namestyle + '">' + name + '</span>');
                        });
                        html.push('</div>');
                        html.push('</div>');
                    }
                    
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
