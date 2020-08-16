layui.config({
	base: '../../../layuiadmin/' //静态资源所在路径
}).extend({
	index: 'lib/index' //主入口模块
}).use(['index', 'user', 'table','laytpl'], function() {
	var a = {};
	var b = {};
 var devices = {};
    var roomList = [];
	var $ = layui.$,
		setter = layui.setter,
		admin = layui.admin,
		form = layui.form,
		element = layui.element,
		table = layui.table,
		layer = layui.layer,
		tpl = layui.laytpl,
		datas = null,
		router = layui.router();
	element.render();
	var url = setter.baseUrl;
	// var url="http://127.0.0.1:8083"

	// 20.04.06 dh 下行有修改
	$.ajax({
		async: false,
		type: "get",
		url:url + "/permission/getpremission",
		datatype: 'json',

		xhrFields: {
			withCredentials: true
		},
		//成功的回调函数
		success: function(msg) {
			var data = msg.data;

			if (msg.code != 0) {
				location.href = "user/login.html"
			}
			window.a = data
			var grouphtml= groups.innerHTML;tpl(grouphtml).render(data,function (html) {
				// console.log(grouphtml)
				document.getElementById("group").innerHTML= html;
			})

		},
		error: function(error) {
			console.log(error)
		},
	})
    function isEmptyObject(obj) {
    
        var jlength = 0;
        for (var key in obj) {
            if (key != "null") {
                jlength++;
            }
        };
        return jlength
    };
    table.render({
        elem: '#test-table-operate',
        // height: 'full-200',
        url: url + "/roomtemplate/findRoomTemplatePartBylayui",//数据接口
        method: 'get',
        xhrFields: {
            withCredentials: true
        },
        page: {
            layout: ['prev', 'page', 'next', 'count', 'skip']
        },
        cols: [
            [ //表头
            {
            	type: 'checkbox',
            	fixed: 'left'
            },
                {
                    field: 'id',
                    title: 'ID',
                    align: 'left',
                    unresize: 'false',
                    width:'7%'
                },
                {
                    field: 'name',
                    title: '会场名称',
                    align: 'left',
                },
                {
                    field: 'templatefilename',
                    title: 'Word模板名',
                    align: 'left',
                    
                },
				{
					field: 'seatnum',
					title: '座位数',
					align: 'left',

				},
				{
					width: 100,
                    field: 'seatrule',
                    title: '左右编号',
                    align: 'left',
                    templet: function(data) {
                    	if (data.seatrule == 0) {
                    		return '左双右单'
                    	}
                    	if (data.seatrule == 1) {
                    		return '左单右双'
                    	}
                    	if (data.seatrule == undefined) {
                    		return ''
                    	}
                    },
    
                }, 
                {
			// field: '1',\
                	align: 'left',
                	title: '座区图',
					width:'7%',
                    toolbar: '#table-zone-list'
                },{
                    field: 'modifytime',
                    title: '更新时间',
                    align: 'left',
    
                }, 
                {
                    width: 100,
                    align: 'left',
                    title: '操作',
                    toolbar: '#table-content-list',
                }
            ]
        ],
    
        event: true,
        page: true,
        limit: 15,
	skin: 'line',
	even: true,
        limits: [5, 10, 15],
        done: function(res, curr, count) {
            table_data = res.data;
    
            layer.closeAll('loading');
            roomList.length = 0;
        },
    
    
    
    
    });
    function reloaddata(){
        table.render({
            elem: '#test-table-operate',
            // height: 'full-200',
            url: url + "/roomtemplate/findRoomTemplatePartBylayui",//数据接口
            method: 'get',
            page: {
                layout: ['prev', 'page', 'next', 'count', 'skip']
            },
            xhrFields: {
                withCredentials: true
            },
            cols: [
				[ //表头
					{
						type: 'checkbox',
						fixed: 'left'
					},
					{
					    field: 'id',
					    title: 'ID',
					    align: 'left',
					    unresize: 'false',
					    width:'7%'
					},
					{
						field: 'name',
						title: '会场名称',
						align: 'left',
					},
					{
						field: 'templatefilename',
						title: 'Word模板名',
						align: 'left',

					},
					{
						field: 'seatnum',
						title: '座位数',
						align: 'left',

					},
					{
						width: 100,
						field: 'seatrule',
						title: '左右编号',
						align: 'left',
						templet: function(data) {
							if (data.seatrule == 0) {
								return '左双右单'
							}
							if (data.seatrule == 1) {
								return '左单右双'
							}
							if (data.seatrule == undefined) {
								return ''
							}
						},

					},
					{
						// field: '1',\
						align: 'left',
						title: '座区图',
						width:'7%',
						toolbar: '#table-zone-list'
					},{
					field: 'modifytime',
					title: '更新时间',
					align: 'left',

				},
					{
						width: 100,
						align: 'left',
						title: '操作',
						toolbar: '#table-content-list',
					}
				]
	    ],
	
	    event: true,
	    page: true,
	    limit: 15,
	    skin: 'line',
	    even: true,
            limits: [5, 10, 15],
            done: function(res, curr, count) {
                table_data = res.data;
        
                layer.closeAll('loading');
                roomList.length = 0;
            },
        
        
        
        
        });
    }
    table.on('checkbox(test-table-operate)', function(obj) {
        // console.log(obj.checked); //当前是否选中状态
        // // console.log(obj.data); //选中行的相关数据
        // console.log(obj.type); //如果触发的是全选，则为：all，如果触发的是单选，则为：one
        // // console.log(table.checkStatus('test-table-operate').data); // 获取表格中选中行的数据
        if (obj.checked && obj.type == 'one') {
            var devi = {};
            devi = obj.data.id;
            roomList.push(devi)
        }
        if (!obj.checked && obj.type == 'one') {
            var index = roomList.indexOf(obj.data.id);
            if (index > -1) {
                roomList.splice(index, 1);
            }
        }
        if (!obj.checked && obj.type == 'all') {
            roomList.length = 0;
    
        }
        if (obj.checked && obj.type == 'all') {
            $.each(table.checkStatus('test-table-operate').data, function(idx, con) {
                var devi = {};
                devi = con.id;
    
                roomList.push(devi)
            });
            roomList = Array.from(new Set(roomList))
        }
      console.log(roomList)
    
    });
	table.on('tool(test-table-operate)', function(obj) {
		var age = obj.data;
		if (obj.event === 'edit') {
			layer.open({
				type: 2,
				title: '编辑会场',
				content: 'meeting_room_form.html',
				maxmin: true,
				area: ['60%', '80%'],
				// btn: ['确定','打开会场编辑器', '取消'],
				btn: ['确定','取消'],
				yes: function(index, layero) {
					var body = layer.getChildFrame('body', index);
					
					var seatnum = age.seatnum;
					var templatecode = sessionStorage.getItem("_seatscomplete") || undefined;
					if(templatecode){
						seatnum = +sessionStorage.getItem("_seatnum") || 0;
					}
					
					
					$.ajax({
						url: url+"/roomtemplate/updateRoomtemplate",
						type: "POST",
                        xhrFields: {
                            withCredentials: true
                        },
						data: {
							"id": age.id,
							"name": body.find('#roomname').val(),
							"templatefilename": body.find('#templatefilename').val(),
							"seatrule": body.find('#seatrule').val(),
							// "templatecode": body.find('#templatecode').val(),
							"templatecode": templatecode,
							"seatnum":seatnum
						},
						success: function(data) {
							if (data.code == '0') {
								layer.msg('维护成功');
								layer.close(index);
								  reloaddata();
							} else {
								layer.msg(data.msg, {
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
				btn2:function(index, layero){
					// $.ajax({
					// 	url: url+"/roomtemplate/findByIdTemplatecode",
					// 	type: "POST",
					// 	data: {
					// 		"id": age.id
					// 	},
					// 	xhrFields: {
					// 		withCredentials: true
					// 	},
					// 	success: function(data) {
					// 		console.log("---findByIdTemplatecode----",data)
					// 		if (data.code == "0") {
					// 			var templatecode = data.data.templatecode;

					// 			sessionStorage.setItem("_seatscomplete",templatecode);
					// 			var topLayui = parent === self ? layui : top.layui;
					// 			topLayui.index.openTabsPage("arrange/meeting/seatmapseditor.html", "会场编辑器");
					// 		} else {
					// 			layer.msg(data.msg, {
					// 				icon: 5
					// 			});
					// 		}
					// 	},
					// 	error: function(error) {
							
					// 	}
					// });
					// return false;
				},
				btn3:function(index, layero){
					console.log("btn3----")
				},
				success: function(layero, index) {
					var body = layer.getChildFrame('body', index);
					console.log("age------",age)
					if (age) {
						body.find('#editid').val(age.id);

						body.find('#roomname').val(age.name);
						body.find('#templatefilename').val(age.templatefilename);
						if (age.seatrule == "左双右单") {
							body.find('#seatrule').val('0');
						}
						if (age.seatrule == "左单右双") {
							body.find('#seatrule').val('1');
						}
                        body.find('#templatecode').val(age.templatecode);
					}
				}
			});
		} else if (obj.event === 'del') {
			layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;您正在执行删除会场操作,执行删除操作后，与会场相关联的编排规则、对应绑定关系、座区自动编排数据也将一并被删除，是否确认继续进行该操作？',{title:'温馨提示'}, function() {
				$.ajax({
					url: url+"/roomtemplate/deleteRoomtemplate",
					type: "POST",
					data: {
						"id": age.id
					},
                    xhrFields: {
                        withCredentials: true
                    },
					success: function(data) {
						if (data.code == "0") {
							layer.msg('成功删除', {
								icon: 1
							})
                             reloaddata();
						} else {
							layer.msg(data.msg, {
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
				title: obj.data.name,
				//content: 'meeting_room_zq.html?roomid='+age.id
				content: 'meeting_room_zq.html?roomid='+age.id
					,maxmin: true
					,
				area: ['100%', '100%'],
				skin: 'layer-ext-greytitle',//添加自定义样式

				scrollbar: false,
				yes: function(index, layero) {
				},
				success: function(layero, index) {
					var body = layer.getChildFrame('body', index);
					
				}
			});
		}
	})
	window.onkeyup = function(ev) {
		var key = ev.keyCode || ev.which;
		if (key == 27) { //按下Escape
			layer.closeAll('iframe'); //关闭所有的iframe层

		}
		if (key == 13) { //按下Escape
			$('#search').click();

		}
	}
	//弹出层区
	var active = {
		add: function() {
			layer.open({
				type: 2,
				title: '<p style="">新增会议室</p>',
				content: 'meeting_room_form.html'
					,maxmin: true
					,
				area: ['60%', '80%'],
				btn: ['确定', '取消'],
				yes: function(index, layero) {
					var body = layer.getChildFrame('body', index);

					var templatecode = sessionStorage.getItem("_seatscomplete") || "";
					if(!templatecode){
						layer.msg('模板未保存');
						return;
					}else{
						sessionStorage.setItem("_seatscomplete","");
					}
					var seatnum = +sessionStorage.getItem("_seatnum") || 0;

					$.ajax({
						url: url+"/roomtemplate/addRoomtemplate",
						type: "POST",
                        xhrFields: {
                            withCredentials: true
                        },
						data: {
							"name": body.find('#roomname').val(),
							"templatefilename": body.find('#templatefilename').val(),
							"seatrule": body.find('#seatrule').val(),
							// "templatecode": body.find('#templatecode').val()
							"templatecode": templatecode,
							"seatnum":seatnum
						},
						success: function(data) {
							if (data.code === 0) {
								layer.msg('添加成功');
								layer.close(index);
								 reloaddata();
							} else {
								layer.msg(data.msg, {
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
		refresh:function(){
			location.reload();
		},
		search: function(){
		 table.render({
		     elem: '#test-table-operate',
		    //  height: 'full-200',
		     url: url + "/roomtemplate/roomtemplateSearch" //数据接口
		         ,
		      where:{
		        "room":$('#demoReload').val()
		      },
		 
		     method: 'get',
             xhrFields: {
                 withCredentials: true
             },
		     page: {
		         layout: ['prev', 'page', 'next', 'count', 'skip']
		     },
		     cols: [
				 [ //表头
					 {
						 type: 'checkbox',
						 fixed: 'left'
					 },
					 {
					     field: 'id',
					     title: 'ID',
					     align: 'left',
					     unresize: 'false',
					     width:'7%'
					 },
					 {
						 field: 'name',
						 title: '会场名称',
						 align: 'left',
					 },
					 {
						 field: 'templatefilename',
						 title: 'Word模板名',
						 align: 'left',

					 },
					 {
						 field: 'seatnum',
						 title: '座位数',
						 align: 'left',

					 },
					 {
						 width: 100,
						 field: 'seatrule',
						 title: '左右编号',
						 align: 'left',
						 templet: function(data) {
							 if (data.seatrule == 0) {
								 return '左双右单'
							 }
							 if (data.seatrule == 1) {
								 return '左单右双'
							 }
							 if (data.seatrule == undefined) {
								 return ''
							 }
						 },

					 },
					 {
						 // field: '1',\
						 align: 'left',
						 title: '座区图',
						 width:'7%',
						 toolbar: '#table-zone-list'
					 },{
					 field: 'modifytime',
					 title: '更新时间',
					 align: 'left',

				 },
					 {
						 width: 100,
						 align: 'left',
						 title: '操作',
						 toolbar: '#table-content-list',
					 }
				 ]
		    ],
		
		    event: true,
		    page: true,
		    limit: 15,
		    skin: 'line',
		    even: true,
		     limits: [5, 10, 15],
		     done: function(res, curr, count) {
		         table_data = res.data;
		 
		         layer.closeAll('loading');
                 roomList.length = 0;
		     },
		 
		 
		 
		 
		 });
		   
		},
        //全选
       getCheckData: function() { //获取选中数据
           var cb = $(".layui-form-checkbox");
                   $(".layui-form-checkbox").each(function() {
                           $(this).click();
                   })
       },
       getCheckLength: function() { 
           if ( roomList.length == 0 ) {
               return layer.msg("请选择会场后再批量删除")
           }
           layer.confirm('&nbsp;&nbsp;&nbsp;&nbsp;您正在执行删除会场操作,执行删除操作后，与会场相关联的编排规则、对应绑定关系、座区自动编排数据也将一并被删除，是否确认继续进行该操作？',{title:'温馨提示'}, function() {//获取选中数目
           $.ajax({
                   async: false,
                   type: "post",
                   url: url+"/roomtemplate/batchRemove",
                   dataType: "json",
                   //成功的回调函数
                   data: {
                       "roomid":roomList.join(",")
                       
                   },
                   xhrFields: {
                       withCredentials: true
                   },
                   success: function(msg) {
                       if (msg.code == 0) {
                           layer.msg("删除成功");
                           reloaddata(); // 父页面刷新
           
                       } else {
                           layer.msg(msg.msg);
                           
           
                       }
           
                   },
                   //失败的回调函数
                   error: function() {
                       console.log("error")
                   }
               })
               })
       },
       isAll: function() { //验证是否全选
       layer.confirm('您将要进行列表清空操作,执行后您的所有记录将被删除,请谨慎操作,是否确认?', function(index) {
          $.ajax({
                  async: false,
                  type: "get",
                  url: url+"/roomtemplate/empty",
                  dataType: "json",
                  //成功的回调函数
                  data: {
                      
                  },
                  xhrFields: {
                      withCredentials: true
                  },
                  success: function(msg) {
                      if (msg.code == 0) {
                          layer.msg("清空成功");
                          reloaddata(); // 父页面刷新
          
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
	}

	$('.layui-ds').on('click', function() {
		var type = $(this).data('type');
		active[type] && active[type].call(this);
	});
})
