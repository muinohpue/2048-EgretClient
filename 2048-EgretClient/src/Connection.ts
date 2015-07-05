class Connection extends egret.EventDispatcher{
    //public static HOST: string = "localhost";
    //public static HOST: string = "192.168.1.107";
    //public static URL_START: string = "http://" + Connection.HOST + ":8000/2048/start";
    //public static URL_MOVE: string = "http://" + Connection.HOST + ":8000/2048/move";
    public static URL_START: string = "";
    public static URL_MOVE: string = "";

    public static DATA_STARTED: string = "data_started";
    public static DATA_MOVED: string = "data_moved";

    private _main: egret.MainContext;
    private _data: GameData;

    private urlloader: egret.URLLoader;

    public constructor(data: GameData) {
        super();
        this._main = egret.MainContext.instance;
        this._data = data;
    }

    public sendStart(): void {
        this.urlloader = new egret.URLLoader();
        this.urlloader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        var urlreq: egret.URLRequest = new egret.URLRequest();
        urlreq.method = egret.URLRequestMethod.GET;
        urlreq.url = Connection.URL_START;
        this.urlloader.addEventListener(egret.Event.COMPLETE, this.onStartBack, this);
        this.urlloader.load(urlreq);
    }

    private onStartBack(event: egret.Event): void {
        var data: any[][] = JSON.parse(event.target.data);
        for (var i: number = 0; i < GameData.CELL_MAX; i++) {
            for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                this._data.dataArr[i][j] = data[i][j].value;
            }
        }
        this.dispatchEvent(new egret.Event(Connection.DATA_STARTED));
    }

    public _isProtocalSending: boolean = false;

    public sendMove(direction: Direction): void {
        if (this._isProtocalSending) {
            return;
        }
        this._isProtocalSending = true;
        Utils.showStatus("moving");
        
        var url: string = Connection.URL_MOVE;
        var loader: egret.URLLoader = new egret.URLLoader();
        //loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader.addEventListener(egret.Event.COMPLETE, this.onMoveComplete, this);
        var request: egret.URLRequest = new egret.URLRequest(url);
        request.method = egret.URLRequestMethod.POST;
        request.data = new egret.URLVariables("direction=" + Direction[direction] + "&table=" + JSON.stringify(this._data.dataArr) + "");
        loader.load(request);

        console.log("out "+JSON.stringify(this._data.dataArr));
    }

    private onMoveComplete(event: egret.Event): void {
        Utils.showStatus("ok");

        var data: {
            value: number;
            "type": string;
            source: any;
        }[][] = JSON.parse(event.target.data);

        var str: string = this.convertToString(data);
        console.log("in " + str);

        this._data.convertDataFromServer(data);

        var event: egret.Event = new egret.Event(Connection.DATA_MOVED);
        event.data = data;
        this.dispatchEvent(event);
    }

    private convertToString(arr: { value: number; "type": string; source: any; }[][]): string {
        var str: string = "[";
        for (var i: number = 0; i < GameData.CELL_MAX; i++) {
            str += "[";
            for (var j: number = 0; j < GameData.CELL_MAX; j++) {
                if (arr[j][i] == null) {
                    str += "0,";
                } else {
                    str += arr[i][j].value + ",";
                }
            }
            str += "]\n";
        }
        str += "]";
        return str;
    }
}