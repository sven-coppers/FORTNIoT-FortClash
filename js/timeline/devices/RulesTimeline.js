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
var RulesTimeline = /** @class */ (function (_super) {
    __extends(RulesTimeline, _super);
    function RulesTimeline(mainController, containerTimeline, rules, futureClient) {
        var _this = _super.call(this, containerTimeline, "all_rules") || this;
        _this.rulesComponent = new RulesComponent(mainController, _this, _this.getMainAttributeContainer(), rules, futureClient);
        _this.components = [];
        _this.components.push(_this.rulesComponent);
        return _this;
    }
    RulesTimeline.prototype.redrawConflict = function (conflict) {
        this.rulesComponent.highlightConflict(conflict);
    };
    RulesTimeline.prototype.highlightActionExecution = function (actionExecutionID) {
        this.rulesComponent.highlightActionExecution(actionExecutionID);
    };
    RulesTimeline.prototype.clearConflict = function () {
        this.rulesComponent.clearConflict();
    };
    return RulesTimeline;
}(DeviceTimeline));
//# sourceMappingURL=RulesTimeline.js.map