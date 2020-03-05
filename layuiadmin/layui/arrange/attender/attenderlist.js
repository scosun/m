var indexs = 0;

layui.config({
	base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
	index: 'lib/index' //主入口模块
}).use(['index', 'user', 'form', 'table'], function() {
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
	//初次渲染表格

	layer.msg("上方下拉框选择会议后自动加载相关人员");


	//渲染下拉框的ajax
	$.ajax({
		async: false,
		type: "post",
		url: "https://www.longjuli.com/ajax",
		dataType: "json",
		//成功的回调函数
		data: {
			"a": "s",
			"t": "meetinglist",
			"f": "sel"
		},
		success: function(msg) {
			var data = msg;
			$.each(data, function(idx, con) {
				$("#select_meets").after("<option value=" + con.id + ">" + con.name + "</option>");
			})
			form.render();
		},
		//失败的回调函数
		error: function() {
			console.log("error")
		}
	})
	//选中以后更新表的ajax
	function ajaxs(value) {
		$.ajax({
			url: "https://www.longjuli.com/ajax?",
			type: "POST",
			data: {
				"a": "s1",
				"t": "attenderlist",
				"c": value
			},
			success: function(data) {
				var datas = data.data
				a = datas.reverse();
				table.render({
					elem: '#test-table-operate',
					data: a, //数据源
					// height: 515, //高
					page: true, //开启分页
					skin: 'line', //显示风格
					page: true, //开启分页
					limits: [5, 10, 15], //显示
					limit: 10, //每页默认显示的数量
					cols: [
						[{
							type: 'checkbox',
							fixed: 'left'
						}, {
							field: 'attenderid',
							width: '7%',
							title: 'ID',
							sort: true
						}, {
							field: 'name',
							width: '10%',
							title: '姓名'
						}, {
							field: 'duties',
							// width: '25%',
							title: '单位职务'
						}, {
							field: 'phone1',
							width: '15%',
							title: '联系电话'
						}, {
							field: 'modifytime',
							width: '15%',
							title: '更新时间',
							sort: true
						}, {
							// width: '12%',
							align: 'right',
							title: '操作',
							toolbar: '#table-content-list',
							flxed: 'right',
							width: '10%'
						}, ]
					],
				})

			},
			error: function(error) {
				console.log(error)
			},
			async: false
		})
	}
	
		window.onkeyup = function(ev) {
		var key = ev.keyCode || ev.which;
		if (key == 27) { //按下Escape
			layer.closeAll('iframe'); //关闭所有的iframe层
	
		}
	}
	//监听下拉框选中
	form.on('select(component-form-select)', function(data) {

		ajaxs(data.value)
		window.indexs = data.value;
	});

	table.on('tool(test-table-operate)', function(obj) {
		var age = obj.data;

		if (obj.event === 'edit') {
			layer.open({
				type: 2,
				title: '信息维护',
				content: 'attender_form.html',
				// maxmin: true,
				area: ['60%', '80%'],
				btn: ['确定', '取消'],
				yes: function(index, layero) {
					var body = layer.getChildFrame('body', index);
					var convenornum = body.find('#convenornum').val()

					if (body.find('#isconvenor_list').val() == "2") {
						convenornum = null
					} else if (body.find('#isconvenor_list').val() == "") {
						convenornum = null
					}

					$.ajax({
						url: "https://www.longjuli.com/ajax",
						type: "POST",
						data: {
							"a": "u",
							"t": "attenderlist",
							"c": "s",
							"id": age.attenderid,
							"meetingname": body.find('#meeting_list').find("option[value='" + body.find('#meeting_list').val() +
								"']").text(),
							"meetingid": body.find('#meeting_list').val(),
							"name": body.find('#name').val(),
							"sexid": body.find('#sexid').val(),
							"company": body.find('#company').val(),
							"duties": body.find('#duties').val(),
							"phone1": body.find('#phone1').val(),
							"phone2": body.find('#phone2').val(),
							"contacts": body.find('#contacts').val(),
							"contactsphone": body.find('#contactsphone').val(),
							"cardid": body.find('#cardid').val(),
							"groupid": body.find('#group_list').val(),
							"partyid": body.find('#partyid_list').val(),
							"differentid": body.find('#different_list').val(),
							"isconvenor": body.find('#isconvenor_list').val(),
							"convenornum": convenornum,
							"specialid": body.find('#special_list').val(),
							"imgurl": null,
						},

						success: function(data) {
							if (data.state == '1') {
								layer.msg('维护成功');
								layer.close(index);
								ajaxs(indexs)
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
					if (age.isconvenor == "1") {
						body.find('#convenornum_list').show();
					}
					body.find('#name').val(age.name)
					body.find('#meetingid').val(age.meetingid)
					body.find('#company').val(age.company)
					body.find('#duties').val(age.duties)
					body.find('#phone1').val(age.phone1)
					body.find('#sexid').val(age.sexid)
					body.find('#phone2').val(age.phone2)
					body.find('#groupid').val(age.groupid)
					body.find('#partyid').val(age.partyid)
					body.find('#differentid').val(age.differentid)
					body.find('#isconvenor').val(age.isconvenor)
					body.find('#specialid').val(age.specialid)
					body.find('#contacts').val(age.contacts)
					body.find('#contactsphone').val(age.contactsphone)
					body.find('#contacts').val(age.contacts)
					body.find('#cardid').val(age.cardid)
					body.find('#convenornum').val(age.convenornum)
					body.find('#isconvenor_list').val(age.isconvenor)
					body.find('#specialid').val(age.specialid)
				}
			});
		} else if (obj.event === 'del') {
			layer.confirm('真的删除吗？', function() {
				$.ajax({
					url: "https://www.longjuli.com/ajax",
					type: "POST",
					data: {
						"a": "d",
						"t": "attenderlist",
						"id": age.attenderid
					},

					success: function(data) {
						if (data.state == "1") {
							layer.msg('成功删除', {
								icon: 1
							})
							ajaxs(indexs)
							obj.del();
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
		}



	})

	//弹出层区

	var active = {
		add: function() {
			layer.open({
				type: 2,
				title: '<p style="">新增人员</p>',
				content: 'attender_form.html',
				// maxmin: true,
				area: ['60%', '80%'],
				btn: ['确定', '取消'],
				yes: function(index, layero) {
					var body = layer.getChildFrame('body', index);
					console.log(body.find('#meeting_list').val() + "1s")

					$.ajax({
						url: "https://www.longjuli.com/ajax?",
						type: "POST",
						data: {
							"a": "add",
							"t": "attenderlist",
							//"meetingname":body.find('#meeting_list').find("option[value='"+body.find('#meeting_list').val()+"']").text(),
							"meetingid": body.find('#meeting_list').val(),
							"name": body.find('#name').val(),
							"sexid": body.find('#sexid').val(),
							"company": body.find('#company').val(),
							"duties": body.find('#duties').val(),
							"phone1": body.find('#phone1').val(),
							"phone2": body.find('#phone2').val(),
							"contacts": body.find('#contacts').val(),
							"contactsphone": body.find('#contactsphone').val(),
							"cardid": body.find('#cardid').val(),
							"groupid": body.find('#group_list').val(),
							"partyid": body.find('#partyid_list').val(),
							"differentid": body.find('#different_list').val(),
							"isconvenor": body.find('#isconvenor_list').val(),
							"convenornum": body.find('#convenornum').val(),
							"specialid": body.find('#special_list').val(),
							"imgurl": null,

						},

						success: function(data) {
							if (data.state === 1) {
								layer.msg('添加成功');
								layer.close(index);
								var submit = layero.find('iframe').contents().find("#layuiadmin-app-form-submit");
								submit.click();

								ajaxs(indexs)
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



				},
				success: function(layero, index) {
					var body = layui.layer.getChildFrame('body', index);
					var a = indexs + "";

					// ;

					body.find('#meetingid').val(indexs)





				}
			});

		},
		edit: function() {


		},


	}
	//弹出层选项区

	$('.layui-ds').on('click', function() {
		var type = $(this).data('type');
		active[type] && active[type].call(this);
	});




})
