const { ccclass, property } = cc._decorator;

@ccclass
export default class CompUI<T = undefined> extends cc.Component {
    private __data: T;
    protected data(): T {
        return this.__data;
    }

    setData(v: T) {
        this.__data = v;
    }


    show(data?: T) {
        if (this.node.active) {
            if (this.__data != data) {
                this.__data = data;
                this.onShow(this.__data);
            }
        } else {
            this.__data = data;
            this.node.active = true;
        }
    }

    hide() {
        if (!this.node.active) return;
        this.node.active = false;
    }

    protected onEnable(): void {
        this.onShow(this.__data);
    }

    protected onDisable(): void {
        this.onHide();
    }

    protected onShow?(data?: T);

    protected onHide?();

}