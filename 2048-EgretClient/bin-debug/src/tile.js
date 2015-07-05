var Tile = (function (_super) {
    __extends(Tile, _super);
    function Tile() {
        _super.call(this);
        this.INIT_XY = GameData.GAME_BOARD_GAP;
        this.OFFSET_XY = GameData.CELL_SIDE + GameData.GAME_BOARD_GAP;
        this.createView();
    }
    var __egretProto__ = Tile.prototype;
    __egretProto__.createView = function () {
        this.background = new egret.Shape;
        this.position = new egret.Point();
        this.addChild(this.background);
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.x = 0;
        this.textField.y = 17;
        this.textField.width = 80;
        this.textField.height = 80;
        this.textField.bold = true;
        this.textField.size = 45;
        this.textField.textAlign = "center";
        this.setNumber(0);
    };
    __egretProto__.setNumber = function (num) {
        this.value = num;
        this.textField.text = num.toString();
        this.textField.textColor = this.getTextColor(num);
        this.background.graphics.clear();
        this.background.graphics.beginFill(this.getBackgroundColor(num), 1);
        this.background.graphics.drawRoundRect(0, 0, GameData.CELL_SIDE, GameData.CELL_SIDE, GameData.CELL_SIDE / 8, GameData.CELL_SIDE / 8);
        this.background.graphics.endFill();
    };
    __egretProto__.setPosition = function (x, y) {
        this.position.x = x;
        this.position.y = y;
        this.x = this.INIT_XY + this.OFFSET_XY * x;
        this.y = this.INIT_XY + this.OFFSET_XY * y;
    };
    __egretProto__.moveTo = function (x, y) {
        this.position.x = x;
        this.position.y = y;
        egret.Tween.get(this).to({ x: this.INIT_XY + this.OFFSET_XY * x, y: this.INIT_XY + this.OFFSET_XY * y }, 100);
    };
    __egretProto__.mergeTo = function (x, y) {
        var _this = this;
        this.position.x = x;
        this.position.y = y;
        egret.Tween.get(this).to({ x: this.INIT_XY + this.OFFSET_XY * x, y: this.INIT_XY + this.OFFSET_XY * y }, 100).call(function (onMerged) {
            _this.alpha = 0;
            var event = new egret.Event(Tile.NEW_TILE_BY_MERGED);
            event.data = { x: x, y: y };
            _this.dispatchEvent(event);
        });
    };
    __egretProto__.appear = function () {
        this.scaleX = this.scaleY = this.alpha = 0;
        egret.Tween.get(this).wait(100).to({ scaleX: 1.0, scaleY: 1.0, alpha: 1 }, 100);
    };
    __egretProto__.merging = function () {
        this.scaleX = this.scaleY = 1.1;
        egret.Tween.get(this).to({ scaleX: 1.0, scaleY: 1.0 }, 100);
    };
    __egretProto__.getBackgroundColor = function (num) {
        switch (num) {
            case 2:
                return 0xEEE4DA;
                break;
            case 4:
                return 0xEDE0C8;
                break;
            case 8:
                return 0xF2B179;
                break;
            case 16:
                return 0xEC8D54;
                break;
            case 32:
                return 0xF67C5F;
                break;
            case 64:
                return 0xEA5937;
                break;
            case 128:
                return 0xF3D86B;
                break;
            case 256:
                return 0xF1D04B;
                break;
            case 512:
                return 0xE4C02A;
                break;
            case 1024:
                return 0xE2BA13;
                break;
            case 2048:
                return 0xECC400;
                break;
            case 4096:
                return 0x000000;
                break;
            default: return 0xCCC0B4;
        }
    };
    __egretProto__.getTextColor = function (num) {
        //if (num == 0) {
        //    return 0xCCC0B4;
        //} else
        if (num == 2 || num == 4) {
            return 0x776E65;
        }
        else {
            return 0xFFFFFF;
        }
    };
    Tile.NEW_TILE_BY_MERGED = "new_tile_by_merged";
    return Tile;
})(egret.Sprite);
Tile.prototype.__class__ = "Tile";
