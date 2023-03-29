
import { app } from "./Engine";
const { ccclass, property } = cc._decorator;

declare global {
    interface GlobalGameConfig {
        loading?: LoadingConfig;
    }

    interface LoadingConfig {
        bundle: string,
        path: string
        options?: Record<string, any>;
    }
}

@ccclass
export default abstract class Entry extends cc.Component {

    protected readonly GlobalGameConfig: Readonly<GlobalGameConfig> = {
        loading: {
            bundle: "loading",
            path: "loading",
        }
    };




    protected async start() {
        const self = this;
        const loadPrefeb = await self.__loading().catch(err => err);
        if (loadPrefeb instanceof cc.Prefab) {
            const loadNode = cc.instantiate(loadPrefeb);
            loadNode.once("startGame", self.__startGame, self);
            cc.find("Canvas").addChild(loadNode);
            await app.init(self.loadResProgress && function (progress, total) {
                self.loadResProgress(progress, total, loadNode);
            }).catch(err => {
                loadNode.off("startGame", self.__startGame, self);
                self.__startGame(err);
            });
        } else {
            app.error(loadPrefeb);
            throw loadPrefeb; 
        }
    }


    protected update(dt: number): void {
        app.update(dt);
    }


    private __startGame(err: Error) {
        if (!!this.__loadPrefeb) {
            this.__loadPrefeb.decRef();
            this.__loadPrefeb = null;
            app.debug(`loading Prefeb decRef`)
        }
        if (!!this.__bundle) {
            this.__bundle.releaseAll();
            this.__bundle = null;
            app.debug(`loading bundle releaseAll`)
        }
        this.startGame(err);
    }

    protected abstract startGame(err: Error);

    private __bundle: cc.AssetManager.Bundle;
    private __loadPrefeb: cc.Prefab;
    private __loading(): Promise<cc.Prefab> {
        const self = this;
        return new Promise((res, rej) => {
            cc.assetManager.loadBundle(self.GlobalGameConfig.loading.bundle, self.GlobalGameConfig.loading.options, (err, bundle) => {
                if (!!err) return rej(err);
                self.__bundle = bundle;
                bundle.load(self.GlobalGameConfig.loading.path, cc.Prefab, (err, prefeb) => {
                    if (!!err) return rej(err);
                    self.__loadPrefeb = prefeb;
                    prefeb.addRef();
                    res(prefeb);
                })
            })
        });
    }
    protected loadResProgress?(progress: number, total: number, loadNode: cc.Node);
}


