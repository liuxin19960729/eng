import Module, { E_Module_Type } from "./modules/Module";

const { ccclass, property } = cc._decorator;

declare global {
    namespace app {
        /**
         *  游戏是否运行
         */
        const isRunning: boolean;
        /**
         * 游戏运行总时间
         */
        const totalTime: number;

        const sys: ISysModules;
        const cus: ICusModules;

        function log(str: string, ...args: any[]);

        function error(str: string, ...args: any[]);

        function debug(str: string, ...args: any[]);

    }

    interface ISysModules {

    }

    interface ICusModules {

    }
}
@ccclass
export default class Engine extends cc.Component {
    protected onLoad(): void {
        const mods = this.node.getComponentsInChildren(Module);
        mods.forEach(mod => {
            app.registerModule(mod.node.name, mod);
        })
    }
}



class App {
    private _isRunning: boolean = false;
    private readonly _event: cc.EventTarget = new cc.EventTarget();
    readonly sys: { [key: string]: Module } = {};
    readonly cus: { [key: string]: Module } = {};


    registerModule(key: string, module: Module) {
        const self = this;
        const map = module.type == E_Module_Type.Custom ? self.cus : self.sys;
        const typeStr = module.type == E_Module_Type.Custom ? "custom" : "system";
        if (!!map[`${key}`]) {
            const typeStr = module.type == E_Module_Type.Custom ? "custom" : "system";
            throw Error(`[${typeStr}]: ${key} module 同名`)
        } else {
            map[`${key}`] = module;
            this.debug(`[${typeStr}] name:${key} module register`);
        }
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    async init(cb?: (progress: number, total: number) => void): Promise<any> {
        const self = this;
        Object.values(self.sys).forEach(val => val["_event"] = self._event);
        Object.values(self.cus).forEach(val => val["_event"] = self._event);
        Object.values(self.sys).forEach(val => !!val.onBeforeInit && val.onBeforeInit());
        Object.values(self.cus).forEach(val => !!val.onBeforeInit && val.onBeforeInit());
        const sysInits = Object.values(self.sys).filter(v => v.onInit);
        const cusInits = Object.values(self.cus).filter(v => v.onInit);
        const total = sysInits.length + cusInits.length;
        let progress = 0;
        await Promise.all(sysInits.map(v => v.onInit().then(v => cb(++progress, total))));
        await Promise.all(cusInits.map(v => v.onInit().then(v => cb(++progress, total))));
        Object.values(self.sys).forEach(val => !!val.onAfterInit && val.onAfterInit());
        Object.values(self.cus).forEach(val => !!val.onAfterInit && val.onAfterInit());
        return Promise.resolve();
    }
    private _totalTime: number = 0;

    get totalTime(): number {
        return this._totalTime;
    }
    update(dt: number) {
        if (!this._isRunning) return;
        this._totalTime += dt;

    }


    log(str: string, ...args: any[]) {
        console.log("info: " + str, ...args);
    }

    error(str: string, ...args: any[]) {
        console.error("error: " + str, ...args);
    }

    debug(str: string, ...args: any[]) {
        if (CC_DEBUG || CC_DEV) {
            console.log("%cdebug: " + str, "color:rgb(7, 193, 96);font-weight:bolder;", ...args);
        }
    }
}

const app = new App();

export { app };

(<any>window)[`app`] = app;