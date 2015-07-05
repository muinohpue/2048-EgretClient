class Utils {
    public static showStatus(str: string): void {
        var event: egret.Event = new egret.Event(Main.STATUS_CHANGED);
        event.data = str;
        egret.MainContext.instance.dispatchEvent(event);
    }
}