 layui.config({
        base: '../../../layuiadmin/' //静态资源所在路径
    }).extend({
        index: 'lib/index' //主入口模块
    }).use(['index', 'form','upload'], function(){
        var $ = layui.$
            ,upload = layui.upload
            ,form = layui.form;

        //监听提交
        var uploadInst = upload.render({
            elem: '#test-upload-normal'
            ,url: '/upload/'
            ,before: function(obj){
                //预读本地文件示例，不支持ie8
                obj.preview(function(index, file, result){
                    $('#test-upload-normal-img').attr('src', result); //图片链接（base64）
                });
            }
            ,done: function(res){
                //如果上传失败
                if(res.code > 0){
                    return layer.msg('上传失败');
                }
                //上传成功
            }
            ,error: function(){
                //演示失败状态，并实现重传
                var demoText = $('#test-upload-demoText');
                demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
                demoText.find('.demo-reload').on('click', function(){
                    uploadInst.upload();
                });
            }
        });
        //渲染会议下拉框的ajax
        $.ajax({
            async: false,
            type: "post",
            url: "https://www.longjuli.com/ajax",
            dataType: "json",
            //成功的回调函数
            data: {
                "a": "s",
                "t": "meetinglist",
                "f":"sel"
            },
            success: function(msg) {

                var data = msg.reverse();

                $.each(data, function(idx, con) {
					$("#select_meet").after("<option value=" + con.id + ">" + con.name + "</option>");
					
                })
				
				 $("#meeting_list").val($("#meetingid").val());


            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
        //渲染分组的下拉框
        $.ajax({
            async: false,
            type: "post",
            url: "https://www.longjuli.com/ajax",
            dataType: "json",
            //成功的回调函数
            data: {
                "a": "s1",
                "t": "attendergrouplist",
            },
            success: function(msg) {

                var data = msg.data.reverse();

                $.each(data, function(idx, con) {

                    $("#select_group").after("<option value=" + con.groupid + ">" + con.groupname + "</option>");
                })
				
				
				$("#group_list").val($("#groupid").val());



            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
        //渲染党派的下拉框
        $.ajax({
            async: false,
            type: "post",
            url: "https://www.longjuli.com/ajax",
            dataType: "json",
            //成功的回调函数
            data: {
                "a": "s1",
                "t": "attenderpartylist",
            },
            success: function(msg) {

                var data = msg.data.reverse();

                $.each(data, function(idx, con) {

                    $("#select_party").after("<option value=" + con.partyid + ">" + con.partyname + "</option>");
                })
	            $("#partyid_list").val($("#partyid").val());

            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
        //渲染界面下拉框
        $.ajax({
            async: false,
            type: "post",
            url: "https://www.longjuli.com/ajax",
            dataType: "json",
            //成功的回调函数
            data: {
                "a": "s1",
                "t": "attenderdifferentlist",
            },
            success: function(msg) {

                var data = msg.data.reverse();

                $.each(data, function(idx, con) {

                    $("#select_different").after("<option value=" + con.differentid + ">" + con.differentname + "</option>");
                })
				$("#different_list").val($("#differentid").val());

            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
        upload.render({
            elem: '#test-upload-drag'
            ,url: '/upload/'
            ,done: function(res){
                console.log(res)
            }
        });
        //渲染特殊身份下拉框
        $.ajax({
            async: false,
            type: "post",
            url: "https://www.longjuli.com/ajax",
            dataType: "json",
            //成功的回调函数
            data: {
                "a": "s1",
                "t": "attenderspeciallist",
            },
            success: function(msg) {

                var data = msg.data.reverse();

                $.each(data, function(idx, con) {

                    $("#select_special").after("<option value=" + con.specialid + ">" + con.specialname + "</option>");
                })
				$("#special_list").val($("#specialid").val());


            },
            //失败的回调函数
            error: function() {
                console.log("error")
            }
        })
        upload.render({
            elem: '#test-upload-drag'
            ,url: '/upload/'
            ,done: function(res){
                console.log(res)
            }
        });
        form.render();
        form.on('select(component-form-isconvenor)', function(data){
          if(data.value == 1){
              $("#convenornum_list").show();

          }
          if(data.value == 2){
              $("#convenornum_list").css("display","none");
          }
        });
    })