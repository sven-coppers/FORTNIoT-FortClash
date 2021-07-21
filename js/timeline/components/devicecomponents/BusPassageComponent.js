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
var BusPassageComponent = /** @class */ (function (_super) {
    __extends(BusPassageComponent, _super);
    function BusPassageComponent(mainController, parentDevice, parentElement, label, property) {
        return _super.call(this, mainController, parentDevice, parentElement, label, property, "bus.png") || this;
    }
    BusPassageComponent.prototype.jsonToItem = function (json, id, startTime, endTime) {
        return {
            id: id,
            group: 1,
            content: this.createHTML(id, json["state"], true, json["future"]),
            start: startTime,
            end: new Date(new Date(startTime).getTime() + 30000),
            type: 'range'
        };
    };
    return BusPassageComponent;
}(StateComponent));
//# sourceMappingURL=BusPassageComponent.js.map