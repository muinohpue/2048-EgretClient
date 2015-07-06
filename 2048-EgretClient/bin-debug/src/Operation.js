var Operation = (function (_super) {
    __extends(Operation, _super);
    function Operation() {
        _super.call(this);
        this.downPoint = new egret.Point();
        this.movePoint = new egret.Point();
        this.stage = egret.MainContext.instance.stage;
    }
    var __egretProto__ = Operation.prototype;
    __egretProto__.startListen = function () {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
    };
    __egretProto__.onTouchBegin = function (event) {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.downPoint.x = event.stageX;
        this.downPoint.y = event.stageY;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
        this.stage.addEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
    };
    __egretProto__.onTouchMove = function (event) {
        this.movePoint.x = event.stageX;
        this.movePoint.y = event.stageY;
    };
    __egretProto__.onTouchUp = function (event) {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchUp, this);
        this.stage.removeEventListener(egret.Event.LEAVE_STAGE, this.onTouchUp, this);
        var offsetX = this.movePoint.x - this.downPoint.x;
        var offsetY = this.movePoint.y - this.downPoint.y;
        if (offsetX > 0 && Math.abs(offsetX) - Math.abs(offsetY) > 15) {
            this.doMove(3 /* Right */);
        }
        else if (offsetX < 0 && Math.abs(offsetX) - Math.abs(offsetY) > 15) {
            this.doMove(2 /* Left */);
        }
        else if (offsetY > 0 && Math.abs(offsetY) - Math.abs(offsetX) > 15) {
            this.doMove(1 /* Down */);
        }
        else if (offsetY < 0 && Math.abs(offsetY) - Math.abs(offsetX) > 15) {
            this.doMove(0 /* Up */);
        }
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
    };
    __egretProto__.doMove = function (direction) {
        var moveEvent = new MoveEvent(Operation.MOVE);
        moveEvent.direction = direction;
        this.dispatchEvent(moveEvent);
    };
    Operation.MOVE = "move";
    return Operation;
})(egret.EventDispatcher);
Operation.prototype.__class__ = "Operation";
//# sourceMappingURL=Operation.js.map