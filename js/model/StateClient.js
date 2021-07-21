var StateClient = /** @class */ (function () {
    function StateClient(mainController) {
        this.mainController = mainController;
        this.stateHistory = [];
    }
    StateClient.prototype.loadStateHistory = function () {
        var oThis = this;
        $("#reload").addClass("disabled");
        $.ajax({
            url: this.mainController.API_URL + (this.mainController.isRemote() ? "states_history.json" : "states/history/"),
            type: "GET",
        }).done(function (data) {
            oThis.stateHistory = data;
            oThis.addAnchorTime(data);
            oThis.mainController.pastStatesLoaded();
        });
    };
    StateClient.prototype.addAnchorTime = function (data) {
        for (var entity in data) {
            for (var _i = 0, _a = data[entity]; _i < _a.length; _i++) {
                var entityState = _a[_i];
                entityState["last_changed"] = new Date(new Date(entityState["last_changed"]).getTime() + this.mainController.getAnchorDate().getTime());
                entityState["last_updated"] = new Date(new Date(entityState["last_updated"]).getTime() + this.mainController.getAnchorDate().getTime());
            }
        }
    };
    StateClient.prototype.drawStateChangeHistory = function (changes) {
        for (var i = changes.length - 1; i >= 0; i--) {
            this.mainController.devices[changes[i]["entity_id"]].addStateHistoryItem(changes[i]);
        }
    };
    StateClient.prototype.drawStateChangeFuture = function (changes) {
        for (var i = changes.length - 1; i >= 0; i--) {
            this.mainController.devices[changes[i]["entity_id"]].addStateFutureItem(changes[i]);
        }
    };
    StateClient.prototype.getStatesHistory = function () {
        return this.stateHistory;
    };
    StateClient.prototype.combineStateHistoryAndFuture = function (stateFuture) {
        var combinedStates = {};
        for (var deviceID in this.stateHistory) {
            combinedStates[deviceID] = [];
            combinedStates[deviceID] = combinedStates[deviceID].concat(this.stateHistory[deviceID]);
            if (typeof stateFuture[deviceID] !== "undefined") {
                combinedStates[deviceID] = combinedStates[deviceID].concat(stateFuture[deviceID]);
            }
        }
        return combinedStates;
    };
    return StateClient;
}());
//# sourceMappingURL=StateClient.js.map