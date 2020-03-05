layui.config({
				base: '../../../../layuiadmin/' //静态资源所在路径
			}).extend({
				index: 'lib/index' //主入口模块
			}).use(['index', 'table', 'jquery'], function() {
				var table = layui.table,
					admin = layui.admin,
					$ = layui.jquery;


				$.ajax({
					async: true,
					type: "post",
					url: "https://www.longjuli.com/ajax",
					dataType: "json",
					//成功的回调函数
					data: {
						"a": "s1",
						"t": "attenderspeciallist"
					},
					success: function(msg) {

						var data = msg.data;





						table.render({
							elem: '#test-table-operate',
							data: data,
							height: 750,
							cols: [
								[
									// 表头
									{
										type: 'checkbox',
										fixed: 'left'
									},
									{
										field: 'specialid',
										title: 'ID',
										sort: true,
										align: 'left',
										width: '5%',
										event: 'seeDetail',
										style: 'cursor: pointer;'
									}, {
										field: 'specialname',
										title: '名称',
										width: '15%'

									}, {
										width: 178,
										align: 'center',
										flxed: 'right',
										toolbar: '#test-table-operate-barDemo'
									}
								]
							],
							skin: 'nob', //表格风格
							even: false, //隔行背景
							page: false, //是否显示分页
							limits: [25], //显示
							limit: 25 //每页默认显示的数量
						});

					},
					//失败的回调函数
					error: function() {
						console.log("error")
					}
				})
				
					window.onkeyup = function(ev) {
					var key = ev.keyCode || ev.which;
					if (key == 27) { //按下Escape
						layer.closeAll('iframe'); //关闭所有的iframe层
				
					}
				}

				//监听表格复选框选择
				table.on('checkbox(test-table-operate)', function(obj) {
					console.log(obj)
				});
				//监听工具条
				table.on('tool(test-table-operate)', function(obj) {
					var data = obj.data;
					 if (obj.event === 'del') {
						layer.confirm('真的删除行么', function(index) {
							obj.del();

							$.ajax({
								async: false,
								type: "post",
								url: "https://www.longjuli.com/ajax",
								dataType: "json",
								//成功的回调函数
								data: {
									"a": "d",
									"id": obj.data.meetingid
								},
								success: function(msg) {

									if (msg.state == 1) {
										layer.msg("删除成功");
									} else {
										layer.msg("删除失败");

									}

								},
								//失败的回调函数
								error: function() {
									console.log("error")
								}
							})
							layer.close(index);
						});
					} else if (obj.event === 'edit') {
						layer.open({
							type: 2,
							title: '编辑信息',
							shadeClose: true, //弹出框之外的地方是否可以点击
							offset: '10%',
							area: ['60%', '80%'],
							content: 'identity_edit.html',
							success: function(layero, index) {
								var body = layui.layer.getChildFrame('body', index);
								if (data) {

									body.find("#id").val(data.specialid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据

									body.find(".specialname").val(data.specialname); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据

									// 记得重新渲染表单
								}
							}
						});
					}
				});

				var $ = layui.$,
					active = {
						getCheckData: function() { //获取选中数据
							var checkStatus = table.checkStatus('test-table-operate'),
								data = checkStatus.data;
							layer.alert(JSON.stringify(data));
						},
						getCheckLength: function() { //获取选中数目
							var checkStatus = table.checkStatus('test-table-operate'),
								data = checkStatus.data;
							layer.msg('选中了：' + data.length + ' 个');
						},
						isAll: function() { //验证是否全选
							var checkStatus = table.checkStatus('test-table-operate');
							layer.msg(checkStatus.isAll ? '全选' : '未全选')
						},
						add: function() {
							layer.open({
								type: 2,
								title: '增加规则',
								shadeClose: true, //弹出框之外的地方是否可以点击
								offset: '10%',
								area: ['60%', '80%'],
								content: 'meet_creat_from.html',
								yes: function(index, layero) {
									
								}
								// content: '/gkzytb/franchiser/rigthColumnJsonList'
							});

						},
					};

				$('.test-table-operate-btn .layui-btn').on('click', function() {
					var type = $(this).data('type');
					active[type] ? active[type].call(this) : '';
				});

			});