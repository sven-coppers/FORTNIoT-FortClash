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
var WindComponent = /** @class */ (function (_super) {
    __extends(WindComponent, _super);
    function WindComponent(mainController, parentDevice, parentElement, label) {
        return _super.call(this, mainController, parentDevice, parentElement, label, null, "wind.png") || this;
    }
    WindComponent.prototype.getDefaultOptions = function () {
        var options = _super.prototype.getDefaultOptions.call(this);
        options["dataAxis"] = { showMajorLabels: true, left: { range: { min: -50, max: 150 } } };
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
    WindComponent.prototype.valueToLabel = function (value) {
        return { content: value.toFixed(0), xOffset: -5, yOffset: 18 };
    };
    return WindComponent;
}(ContinuousGraphComponent));
//# sourceMappingURL=WindComponent.js.map