# 比特币中的记账算法：未发送交易输出模型

****

[TOC]



## 摘要

在区块链网络中，未发送交易输出（UTXO）是指已发送到某个地址但尚未消费的加密货币数量。换句话说，UTXO是尚未用作新交易输入的剩余金额。

每个UTXO都与特定的交易输出相关联，并且只能由UTXO发送到的地址所有者使用。当一个用户向另一个用户发送加密货币时，交易会创建一个或多个UTXO，这些UTXO在区块链上记录为未使用，可供接收者在未来交易中使用。

为了使用UTXO，与UTXO地址的私钥所有者必须创建一个新的交易，该交易将UTXO作为输入，以及要传输的金额和接收者的地址。这个新交易创建了一个或多个新的UTXO，可以在将来的交易中使用。

UTXO在区块链的安全性和完整性方面发挥着关键作用，因为它们允许网络跟踪所有交易的当前状态，并防止重复支出。当创建新的交易时，区块链网络会检查正在使用的UTXO是否有效，并且之前没有使用过。这确保了每个UTXO只能使用一次，并且系统中的加密货币总量保持一致。

**关键词：未发送交易输出模型、比特币、区块链**

## UTXO模型设计的基本思想

事实上，在本门课程学习后，本文根据课上所学内容及在线资料完成了一个区块链系统的原型实现^[1]^。在这个系统中有若干比较复杂的算法没有完全实现，例如没有实现轻钱包、对于交易没有验证双方的余额是否满足条件、使用的共识算法比较简单等。

在这其中，记账模型引起了本文关注。在实现原型时，本文注意到在区块链系统中记录账户余额是一件很困难的事情。为了确保区块链上交易的可追溯性，我们往往需要遍历链上的交易来计算并每个地址（或钱包）的余额。这样的操作成本颇高，于是本文本能的认为应当有更优雅的解决方案，经过资料检索，本文将主要关注UXTO模型。

UTXO模型之所以重要，有几个原因^[2]^：

- 安全性：UTXO模型为比特币用户提供了高级别的安全性。每个UTXO都与特定的比特币地址相关联，该地址的所有者只能通过提供正确的私钥来使用UTXO。这使得任何人都很难从另一个用户的地址窃取比特币。

- 可扩展性：UTXO模型允许有效验证交易，而不需要存储整个交易历史。这对于比特币网络的可扩展性非常重要，因为它允许快速高效地处理交易。**（这也是启发本文的重要因素）**

- 隐私：UTXO模型有助于保护比特币用户的隐私。每个UTXO都与特定地址相关联，但无法确定该地址所有者的身份。这为比特币用户提供了一定程度的匿名性。

- 灵活性：UTXO模型允许灵活的交易输出。例如，一个交易可以创建多个UTXO，每个UTXO具有不同的金额和地址。这种灵活性允许广泛的交易类型。

UTXO模型的基本思想是跟踪区块链网络上所有交易的当前状态。在UTXO模型中，每个交易输出都被视为一个单独的UTXO，只能使用一次。

当一个用户向另一个用户发送加密货币（如BTC）时，交易会创建一个或多个UTXO，这些UTXO在区块链上记录为未使用，可供接收者在未来交易中使用。每个UTXO都与特定的交易输出相关联，并且只能由与UTXO发送到的地址相关联的私钥的所有者使用。

当私钥的所有者想要使用UTXO时，他们会创建一个新的交易，该交易将UTXO作为输入，以及要转移的金额和接收者的地址。这个新交易包含了一个或多个新的UTXO，包括支付者的支出UTXO消耗、“找零”UTXO生成以及接收者的收入UTXO生成。

UTXO模型在维护区块链网络的安全性和完整性方面发挥着关键作用，因为它可以防止重复支出，并确保系统中加密货币的总量保持一致。由于每个UTXO只能使用一次，攻击者更难在网络上操纵交易或创建欺诈交易。

总体而言，UTXO模型提供了一种安全高效的方式来管理区块链网络上的交易，并确保所有交易都准确无误。

## UXTO模型的简要描述

UTXO是指交易中尚未花费的产出。换言之，它是指分配给特定地址的加密货币数量，且未在任何后续交易中使用。

当用户向另一个用户发送加密货币时，交易记录在区块链中。交易由输入和输出组成。输入是用户想要花费的UTXO，输出是作为交易结果创建的新UTXO。

例如，如果小红希望向小明发送1 BTC，则她必须有至少1 BTC的未用输出。小红的比特币钱包将创建一个交易，使用她的UTXO，将价值1 BTC的UTXO分配给小明的地址，并将剩余余额返回到小红钱包控制的新UTXO。这个新的UTXO可以在未来的交易中使用。UTXO是不可分割的，如果小红只有一个面额为5 BTC的UTXO，那么这个5 BTC的UTXO将被“消耗掉”，并产生两个新的UTXO，面额分别为1 BTC和4 BTC。

每个UTXO都有一个唯一的标识符，区块链跟踪UTXO状态。当一个UTXO被消耗时，区块链将删除这个UTXO，并替换为一个新的UTXO，表示交易的变化（如果有的话）。

总的来说，UTXO的工作原理是跟踪比特币交易的未使用输出，允许用户通过创建新的交易来使用这些UTXO来发送和接收比特币。该系统旨在确保每个比特币只能使用一次，并且所有交易都由网络通过共识机制进行验证。

## UTXO模型的适用场景及特性

事实上，UTXO模型在区块链网络、加密货币中有非常广泛的应用，例如比特币、莱特币等。UTXO模型能够在保证交易的可追踪性条件下，又一定程度上维护了用户隐私。接下来，本文将通过一个例子来更加详细介绍UTXO的适用场景及特点。

假设小红想向Bob发送2个BTC。小红之前在两个单独的交易中总共收到了3个BTC：一个是1个BTC，另一个是2个BTC。这两个交易都为小红的比特币地址创建了UTXO。**（UTXO的不可分割）**

为了将2 BTC发送给小明，小红将创建一个新的交易，该交易使用她以前的交易创建的UTXO。具体来说，她将使用1 BTC的UTXO和2 BTC的UTXO作为新交易的输入。新的交易将创建两个新的UTXO：一个用于转到小明地址的2个BTC，另一个用于返回小红钱包控制的新地址的1个BTC。这个新的UTXO是交易的更改输出，如果小红愿意，她可以在将来的交易中使用它。**（在这里，小明无法对自己收到的2 BTC进行溯源，他可以确定这些BTC来源于小红，但是无法确定自己收到的BTC是否来源于某个确切的交易，从而一定程度上确保了隐私性。但在另一种程度上，这确实会对金融监管、反洗钱等工作带来困扰，在BTC交易中，是无法分割“合法收入”和“非法收入”的）**

一旦小红将交易广播到比特币网络，网络上的节点将验证她是否有未使用的输出（UTXO）用于她试图花费的输入。如果UTXO有效且未使用，交易将被添加到区块链，小明将收到2 BTC。**（防止产生“双花”问题）**

在本例中，UTXO使小红能够将未使用的比特币输出用于向小明发送资金，同时确保每个比特币只使用一次，并且交易是安全的，可以通过网络进行验证。

## UTXO模型的潜在问题

尽管UTXO是一个优雅的解决方案，但仍然有一些知名的区块链货币没有使用UTXO模型。例如以太坊就使用了传统记账系统^[5]^，直接记录账户的余额并在交易中附带账户信息。这是由于UTXO也有一些潜在的问题。

1. UTXO碎片化。在网络上进行交易时，会创建并使用UTXO。如果用户想要进行大于可用UTXO的交易，则必须组合或“合并”UTXO，以创建单个更大的UTXO。这个过程可以创建许多较小的UTXO，这可能是低效的，并增加了区块链的规模。
2. UTXO膨胀，其中UTXO集合的大小增长过大，使得完整节点更难维护整个区块链的副本。这可能导致集中化，因为资源较少的较小节点可能无法满足维护UTXO集完整副本的需求。
3. UTXO模型本身不支持智能合约，这限制了区块链的功能。这也是为什么以太坊使用基于账户的模型，这允许更复杂的智能合约和去中心化应用程序。

尽管存在这些潜在问题，但UTXO模型已被证明对许多用例有效，并已在比特币中成功使用了十多年。

## 参考文献

[^1]: https://github.com/qisumi/block-chain-lab	本文实现的系统原型 Qcoin
[^2]: https://www.masterclass.com/articles/utxo	UTXO模型的重要性
[^3]: https://www.investopedia.com/terms/u/utxo.asp 	UTXO模型简介
[^4]: https://www.simplilearn.com/tutorials/blockchain-tutorial/blockchain-wallet	加密货币中的私钥、公钥和地址概念
[^5]: https://ethereum.org/zh/whitepaper/ 以太坊白皮书




## 附录 原型系统实现介绍

### 实现的功能

1. 实现区块链数据结构
2. 实现区块链API服务/服务端
3. 构建一个去中心化区块链网络
4. 实现一个网络共识算法
5. 实现一个区块浏览器应用

### 重要的开源库引用

1. [log4js(用于完成日志输出和保存功能)](https://log4js-node.github.io/log4js-node/)

2. [express(用于构建 API)](http://expressjs.com/zh-cn/)

3. [simple-json-db(用于在节点关机/重启时保存/读取节点数据)](https://github.com/nmaggioni/Simple-JSONdb)

4. [node-fetch(用于实现节点之间的通信)](https://github.com/node-fetch/node-fetch)

### 相较于在线资料做出的工程方面改进

1. 整体使用 typescript 完成
2. 对于网络请求的框架，使用 node-fetch 代替，使用了更加现代化的API
3. 对于 api 构建，将不同的 api 分解到了不同的文件中
4. 新增了 simple-json-db 来保存链的基本信息
5. 新增了 log4js 依赖，可以定制丰富的日志行为
6. 新增了 jest 框架，使得单元测试可以自动化，并且可以得到测试覆盖率
7. 对于加密算法和 UUID 的实现，使用了 JS 标准库中的 crypto 代替了 uuid, sha256 两个依赖

### 存在的问题

1. 没有验证挖矿奖励 Transaction 合法性的机制

2. 对于交易并没有验证严格的记账算法

3. 目前 Qcoin 没有提供"钱包设定"