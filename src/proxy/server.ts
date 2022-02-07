import { default as express } from "express";
import { NextFunction, Request, Response } from "express";
import { FileSystemAdapter } from 'obsidian';
import Live2DPlugin from "../main";
import path from 'path'

const getServer = (port: number, plugin: Live2DPlugin) => {
    const app = express();
    express.static.mime.define({'text/css': ['css']});

    const vault = plugin.app.vault;
    const basePath = (vault.adapter instanceof FileSystemAdapter) ? vault.adapter.getBasePath() : null
    //设置跨域访问
    app.all('*', function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        next();
    });
    app.use('/', express.static(path.normalize(basePath + '/.obsidian/plugins/live2d-widget-obsidian')));

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send(err.message);
    });

    return app.listen(port);
};

export default getServer;