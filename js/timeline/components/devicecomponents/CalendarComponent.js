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
var CalendarComponent = /** @class */ (function (_super) {
    __extends(CalendarComponent, _super);
    function CalendarComponent(mainController, parentDevice, parentElement, label) {
        return _super.call(this, mainController, parentDevice, parentElement, label, "appointments", "cal.png") || this;
    }
    CalendarComponent.prototype.redraw = function (deviceChanges) {
        this.items.clear();
        if (deviceChanges.length == 0)
            return;
        var startIndex = -1;
        for (var i = 0; i < deviceChanges.length; i++) {
            if (deviceChanges[i]["state"] == "on") {
                startIndex = i;
            }
            else if (deviceChanges[i]["state"] == "off" && startIndex > -1) {
                this.items.add(this.jsonToItem(deviceChanges[startIndex], deviceChanges[startIndex]["last_changed"], deviceChanges[i]["last_changed"]));
            }
        }
    };
    CalendarComponent.prototype.jsonToItem = function (json, startTime, endTime) {
        return {
            id: json["context"]["id"],
            group: 1,
            content: this.createHTML(json["context"]["id"], json["attributes"]["message"], true, ""),
            start: startTime,
            end: endTime,
            type: 'range'
        };
    };
    return CalendarComponent;
}(StateComponent));
//# sourceMappingURL=CalendarComponent.js.map