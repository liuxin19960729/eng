import KVMap from "../../utils/collection/KVMap";
import Module from "../Module";

declare global {
    interface ISysModules {
        conf: IConfigModule;
    }

    interface IConfigData {
        t_text: ConfigData<dt.t_text>;
    }
    interface IConfigModule {
        data: IConfigData;
    }
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class ConfigModule extends Module implements IConfigModule {
    @property(cc.JsonAsset)
    protected tableConfig: cc.JsonAsset = null;

    @property(cc.String)
    protected bundle: string = "resources"

    @property(cc.String)
    protected dirPath: string = "data/"

    private _config: { [key: string]: ConfigData<{ id: number }> } = {}



    onInit(): Promise<any> {
        const self = this;
        return new Promise((res, rej) => {

            const load = function () {
                const jsons: dt.t_table_config[] = self.tableConfig.json;
                const map: KVMap<string, any> = new KVMap();
                jsons.forEach(json => map.set(json.table_name, true));
                cc.assetManager.loadBundle(self.bundle, {}, (err, bundle) => {
                    if (!!err) {
                        rej(err);
                        return;
                    } else {
                        bundle.loadDir(self.dirPath, cc.JsonAsset, (err, datas) => {
                            if (!!err) return rej(err);
                            datas.forEach(data => {
                                if (map.has(data.name)) {
                                    self._config[`${data.name}`] = new ConfigData(data.json);
                                }
                            })
                            res("")
                        })
                    }
                })
            }

            load();
        })
    }

    get data(): IConfigData {
        return this._config as any;
    }
}



class ConfigData<T extends { id: number }> {
    private __map: { [key: string]: T } = {};
    private __datas: T[];
    constructor(datas: T[]) {
        const self = this;
        datas.forEach(json => {
            self.__map[json.id] = json;
        })
        self.__datas = datas || [];
    }


    get All(): T[] {
        return this.__datas.slice();
    }

    findOne(id: number): T | undefined {
        return this.__map[id];
    }

    has(id: number): boolean {
        return !!this.__map[id]
    }

    find(cb: (value: T, index: number, array: T[]) => value is T,): T[] {
        return this.__datas.filter(cb);
    }
}

