# log4js 日志库使用帮助

[文档](https://log4js-node.github.io/log4js-node)

## 日志级别
1. ALL
2. TRACE
3. DEBUG
4. INFO
5. WARN
6. ERROR
7. FATAL
8. OFF

## 配置解释
1. appenders: 设置具体的日志输出形式
2. categories: 是 appenders 的分组，一个 category 可以接受多个 appender
3. layouts: 制定了输出日志的格式
## 一个文件例子
```js
// 这个例子中包含了使用文件储存日志的配置
import log4js from "log4js";

log4js.configure({
    appenders: {
        test: {
            type: "file",
            filename: "log/test.log",
            pattern: 'yyyy-mm-dd',
            maxLogSize: '5M',
            backups: 2,
            compress: false,
            keepFileExt: true
        },
    },
    categories: {
        test: {
            appenders: ["test"],
            level: "debug"
        },
    },
})

export const testLogger = log4js.getLogger('test');
```