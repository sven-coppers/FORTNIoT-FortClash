var RuleClient = /** @class */ (function () {
    function RuleClient(mainController) {
        this.mainController = mainController;
        this.executionHistory = [];
    }
    RuleClient.prototype.refresh = function () {
        this.loadExecutionHistory();
        // this.loadExecutionFuture();
    };
    RuleClient.prototype.loadExecutionHistory = function () {
        var oThis = this;
        $("#reload").addClass("disabled");
        $.ajax({
            url: this.mainController.API_URL + (this.mainController.isRemote() ? "rules_history.json" : "rules/history/"),
            type: "GET",
        }).done(function (data) {
            oThis.executionHistory = data;
        });
    };
    /* private loadExecutionFuture() {
         let oThis = this;
         $("#reload").addClass("disabled");
 
         $.ajax({
             url:            this.mainController.API_URL + (this.mainController.isRemote() ? "rules_future.json" : "rules/future/"),
             type:           "GET",
         }).done(function (data) {
             oThis.executionFuture = data;
             oThis.futureLoaded = true;
         });
     } */
    RuleClient.prototype.loadRules = function (timeline) {
        $.ajax({
            url: this.mainController.API_URL + (this.mainController.isRemote() ? "rules.json" : "rules/"),
            type: "GET",
            headers: {
                Accept: "application/json; charset=utf-8" // FORCE THE JSON VERSION
            }
        }).done(function (data) {
            timeline.initializeRules(data);
        });
    };
    RuleClient.prototype.setRuleEnabled = function (ruleID, enabled) {
        var oThis = this;
        $.ajax({
            url: "http://localhost:8080/intelligibleIoT/api/rules/" + ruleID + "/",
            type: "PUT",
            data: JSON.stringify({ enabled: enabled }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        }).done(function (data) {
            oThis.mainController.refreshContext();
        });
    };
    RuleClient.prototype.commitNewSnoozedAction = function (snoozedAction) {
        var oThis = this;
        $.ajax({
            url: "http://localhost:8080/intelligibleIoT/api/overrides/snoozed_actions",
            type: "POST",
            data: JSON.stringify(snoozedAction),
            contentType: "application/json; charset=utf-8",
            dataType: "json"
        }).done(function (data) {
            oThis.mainController.refreshContext();
        });
    };
    RuleClient.prototype.commitRemoveSnoozedAction = function (snoozedActionID) {
        var oThis = this;
        $.ajax({
            url: "http://localhost:8080/intelligibleIoT/api/overrides/snoozed_actions/" + snoozedActionID,
            type: "DELETE"
        }).done(function (data) {
            oThis.mainController.refreshContext();
        });
    };
    RuleClient.prototype.getExecutionsHistory = function () {
        return this.executionHistory;
    };
    return RuleClient;
}());
//# sourceMappingURL=RuleClient.js.map