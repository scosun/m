	layui.config({
        		base: '../../../../layuiadmin/' //静态资源所在路径
        	}).extend({
        		index: 'lib/index' //主入口模块
        	}).use(['index', 'form', 'laydate'], function() {
        		var $ = layui.$,
        			admin = layui.admin,
        			element = layui.element,
        			layer = layui.layer,
        			laydate = layui.laydate,
        			form = layui.form;
        
        	
                var url="http://127.0.0.1:8083"
        
        		form.render(null, 'component-form-group');
        
        		laydate.render({
        			elem: '#LAY-component-form-group-date'
        		});
        
        		
        
        
        		/* 监听指定开关 */
        		form.on('select(component-form-select)', function(data) {
        			
        		});
        
        		/* 监听提交 */
        		form.on('submit(component-form-demo1)', function(data) {
                    console.log(data)
        			$.ajax({
        				async: true,
        				type: "post",
        				url: url+"/meetinggroupcanhui/addMeetingGroupCanHui",
        				dataType: "json",
                        data:{
                           
                            "name":data.field.groupname
                        },
        				//成功的回调函数
        				success: function(msg) {
        					if(msg.code=='0'){
                                parent.layer.msg("添加成功");
                                var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
                                parent.layer.close(index);
                                parent.reloads();
                             
                            }else{
                                layer.msg(msg.msg);
                            }
        				},
        				//失败的回调函数
        				error: function() {
        					console.log("ajax : error")
        				}
        			})
        			
        			return false;
        		});
        	});