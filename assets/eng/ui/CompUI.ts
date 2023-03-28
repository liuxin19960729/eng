const { ccclass, property } = cc._decorator;

@ccclass
export default class CompUI<T = undefined> extends cc.Component {
    private _data: T;
    protected data(): T {
        return this._data;
    }

    setData(v: T) {
        this._data = v;
    }


    show(data?: T) {

    }

    hide() {

    }

    onShow?(data?: T);

    onHide?();

    
}