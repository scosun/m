layui.config({
				base: '../../../layuiadmin/' //静态资源所在路径
			}).extend({
				index: 'lib/index' //主入口模块
			}).use(['index', 'form', 'laydate'], function() {
				var $ = layui.$,
					admin = layui.admin,
					element = layui.element,
					layer = layui.layer,
					laydate = layui.laydate,
					form = layui.form;


				form.render(null, 'component-form-group');

				laydate.render({
					elem: '#LAY-component-form-group-date'
				});
				
				//日期时间选择器
				laydate.render({
				  elem: '#test-laydate-type-datetime'
				  ,type: 'datetime'
				});

				

				/* 监听指定开关 */
				form.on('switch(component-form-switchTest)', function(data) {
					layer.msg('开关checked：' + (this.checked ? 'true' : 'false'), {
						offset: '6px'
					});
					layer.tips('温馨提示：请注意开关状态的文字可以随意定义，而不仅仅是ON|OFF', data.othis)
				});

				/* 监听提交 */
				form.on('submit(component-form-demo1)', function(data) {
					parent.layer.alert(JSON.stringify(data), {
						title: '最终的提交信息'
					})
					return false;
				});
			});
			
			