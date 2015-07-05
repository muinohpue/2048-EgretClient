class Operation extends egret.EventDispatcher {
    public static MOVE: string = "move";

    private stage: egret.Stage;

    private downPoint: egret.Point = new egret.Point();
    private movePoint: egret.Point = new egret.Point();

    public constructor() {
        super();
        this.stage = egret.MainContext.instance.stage;
    }

    public startListen(): void {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
    }

    private onTouchBegin(event: egret.TouchEvent): void {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.downPoint.x = event.stageX;
        this.downPoint.y = event.stageY;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
        this.stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
    }

    private onTouchMove(event: egret.TouchEvent): void {
        this.movePoint.x = event.stageX;
        this.movePoint.y = event.stageY;
    }

    private onTouchUp(event: egret.Event): void {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
        this.stage.removeEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);

        var offsetX: number = this.movePoint.x - this.downPoint.x;
        var offsetY: number = this.movePoint.y - this.downPoint.y;
        if (offsetX > 0 && Math.abs(offsetX) - Math.abs(offsetY) > 15) {
            this.doMove(Direction.Right);
        } else if (offsetX < 0 && Math.abs(offsetX) - Math.abs(offsetY) > 15) {
            this.doMove(Direction.Left);
        } else if (offsetY > 0 && Math.abs(offsetY) - Math.abs(offsetX) > 15) {
            this.doMove(Direction.Down);
        } else if (offsetY < 0 && Math.abs(offsetY) - Math.abs(offsetX) > 15) {
            this.doMove(Direction.Up);
        }

        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
    }

    private doMove(direction: Direction) {
        var moveEvent: MoveEvent = new MoveEvent(Operation.MOVE);
        moveEvent.direction = direction;
        this.dispatchEvent(moveEvent);
    }
} 