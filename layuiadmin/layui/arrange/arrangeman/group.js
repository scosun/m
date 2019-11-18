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
	$.ajax({
		async: false,
		type: "post",
		url: "https://www.longjuli.com/ajax",
		dataType: "json",
		//成功的回调函数
		data: {
			"a": "s1",
			"t": "roomlist"
		},
		success: function(msg) {

			var data = msg.data;
			$.each(data, function(idx, con) {

				$("#select_meet").after("<option value=" + con.roomid + ">" + con.roomname + "</option>");
			})



		},
		//失败的回调函数
		error: function() {
			console.log("error")
		}
	})

	form.render(null, 'component-form-group');

	laydate.render({
		elem: '#LAY-component-form-group-date'
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

		// var rowname = $("#select-room").find("option[value='"+data.field.interest+"']").text();
		var ruletype = 0;
		if (data.field.close == "on") {
			ruletype = 1;
		}
		
		var openid = 0;
		var ruleid;
		var roomid;

		$.ajax({
			async: false,
			type: "post",
			url: "https://www.longjuli.com/ajax",
			dataType: "json",
			//成功的回调函数
			data: {
				"a": "add",
				"t": "rulelist",
				"name": data.field.user,
				"ruletype": ruletype,
				"roomid": data.field.interest
			},
			success: function(msg) {

				var data = msg.state;
				console.log(data);
					console.log(msg.id);
						console.log(msg.roomid);
				
				var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
				
				parent.layer.close(index); //再执行关闭 
				open(msg);
					
							
					
							
							// body.find("#ruleid").val(data.roomid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
				
						
					
				}
			,
			//失败的回调函数
			error: function() {
				console.log("error")
			}
		})
		function  open(msg) {
			parent.layer.open({
				type: 2,
				//title: '收藏管理 (考生姓名：张无忌)',
				title: '  ',
				shadeClose: false, //弹出框之外的地方是否可以点击
				area: ['100%', '106%'],
				closeBtn : 1,
				offset: '-43px',
				content: 'territory_rules_edit.html?ruleid='+msg.id+'&roomid='+msg.roomid,
				success: function(layero, index) {
					// var body = window.parent.layer.getChildFrame('body', index);
					// console.log(body)
				   // parent.$("#ruleid").val(msg.ruleid);
				   // parent.$("#roomid").val(msg.roomid);
					// body.find("#roomid").val(msg.roomid);
					}})
			
		}
		
		
		// if(openid == 1) {
		// 	  
		// }

		return false;
	});


});