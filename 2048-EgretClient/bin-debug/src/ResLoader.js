var ResLoader = (function (_super) {
    __extends(ResLoader, _super);
    function ResLoader() {
        _super.call(this);
        this.stage = egret.MainContext.instance.stage;
    }
    var __egretProto__ = ResLoader.prototype;
    __egretProto__.startPreLoad = function () {
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/resource.json", "resource/");
    };
    /**
    * 配置文件加载完成,开始预加载preload资源组。
    */
    __egretProto__.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        this.dispatchEvent(new egret.Event(ResLoader.PRELOAD_COMPLETE));
        //RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        //RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        //RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        //RES.loadGroup("preload");
    };
    ResLoader.PRELOAD_COMPLETE = "preload_complete";
    return ResLoader;
})(egret.EventDispatcher);
ResLoader.prototype.__class__ = "ResLoader";
//# sourceMappingURL=ResLoader.js.map