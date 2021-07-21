var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BusStopTimeline = /** @class */ (function (_super) {
    __extends(BusStopTimeline, _super);
    function BusStopTimeline(mainController, identifier, friendlyName, containerTimeline) {
        var _this = _super.call(this, containerTimeline, identifier) || this;
        _this.components = [];
        _this.components.push(new BusPassageComponent(mainController, _this, _this.getMainAttributeContainer(), friendlyName, "passage"));
        return _this;
    }
    return BusStopTimeline;
}(DeviceTimeline));
//# sourceMappingURL=BusStopTimeline.js.map