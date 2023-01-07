import log4js from "log4js";

log4js.configure({
    appenders: {
        test: {
            type: "file",
            filename: "log/test.log",
            pattern: 'yyyy-MM-dd',
            maxLogSize: '5M',
            backups: 2,
            compress: false,
            keepFileExt: true,
            // alwaysIncludePattern: true
        },
    },
    categories: {
        default:{
            appenders: ["test"],
            level: "debug"
        },
        test: {
            appenders: ["test"],
            level: "debug"
        },
    },
})

export const testLogger = log4js.getLogger('test');