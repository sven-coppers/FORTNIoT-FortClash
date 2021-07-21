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
var IoTButtonTimeline = /** @class */ (function (_super) {
    __extends(IoTButtonTimeline, _super);
    function IoTButtonTimeline(identifier, containerTimeline) {
        var _this = _super.call(this, containerTimeline, identifier) || this;
        _this.components = [];
        return _this;
        //this.components.push(new AxisComponent(this, this.getMainAttributeContainer(), '<img src="img/button.png" class="thumbnail"/> Button'));
    }
    IoTButtonTimeline.prototype.adaptStateChangesToTimeline = function (changeItems) {
        var items = [];
        // TODO: Change to events
        items.push({
            id: 1,
            group: 1,
            content: "Clicked",
            start: new Date(),
            end: new Date(),
            type: 'range'
        }, {
            id: 2,
            group: 1,
            content: "Clicked",
            end: new Date(),
            start: new Date(new Date().getTime() + 20000),
            type: 'range'
        });
        return items;
    };
    return IoTButtonTimeline;
}(DeviceTimeline));
//# sourceMappingURL=IoTButtonTimeline.js.map