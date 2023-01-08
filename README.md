# 区块链技术实验

该项目是区块链技术课程的期末实验。

## 项目大体结构
在本次实验中，我将主要实现以下五个部分。
1. 实现区块链数据结构
2. 实现区块链API服务/服务端
3. 构建一个去中心化区块链网络
4. 实现一个网络共识算法
5. 实现一个区块浏览器应用


## 具体实现

### 如何注册一个新的节点
 ![注册新节点](assets\how-to-registe-new-node.png)

## 术语表

1. consensus algorithm(共识算法)
2. immutable ledger(不可变账本)
3. transaction(交易)
4. nonce(Number once)
5. Genesys Block(创世模块)

## 名词解释
1. Ledger: A collection of financial accounts or transactions.
2. Immutable: The ledger cannot be changed ever.
3. Distributed: not controlled by a single entity.
4. Nonce: Number used once或Number once的缩写，在密码学中Nonce是一个只被使用一次的任意或非重复的随机数值.

## 引用的软件包及文献
1. [log4js(用于完成日志输出和保存功能)](https://log4js-node.github.io/log4js-node/)
2. [express(用于构建 API)](http://expressjs.com/zh-cn/)
3. [simple-json-db(用于在节点关机/重启时保存/读取节点数据)](https://github.com/nmaggioni/Simple-JSONdb)
4. [node-fetch(用于实现节点之间的通信)](https://github.com/node-fetch/node-fetch)

### 框架方面
1. 整体使用 typescript 改写
2. 对于网络请求的框架，使用 node-fetch 代替，使用了更加现代化的API
3. 对于 api 构建，将不同的 api 分解到了不同的文件中
4. 新增了 simple-json-db 来保存链的基本信息
5. 新增了 log4js 依赖，可以定制丰富的日志行为
6. 新增了 jest 框架，使得单元测试可以自动化，并且可以得到测试覆盖率
7. 对于加密算法和 UUID 的实现，使用了 JS 标准库中的 crypto 代替了 uuid, sha256 两个依赖

### 实现方面
1. 在 Blockchain.ts 中，使用 Set 代替数组来实现 networkNodes，获得更好的性能
2. 部分接口使用 put 代替 post, 这是由于 put 包含了幂等性的语义
