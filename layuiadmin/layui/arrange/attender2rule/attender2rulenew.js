layui.config({
	base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
	index: 'lib/index' //主入口模块
}).use(['index', 'user', 'table','tree', 'util'], function() {
	var $ = layui.$,
		form = layui.form,
		element = layui.element,
		table = layui.table,
		layer = layui.layer,
		tree = layui.tree,
		util = layui.util,
		router = layui.router();


	//人员属性数据
	var attributesData = [];
	//已选中的人员属性
	// var ckPerAttr = [];
	// var ckPerAttrId = [];

	var open = 0;
	var ruleSetupData = [];
	var sortItemsData = [];

	$.ajax({
		async: true,
		type: "get",
		url: "https://m.longjuli.com/v1/meetings",
		dataType: "json",
		success: function(obj) {
			let data = obj.meetings || null;
			if(data && data.length > 0){
				$.each(data, function (index, item) {
					$('#select_meet').append(new Option(item.name, item.id));// 下拉菜单里添加元素
				});
				layui.form.render("select");
			}
			
			
		},
		//失败的回调函数
		error: function() {
			console.log("error")
		}
	});
	
	$.ajax({
		async: true,
		type: "get",
		url: "https://m.longjuli.com/v1/attributes",
		dataType: "json",
		success: function(obj) {
			// console.log("----",obj)
			// select_attributes
			var data = obj.data || null;
			var html = [];
			if(data && data.length){
				attributesData = data;

				$.each(data, function (index, item) {
					html.push('<input type="checkbox" name="attributes" title="' + item.name + '" id="' + item.id + '" lay-skin="primary"></input>');
				});
			}
			$("#select_attributes").html(html.join(''));
			layui.form.render();

			
		},
		//失败的回调函数
		error: function() {
			console.log("error")
		}
	});

	$.ajax({
		async: true,
		type: "get",
		url: "https://m.longjuli.com/v1/sort_items",
		dataType: "json",
		success: function(obj) {
			console.log("----",obj)
			// select_attributes
			var data = obj.data || [];
			sortItemsData = data;
		},
		//失败的回调函数
		error: function() {
			console.log("error")
		}
	});


	var meetingId;
	form.on('select(component-form-select)', function(data){
		var id = +data.value;
		meetingId = id;
		getRuleSetups(id);
	});

	form.on('select(sortitems-form-select)', function(data){
		var id = +data.value;
		ruleSetupData[open].sort_item = id;
	});

	
	function getRuleSetups(meeting_id){
		$.ajax({
			async: true,
			type: "get",
			url: "https://m.longjuli.com/v1/rulesetups?meeting_id="+meeting_id,
			dataType: "json",
			success: function(obj) {
				console.log("----",obj);

				var data = obj.rulesetups || null;
				var html = [];
				var ids = [];
				if(data && data.length){
					ruleSetupData = data;
					ruleSetupData.forEach(function(item){
						item.ckPerAttr = [];
						item.ckPerAttrId = [];
						item.treeData = [];
						item.treeCheckedIds = [];
						item.treeNoCheckedIds = [];
						item.sort_item = 0;
						item.attendees = {};
					});

					$.each(data, function (index, item) {
						ids.push(item.id);
						html.push('<p class="mb10">' + item.ruletype +' '+ item.rulename + '<span id="c_green" style="background:' + item.bgcolor +';"></span></p>');
						// html.push('<p class="mb15">属性1（a/b/c）、属性2（d/e/f）、属性3（g/h/i）、属性4（j/k/l）</p>');
					});
				}
				$("#rulesetups").html(html.join(''));
				layui.form.render();

				// getRuleAttrById(ids);
			},
			//失败的回调函数
			error: function() {
				console.log("error")
			}
		});
	}

	function getAttendeesCount(meeting_id,attribute_ids){
		$.ajax({
			async: true,
			type: "get",
			url: "https://m.longjuli.com/v1/attendees/count?meeting_id="+meeting_id+"&attribute_ids="+attribute_ids.join(','),
			dataType: "json",
			success: function(obj) {
				console.log("----",obj);

				var data = obj|| null;
				var html = [];
				if(data){
					ruleSetupData[open].attendees = data;

					var AttendeesNum = data.AttendeesNum;
					var attributes = data.attributes || [];
					html.push('<p class="mb10">筛选结果：' + AttendeesNum +'人</p>');
					html.push('<p class="mb15">详情：<span class="c_green">');
					for(var i = 0,len = attributes.length; i < len;i++){
						item = attributes[i];
						if(i == (len - 1)){
							html.push(item);
						}else{
							html.push(item+"、");
						}
					}
					html.push('</span></p>');
				}
				$("#attendees_count").html(html.join(''));
				layui.form.render();

			},
			//失败的回调函数
			error: function() {
				console.log("error")
			}
		});
	}

	function setEditRuleHtml(){
		var data = ruleSetupData;
		if(data && data.length){

			var html = [];
			$.each(data, function (index, item) {
				html.push('<p class="mb10">' + item.ruletype +' '+ item.rulename + '<span id="c_green" style="background:' + item.bgcolor +';"></span></p>');
				// html.push('<p class="mb15">属性1（a/b/c）、属性2（d/e/f）、属性3（g/h/i）、属性4（j/k/l）</p>');
				var obj = item.attendees;
				var attributes = obj.attributes || [];
				html.push('<p class="mb15">');
				for(var i = 0,len = attributes.length; i < len;i++){
					item = attributes[i];
					if(i == (len - 1)){
						html.push(item);
					}else{
						html.push(item+"、");
					}
				}
				html.push('</p>');
			});
		}
		$("#rulesetups").html(html.join(''));
		layui.form.render();


		//保存数据
		sessionStorage.setItem("attender2rule_data",JSON.stringify(data));
	}
	
	/* 编辑绑定上一步 下一步 */
	// var btnText = {
	// 	'first': ['下一步', '取消'],
	// 	'middle': ['下一步', '上一步', '取消'],
	// 	'last': ['提交', '上一步', '取消'],
	// 	'a1':['提交', '取消']
	// }
	// var a=5;//这个值是传进来的，动态的
	// var id,btn_,btnFun,btn2Fun
	function handleOpen () {
		// id = arr[open-1]
		// if (a < 2) {
		// 	btn_ = btnText.a1
		// } else {
		// 	if (open < a && open ==1) {
		// 		btn_ = btnText.first;
		// 	} else if (open == a) {
		// 		btn_ = btnText.last
		// 	} else {
		// 		btn_ = btnText.middle
		// 	}
		// }

		var rlen = ruleSetupData.length - 1;
		// if(rlen == 0){
		// 	//只有一条
		// 	btn_ = btnText.a1;
		// }else{
		// 	if(open == 0){
		// 		btn_ = btnText.first;
		// 	}else if(open == rlen){
		// 		btn_ = btnText.last;
		// 	}else{
		// 		btn_ = btnText.middle;
		// 	}
		// }

		// btnFun = function () {
		// 	// if (open == a) {
		// 	// 	alert('提交');
		// 	// 	return;
		// 	// }
		// 	open ++
		// 	handleOpen()
		// 	console.log('btnFun')
		// }
		// btn2Fun = function () {
		// 	if (open > 1) {
		// 		open --
		// 		handleOpen()
		// 	}

		// 	console.log('btn2Fun')
		// }
		// console.log('> open', open)
		// console.log(id,btn_);

		layer.open({
			type: 1,
			title: '编辑绑定',
			anim: 5,
			shadeClose: true, //弹出框之外的地方是否可以点击
			offset: '10%',
			area: ['90%', '80%'],
			content: $("#editBindA"),
			btn: ['上一步','下一步','提交','取消'],
			btn1: function(index, layero){
				//按钮【按钮一】的回调
				// layer.close(index);
				// btnFun && btnFun();
				if(open == 0){
					layer.msg("第一条");
				}else{
					open--;
					setRuleHtml();
					setTreeData();
				}
				return false;
			},
			btn2: function(index, layero){
				if(open == rlen){
					layer.msg("最后一条");
				}else{
					open++;
					setRuleHtml();
					setTreeData();
				}
				return false;
			},
			btn3:function(index, layero){
				setEditRuleHtml();

				layer.close(index);
			},
			cancel: function(index, layero){
				layer.close(index);
			}
		});

		setTimeout(function(){
			setRuleHtml();
		},200);
	}


	// var arr = ['#editBindA','#editBindB','#editBindC','#editBindD','#editBindE']
	
	//编辑属性
	$('#reload_pop').on('click', function(){
		open = 0;

		//获取人员属性类别选择
		var cbox = $("input[type='checkbox'][name='attributes']:checked");
		for(var i = 0,len = ruleSetupData.length; i < len; i++){
			ruleSetupData[i].ckPerAttr = [];
			ruleSetupData[i].ckPerAttrId = [];
			cbox.each(function(){
				ruleSetupData[i].ckPerAttr.push({id:this.id,title:this.title});
				ruleSetupData[i].ckPerAttrId.push(+this.id);
			});
		}

		setTreeData();

		//加载排序select数据
		setSortItem();
		
		//弹出窗口
		handleOpen();
		
	});
	/* 编辑绑定上一步 下一步 end */

	/*新增筛选属性 右侧菜单 设置行列弹框*/
	$('.newSX').on('click', function(){
		setAddAttr();

		layer.open({
			type: 1,
			title: '新增筛选属性',
			shadeClose: true, //弹出框之外的地方是否可以点击
			offset: '20%',
			area: ['60%', '60%'],
			content: $('#addScreen'),
			moveOut: true,
			btn: ['保存', '取消'],
			yes:function(index, layero){
				var cbox = $("input[type='checkbox'][name='add_attributes']:checked");
				cbox.each(function(){
					ruleSetupData[open].ckPerAttr.push({id:this.id,title:this.title});
					ruleSetupData[open].ckPerAttrId.push(+this.id);
				});
				setTreeData();

				layer.close(index);
			},
			cancel: function(index, layero){
				layer.close(index);
			}
		});
	});

	$('#sortbtn').on('click', function(){
		setAddAttr();

		layer.open({
			type: 1,
			title: '自定义排序',
			shadeClose: true, //弹出框之外的地方是否可以点击
			offset: '20%',
			area: ['60%', '60%'],
			content: $('#sortScreen'),
			moveOut: true,
			btn: ['保存', '取消'],
			yes:function(index, layero){
				// var cbox = $("input[type='checkbox'][name='add_attributes']:checked");
				// cbox.each(function(){
				// 	ruleSetupData[open].ckPerAttr.push({id:this.id,title:this.title});
				// 	ruleSetupData[open].ckPerAttrId.push(+this.id);
				// });
				// setTreeData();

				layer.close(index);
			},
			cancel: function(index, layero){
				layer.close(index);
			}
		});
	});

	function setRuleHtml(){
		var rdata = ruleSetupData[open];
		setRuleAttr(rdata);
	}

	function setRuleAttr(obj){
		if(obj){
			$("#ruletype").html(obj.ruletype);
			$("#rulename").html(obj.rulename);
			$("#seatnum").html(obj.seatnum);
			$("#rulebgcolor").css("backgroundColor",obj.bgcolor);
			$('#select_sortitems').val(obj.sort_item);
			layui.form.render();
		}
	}

	function setAddAttr(){
		var data = attributesData;
		var html = [];
		if(data && data.length){
			$.each(data, function (index, item) {
				if(ruleSetupData[open].ckPerAttrId.indexOf(item.id) == -1){
					html.push('<input type="checkbox" name="add_attributes" title="' + item.name + '" id="' + item.id + '" lay-skin="primary"></input>');
				}
			});
		}
		$("#add_attributes").html(html.join(''));
		layui.form.render();
	}

	function getTreeParent(parent){
		$.ajax({
			async: true,
			type: "get",
			url: "https://m.longjuli.com/v1/attributes?parent_id=" + parent.id,
			dataType: "json",
			success: function(obj) {
				console.log("----",obj);
				if(obj.data && obj.data.length > 0){
					
					obj.data.forEach(function(item){
						parent.children.push({title:item.name,id:+item.id,field:"name",children:[]});
					});
				}

				//可以重载所有基础参数
				tree.reload('demoId1', {spread: true});

				tree.setChecked('demoId1', ruleSetupData[open].treeCheckedIds); 
			},
			//失败的回调函数
			error: function() {
				console.log("error")
			}
		});
	}
	

	function setChildrenData(treeData){
		var ids = ruleSetupData[open].treeCheckedIds;
		var noids = ruleSetupData[open].treeNoCheckedIds;
		treeData.forEach(function(td){
			// if(ids.indexOf(td.id+"") > -1){
			// 	td.checked = true;
			// }else{
			// 	td.checked = false;
			// }
			// if(noids.indexOf(td.id+"") > -1){
			// 	td.checked = false;
			// }
			if(td.children.length > 0){
				children(td.children);
			}
		});
	}

	function setTreeData(){
		var treeData = ruleSetupData[open].treeData;
		ruleSetupData[open].ckPerAttr.forEach(function(item){
			var b = false;
			var ids = ruleSetupData[open].treeCheckedIds;
			var noids = ruleSetupData[open].treeNoCheckedIds;

			treeData.forEach(function(td){
				if(td.id == item.id){
					b = true;
				}
				// if(ids.indexOf(td.id+"") > -1){
				// 	td.checked = true;
				// }else{
				// 	td.checked = false;
				// }
				// if(noids.indexOf(td.id+"") > -1){
				// 	td.checked = false;
				// }
				// if(td.children.length > 0){
				// 	setChildrenData(td.children);
				// }
			});
			if(!b){
				treeData.push({title:item.title,id:+item.id,field:"name",children:[]});
			}
		});

		loadTree('#test1',treeData);


		tree.setChecked('demoId1', ruleSetupData[open].treeCheckedIds); 
	}

	function getChildrenData(treeData,checked){
		treeData.forEach(function(td){
			if(td.children.length > 0){
				children(td.children,checked);
			}else{
				var id = +td.id;
				if(checked){
					var noids = ruleSetupData[open].treeNoCheckedIds;
					if(noids.indexOf(id) > -1){
						noids.splice(noids.indexOf(id),1);
					}
					if(ruleSetupData[open].treeCheckedIds.indexOf(id) == -1){
						ruleSetupData[open].treeCheckedIds.push(id);
					}
				}else{
					var ids = ruleSetupData[open].treeCheckedIds;
					if(ids.indexOf(id) > -1){
						ids.splice(ids.indexOf(id),1);
					}
					if(ruleSetupData[open].treeNoCheckedIds.indexOf(id) == -1){
						ruleSetupData[open].treeNoCheckedIds.push(id);
					}
				}
			}
		});
	}


	function loadTree(id,data){
		console.log("treedata----",data)
		//树形组件 基本演示
		tree.render({
			elem: id,
			data: data,
			// spread: false,
			showCheckbox: true,  //是否显示复选框
			onlyIconControl:true,
			id: 'demoId1',
			// isJump: true, //是否允许点击节点时弹出新窗口跳转
			oncheck:function(obj){
				// if(obj.checked && obj.data.children.length == 0){
				// 	getTreeParent(obj.data);
				// }
				var id = +obj.data.id;
				if(obj.checked){
					//判断有没有子节点
					if(obj.data.children.length > 0){
						var ids = ruleSetupData[open].treeCheckedIds;
						if(ids.indexOf(id) != -1){
							ids.splice(ids.indexOf(id),1);
						}
						getChildrenData(obj.data.children,obj.checked);
					}else{
						var noids = ruleSetupData[open].treeNoCheckedIds;
						if(noids.indexOf(id) > -1){
							noids.splice(noids.indexOf(id),1);
						}
						if(ruleSetupData[open].treeCheckedIds.indexOf(id) == -1){
							ruleSetupData[open].treeCheckedIds.push(id);
						}
					}
					
				}else{
					//判断有没有子节点
					if(obj.data.children.length > 0){
						var noids = ruleSetupData[open].treeNoCheckedIds;
						if(noids.indexOf(id) != -1){
							noids.splice(noids.indexOf(id),1);
						}
						getChildrenData(obj.data.children,obj.checked);
					}else{
						var ids = ruleSetupData[open].treeCheckedIds;
						if(ids.indexOf(id) > -1){
							ids.splice(ids.indexOf(id),1);
						}
						if(ruleSetupData[open].treeNoCheckedIds.indexOf(id) == -1){
							ruleSetupData[open].treeNoCheckedIds.push(id);
						}
					}
				}
				
				getAttendeesCount(meetingId,ruleSetupData[open].treeCheckedIds)
				// console.log(ruleSetupData[open],obj.data.id,obj.checked)
				// console.log(obj.data); //得到当前点击的节点数据
				// console.log(obj.checked); //得到当前节点的展开状态：open、close、normal
				// console.log(obj.elem); //得到当前节点元素
			},
			click: function(obj){
				// var data = obj.data;  //获取当前点击的节点数据
				// layer.msg('状态：'+ obj.state + '<br>节点数据：' + JSON.stringify(data));
				
				if(obj.data.children.length == 0){
					getTreeParent(obj.data);
				}
			}
		});
	}

	function setSortItem(){
		
		if(sortItemsData && sortItemsData.length > 0){
			$('#select_sortitems').html("");
			$.each(sortItemsData, function (index, item) {
				$('#select_sortitems').append(new Option(item.name, item.id));// 下拉菜单里添加元素
			});
			layui.form.render("select");

			$('#select_sortitems').val(ruleSetupData[open].sort_item);
		}
	}





	//树形组件 基本演示 模拟数据
	testdata = [{
		title: '属性1'
		,id: 1
		,field: 'name1'
		,checked: true
		//,spread: true
		,children: [{
			title: '二级1-1 可允许跳转'
			,id: 3
			,field: 'name11'
			,checked: false
			,href: 'https://www.layui.com/'
			,children: [{
				title: '三级1-1-3'
				,id: 23
				,field: ''
				,children: [{
					title: '四级1-1-3-1'
					,id: 24
					,field: ''
					,children: [{
						title: '五级1-1-3-1-1'
						,id: 30
						,field: ''
					},{
						title: '五级1-1-3-1-2'
						,id: 31
						,field: ''
					}]
				}]
			},{
				title: '三级1-1-1'
				,id: 7
				,field: ''
				,children: [{
					title: '四级1-1-1-1 可允许跳转'
					,id: 15
					,field: ''
					,href: 'https://www.layui.com/doc/'
				}]
			},{
				title: '三级1-1-2'
				,id: 8
				,field: ''
				,children: [{
					title: '四级1-1-2-1'
					,id: 32
					,field: ''
				}]
			}]
		},{
			title: '二级1-2'
			,id: 4
			,spread: true
			,children: [{
				title: '三级1-2-1'
				,id: 9
				,field: ''
				,disabled: true
			},{
				title: '三级1-2-2'
				,id: 10
				,field: ''
			}]
		},{
			title: '二级1-3'
			,id: 20
			,field: ''
			,children: [{
				title: '三级1-3-1'
				,id: 21
				,field: ''
			},{
				title: '三级1-3-2'
				,id: 22
				,field: ''
			}]
		}]
	},{
		title: '属性2'
		,id: 2
		,field: ''
		//,spread: true
		,children: [{
			title: '二级2-1'
			,id: 5
			,field: ''
			,spread: true
			,children: [{
				title: '三级2-1-1'
				,id: 11
				,field: ''
			},{
				title: '三级2-1-2'
				,id: 12
				,field: ''
			}]
		},{
			title: '二级2-2'
			,id: 6
			,field: ''
			,children: [{
				title: '三级2-2-1'
				,id: 13
				,field: ''
			},{
				title: '三级2-2-2'
				,id: 14
				,field: ''
				,disabled: true
			}]
		}]
	},{
		title: '属性3'
		,id: 16
		,field: ''
		,children: [{
			title: '二级3-1'
			,id: 17
			,field: ''
			,fixed: true
			,children: [{
				title: '三级3-1-1'
				,id: 18
				,field: ''
			},{
				title: '三级3-1-2'
				,id: 19
				,field: ''
			}]
		},{
			title: '二级3-2'
			,id: 27
			,field: ''
			,children: [{
				title: '三级3-2-1'
				,id: 28
				,field: ''
			},{
				title: '三级3-2-2'
				,id: 29
				,field: ''
			}]
		}]
	}]
	//树形组件 基本演示
	// tree.render({
	// 	elem: '#test1'
	// 	,data: data
	// 	,showCheckbox: true  //是否显示复选框
	// 	,id: 'demoId1'
	// 	,isJump: true //是否允许点击节点时弹出新窗口跳转
	// 	,click: function(obj){
	// 		var data = obj.data;  //获取当前点击的节点数据
	// 		layer.msg('状态：'+ obj.state + '<br>节点数据：' + JSON.stringify(data));
	// 	}
	// });



	// tree.render({
	// 	elem: '#test2'
	// 	,data: data
	// 	,showCheckbox: true  //是否显示复选框
	// 	,id: 'demoId1'
	// 	,isJump: true //是否允许点击节点时弹出新窗口跳转
	// 	,click: function(obj){
	// 		var data = obj.data;  //获取当前点击的节点数据
	// 		layer.msg('状态：'+ obj.state + '<br>节点数据：' + JSON.stringify(data));
	// 	}
	// });
	// tree.render({
	// 	elem: '#test3'
	// 	,data: data
	// 	,showCheckbox: true  //是否显示复选框
	// 	,id: 'demoId1'
	// 	,isJump: true //是否允许点击节点时弹出新窗口跳转
	// 	,click: function(obj){
	// 		var data = obj.data;  //获取当前点击的节点数据
	// 		layer.msg('状态：'+ obj.state + '<br>节点数据：' + JSON.stringify(data));
	// 	}
	// });
	// tree.render({
	// 	elem: '#test4'
	// 	,data: data
	// 	,showCheckbox: true  //是否显示复选框
	// 	,id: 'demoId1'
	// 	,isJump: true //是否允许点击节点时弹出新窗口跳转
	// 	,click: function(obj){
	// 		var data = obj.data;  //获取当前点击的节点数据
	// 		layer.msg('状态：'+ obj.state + '<br>节点数据：' + JSON.stringify(data));
	// 	}
	// });
	// tree.render({
	// 	elem: '#test5'
	// 	,data: data
	// 	,showCheckbox: true  //是否显示复选框
	// 	,id: 'demoId1'
	// 	,isJump: true //是否允许点击节点时弹出新窗口跳转
	// 	,click: function(obj){
	// 		var data = obj.data;  //获取当前点击的节点数据
	// 		layer.msg('状态：'+ obj.state + '<br>节点数据：' + JSON.stringify(data));
	// 	}
	// });

})