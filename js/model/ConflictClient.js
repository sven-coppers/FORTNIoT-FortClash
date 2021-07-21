var ConflictClient = /** @class */ (function () {
    function ConflictClient(mainController) {
        this.mainController = mainController;
        this.futureConflicts = [];
    }
    ConflictClient.prototype.refresh = function () {
        this.loadFutureConflicts();
    };
    ConflictClient.prototype.loadFutureConflicts = function () {
        var oThis = this;
        $.ajax({
            url: this.mainController.API_URL + (this.mainController.isRemote() ? "states_future.json" : "conflicts/future/"),
            type: "GET",
        }).done(function (data) {
            oThis.futureConflicts = data;
            //  oThis.mainController.conflictClientCompleted();
        });
    };
    ConflictClient.prototype.getConflicts = function () {
        return this.futureConflicts;
    };
    return ConflictClient;
}());
//# sourceMappingURL=ConflictClient.js.map