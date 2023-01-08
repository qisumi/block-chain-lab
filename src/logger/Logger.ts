import log4js from "log4js";
const port = process.argv[2];
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
        server_file: {
            type: "file",
            filename: `log/server-${port}.log`,
            pattern: 'yyyy-MM-dd',
            maxLogSize: '5M',
            backups: 2,
            compress: false,
            keepFileExt: true,
            // alwaysIncludePattern: true
        },
        server_console: {
            type: "stdout"
        }
    },
    categories: {
        default: {
            appenders: ["server_console"],
            level: "debug"
        },
        test: {
            appenders: ["test"],
            level: "debug"
        },
        server: {
            appenders: ["server_file", "server_console"],
            level: "trace"
        }
    },
})

export const testLogger = log4js.getLogger('test');
export const serverLogger = log4js.getLogger('server');