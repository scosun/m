layui.config({
	base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
	index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery'], function() {
	var table = layui.table,
		admin = layui.admin,
		$ = layui.jquery;

	// #test-table-operate

	$.ajax({
		async: true,
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
			data.reverse()
			// console.log(data)

			table.render({
				elem: '#test-table-operate',
				data: data,
				height: 515,
				cols: [
					[
						// 表头
						{
							type: 'checkbox',
							fixed: 'left'
						},
						{
							field: 'ruleid',
							title: '编排规则ID',
							sort: true,
							align: 'left',
							width: '9%',
							event: 'seeDetail',
							style: 'cursor: pointer;'
						}, {
							field: 'rulename',
							title: '会议名',
							width: '20%',
							align: "center"

						}, {
							field: 'roomname',
							title: '会议室地点',
							width: '20%',
							align: "center"

						}, {
							field: 'stauts',
							title: '会议规则',
							width: '15%',
							align: "center"

						}, {
							field: 'modifytime',
							title: '更新时间',
							width: '20%',
							sort: true,
							align: "center"

						}, {
							width: '13.3%',
							align: 'center',
							flxed: 'right',
							title: '操作',
							toolbar: '#test-table-operate-barDemo'
						}
					]
				],
				skin: 'line', //表格风格
				page: true, //是否显示分页
				limits: [5, 10, 15], //显示
				limit: 10 //每页默认显示的数量
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
		if (obj.event === 'detail') {
			layer.msg('ID：' + data.id + ' 的查看操作');
		} else if (obj.event === 'del') {
			/**
			 * @param {Object} index
			 * 编排规则的借口提供之后需要接入删除
			 */
			// layer.confirm('真的删除行么', function(index) {
			// 	obj.del();
			// 	
			// 	$.ajax({
			// 		async: false,
			// 		type: "post",
			// 		url: "https://www.longjuli.com/ajax",
			// 		dataType: "json",
			// 		//成功的回调函数
			// 		data: {
			// 			"a": "d",
			// 			"id": obj.data.meetingid
			// 		},
			// 		success: function(msg) {
			// 	
			// 			if(msg.state==1){
			// 				layer.msg("删除成功");
			// 			}else {
			// 				layer.msg("删除失败");
			// 
			// 			}
			// 	
			// 		},
			// 		//失败的回调函数
			// 		error: function() {
			// 			console.log("error")
			// 		}
			// 	})
			// 	layer.close(index);
			// });
		} else if (obj.event === 'edit') {
			
			layer.open({
				type: 2,
				//title: '收藏管理 (考生姓名：张无忌)',
				title: '  ',
				shadeClose: false, //弹出框之外的地方是否可以点击
				area: ['100%', '106%'],
				closeBtn : 1,
				offset: '-43px',
				content: 'territory_rules.html',
				success: function(layero, index) {
					var body = layui.layer.getChildFrame('body', index);
					if (data) {
						var roomid;
						// 取到弹出层里的元素，并把编辑的内容放进去
						body.find("#ruleid").val(data.ruleid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
						$.ajax({
							async: true,
							type: "post",
							url: "https://www.longjuli.com/ajax",
							dataType: "json",
							//成功的回调函数
							data: {
								"a": "s",
								"t": "rule",
								"c": data.ruleid
							},
							success: function(msg) {
						
								var data = msg;
				
								$.each(data, function(idx, con) {
									
									roomid =  con.roomid;
									
								})
								
								
								body.find("#roomid").val(roomid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据
							},
							//失败的回调函数
							error: function() {
								console.log("error")
							}
						})
						
				
						
						// body.find("#ruleid").val(data.roomid); //将选中的数据的id传到编辑页面的隐藏域，便于根据ID修改数据

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
					content: 'group.html'
					// content: '/gkzytb/franchiser/rigthColumnJsonList'
				});
			},
		};

	$('.test-table-operate-btn .layui-btn').on('click', function() {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});

});
