layui.config({
	base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
	index: 'lib/index' //主入口模块
}).use(['index', 'user', 'table'], function() {
	var a = {};
	var b = {};

	var $ = layui.$,
		setter = layui.setter,
		admin = layui.admin,
		form = layui.form,
		element = layui.element,
		table = layui.table,
		layer = layui.layer,
		datas = null,
		router = layui.router();
	element.render();
	$.ajax({
		url: "https://www.longjuli.com/ajax?",
		type: "POST",
		data: {
			"a": "s1",
			"t": "roomlist"
		},
		success: function(data) {
			var datas = data.data
			function compare(propertyName) {
				return function(object1, object2) {
					var value1 = parseInt(object1[propertyName]);
					var value2 = parseInt(object2[propertyName]);
					if (value2 < value1) {
						return -1;
					} else if (value2 > value1) {
						return 1;
					} else {
						return 0;
					}
				}
			}
			datas.sort(compare("roomid"))
			a = datas;
		},
		async: false
	})

	function ajaxs() {
		$.ajax({
			url: "https://www.longjuli.com/ajax",
			type: "POST",
			data: {
				"a": "s1",
				"t": "roomlist"
			},
			success: function(data) {
				var datas = data.data
				datas.reverse()
				a = datas;
			},
			async: false
		})
	}

	//绘制表格区
	table.render({
		elem: '#test-table-operate',
		data: a,
		// height: 515,
		page: true,
		skin: 'line',
		page: true, 			//开启分页
		limits: [5, 10, 15], 	//显示
		limit: 10,				//每页默认显示的数量
		cols: [
			[
				{
					type: 'checkbox',
					fixed: 'left'
				}, {
					field: 'roomid',
					width: '7%',
					title: 'ID',
					sort: true
				}, {
					field: 'roomname',
					title: '名称',
				}, {
					field: 'templatefilename',
					title: '代码',
					sort: true
				}, {
					field: 'seatrule',
					title: '座位编号'
				}, {
					// field: '1',
					align: 'center',
					title: '查看',
				    toolbar: '#table-zone-list'
				}, {
					field: 'modifytime',
					title: '更新时间',
					align: "left",
					sort: true
				}, {
					width: '10%',
					align: 'right',
					title: '操作',
					toolbar: '#table-content-list'
				}
			]
		]
	})
	table.on('tool(test-table-operate)', function(obj) {
		var age = obj.data;
		if (obj.event === 'edit') {
			layer.open({
				type: 2,
				title: '信息维护',
				content: 'meeting_room_form.html',
				//maxmin: true,
				area: ['60%', '80%'],
				btn: ['确定', '取消'],
				yes: function(index, layero) {
					var body = layer.getChildFrame('body', index);
					$.ajax({
						url: "https://www.longjuli.com/ajax",
						type: "POST",
						data: {
							"a": "u",
							"c": "s",
							"t": "roomlist",
							"id": age.roomid,
							"name": body.find('#roomname').val(),
							"templatefilename": body.find('#templatefilename').val(),
							"seatrule": body.find('#seatrule').val(),
							"templatecode": body.find('#templatecode').val()
						},
						success: function(data) {
							if (data.state == '1') {
								layer.msg('维护成功');
								layer.close(index);
								ajaxs();
								table.reload('test-table-operate', {
									data: a
								})
							} else {
								layer.msg('维护失败，请稍后再试', {
									icon: 5
								});
								layer.close(index);
							}
						},
						error: function(error) {
							layer.msg('维护失败，服务器错误请稍后再试', {
								icon: 5
							});
							layer.close(index);
						}
					})
				},
				success: function(layero, index) {
					var body = layer.getChildFrame('body', index);
					if (age) {
						body.find('#roomname').val(age.roomname);
						body.find('#templatefilename').val(age.templatefilename);
						if (age.seatrule == "左双右单") {
							body.find('#seatrule').val('0');
						}
						if (age.seatrule == "左单右双") {
							body.find('#seatrule').val('1');
						}
						$.ajax({
							url: "https://www.longjuli.com/ajax",
							type: "POST",
							async: false,
							data: {
								"a": "s",
								"t": "seatzone",
								"c": age.roomid
							},
							success: function(data) {
								var datas = data.data.code
								body.find('#templatecode').val(datas);
							}
						})
					}
				}
			});
		} else if (obj.event === 'del') {
			layer.confirm('真的删除吗？', function() {
				$.ajax({
					url: "https://www.longjuli.com/ajax",
					type: "POST",
					data: {
						"a": "d",
						"t": "roomlist",
						"id": age.roomid
					},
					success: function(data) {
						if (data.state == "1") {
							layer.msg('成功删除', {
								icon: 1
							})
							obj.del();
							ajaxs()
							table.reload('test-table-operate', {
								data: a
							})
						} else {
							layer.msg('删除失败，请稍后再试', {
								icon: 5
							});
						}
					},
					error: function(error) {
						layer.msg('删除失败，服务器错误请稍后再试', {
							icon: 5
						});
					}
				})
			});
		} else if (obj.event === 'zonelist') {
			layer.open({
				type: 2,
				title: '座区图',
				content: 'meeting_room_zq.html'
					// ,maxmin: true
					,
				area: ['100%', '100%'],
				scrollbar: false,
				yes: function(index, layero) {
				},
				success: function(layero, index) {
					var body = layer.getChildFrame('body', index);
					body.find('#roomid').val(age.roomid)
				}
			});
		}
	})

	//弹出层区
	var active = {
		add: function() {
			layer.open({
				type: 2,
				title: '<p style="">新增会议室</p>',
				content: 'meeting_room_form.html'
					// ,maxmin: true
					,
				area: ['60%', '80%'],
				btn: ['座区编辑','确定', '取消'],
				yes:function(index,layer0){
					// location.href= "seatmapseditor.html";
					//执行跳转
					var topLayui = parent === self ? layui : top.layui;
					topLayui.index.openTabsPage("arrange/meeting/seatmapseditor.html", "会场编辑器");
				},
				btn2: function(index, layero) {
					var body = layer.getChildFrame('body', index);
					$.ajax({
						url: "https://www.longjuli.com/ajax?",
						type: "POST",
						data: {
							"a": "add",
							"t": "roomlist",
							"name": body.find('#roomname').val(),
							"templatefilename": body.find('#templatefilename').val(),
							"seatrule": body.find('#seatrule').val(),
							"templatecode": body.find('#templatecode').val()
						},
						success: function(data) {
							if (data.state === 1) {
								layer.msg('添加成功');
								layer.close(index);
								var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
								submit.click();
								ajaxs();
								table.reload('test-table-operate', {
									data: a
								})
							} else {
								layer.msg('添加失败，请稍后再试', {
									icon: 5
								});
								layer.close(index);
							}
						},
						error: function(error) {
							layer.msg('添加失败，服务器错误请稍后再试', {
								icon: 5
							});
							layer.close(index);
						}
					})
				}
			});
		},
		edit: function() {
		},
	}
	//弹出层选项区
		window.onkeyup = function(ev) {
		var key = ev.keyCode || ev.which;
		if (key == 27) { //按下Escape
			layer.closeAll('iframe'); //关闭所有的iframe层
		}
	}

	$('.layui-ds').on('click', function() {
		var type = $(this).data('type');
		active[type] && active[type].call(this);
	});
})
