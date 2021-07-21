var DeviceClient = /** @class */ (function () {
    function DeviceClient(mainController) {
        this.mainController = mainController;
    }
    DeviceClient.prototype.refresh = function () {
        this.refreshDevices();
    };
    DeviceClient.prototype.refreshDevices = function () {
        var oThis = this;
        $.ajax({
            url: this.mainController.API_URL + (this.mainController.isRemote() ? "devices.json" : "devices"),
            type: "GET",
            headers: {
                Accept: "application/json; charset=utf-8" // FORCE THE JSON VERSION
            }
        }).done(function (data) {
            oThis.mainController.updateDevices(data);
        });
    };
    DeviceClient.prototype.loadDevices = function (timeline) {
        $.ajax({
            url: this.mainController.API_URL + (this.mainController.isRemote() ? "devices.json" : "devices"),
            type: "GET",
            headers: {
                Accept: "application/json; charset=utf-8" // FORCE THE JSON VERSION
            }
        }).done(function (data) {
            timeline.initializeDevices(data);
        });
    };
    return DeviceClient;
}());
//# sourceMappingURL=DeviceClient.js.map