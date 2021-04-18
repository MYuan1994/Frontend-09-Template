# 第八周

## 有限状态机

- 每一个状态都是一个机器，机器间相互解耦。
  - 在每一个机器里，可以做计算、存储、输出...
  - 接受的输入数据格式要求一致
  - 机器本身无状态，可以用纯函数表示
- 每一个机器知道下一个状态
  - 每个机器都有确定的下一个状态（Moore状态机）
  - 每个机器根据输入决定下一个状态（Mealy状态机，用途较广）

## HTTP请求

### 网络基础

#### ISO-OSI七层**网络模型**：

require("http")

- HTTP

  1. 应用层

  2. 表示层

  3. 会话层

require("net")

- TCP：传输协议TCP、UDP
  4. 传输层
- Internet：实际指www，internet仅为一种分类；协议为internet protocol（IP）。
  5. 网络层
- 4G/5G/Wi-Fi：完成对数据的准确传输；点对点，要求有直接连接；
  6. 数据链路层
  7. 物理层

#### TCP/IP基础

TCP：

- 流：传输数据的概念，流只保证前后顺序正确，无分割单位。
- 端口：TCP协议被计算机软件所使用，每个软件都需要从网卡拿数据，具体的数据分配由端口决定，网卡据此将接受的数据包分发给各应用。==>对应node中的net模块
- 数据包：TCP传输实际上是传输一定数量不定大小的数据包。

IP：

- IP根据地址(唯一标识IP)传输数据包==>node无对应库，node具体实现需要使用c++的两个库：
  - libnet：构造IP包并发送
  - libpcap：从网卡抓取所有流经网卡的IP包，使用libpcap可以抓取到不是发给我们IP的包。

### Http协议

#### HTTP服务的构建

1. request的创建

   构造器中接收所有数据，其中body需要依据Content-Type，使用对应的解析方式。

2. 发送请求

   判断连接是否结束来使用或者新建连接；数据传给Parse，使用状态机分段分析；根据分析的状态使用promise异步处理

3. response解析

   必须分段构造，故使用responseParse装配；使用状态机分段处理以文本存在的response的内容

#### request

http协议是一种文本型协议，即协议里所有内容都为字符串。

组成：

1. request line：第一行，例子：POST / HTTP/1.1，由三部分构成
   - method：POST或者GET（另有Delete、Put、options等）
   - / ：路径
   - HTTP/1.1：HTTP和HTTP版本
2. Headers：多行，每行是由冒号分隔的Key-Value格式；以空行为结束标志。
3. body：由Content-Type决定；为区分换行使用\r\n两个

#### response

组成：

1. status line：第一行，例子：HTTP/1.1 200 OK，由三部分构成
   - HTTP/1.1：HTTP及版本
   - 200：**状态码**需要自行掌握
   - OK：状态文本
2. headers：格式与request相同，也同样以空行结束
3. body：由Content-Type决定；node默认返回Trunked body格式



