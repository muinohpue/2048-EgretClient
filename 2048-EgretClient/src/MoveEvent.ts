class MoveEvent extends egret.Event {
    public direction: Direction;

    public constructor(type: string, bubbles: boolean = false, cancelable: boolean = false) {
        super(type, bubbles, cancelable);
    }
}