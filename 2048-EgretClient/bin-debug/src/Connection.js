var Connection = (function (_super) {
    __extends(Connection, _super);
    function Connection(data) {
        _super.call(this);
        this._isProtocalSending = false;
        this._main = egret.MainContext.instance;
        this._data = data;
    }
    var __egretProto__ = Connection.prototype;
    __egretProto__.sendStart = function () {
        this.urlloader = new egret.URLLoader();
        this.urlloader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var urlreq = new egret.URLRequest();
        urlreq.method = egret.URLRequestMethod.GET;
        urlreq.url = Connection.URL_START;
        this.urlloader.addEventListener(egret.Event.COMPLETE, this.onStartBack, this);
        this.urlloader.load(urlreq);
    };
    __egretProto__.onStartBack = function (event) {
        var data = JSON.parse(event.target.data);
        for (var i = 0; i < GameData.CELL_MAX; i++) {
            for (var j = 0; j < GameData.CELL_MAX; j++) {
                this._data.dataArr[i][j] = data[i][j].value;
            }
        }
        this.dispatchEvent(new egret.Event(Connection.DATA_STARTED));
    };
    __egretProto__.sendMove = function (direction) {
        if (this._isProtocalSending) {
            return;
        }
        this._isProtocalSending = true;
        Utils.showStatus("moving");
        var url = Connection.URL_MOVE;
        var loader = new egret.URLLoader();
        //loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader.addEventListener(egret.Event.COMPLETE, this.onMoveComplete, this);
        var request = new egret.URLRequest(url);
        request.method = egret.URLRequestMethod.POST;
        request.data = new egret.URLVariables("direction=" + Direction[direction] + "&table=" + JSON.stringify(this._data.dataArr) + "");
        loader.load(request);
        console.log("out " + JSON.stringify(this._data.dataArr));
    };
    __egretProto__.onMoveComplete = function (event) {
        Utils.showStatus("ok");
        var data = JSON.parse(event.target.data);
        var str = this.convertToString(data);
        console.log("in " + str);
        this._data.convertDataFromServer(data);
        var event = new egret.Event(Connection.DATA_MOVED);
        event.data = data;
        this.dispatchEvent(event);
    };
    __egretProto__.convertToString = function (arr) {
        var str = "[";
        for (var i = 0; i < GameData.CELL_MAX; i++) {
            str += "[";
            for (var j = 0; j < GameData.CELL_MAX; j++) {
                if (arr[j][i] == null) {
                    str += "0,";
                }
                else {
                    str += arr[i][j].value + ",";
                }
            }
            str += "]\n";
        }
        str += "]";
        return str;
    };
    //public static HOST: string = "localhost";
    //public static HOST: string = "192.168.1.107";
    //public static URL_START: string = "http://" + Connection.HOST + ":8000/2048/start";
    //public static URL_MOVE: string = "http://" + Connection.HOST + ":8000/2048/move";
    Connection.URL_START = "";
    Connection.URL_MOVE = "";
    Connection.DATA_STARTED = "data_started";
    Connection.DATA_MOVED = "data_moved";
    return Connection;
})(egret.EventDispatcher);
Connection.prototype.__class__ = "Connection";
