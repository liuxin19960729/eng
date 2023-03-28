
import LoadingWindow from "../loading/LoadingWindow";
import { app } from "./Engine";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class Entry extends cc.Component {

    @property(cc.String)
    loadingBundle: string = "loading";

    @property(cc.String)
    loadingPrefebPath: string = "loading"


    protected loadingWindow: LoadingWindow = null;
    protected loadingPrefeb: cc.Prefab = null;

    protected async start() {
        const loadingPrefeb = await this.loadLoding();
        loadingPrefeb.addRef();
        this.loadingPrefeb = loadingPrefeb;
        const loadingNode = cc.instantiate(loadingPrefeb);
        cc.find("Canvas").addChild(loadingNode);
        this.loadingWindow = loadingNode.getComponent(LoadingWindow);
        await app.init(this.loading.bind(this));
        app.debug(`游戏开始`)
        this.startGame();
    }


    protected update(dt: number): void {
        app.update(dt);
    }

    abstract startGame();
    abstract loading(progress: number, total: number);

    protected loadLoding(): Promise<cc.Prefab> {
        const self = this;
        return new Promise((res, rej) => {
            cc.assetManager.loadBundle(self.loadingBundle, (err, bundle) => {
                if (!!err) return rej(err)
                bundle.load<cc.Prefab>(self.loadingPrefebPath, (err, prefeb) => {
                    if (!!err) return rej(err);
                    res(prefeb);
                })
            })
        })
    }
}
