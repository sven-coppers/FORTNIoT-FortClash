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
var MotionComponent = /** @class */ (function (_super) {
    __extends(MotionComponent, _super);
    function MotionComponent(mainController, parentDevice, parentElement, label) {
        return _super.call(this, mainController, parentDevice, parentElement, label, "motion", "motion.png") || this;
    }
    MotionComponent.prototype.jsonToLabel = function (json) {
        if (json["state"] == "off")
            return "Clear";
        if (json["state"] == "on")
            return "Movement";
        return json["state"];
    };
    return MotionComponent;
}(StateComponent));
//# sourceMappingURL=MotionComponent.js.map