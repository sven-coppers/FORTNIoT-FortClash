$(document).ready(function () {
    new IoTController();
});
var IoTController = /** @class */ (function () {
    function IoTController() {
        this.devices = {};
        this.feedforwardStillRelevant = false;
        this.selectedTriggerEntity = null;
        this.selectedActionID = null;
        this.selectedTime = null;
        this.initDemonstrator();
        this.updateDemonstrator();
        this.initClients();
        this.timeline = new Timeline(this, this.ruleClient, this.stateClient, this.deviceClient, this.conflictClient, this.futureClient);
        var oThis = this;
        $("#reload").click(function () {
            oThis.refreshContext();
            return false;
        });
        $(".copy").click(function () {
            var identifier = $(this).closest(".device").find(".code").attr("id");
            //$(this).closest(".device").find(".code").text().sel;
            var textBox = document.getElementById(identifier);
            /* Select the text field */
            textBox.select();
            /* Copy the text inside the text field */
            document.execCommand("copy");
        });
        if (!this.isRemote()) {
            var source = new EventSource("http://localhost:8080/intelligibleIoT/api/states/stream");
            source.onmessage = function (event) {
                if (event.data == "Scenario Changed") {
                    oThis.timeline.refreshSetup();
                }
                else {
                    oThis.refreshContext();
                }
            };
        }
        $("#rules_checkbox").click(function () {
            oThis.timeline.setAllRulesVisible($(this).is(":checked"));
            //  $(".timeline_device.rule").slideToggle();
        });
        $("#devices_checkbox").click(function () {
            oThis.timeline.setAllDevicesVisible($(this).is(":checked"));
        });
        $("#back_button").click(function () {
            oThis.clearSelection(false);
            $(this).addClass("hidden");
        });
        $("#events_without_changes").click(function () {
            $(".event_item.without_changes").toggleClass("hidden", !$(this).is(":checked"));
        });
    }
    IoTController.prototype.initClients = function () {
        // this.eventsClient = new EventsClient(this);
        this.stateClient = new StateClient(this);
        this.ruleClient = new RuleClient(this);
        this.deviceClient = new DeviceClient(this);
        //  this.configClient = new ConfigClient(this);
        this.conflictClient = new ConflictClient(this);
        this.futureClient = new FutureClient(this);
        $(".timeline_device_attributes").toggle();
    };
    // Small refresh: states, rule executions, conflicts
    IoTController.prototype.refreshContext = function () {
        $("#reload").addClass("disabled");
        $(".history").empty();
        $(".future").empty();
        this.stateClient.loadStateHistory(); // The callback will start the next request
        //this.configClient.refresh(); // The callback will start the next request
    };
    IoTController.prototype.reAlign = function (range) {
        this.timeline.reAlign(range);
    };
    IoTController.prototype.setWindow = function (newRange) {
        this.timeline.setWindow(newRange);
    };
    IoTController.prototype.configLoaded = function () {
    };
    IoTController.prototype.pastStatesLoaded = function () {
        this.futureClient.refresh();
    };
    IoTController.prototype.futureLoaded = function (future) {
        var allStates = this.stateClient.combineStateHistoryAndFuture(future.states);
        if (this.timeline != null) {
            this.timeline.loadingCompleted();
            this.timeline.redraw(allStates, future.executions, future.conflicts, false, this.getSelectedActionExecution());
        }
    };
    IoTController.prototype.showFeedforward = function (alternativeFutureStates, alternativeFutureExecutions) {
        var originalStates = this.stateClient.combineStateHistoryAndFuture(this.futureClient.getFuture().states);
        var originalExecutions = this.futureClient.getFuture().executions();
        var originalConflicts = this.conflictClient.getConflicts();
        var alternativeStates = [];
        alternativeStates = alternativeStates.concat(this.stateClient.getStatesHistory());
        alternativeStates = alternativeStates.concat(alternativeFutureStates);
        var alternativeExecutions = [];
        alternativeExecutions = alternativeExecutions.concat(this.ruleClient.getExecutionsHistory());
        alternativeExecutions = alternativeExecutions.concat(alternativeFutureExecutions);
        var alternativeConflicts = [];
        // TODO find alternative conflicts
        this.timeline.showFeedforward(originalStates, alternativeStates, originalExecutions, alternativeExecutions, originalConflicts, alternativeConflicts, null);
    };
    IoTController.prototype.updateDevices = function (data) {
        this.timeline.updateDevices(data);
    };
    IoTController.prototype.actionExecutionChanged = function (actionExecutionID, actionID, newEnabled) {
        //  console.log(actionID + " - " + actionExecutionID + ": " + newEnabled);
        // Get trigger entity ID and execution time by using the actionExecutionID
        var ruleExecution = this.futureClient.getRuleExecutionByActionExecutionID(actionExecutionID);
        if (ruleExecution != null) {
            var actionExecution = this.futureClient.getActionExecutionByActionExecutionID(ruleExecution, actionExecutionID);
            if (newEnabled) {
                if (this.isRemote()) {
                    this.futureClient.loadAlternativeFuture(actionExecution["action_execution_id"], newEnabled);
                }
                else {
                    // Now enabled -> remove snooze
                    this.ruleClient.commitRemoveSnoozedAction(actionExecution["snoozed_by"]);
                }
            }
            else {
                if (this.isRemote()) {
                    this.futureClient.loadAlternativeFuture(actionExecution["action_execution_id"], newEnabled);
                }
                else {
                    // // Now snoozed -> add snooze
                    var snoozedAction = {};
                    snoozedAction["action_id"] = actionID;
                    snoozedAction["conflict_time_window"] = 20000;
                    snoozedAction["trigger_entity_id"] = ruleExecution["trigger_entity"];
                    snoozedAction["conflict_time"] = new Date(new Date(ruleExecution["datetime"]).getTime() - this.getAnchorDate().getTime());
                    this.ruleClient.commitNewSnoozedAction(snoozedAction);
                }
            }
        }
    };
    IoTController.prototype.previewActionExecutionChange = function (actionExecutionID, newEnabled) {
        this.feedforwardStillRelevant = true;
        this.futureClient.simulateAlternativeFuture(actionExecutionID, newEnabled);
    };
    IoTController.prototype.alternativeFutureSimulationReady = function (alternativeFuture) {
        if (!this.feedforwardStillRelevant)
            return;
        var originalFuture = this.futureClient.future;
        this.timeline.showFeedforward(originalFuture.states, alternativeFuture.states, originalFuture.executions, alternativeFuture.executions, originalFuture.conflicts, alternativeFuture.conflicts, this.getSelectedActionExecution());
    };
    IoTController.prototype.cancelPreviewActionExecutionChange = function () {
        //  this.clearSelection(false);
        this.feedforwardStillRelevant = false;
        var future = this.futureClient.future;
        var allStates = this.stateClient.combineStateHistoryAndFuture(future.states);
        this.timeline.redraw(allStates, future.executions, future.conflicts, false, this.getSelectedActionExecution());
    };
    IoTController.prototype.selectState = function (stateContextID) {
        var causedByActionExecution = this.futureClient.getActionExecutionByResultingContextID(stateContextID, null);
        if (causedByActionExecution == null) {
            console.log("No explanation available for this state");
            this.clearSelection(false);
        }
        else {
            this.selectActionExecution(causedByActionExecution["action_execution_id"]);
        }
    };
    IoTController.prototype.selectActionExecution = function (actionExecutionID) {
        this.clearSelection(true);
        var ruleExecution = this.futureClient.getRuleExecutionByActionExecutionID(actionExecutionID);
        var actionExecution = this.futureClient.getActionExecutionByActionExecutionID(ruleExecution, actionExecutionID);
        if (actionExecution["resulting_contexts"].length > 0) {
            var relatedConflict = this.futureClient.getRelatedConflict(actionExecution["resulting_contexts"][0]["id"]);
            if (relatedConflict != null) {
                this.timeline.drawConflict(relatedConflict);
            }
        }
        this.timeline.highlightActionExecution(actionExecutionID);
        this.timeline.drawCustomTime(ruleExecution["datetime"]);
        this.timeline.highlightTrigger(ruleExecution["trigger_context"]["id"]);
        this.timeline.highlightConditions(this.futureClient.getTriggerContextIDsByExecution(ruleExecution));
        this.timeline.highlightActions(actionExecution["resulting_contexts"]);
        this.selectedTriggerEntity = ruleExecution["trigger_entity"];
        this.selectedActionID = actionExecution["action_id"];
        this.selectedTime = new Date(ruleExecution["datetime"]);
    };
    IoTController.prototype.clearSelection = function (nextSelectionExpected) {
        this.selectedTriggerEntity = null;
        this.selectedActionID = null;
        this.selectedTime = null;
        this.timeline.clearSelection(nextSelectionExpected);
    };
    /**
     * Return the selected action exeuction, if any. Null otherwise
     */
    IoTController.prototype.getSelectedActionExecution = function () {
        if (this.selectedTriggerEntity != null) {
            return this.futureClient.findActionExecution(this.selectedTriggerEntity, this.selectedActionID, this.selectedTime);
        }
        return null;
    };
    /*getConfigClient() {
        return this.configClient;
    } */
    IoTController.prototype.getAnchorDate = function () {
        return this.anchorDate;
    };
    IoTController.prototype.isPredicting = function () {
        return this.predicting;
    };
    IoTController.prototype.isRemote = function () {
        return this.remote;
    };
    IoTController.prototype.initDemonstrator = function () {
        //this.scenarios = ["training", "television", "temperature", "weather", "security", "conflicts"];
        this.scenarios = ["basic", "conflicts"];
        for (var _i = 0, _a = this.scenarios; _i < _a.length; _i++) {
            var scenario = _a[_i];
            $("#scenario").append("<option>" + scenario + "</option>");
        }
        var oThis = this;
        $("#predictions").click(function () {
            oThis.updateDemonstrator();
            oThis.refreshContext();
        });
        $("#remote").click(function () {
            oThis.updateDemonstrator();
            oThis.refreshContext();
        });
        $("#scenario").change(function () {
            oThis.updateDemonstrator();
            oThis.timeline.refreshSetup();
        });
    };
    IoTController.prototype.updateDemonstrator = function () {
        var selectedScenarioElement = $("#scenario").find(':selected');
        var selectedScenario = selectedScenarioElement.length > 0 ? selectedScenarioElement.text() : "training";
        var detectedRemote = window.location.href.indexOf("research.edm.uhasselt.be") != -1;
        if (detectedRemote) {
            $("#remote").addClass("hidden");
            $("#remote_label").addClass("hidden");
        }
        this.remote = detectedRemote || $("#remote").is(":checked");
        this.predicting = $("#predictions").is(":checked");
        this.anchorDate = new Date();
        if (this.remote) {
            this.API_URL = "cache/" + selectedScenario + "/";
        }
        else {
            this.API_URL = "http://localhost:8080/intelligibleIoT/api/";
        }
    };
    return IoTController;
}());
//# sourceMappingURL=controller.js.map