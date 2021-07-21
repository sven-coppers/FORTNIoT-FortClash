var Timeline = /** @class */ (function () {
    function Timeline(mainController, ruleClient, stateClient, deviceClient, conflictsClient, futureClient) {
        this.mainController = mainController;
        this.ruleClient = ruleClient;
        this.stateClient = stateClient;
        this.deviceClient = deviceClient;
        //this.configClient = configClient;
        this.conflictsClient = conflictsClient;
        this.futureClient = futureClient;
        this.hasCustomTime = false;
        this.showingOnlyContext = true;
        this.deviceAdapters = {};
        this.rulesAdapter = null;
        this.redrawing = false;
        this.refreshSetup();
        $(".timeline_device_main_attribute .timeline_label").click(function () {
            $(this).closest(".timeline_device").find(".timeline_device_attributes").toggle();
        });
    }
    Timeline.prototype.refreshSetup = function () {
        $(".timeline_wrapper").empty();
        // First load the devices
        this.deviceClient.loadDevices(this);
        // The callback will start to load the rules
    };
    /**
     * Second, initialise the rules
     * Callback function for when the ruleClient is finished loading
     * @param devices
     */
    Timeline.prototype.initializeRules = function (rules) {
        this.rulesAdapter = new RulesTimeline(this.mainController, this, rules, this.futureClient);
        this.mainController.refreshContext();
    };
    /**
     * First, initialise the devices
     * Callback function for when the deviceClient is finished loading
     * @param devices
     */
    Timeline.prototype.initializeDevices = function (devices) {
        var deviceNames = [];
        for (var deviceName in devices) {
            deviceNames.push(deviceName);
        }
        deviceNames.sort();
        for (var _i = 0, deviceNames_1 = deviceNames; _i < deviceNames_1.length; _i++) {
            var deviceName = deviceNames_1[_i];
            var device = devices[deviceName];
            if (!device["available"])
                continue;
            if (deviceName.indexOf("light.") == 0) {
                this.deviceAdapters[deviceName] = new HueTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("lock.") == 0) {
                this.deviceAdapters[deviceName] = new GenericDeviceTimeline(this.mainController, deviceName, device["friendly_name"], "lock.png", this);
            }
            else if (deviceName.indexOf("sirene.") == 0) {
                this.deviceAdapters[deviceName] = new GenericDeviceTimeline(this.mainController, deviceName, device["friendly_name"], "sirene.png", this);
            }
            else if (deviceName.indexOf("sun.") == 0) {
                this.deviceAdapters[deviceName] = new SunTimeline(this.mainController, deviceName, this);
            }
            else if (deviceName.indexOf("switch.outlet") == 0) {
                this.deviceAdapters[deviceName] = new OutletTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("screen.") == 0) {
                this.deviceAdapters[deviceName] = new GenericDeviceTimeline(this.mainController, deviceName, device["friendly_name"], "screen.png", this);
            }
            else if (deviceName.indexOf("weather.dark_sky") == 0) {
                this.deviceAdapters[deviceName] = new WeatherTimeline(this.mainController, deviceName, this);
            }
            else if (deviceName.indexOf("calendar.") == 0) {
                this.deviceAdapters[deviceName] = new CalendarTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("agoralaan_diepenbeek") != -1) {
                this.deviceAdapters[deviceName] = new BusStopTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("sensor.moon") != -1) {
                this.deviceAdapters[deviceName] = new MoonTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("sensor.people_home_counter") != -1) {
                this.deviceAdapters[deviceName] = new PersonCounterTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("routine.") != -1) {
                this.deviceAdapters[deviceName] = new GenericDeviceTimeline(this.mainController, deviceName, device["friendly_name"], "routine.png", this);
            }
            else if (deviceName.indexOf("binary_sensor.") != -1) {
                if (deviceName.indexOf("_contact") != -1) {
                    this.deviceAdapters[deviceName] = new ContactTimeline(this.mainController, deviceName, device["friendly_name"], this);
                }
                else if (deviceName.indexOf("_acceleration") != -1) {
                    this.deviceAdapters[deviceName] = new AccelerationTimeline(this.mainController, deviceName, device["friendly_name"], this);
                }
                else if (deviceName.indexOf("sensor_motion") != -1) {
                    this.deviceAdapters[deviceName] = new MotionTimeline(this.mainController, deviceName, device["friendly_name"], this);
                }
                else if (deviceName.indexOf(".remote_ui") != -1) {
                    // Ignore
                }
                else {
                    console.log("TODO: show timeline for " + deviceName);
                }
            }
            else if (deviceName.indexOf("battery") != -1) {
                this.deviceAdapters[deviceName] = new BatteryTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("smoke") != -1) {
                this.deviceAdapters[deviceName] = new GenericDeviceTimeline(this.mainController, deviceName, device["friendly_name"], "smoke.png", this);
            }
            else if (deviceName.indexOf("thermostat.") != -1) {
                this.deviceAdapters[deviceName] = new GenericDeviceTimeline(this.mainController, deviceName, device["friendly_name"], "thermostat.png", this);
                //    this.deviceAdapters[deviceName] = new ThermostatTimeline(deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("_temperature") != -1) {
                this.deviceAdapters[deviceName] = new TemperatureTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("wind_speed") != -1) {
                this.deviceAdapters[deviceName] = new WindTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("_coordinate") != -1) {
                // Decreases performance a lot
                this.deviceAdapters[deviceName] = new CoordinateTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("device_tracker.") != -1) {
                this.deviceAdapters[deviceName] = new DeviceTrackerTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("heater.") != -1) {
                this.deviceAdapters[deviceName] = new HeaterTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf("cooler.") != -1) {
                this.deviceAdapters[deviceName] = new AircoTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else if (deviceName.indexOf(".roomba") != -1) {
                this.deviceAdapters[deviceName] = new GenericDeviceTimeline(this.mainController, deviceName, device["friendly_name"], "roomba.png", this);
            }
            else if (deviceName.indexOf("blinds.") != -1) {
                this.deviceAdapters[deviceName] = new GenericDeviceTimeline(this.mainController, deviceName, device["friendly_name"], "blinds.png", this);
            }
            else if (deviceName.indexOf("person.") != -1) {
                this.deviceAdapters[deviceName] = new PersonTimeline(this.mainController, deviceName, device["friendly_name"], this);
            }
            else {
                console.log("TODO: show timeline for " + deviceName);
            }
            if (this.deviceAdapters[deviceName] == null) {
                this.deviceAdapters[deviceName].setRedundancyBad(device["redundancy_bad"]);
                this.deviceAdapters[deviceName].setChangeCoolDown(device["change_cooldown"]);
            }
        }
        // Then we can load the rules
        this.ruleClient.loadRules(this);
    };
    Timeline.prototype.reAlign = function (range) {
        if (typeof range.event === "undefined")
            return; // This is caused by myself
        $.each(this.deviceAdapters, function (identifier, adapter) {
            adapter.reAlign(range);
        });
        this.rulesAdapter.reAlign(range);
    };
    Timeline.prototype.setWindow = function (range) {
        $.each(this.deviceAdapters, function (identifier, adapter) {
            adapter.setWindow(range);
        });
        this.rulesAdapter.setWindow(range);
    };
    Timeline.prototype.updateDevices = function (devices) {
        for (var _i = 0, devices_1 = devices; _i < devices_1.length; _i++) {
            var device = devices_1[_i];
            if (device["id"] in this.deviceAdapters) {
                this.deviceAdapters[device["id"]].setAvailable(device["available"]);
            }
        }
    };
    Timeline.prototype.redraw = function (deviceChangesMap, executions, conflicts, feedforward, selectedActionExecution) {
        if (this.redrawing)
            return;
        this.redrawing = true;
        this.redrawStates(deviceChangesMap, feedforward);
        this.redrawRules(executions, feedforward);
        this.highlightConflictingStates(conflicts);
        if (selectedActionExecution != null) {
            this.mainController.selectActionExecution(selectedActionExecution["action_execution_id"]);
        }
        else {
            this.mainController.clearSelection(false);
        }
        this.redrawing = false;
    };
    Timeline.prototype.redrawStates = function (deviceChangesMap, feedforward) {
        for (var deviceName in deviceChangesMap) {
            if (typeof this.deviceAdapters[deviceName] !== "undefined") {
                this.deviceAdapters[deviceName].redrawVisualisation(deviceChangesMap[deviceName], feedforward);
            }
        }
    };
    Timeline.prototype.redrawRules = function (executionEvents, feedforward) {
        this.rulesAdapter.redrawVisualisation(executionEvents, feedforward);
    };
    /** Add exclemation marks to all conflicted states */
    Timeline.prototype.highlightConflictingStates = function (conflicts) {
        $(".state_item_wrapper.conflict").removeClass("conflict");
        for (var _i = 0, conflicts_1 = conflicts; _i < conflicts_1.length; _i++) {
            var conflict = conflicts_1[_i];
            for (var _a = 0, _b = conflict["conflicting_states"]; _a < _b.length; _a++) {
                var conflictingState = _b[_a];
                $("#" + conflictingState["context"]["id"]).closest(".state_item_wrapper").addClass("conflict");
            }
        }
    };
    Timeline.prototype.drawCustomTime = function (date) {
        this.clearCustomTime();
        $.each(this.deviceAdapters, function (identifier, adapter) {
            adapter.drawCustomTime(date);
        });
        this.rulesAdapter.drawCustomTime(date);
        this.hasCustomTime = true;
    };
    Timeline.prototype.setAllRulesVisible = function (visible) {
        // Can eventueel nog iets anders doen
    };
    Timeline.prototype.setAllDevicesVisible = function (visible) {
        $.each(this.deviceAdapters, function (identifier, adapter) {
            adapter.setVisible(visible);
        });
    };
    Timeline.prototype.selectExecution = function (executionID) {
        $("#" + executionID).addClass("selected");
    };
    Timeline.prototype.clearSelection = function (nextSelectionExpected) {
        $("span.highlighted_state").removeClass("highlighted_state");
        $(".state_item_wrapper .trigger img").attr("src", "img/warning.png").attr("title", "This state will be involved in conflict");
        $(".state_item_wrapper").removeClass("trigger action condition conflict_related").attr("title", "");
        $(".vis-point").removeClass("vis-selected");
        $(".event_item").removeClass("selected");
        $(".action_execution").removeClass("highlighted conflict_related");
        // $("#back_button").addClass("hidden");
        if (!nextSelectionExpected) {
            this.setAllDevicesVisible(true);
            this.setAllRulesVisible(true);
        }
        this.clearCustomTime();
        this.rulesAdapter.clearConflict();
    };
    Timeline.prototype.clearCustomTime = function () {
        $.each(this.deviceAdapters, function (identifier, adapter) {
            adapter.clearCustomTime();
            adapter.clearHighlights();
        });
        this.rulesAdapter.clearCustomTime();
    };
    Timeline.prototype.getMainController = function () {
        return this.mainController;
    };
    /**
     * Create a new merged lists of states and executions that keep track of differences
     * @param originalStates
     * @param alternativeStates
     * @param originalExecutions
     * @param alternativeExecutions
     */
    Timeline.prototype.showFeedforward = function (originalFutureStates, alternativeFutureStates, originalExecutions, alternativeExecutions, originalConflicts, alternativeConflicts, selectedActionExecution) {
        var mergedFutureStates = this.mergeStates(originalFutureStates, alternativeFutureStates, originalExecutions, alternativeExecutions, alternativeConflicts);
        var mergedStates = this.stateClient.combineStateHistoryAndFuture(mergedFutureStates);
        var mergedExecutions = this.mergeAllExecutions(originalExecutions, alternativeExecutions);
        var mergedConflicts = this.mergeConflicts(originalConflicts, alternativeConflicts);
        this.redraw(mergedStates, mergedExecutions, mergedConflicts, true, selectedActionExecution);
    };
    /**
     * Check which rule executions will be new, which ones will be deprecated
     * @param originalExecutions
     * @param alternativeExecutions
     */
    Timeline.prototype.mergeAllExecutions = function (originalExecutions, alternativeExecutions) {
        var mergedExecutions = [];
        for (var _i = 0, originalExecutions_1 = originalExecutions; _i < originalExecutions_1.length; _i++) {
            var originalExecution = originalExecutions_1[_i];
            var matchingAlternativeExecution = null;
            var alternativeCounter = void 0;
            for (alternativeCounter = 0; alternativeCounter < alternativeExecutions.length; alternativeCounter++) {
                var alternativeExecution = alternativeExecutions[alternativeCounter];
                if (new Date(originalExecution["datetime"]).getTime() == new Date(alternativeExecution["datetime"]).getTime() && originalExecution["rule_id"] == alternativeExecution["rule_id"] && originalExecution["trigger_entity"] == alternativeExecution["trigger_entity"]) {
                    matchingAlternativeExecution = alternativeExecution;
                    break;
                }
            }
            mergedExecutions.push(this.mergeRuleExecutions(originalExecution, matchingAlternativeExecution));
            // Remove from list
            if (matchingAlternativeExecution != null) {
                alternativeExecutions.splice(alternativeCounter, 1); // remove from alternative states
            }
        }
        // Add all alternativeExecutions
        for (var _a = 0, alternativeExecutions_1 = alternativeExecutions; _a < alternativeExecutions_1.length; _a++) {
            var alternativeExecution = alternativeExecutions_1[_a];
            mergedExecutions.push(this.mergeRuleExecutions(null, alternativeExecution));
        }
        return mergedExecutions;
    };
    Timeline.prototype.mergeConflicts = function (originalConflicts, alternativeConflicts) {
        var mergedConflicts = [];
        //console.log(originalConflicts);
        //console.log(alternativeConflicts);
        return alternativeConflicts;
    };
    /**
     * IF original = null -> new
     * IF alternative = null -> deprecated
     * both not null -> check the differences (becomes effective, no longer effective, the same)
     * Altijd dezelfde rule
     * @param originalRuleExecution
     * @param alternativeRuleExecution
     */
    Timeline.prototype.mergeRuleExecutions = function (originalRuleExecution, alternativeRuleExecution) {
        // IF original = null -> new
        if (originalRuleExecution == null) {
            for (var _i = 0, _a = alternativeRuleExecution["action_executions"]; _i < _a.length; _i++) {
                var actionExecution = _a[_i];
                actionExecution["future"] = "new";
            }
            return alternativeRuleExecution;
        }
        // IF alternative = null -> deprecated
        if (alternativeRuleExecution == null) {
            for (var _b = 0, _c = originalRuleExecution["action_executions"]; _b < _c.length; _b++) {
                var actionExecution = _c[_b];
                actionExecution["future"] = "deprecated";
            }
            return originalRuleExecution;
        }
        // Both not null -> check the differences (becomes effective, no longer effective, the same)
        for (var actionExecutionCounter = 0; actionExecutionCounter < originalRuleExecution["action_executions"].length; actionExecutionCounter++) {
            var originalActionExecution = originalRuleExecution["action_executions"][actionExecutionCounter];
            var alternativeActionExecution = alternativeRuleExecution["action_executions"][actionExecutionCounter];
            if (originalActionExecution["snoozed"] && alternativeActionExecution["snoozed"]) {
                originalActionExecution["future"] = "unchanged";
            }
            else if (alternativeActionExecution["snoozed"]) {
                originalActionExecution["future"] = "becomes_snoozed";
            }
            else {
                // Will (still not / no longer) be snoozed
                if ((originalActionExecution["snoozed"] || originalActionExecution["has_effects"]) && (!alternativeActionExecution["snoozed"] && !alternativeActionExecution["has_effects"])) {
                    originalActionExecution["future"] = "becomes_ineffective";
                }
                else if (originalActionExecution["has_effects"] == alternativeActionExecution["has_effects"]) {
                    originalActionExecution["future"] = "unchanged";
                }
                else {
                    originalActionExecution["future"] = "becomes_effective";
                }
            }
        }
        return originalRuleExecution;
    };
    /**
     * Find out the differences between the two stateMaps
     * @param originalStatesMap
     * @param alternativeStatesMap
     */
    Timeline.prototype.mergeStates = function (originalStatesMap, alternativeStatesMap, originalExecutions, alternativeExecutions, alternativeConflicts) {
        var mergedStates = {};
        for (var deviceID in originalStatesMap) {
            // if(deviceID != "light.living_spots") continue;
            var originalStates = originalStatesMap[deviceID];
            var alternativeStates = alternativeStatesMap[deviceID];
            var originalStatesCounter = 0;
            var alternativeStatesCounter = 0;
            mergedStates[deviceID] = [];
            while (originalStatesCounter < originalStates.length || alternativeStatesCounter < alternativeStates.length) {
                var originalStatesTick = [];
                var alternativeStatesTick = [];
                var tickTime = void 0;
                if (originalStatesCounter >= originalStates.length) {
                    tickTime = new Date(alternativeStates[alternativeStatesCounter]["last_changed"]);
                }
                else if (alternativeStatesCounter >= alternativeStates.length) {
                    tickTime = new Date(originalStates[originalStatesCounter]["last_changed"]);
                }
                else {
                    tickTime = new Date(Math.min(new Date(alternativeStates[alternativeStatesCounter]["last_changed"]).getTime(), new Date(originalStates[originalStatesCounter]["last_changed"]).getTime()));
                }
                // Push all original states that happen at this time
                while (originalStatesCounter < originalStates.length && tickTime.getTime() == new Date(originalStates[originalStatesCounter]["last_changed"]).getTime()) {
                    originalStatesTick.push(originalStates[originalStatesCounter]);
                    originalStatesCounter++;
                }
                // Push all original states that happen at this time
                while (alternativeStatesCounter < alternativeStates.length && tickTime.getTime() == new Date(alternativeStates[alternativeStatesCounter]["last_changed"]).getTime()) {
                    alternativeStatesTick.push(alternativeStates[alternativeStatesCounter]);
                    alternativeStatesCounter++;
                }
                mergedStates[deviceID] = mergedStates[deviceID].concat(this.mergeStatesTick(originalStatesTick, alternativeStatesTick, originalExecutions, alternativeExecutions, alternativeConflicts));
            }
        }
        return mergedStates;
    };
    /**
     * Merge all states that happen at the same tick.
     * Use the originalExecutions and alternativeExecutions to more accurately decide which states are new
     * @param originalStates
     * @param alternativeStates
     */
    Timeline.prototype.mergeStatesTick = function (originalStates, alternativeStates, originalExecutions, alternativeExecutions, alternativeConflicts) {
        var mergedStates = [];
        for (var originalStatesCounter = 0; originalStatesCounter < originalStates.length; originalStatesCounter++) {
            var originalState = JSON.parse(JSON.stringify(originalStates[originalStatesCounter]));
            var originalRuleExecution = this.futureClient.getRuleExecutionByActionContextID(originalState["context"]["id"], originalExecutions);
            originalState["future"] = "unchanged";
            var found = false;
            // Try to check if there is state matching in the alternatives
            for (var alternativeCounter = 0; alternativeCounter < alternativeStates.length; alternativeCounter++) {
                var alternativeState = alternativeStates[alternativeCounter];
                var alternativeRuleExecution = this.futureClient.getRuleExecutionByActionContextID(alternativeState["context"]["id"], alternativeExecutions);
                if (this.isSameStatePrediction(originalState, alternativeState, originalRuleExecution, alternativeRuleExecution)) {
                    found = true;
                    // Change context id in conflict from alternativeState to originalState
                    this.updateAlternativeConflicts(originalState["context"]["id"], alternativeState["context"]["id"], alternativeConflicts);
                    if (!originalState["is_new"] && alternativeState["is_new"]) {
                        originalState["is_new"] = true;
                        originalState["future"] = "new";
                    }
                    alternativeStates.splice(alternativeCounter, 1); // remove from alternative states
                    break;
                }
            }
            if (!found) {
                originalState["future"] = "deprecated";
            }
            mergedStates.push(originalState);
        }
        // the remaining alternative states are new
        for (var alternativeCounter = 0; alternativeCounter < alternativeStates.length; alternativeCounter++) {
            alternativeStates[alternativeCounter]["future"] = "new";
            mergedStates.push(alternativeStates[alternativeCounter]);
        }
        return mergedStates;
    };
    Timeline.prototype.drawConflict = function (relatedConflict) {
        this.rulesAdapter.redrawConflict(relatedConflict);
        for (var _i = 0, _a = relatedConflict["conflicting_states"]; _i < _a.length; _i++) {
            var conflictedState = _a[_i];
            $("#" + conflictedState["context"]["id"]).closest(".state_item_wrapper").addClass("conflict_related");
        }
    };
    Timeline.prototype.highlightActions = function (actionContexts) {
        for (var _i = 0, actionContexts_1 = actionContexts; _i < actionContexts_1.length; _i++) {
            var actionContext = actionContexts_1[_i];
            this.highlightAction(actionContext["id"]);
        }
    };
    Timeline.prototype.highlightConditions = function (triggerContextIDs) {
        for (var _i = 0, triggerContextIDs_1 = triggerContextIDs; _i < triggerContextIDs_1.length; _i++) {
            var triggerContextID = triggerContextIDs_1[_i];
            this.highlightCondition(triggerContextID);
        }
    };
    Timeline.prototype.highlightTrigger = function (stateContextID) {
        $("#" + stateContextID).closest(".state_item_wrapper").addClass("trigger");
        $("#" + stateContextID).closest(".state_item_wrapper").find("img").attr("src", "img/trigger.png").attr("title", "This state will be the trigger");
    };
    Timeline.prototype.highlightCondition = function (stateContextID) {
        $("#" + stateContextID).closest(".state_item_wrapper").addClass("condition");
        $("#" + stateContextID).closest(".state_item_wrapper").attr("title", "This state will be satisfy the condition");
    };
    Timeline.prototype.highlightAction = function (stateContextID) {
        $("#" + stateContextID).addClass("highlighted_state");
        $("#" + stateContextID).closest(".state_item_wrapper").addClass("action");
        $("#" + stateContextID).closest(".state_item_wrapper").attr("title", "This state will be result from executing the rule");
    };
    Timeline.prototype.highlightActionExecution = function (actionExecutionID) {
        $("#" + actionExecutionID).addClass("highlighted");
    };
    Timeline.prototype.loadingCompleted = function () {
        $(".devices_column").removeClass("hidden");
        $("#connection_error").remove();
        $("#reload").removeClass("disabled");
        $(".timeline_wrapper").removeClass("hidden");
    };
    Timeline.prototype.compareStateTimes = function (stateA, stateB) {
        var timestampA = new Date(stateA.last_changed).getTime();
        var timestampB = new Date(stateB.last_changed).getTime();
        if (timestampA < timestampB) {
            return -1;
        }
        if (timestampA > timestampB) {
            return 1;
        }
        return 0;
    };
    /**
     * Check if two states correspond to each other (but might be different)
     * @param originalState
     * @param alternativeState
     * @param originalRuleExecution
     * @param alternativeRuleExecution
     * @Pre the states happen at the sametime, on the same device
     * @pre the causes for the states have been lookedUp already (but might be null)
     */
    Timeline.prototype.isSameStatePrediction = function (originalState, alternativeState, originalRuleExecution, alternativeRuleExecution) {
        if (originalState["context"]["id"] == alternativeState["context"]["id"]) {
            // Dezelfde contextID -> hetzelfde
            return true;
        }
        else {
            // Verschillende contextID
            if (originalRuleExecution == null && alternativeRuleExecution == null) {
                // Geen oorzaak bekend -> return IF dezelfde staat
                return originalState["state"] == alternativeState["state"];
            }
            else {
                // Normaal zouden ze dan alletwee wel een cause moeten hebben.
                // Wel oorzaak bekend? -> return dezelfde oorzaak?
                return originalRuleExecution["trigger_entity"] == alternativeRuleExecution["trigger_entity"] && originalRuleExecution["rule_id"] == alternativeRuleExecution["rule_id"];
            }
        }
    };
    Timeline.prototype.isSameActionPrediction = function (originalActionExecution, alternativeActionExecution, originalRuleExecution, alternativeRuleExecution) {
        return originalRuleExecution["trigger_entity"] == alternativeRuleExecution["trigger_entity"] && originalActionExecution["action_id"] == alternativeActionExecution["action_id"];
    };
    /**
     * Map alternative conflicts to the original states
     * @param originalContextID
     * @param alternativeContextID
     * @param alternativeConflicts
     * @private
     */
    Timeline.prototype.updateAlternativeConflicts = function (originalContextID, alternativeContextID, alternativeConflicts) {
        for (var _i = 0, alternativeConflicts_1 = alternativeConflicts; _i < alternativeConflicts_1.length; _i++) {
            var alternativeConflict = alternativeConflicts_1[_i];
            for (var conflictingStateIndex in alternativeConflict["conflicting_states"]) {
                var conflictingState = alternativeConflict["conflicting_states"][conflictingStateIndex];
                if (conflictingState["context"]["id"] == alternativeContextID) {
                    conflictingState["context"]["id"] = originalContextID;
                }
            }
        }
    };
    return Timeline;
}());
//# sourceMappingURL=Timeline.js.map