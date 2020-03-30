layui.config({
	base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
	index: 'lib/index' //主入口模块
}).use(['index', 'table', 'jquery'], function() {
	var table = layui.table,
	admin = layui.admin,
	$ = layui.jquery;
	// #test-table-operate
	
	var arrangeList = [];

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
				
				arrangeList = [];

				table.render({
					elem: '#test-table-operate',
					data: data,
					// height: 515,
					cols: [
						[
							// 表头
							{
								type: 'checkbox',
								fixed: 'left'
							},
							// {
							// 	field: 'id',
							// 	title: 'ID',
							// 	sort: true,
							// 	align: 'left',
							// 	width: '10%',
							// 	event: 'seeDetail',
							// 	style: 'cursor: pointer;'
							// },
							{
								field: 'name',
								title: '对应关系名称',
								//align: "center"
							}, {
								field: 'meeting_name',
								title: '会议名称',
								//width: '15%',
								//align: "center"
	
							}, {
								field: 'rule_num',
								title: '规则数量',
								//width: '8%',
								//align: "center"
	
							},{
								field: 'attendee_num',
								title: '对应人数',
								//width: '8%',
								//align: "center"
							}, {
								field: 'modifytime',
								title: '更新时间',
								//width: '10%',
								sort: true,
								//align: "center"
							}, {
								width: 100,
								//align: 'center',
								//flxed: 'right',
								title: '操作',
								toolbar: '#test-table-operate-barDemo'
							}
						]
					],
					skin: 'line', //表格风格
					even: true,
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
        // console.log(obj.checked); //当前是否选中状态
        // // console.log(obj.data); //选中行的相关数据
        // console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
        // // console.log(table.checkStatus('test-table-operate').data); // 获取表格中选中行的数据
        if (obj.checked && obj.type == 'one') {
            var devi = {};
            devi = obj.data.id;
            arrangeList.push(devi)
        }
        if (!obj.checked && obj.type == 'one') {
            var index = arrangeList.indexOf(obj.data.id);
            if (index > -1) {
                arrangeList.splice(index, 1);
            }
        }
        if (!obj.checked && obj.type == 'all') {
            arrangeList.length = 0;

        }
        if (obj.checked && obj.type == 'all') {
            $.each(table.checkStatus('test-table-operate').data, function(idx, con) {
                var devi = {};
                devi = con.id;

                arrangeList.push(devi)
            });
            arrangeList = Array.from(new Set(arrangeList))
        }
        // console.log("checkbox(test-table-operate)---",arrangeList)

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
				maxmin: true,
				offset: '10%',
				area: ['60%', '80%'],
				content: 'attender2rule_update.html#/id='+_id,
				btn: ['保存', '取消'],
				yes: function(index, layero) {
					var body = layer.getChildFrame('body', index);
					var programmename = body.find('#programmename').val() || "";
					var select_meet = body.find('#select_meet').val() || "";
					var data = sessionStorage.getItem("attender2rule_data") || "";

					if(!programmename){
						layer.msg("请对应关系方案名称");
						return;
					}
					if(!select_meet){
						layer.msg("请选择会议");
						return;
					}

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
							// rule_bindings[index].sort_item = +item.sort_item;
							rule_bindings[index].sort_items = item.sortSelectItemData;
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
            delall: function() {
                layer.confirm('您将要进行列表清空操作,执行后您的所有记录将被删除,请谨慎操作,是否确认?', function(index) {
                    $.ajax({
                        async: false,
                        type: "get",
                        url: url + "/ruletemplate/empty",
                        dataType: "json",
                        success: function(msg) {
                            if (msg.code == 0) {
                                layer.msg("清空成功");
                                getListData();

                            } else {
                                layer.msg(msg.msg);
                            }
                        },
                        //失败的回调函数
                        error: function() {
                            console.log("error")
                        }
                    })
                    layer.close(index);
                });
            },
			allcheck: function() { 
                var cb = $(".layui-form-checkbox");
                $(".layui-form-checkbox").each(function() {
                    $(this).click();
                });
            },
			dels: function() {
				if(arrangeList.length == 0){
					return;
				}
				var condi = {
					"attribute_ids": arrangeList
				};
				layer.confirm('真的删除吗？', function() {
					$.ajax({
						url: "https://m.longjuli.com/v1/attendee2rules/batch_delete",
						type: "POST",
						data: JSON.stringify(condi),
						contentType: 'application/json', 
						success: function(msg) {
							if (msg.code == 0) {
								layer.msg("删除成功");
								getListData();
							} else {
								layer.msg(msg.msg);
							}
						},
						//失败的回调函数
						error: function() {
							console.log("error")
						}
					});
				});
            },
			add: function() {
				layer.open({
					type: 2,
					title: '增加对应关系方案',
					shadeClose: false, //弹出框之外的地方是否可以点击
					offset: '10%',
					maxmin: true,
					area: ['60%', '80%'],
					content: 'attender2rule_new.html',
					btn: ['保存', '取消'],
					yes: function(index, layero) {
						var body = layer.getChildFrame('body', index);
						var programmename = body.find('#programmename').val() || "";
						var select_meet = body.find('#select_meet').val() || "";
						var data = sessionStorage.getItem("attender2rule_data") || "";

						if(!programmename){
							layer.msg("请对应关系方案名称");
							return;
						}
						if(!select_meet){
							layer.msg("请选择会议");
							return;
						}

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
								// rule_bindings[index].sort_item = +item.sort_item;
								rule_bindings[index].sort_items = item.sortSelectItemData;
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
