var MoveEvent = (function (_super) {
    __extends(MoveEvent, _super);
    function MoveEvent(type, bubbles, cancelable) {
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        _super.call(this, type, bubbles, cancelable);
    }
    var __egretProto__ = MoveEvent.prototype;
    return MoveEvent;
})(egret.Event);
MoveEvent.prototype.__class__ = "MoveEvent";
//# sourceMappingURL=MoveEvent.js.map