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
var PersonCounterTimeline = /** @class */ (function (_super) {
    __extends(PersonCounterTimeline, _super);
    function PersonCounterTimeline(mainController, identifier, friendlyName, containerTimeline) {
        var _this = _super.call(this, containerTimeline, identifier) || this;
        _this.components = [];
        _this.components.push(new StateComponent(mainController, _this, _this.getMainAttributeContainer(), friendlyName, null, "users.png"));
        return _this;
    }
    return PersonCounterTimeline;
}(DeviceTimeline));
//# sourceMappingURL=PersonCounterTimeline.js.map