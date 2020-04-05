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
> | **username** | 字符串    | 当前用户的用户名 |
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
> 	"errorCount": 0,
> 	"successCount": 1,
> 	"successMsg": "单发消息成功"
> }
> 
> 失败如：
> {
> 	"errorCount": 1,
> 	"errorMsg": "会议还没开始",
> 	"successCount": 0
> }
> ```
>

> **3.开始会议接口**
>
> ** GET：https://m.longjuli.com/tableSign/startMeeting **
>
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **meetingid** | 字符串    | 会议室id |
>
> **返回值如**：
>
> ```json
> 成功：
> {
> 	"errorCount": 0,
> 	"errorDeviceNames": "[]",
> 	"successCount": 2
> }
> 
> 失败：
> {
> 	"errorCount": 1,
> 	"errorDeviceNames": "[{\"devEui\":\"sfsfsdfsdf\",\"deviceName\":\"sfsfsdfsdf\",\"iotId\":\"sefsfdfsfdssfsfsfsdfsdf\",\"pinCode\":\"212131\",\"productKey\":\"a1nqDCT9tmc\"}]",
> 	"successCount": 1
> }
> ```
>

> **4.结束会议接口**
> 3
> ** GET：https://m.longjuli.com/tableSign/endMeeting **
>
> | 参数名     | 参数类型 | 描述     |
> | ---------- | -------- | -------- |
> | **meetingid** | 字符串    | 会议室id |
>
> ** 注意：调用该接口需要前端关闭websocket
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