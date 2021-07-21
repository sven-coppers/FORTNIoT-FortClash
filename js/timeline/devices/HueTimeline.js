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
var HueTimeline = /** @class */ (function (_super) {
    __extends(HueTimeline, _super);
    function HueTimeline(mainController, identifier, deviceName, containerTimeline) {
        var _this = _super.call(this, containerTimeline, identifier) || this;
        _this.components = [];
        _this.components.push(new StateComponent(mainController, _this, _this.getMainAttributeContainer(), deviceName, "state", "hue.png"));
        return _this;
        // this.components.push(new DiscreteGraphComponent(this.device.getHTMLID() + '_brightness_graph', this,"Brightness"));
        //   this.components.push(new ColorComponent(this.device.getHTMLID() + '_color_timeline', this));
    }
    HueTimeline.prototype.adaptBrightnessChangesToGraph = function (changeItems) {
        if (changeItems.length == 0)
            return [];
        var items = [];
        var lastTime = changeItems[0]["last_changed"];
        var lastBrightness = changeItems[0]["attributes"]["brightness"];
        items.push({ x: lastTime, y: lastBrightness / 255.0, group: 1 });
        for (var i = 1; i < changeItems.length; i++) {
            var thisBrightness = changeItems[i]["attributes"]["brightness"];
            var thisTime = changeItems[i]["last_changed"];
            if (thisBrightness == lastBrightness)
                continue;
            var oldPoint = new Date(thisTime);
            oldPoint.setSeconds(oldPoint.getSeconds() - 5);
            items.push({ x: oldPoint, y: lastBrightness / 255.0, group: 1 });
            items.push({ x: thisTime, y: thisBrightness / 255.0, group: 1 });
            lastBrightness = thisBrightness;
            lastTime = thisTime;
        }
        var latest = Math.max(Date.parse(lastTime), new Date().getTime());
        items.push({ x: new Date(latest), y: lastBrightness / 255.0, group: 1 });
        return items;
    };
    HueTimeline.prototype.adaptColorChangesToTimeline = function (deviceChanges) {
        if (deviceChanges.length == 0)
            return [];
        var items = [];
        var lastColor = deviceChanges[0]["attributes"]["rgb_color"];
        var startTime = deviceChanges[0]["last_updated"];
        var endTime = startTime;
        for (var i = 0; i < deviceChanges.length; i++) {
            var thisColor = deviceChanges[i]["attributes"]["rgb_color"];
            if (JSON.stringify(thisColor) !== JSON.stringify(lastColor) || deviceChanges[i]["state"] === "off") {
                endTime = deviceChanges[i]["last_updated"];
                if (thisColor != null) {
                    for (var j = 0; j < 3; j++) {
                        thisColor[j] = 255 * thisColor[j];
                    }
                    items.push({
                        id: i,
                        group: 1,
                        content: '<span class="colored" style="background-color: rgb(' + thisColor + ');">&nbsp;</span>',
                        start: startTime,
                        end: endTime,
                        type: 'range'
                    });
                }
                lastColor = thisColor;
                startTime = endTime;
            }
        }
        return items;
    };
    return HueTimeline;
}(DeviceTimeline));
//# sourceMappingURL=HueTimeline.js.map