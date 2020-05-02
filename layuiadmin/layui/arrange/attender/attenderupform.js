layui.config({
    base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
    index: 'lib/index' //主入口模块
}).use(['index', 'form','upload','tree'], function(){
    var $ = layui.$
        ,upload = layui.upload
        ,form = layui.form,
        setter = layui.setter,
        tree = layui.tree
    var url = setter.baseUrl;
    var attributes =[];
    var uploadfile = null;
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
            demoText.html('<span style="color: #ff5722;">上传失败</span> <a class="layui-btn layui-btn-mini demo-reload">重试</a>');
            demoText.find('.demo-reload').on('click', function(){
                uploadInst.upload();
            });
        }
    });
    //渲染会议下拉框的ajax
    $.ajax({
        async: false,
        type: "get",
        url: url+"/meeting/findAll",
        dataType: "json",
        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        data: {
           
        },
        success: function(msg) {

            var data = msg.data.reverse();

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
    var data;
    var id = $('#id').val();
    console.log(id)
    $.ajax({
        async: false,
        type: "get",
        url: url+"/attribute/findshowtree",
        datatype: 'json',
        data:{
            "id":id
        },

        xhrFields: {
            withCredentials: true
        },
        //成功的回调函数
        success: function (msg) {
            data = msg.data

        },
        error: function (error) {
            console.log(error)
        },
    })
    //渲染
    var inst1 = tree.render({
        elem: '#tree'  //绑定元素
        , data: data,
        showCheckbox: true,
        oncheck: function (obj) {
            // console.log(obj.data); //得到当前点击的节点数据
            // console.log(obj.checked.id); //得到当前节点的展开状态：open、close、normal
            // console.log(obj.elem); //得到当前节点元素
            if(obj.checked == true){
                if(obj.data.children.length !=0){
                    $.each(obj.data.children,(idx,con)=>{
                        attributes.push(con.id);
                    })    
                }else{
                    attributes.push(obj.data.id);
                }
               
            }else{
                if(obj.data.children.length !=0){
                    $.each(obj.data.children,(idx,con)=>{
                        attributes.splice($.inArray(con.id,attributes),1)
                    })    
                }else{
                    var i = $.inArray(obj.data.id,attributes)
                    
                if( i != -1){
                    attributes.splice(i,1)
                } 
                }
                
             
               
            }
        }

    });
    
    upload.render({
        elem: '#test-upload-drag'
        ,url: '/upload/',
        auto: false,    
        bindAction:'#btn99',
        choose: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
            obj.preview(function(index, file, result){
                // console.log(index); //得到文件索引
                // console.log(file);
                uploadfile = file;//得到文件对象
                // console.log(uploadfile)
                // console.log(result); //得到文件base64编码，比如图片
                
                //obj.resetFile(index, file, '123.jpg'); //重命名文件名，layui 2.3.0 开始新增
                
                //这里还可以做一些 append 文件列表 DOM 的操作
                
                //obj.upload(index, file); //对上传失败的单个文件重新上传，一般在某个事件中使用
                //delete files[index]; //删除列表中对应的文件，一般在某个事件中使用
              });
          }
        ,done: function(res){
            console.log(res)
        }
    });
    
    // upload.render({
    //     elem: '#test-upload-drag'
    //     ,url: '/upload/'
    //     ,done: function(res){
    //         console.log(res)
    //     }
    // });
    form.render();
    form.on('select(isconvenor)', function(data){
        if(data.value == 0){
            $("#convenornums").show();

        }
        if(data.value == 1){
            $("#convenornums").css("display","none");
        }
    });
    form.on('select(isstagger)', function(data){
        if(data.value == 1){
            $("#viprooms").show();

        }
        if(data.value == 0){
            $("#viprooms").css("display","none");
        }
    });
	
	form.on('submit(updatameeting)', function(data) {
		console.log("22222");
		console.log(data);
		var formdata = new FormData();
		if(uploadfile != null){
		    /* return layer.msg("请选择证件照片") */
			formdata.append('file',uploadfile);
		}
		formdata.append('id',data.field.id);
		formdata.append('name',data.field.author);
		formdata.append('cardId',data.field.cardid);
		formdata.append('company',data.field.company);
		formdata.append('contacts',data.field.contacts);
		formdata.append('meetingId',data.field.meeting_list);
		formdata.append('duties',data.field.duties);
		formdata.append('phone1',data.field.phone1);
		formdata.append('phone2',data.field.phone2);
		formdata.append('sexid',data.field.sexid);
		formdata.append('contactsPhone',data.field.contactsphone);
		formdata.append('attributes',JSON.stringify(attributes));
		formdata.append('seatid','');
		formdata.append('sortItems','');
		formdata.append('camera','');
		formdata.append('compareimg1','');
		formdata.append('compareimg2','');
		formdata.append('compareimg3','');
        formdata.append('viproomId',data.field.viproom);
        formdata.append('isconvenor',data.field.isconvenor);
        formdata.append('isstage',data.field.isstagger);
        formdata.append('convenornum',data.field.convenornum);
        formdata.append('address',data.field.address);
        formdata.append('roomnum',data.field.roomnum);
        formdata.append('szx',data.field.szm);
		$.ajax({
			async: false,
			url: url + "/meetingcanhui/updateMeetingCanHui",
			type: "POST",
			xhrFields: {
			    withCredentials: true
			},
			data: formdata,
			contentType:false,
			processData: false,
			success: function (res) {
			    if (res.code == '0') {
			        parent.layer.msg('维护成功');
					var index = parent.layer.getFrameIndex(window.name)
					parent.layer.close(index)
					parent.ajaxs(data.field.meeting_list)
			    } else {
			        layer.msg(res.msg, {
			            icon: 5
			        });
					var index = parent.layer.getFrameIndex(window.name)
					parent.layer.close(index)
			    }
			},
			error: function (error) {
			    layer.msg('维护失败，服务器错误请稍后再试', {
			        icon: 5
			    });
			    layer.close(index);
			}
		});
		
	});
	
    form.on('submit(addmeeting)', function(data) {
        console.log(data)
        console.log()
        if(uploadfile == null){
            return layer.msg("请选择证件照片")
        }
        var formdata = new FormData();
        formdata.append('file',uploadfile);
        formdata.append('name',data.field.author);
        formdata.append('cardId',data.field.cardid);
        formdata.append('company',data.field.company);
        formdata.append('contacts',data.field.contacts);
        formdata.append('meetingId',data.field.meeting_list);
        formdata.append('duties',data.field.duties);
        formdata.append('phone1',data.field.phone1);
        formdata.append('phone2',data.field.phone2);
        formdata.append('sexid',data.field.sexid);
        formdata.append('contactsPhone',data.field.contactsphone);
        formdata.append('attributes',JSON.stringify(attributes));
        formdata.append('seatid','');
        formdata.append('sortItems','');
        formdata.append('viproomId',0);
        formdata.append('camera','');
        formdata.append('compareimg1','');
        formdata.append('compareimg2','');
        formdata.append('compareimg3','');
        
        $.ajax({
            async: false,
            type: "post",
            url: url+"/meetingcanhui/addMeetingCanHui",
            contentType:false,
            processData: false,
            data:formdata,
            xhrFields: {
                withCredentials: true
            },
            //成功的回调函数
            success: function (msg) {
                
                if(msg.code==0){
                    parent.layer.msg(msg.msg)
                    var index = parent.layer.getFrameIndex(window.name)
                    parent.layer.close(index)
                    parent.ajaxs(data.field.meeting_list)
                }else{
                    parent.layer.msg(msg.msg)
                    var index = parent.layer.getFrameIndex(window.name)
                    parent.layer.close(index)
                }

            },
            error: function (error) {
                console.log(error)
            },
        })
        
        return false;
    });
})