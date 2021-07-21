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
var BatteryComponent = /** @class */ (function (_super) {
    __extends(BatteryComponent, _super);
    function BatteryComponent(mainController, parentDevice, parentElement, label) {
        return _super.call(this, mainController, parentDevice, parentElement, label, null, "battery.png") || this;
    }
    BatteryComponent.prototype.getDefaultOptions = function () {
        var options = _super.prototype.getDefaultOptions.call(this);
        options["dataAxis"] = { showMajorLabels: true, left: { range: { min: -25, max: 125 } } };
        // @ts-ignore
        options["drawPoints"] = function (item, group) {
            if (item["label"] == null) {
                return false;
            }
            else {
                return { style: "circle" };
            }
        };
        return options;
    };
    BatteryComponent.prototype.valueToLabel = function (value) {
        if (value < 30) {
            return { content: value.toFixed(0), xOffset: -5, yOffset: -10 };
        }
        else {
            return { content: value.toFixed(0), xOffset: -5, yOffset: 18 };
        }
    };
    return BatteryComponent;
}(GraphComponent));
//# sourceMappingURL=BatteryComponent.js.map