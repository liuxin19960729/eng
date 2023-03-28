import Module from "../Module";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ConfigModule extends Module {
    @property(cc.JsonAsset)
    protected config: cc.JsonAsset = null;


    onInit(): Promise<any> {
        return new Promise((res, rej) => {
            res("");
        })
    }
}

