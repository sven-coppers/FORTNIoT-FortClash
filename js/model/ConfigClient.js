var ConfigClient = /** @class */ (function () {
    function ConfigClient(mainController) {
        this.mainController = mainController;
        //  this.connectedToHassio = false;
        this.predictionEngineEnabled = false;
    }
    //   public isConnectedToHassio(): boolean {
    //       return this.connectedToHassio;
    //   }
    ConfigClient.prototype.getPredictionInterval = function () {
        return this.predictionInterval;
    };
    ConfigClient.prototype.getPredictionWindow = function () {
        return this.predictionWindow;
    };
    ConfigClient.prototype.isPredictionEngineEnabled = function () {
        return this.predictionEngineEnabled;
    };
    ConfigClient.prototype.refresh = function () {
        //  this.refreshConfig();
        this.refreshPredictionEngine();
    };
    /*  private refreshConfig() {
          let oThis = this;
  
          $.ajax({
              url: "http://localhost:8080/intelligibleIoT/api/config",
              type: "GET",
              headers: {
                  Accept: "application/json; charset=utf-8" // FORCE THE JSON VERSION
              }
          }).done(function (data) {
          //    oThis.connectedToHassio = data["connected_to_hassio"];
          });
      } */
    ConfigClient.prototype.refreshPredictionEngine = function () {
        var oThis = this;
        $.ajax({
            url: this.mainController.API_URL + (this.mainController.isRemote() ? "settings.json" : "config/predictions"),
            type: "GET",
            headers: {
                Accept: "application/json; charset=utf-8" // FORCE THE JSON VERSION
            }
        }).done(function (data) {
            oThis.predictionEngineEnabled = data["predictions"];
            oThis.predictionWindow = data["tick_window_minutes"];
            oThis.predictionInterval = data["tick_interval_minutes"];
            if (oThis.predictionEngineEnabled) {
                $("#version").text("Version A - " + data["use_case"]);
            }
            else {
                $("#version").text("Version B - " + data["use_case"]); // Baseline
            }
            if (data["question"] != null) {
                $("#question").text(" - " + data["question"]);
            }
            oThis.mainController.configLoaded();
        });
    };
    return ConfigClient;
}());
//# sourceMappingURL=ConfigClient.js.map