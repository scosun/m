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

				var day2 = new Date();
				day2.setTime(day2.getTime());
				var hour = day2.getHours(); //得到小时
				
				var minu = day2.getMinutes(); //得到分钟
				
				var sec = day2.getSeconds(); //得到秒
				var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
				var s3 = hour + ":" + minu + ":" + sec;
				
				//日期时间选择器
				
				var ins22 = laydate.render({
				  elem: '#test-laydate-limit1'
				  ,min: s2
				  ,max: '2080-10-14'
				  ,format: 'yyyy年MM月dd日' //可任意组合
				  ,theme: 'molv'
				});
				
				laydate.render({
				  elem: '#test-laydate-limit3'
				  ,type: 'time'
				  ,format: 'HH:mm'
				  ,btns: ['clear', 'confirm']
				  ,theme: 'molv'
				});


				$.ajax({
					async: false,
					type: "post",
					url: "https://www.longjuli.com/ajax",
					dataType: "json",
					//成功的回调函数
					data: {
						"a": "s1",
						"t": "rulelist"
					},
					success: function(msg) {

						var data = msg.data;

						$.each(data, function(idx, con) {

							$("#select_meet").after("<option value=" + con.ruleid + ">" + con.rulename + "</option>");
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
				form.on('select(component-form-select)', function(data) {
					var value = data.value;
					$("#ruleid").val(value);

					$.ajax({
						async: false,
						type: "post",
						url: "https://www.longjuli.com/ajax",
						dataType: "json",
						//成功的回调函数
						data: {
							"a": "s",
							"t": "rule",
							"c": value
						},
						success: function(msg) {

							$.each(msg, function(idx, con) {
							

								var name = con.roomname + "";
								var id = con.roomid + "";

								$("#meetnameo").val(name);
								$("#id").val(id);

							})

						},
						//失败的回调函数
						error: function() {
							console.log("error")
						}
					})
				});

				/* 监听提交 */
				form.on('submit(component-form-demo1)', function(data) {
					// data.field.time   需要进行一个时间的转换 - 判断是否大于12点？上午:下午
					console.log(data);
					console.log(data.field.time);
					var datime = "";
					if (data.field.time >'12:00') {
						datime = "下午"+data.field.time;
					}else{
						datime = "上午"+data.field.time;
					}
					
					var datatime = data.field.date+" "+datime;
					console.log(datatime);
					 
					 console.log(data.field.addressd);

					$.ajax({	
						async: false,
						type: "post",
						url: "https://www.longjuli.com/ajax",
						dataType: "json",
						//成功的回调函数
						data: {
							"a": "add",
							"name": data.field.name,
							"time": datatime,
							"roomid": data.field.roomid,
							"address": data.field.addressd,
							"ruleid": data.field.interest,
							"memo": data.field.memo
						},
						success: function(msg) {
							if (msg.state == 1) {
								layer.msg("增加成功");
								var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
								parent.layer.close(index);
								parent.location.reload(); // 父页面刷新

							} else {
								layer.msg("增加失败");
								var index = parent.layer.getFrameIndex(window.name); //获取当前窗口的name
								parent.layer.close(index);
								parent.location.reload(); // 父页面刷新


							}

						},
						//失败的回调函数
						error: function() {
							console.log("error")
						}
					})
					return true;
				});
			});