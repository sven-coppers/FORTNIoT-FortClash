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
var WeatherStateComponent = /** @class */ (function (_super) {
    __extends(WeatherStateComponent, _super);
    function WeatherStateComponent(mainController, parentDevice, parentElement, label) {
        return _super.call(this, mainController, parentDevice, parentElement, label, "weather_state", "weather.png") || this;
    }
    WeatherStateComponent.prototype.jsonToLabel = function (json) {
        var icon = json["state"];
        var label = icon;
        if (label === "partlycloudy") {
            label = "partly cloudy";
        }
        label = label.replace("_", " ");
        return '<img class="thumbnail" src="img/devices/weather/' + icon + '.png" /> ' + capitalizeFirstLetter(label);
    };
    return WeatherStateComponent;
}(StateComponent));
//# sourceMappingURL=WeatherStateComponent.js.map