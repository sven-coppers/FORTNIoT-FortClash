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
var TemperatureTimeline = /** @class */ (function (_super) {
    __extends(TemperatureTimeline, _super);
    function TemperatureTimeline(mainController, identifier, friendlyName, containerTimeline) {
        var _this = _super.call(this, containerTimeline, identifier) || this;
        _this.components = [];
        _this.components.push(new TemperatureComponent(mainController, _this, _this.getMainAttributeContainer(), friendlyName));
        return _this;
    }
    return TemperatureTimeline;
}(DeviceTimeline));
//# sourceMappingURL=TemperatureTimeline.js.map