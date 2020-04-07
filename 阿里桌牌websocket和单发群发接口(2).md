# 阿里桌牌websocket和单发群发接口
## 一、接口
> **1.调用websocket接口**
> 
> **ws://localhost:8083/cardWebSocket/当前用户名**
> 
> **参数：**
> 
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **username** | 字符串    | 当前用户的用户名(随便填也可以) |
> 
> **websocket成功连接返回值如**：
>
> ```json
> {
> 	"code": 0,
> 	"msg": "ok",
> 	"data": "username连接成功--当前在线人数为：1"
> }
> ```

> **2.单发消息到指定桌牌接口**
>
> **GET：https://m.longjuli.com/tableSign/sendOneTableSign**
>
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **meetingid** | 字符串    | 会议室id |
> | **seatid** | 字符串    | 座位号 |
> | **msg** | 字符串    | 传入的自定义名字 |
>
> **返回值如**：
>
> ```json
> 成功：
> {
> 	"code": 0,
> 	"msg": "发送消息到设备成功",
> 	"data": {
> 		"name": "李其威",
> 		"seatid": "1-2",
> 		"roomid": "70",
> 		"meetingState": "1",
> 		"deviceState": "ONLINE",
> 		"bindingState": "1"
> 	}
> }
> 
> 失败如：
> {
> 	"code": -2,
> 	"msg": "会议还没开始",
> 	"data": null
> }
> 
> ```
>
> **返回类型说明**
>
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **code** | 字符串    | 发消息成功状态 0：成功，-1：发送消息失败，-2：会议还没开始，-3：传入参数错误 |
> | **name** | 字符串    | 参会人员的名字 |
> | **bindingState** | 字符串    | 设备绑定状态 0:未绑定物联网平台。1：绑定了物联网平台 |
> | **deviceState** | 字符串    | 设备状态 ONLINE：设备在线。 OFFLINE：设备离线。UNACTIVE：设备未激活。DISABLE：设备已禁用。 |
> | **meetingState** | 字符串    | 会议状态 0：未发送；1：开始会议发送成功；-1：开始会议发送失败；2：结束会议成功; -2:结束会议失败 |
> | **roomid** | 字符串    | 会议室id |
> | **seatid** | 字符串    | 座位id |
> | **msg** | 字符串    | 成功和失败返回的消息 |

> 
>
> **3.开始会议接口**
>
> **通过websocket的send发送消息:meetingid&startMeeting **
>
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **meetingid** | 字符串    | 会议室id |
>
> **例子：**
>
> ```json
> var websocket = null;
> if('WebSocket' in window){
> //连接WebSocket节点 
> websocket = new WebSocket("ws://localhost:8083/cardWebSocket/shuxian");
> }
> websocket.send('70&startMeeting');
> ```
>
> **返回值如**：
>
> ```json
> {
>      "code":-1,
>      "data":{
>          "bindingState":"1",
>          "deviceState":"ONLINE",
>          "meetingState":"-1",
>          "roomid":"70",
>          "seatid":"1-7"
>      },
>      "msg":"开始会议失败"
> }
> 
> {
>         "code":0,
>         "data":{
>             "bindingState":"1",
>             "deviceState":"ONLINE",
>             "meetingState":"1",
>             "name":"李其威",
>             "roomid":"70",
>             "seatid":"1-2"
>         },
>         "msg":"ok"
> }
> ```
>
>**返回类型说明**
> 
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **code** | 字符串    | 发消息成功状态 0：成功，-1：失败 |
> | **name** | 字符串    | 参会人员的名字 |
> | **bindingState** | 字符串    | 设备绑定状态 0:未绑定物联网平台。1：绑定了物联网平台 |
> | **deviceState** | 字符串    | 设备状态 ONLINE：设备在线。 OFFLINE：设备离线。UNACTIVE：设备未激活。DISABLE：设备已禁用。 |
> | **meetingState** | 字符串    | 会议状态 0：未发送；1：开始会议发送成功；-1：开始会议发送失败；2：结束会议成功; -2:结束会议失败 |
> | **roomid** | 字符串    | 会议室id |
> | **seatid** | 字符串    | 座位id |
> | **msg** | 字符串    | 成功和失败返回的消息 |



> **4.结束会议接口(目前没做)**
>
> **通过websocket的send发送消息:meetingid&endMeeting**
>
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **meetingid** | 字符串    | 会议室id |
>
> **例子：**
>
> ```json
> var websocket = null;
> if('WebSocket' in window){
> //连接WebSocket节点 
> websocket = new WebSocket("ws://localhost:8083/cardWebSocket/shuxian");
> }
> websocket.send('70&endMeeting');
> ```
>
> 
>
> **返回值如**：
>
> ```json
> 成功：
> {
> 	"code": 0,
> 	"msg": "会议结束成功"
> }
> 
> 失败：
> {
> 	"code": -1,
> 	"msg": "会议结束失败"
> }
> ```
>