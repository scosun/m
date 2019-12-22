layui.config({
	base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
	index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery'], function() {
	var table = layui.table,
	admin = layui.admin,
	$ = layui.jquery;
	// #test-table-operate
	
	getListData();

	function getListData(key){
		if(!key){
			key = "";
		}
		$.ajax({
			async: true,
			type: "get",
			url: "https://m.longjuli.com/v1/attendee2rules?page=1&limit=10&q="+key,//修改为 参会人员和座区规则对应关系方案 表
			dataType: "json",
			//成功的回调函数
			// data: {
			// 	"a": "s1",
			// 	"t": "rulelist"
			// },
			success: function(msg) {
				console.log("=====",msg)
				var data = msg.data;
				data.reverse();
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
								field: 'id',
								title: 'ID',
								sort: true,
								align: 'left',
								width: '10%',
								event: 'seeDetail',
								style: 'cursor: pointer;'
							}, {
								field: 'name',
								title: '对应关系名称',
								align: "center"
							}, {
								field: 'meeting_name',
								title: '会议名称',
								width: '15%',
								align: "center"
	
							}, {
								field: 'rule_num',
								title: '规则数量',
								width: '8%',
								align: "center"
	
							},{
								field: 'stauts',
								title: '对应人数',
								width: '8%',
								align: "center"
							}, {
								field: 'modifytime',
								title: '更新时间',
								width: '10%',
								sort: true,
								align: "center"
							}, {
								width: 230,
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
	}

	function saveAttendee2rules(condi,index){
		$.ajax({
			async: true,
			type: "post",
			data: JSON.stringify(condi),
			contentType: 'application/json', 
			url: "https://m.longjuli.com/v1/attendee2rules",
			dataType: "json",
			success: function(obj) {
				// console.log("--saveAttendee2rules---",condi);
				if(obj && obj.id){
					if(condi.attendee2rule.id){
						layer.msg("修改成功");
					}else{
						layer.msg("添加成功");
					}

					layer.close(index);

					getListData();
				}
			},
			//失败的回调函数
			error: function() {
				console.log("error")
			}
		});
	}

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

		if (obj.event === 'unused') {//未用
			//layer.msg('ID：' + data.id + ' 的查看操作');
		} else if (obj.event === 'use') {//使用
				
		} else if (obj.event === 'binding') {//绑定
			
		} else if (obj.event === 'edit') {
			//编辑
			var _id = data.id;
			layer.open({
				type: 2,
				title: '编辑对应关系方案',
				shadeClose: false, //弹出框之外的地方是否可以点击
				offset: '10%',
				area: ['60%', '80%'],
				content: 'attender2rule_update.html#/id='+_id,
				btn: ['保存', '取消'],
				yes: function(index, layero) {
					var body = layer.getChildFrame('body', index);
					var programmename = body.find('#programmename').val();
					var select_meet = body.find('#select_meet').val();
					var data = sessionStorage.getItem("attender2rule_data") || "";

					var condi = {};
					condi.attendee2rule = {
						"id":_id,
						"name": programmename,
						"meeting_id": +select_meet,
						"rule_bindings": []
					};
					if(data){
						var obj = JSON.parse(data);
						// console.log("-----obj------",obj)
						var rule_bindings = condi.attendee2rule.rule_bindings;
						obj.forEach(function(item,index){
							rule_bindings[index] = {};
							rule_bindings[index].rulesetup_id = +item.id;
							rule_bindings[index].sort_item = +item.sort_item;
							rule_bindings[index].attribute_ids = item.treeCheckedIds;
							
						});
					}
					console.log(condi);
					
					saveAttendee2rules(condi,index);
				}
			});
		} else if (obj.event === 'del') {//删除
			var condi = {
			 "attribute_ids": [data.id]
			};
			layer.confirm('真的删除吗？', function() {
				$.ajax({
					url: "https://m.longjuli.com/v1/attendee2rules/batch_delete",
					type: "POST",
					data: JSON.stringify(condi),
					contentType: 'application/json', 
					success: function(data) {
						if (data.code == 0) {
							layer.msg('成功删除', {
								icon: 1
							})
							obj.del();
							getListData();
							// table.reload('test-table-operate', {
							// 	data: a
							// })
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
					title: '增加对应关系方案',
					shadeClose: false, //弹出框之外的地方是否可以点击
					offset: '10%',
					area: ['60%', '80%'],
					content: 'attender2rule_new.html',
					btn: ['保存', '取消'],
					yes: function(index, layero) {
						var body = layer.getChildFrame('body', index);
						var programmename = body.find('#programmename').val();
						var select_meet = body.find('#select_meet').val();
						var data = sessionStorage.getItem("attender2rule_data") || "";

						var condi = {};
						condi.attendee2rule = {
							"name": programmename,
							"meeting_id": +select_meet,
							"rule_bindings": []
						};
						if(data){
							var obj = JSON.parse(data);
							// console.log("-----obj------",obj)
							var rule_bindings = condi.attendee2rule.rule_bindings;
							obj.forEach(function(item,index){
								rule_bindings[index] = {};
								rule_bindings[index].rulesetup_id = +item.id;
								rule_bindings[index].sort_item = +item.sort_item;
								rule_bindings[index].attribute_ids = item.treeCheckedIds;
								
							});
						}
						console.log(condi);
						
						saveAttendee2rules(condi,index);
					}
				});
			},
			reload:function() {
				var key = $("#search-key").val();
				getListData(key);
			},
			close:function(){
				var index = parent.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
	
				parent.layer.close(index); //再执行关闭 
			}
		};
	$('.test-table-operate-btn .layui-btn,.test-table-reload-btn .layui-btn').on('click', function() {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});


});
