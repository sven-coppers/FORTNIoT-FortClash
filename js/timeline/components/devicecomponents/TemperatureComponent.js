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
var TemperatureComponent = /** @class */ (function (_super) {
    __extends(TemperatureComponent, _super);
    function TemperatureComponent(mainController, parentDevice, parentElement, label) {
        return _super.call(this, mainController, parentDevice, parentElement, label, null, "temperature.png") || this;
    }
    TemperatureComponent.prototype.getDefaultOptions = function () {
        var options = _super.prototype.getDefaultOptions.call(this);
        options["dataAxis"] = { showMajorLabels: true, left: { range: { min: -20, max: 40 } } };
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
    return TemperatureComponent;
}(ContinuousGraphComponent));
//# sourceMappingURL=TemperatureComponent.js.map