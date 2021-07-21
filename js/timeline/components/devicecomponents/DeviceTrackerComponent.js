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
var DeviceTrackerComponent = /** @class */ (function (_super) {
    __extends(DeviceTrackerComponent, _super);
    function DeviceTrackerComponent(mainController, parentDevice, parentElement, label) {
        return _super.call(this, mainController, parentDevice, parentElement, label, null, "tracker.png") || this;
    }
    DeviceTrackerComponent.prototype.jsonToLabel = function (json) {
        return capitalizeFirstLetter(json["state"]);
    };
    return DeviceTrackerComponent;
}(StateComponent));
//# sourceMappingURL=DeviceTrackerComponent.js.map