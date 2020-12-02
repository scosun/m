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
> 
> 
>
> **2.批量绑定接口**
> 
> **说明：划区批量绑定桌牌到指定产品，选中一块区域右键或右上方选则产品进行绑定**
>
> **通过websocket的send发送消息:meetingid&batchBindPlatform&productKey&ids**
>
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **meetingid** | 字符串    | 会议室id |
> | **productKey** | 字符串    | 产品key |
> | **ids** | 字符串组    | 座位号组(用逗号分开) |
>
> **例子：**
>
> ```json
> var websocket = null;
> if('WebSocket' in window){
> //连接WebSocket节点 
> websocket = new WebSocket("ws://localhost:8083/cardWebSocket/shuxian");
> }
> websocket.send('70&batchBindPlatform&sdfsgdsegsd33&1-1,2-5,6-5');
> ```
>
> **返回值如**：
>
> ```json
> {
>   [
> 		"code":'0',
> 		"seat":'1-1',
> 		"meeting":'70',
> 		"productKey":'asdgsdfsf212',
> 		"message":'success'
> 	]
> }
> ```
>
> **返回类型说明**
>
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **code** | 字符串    | 发消息成功状态 0：成功，-1：失败 |
> | **seat** | 字符串    | 座位号 |
> | **meeting** | 字符串    | 会议室id |
> | **productKey** | 字符串    | 产品key |
> | **message** | 字符串    | 返回的消息 |
> 

