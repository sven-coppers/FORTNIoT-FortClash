var FutureClient = /** @class */ (function () {
    function FutureClient(mainController) {
        this.mainController = mainController;
        this.future = null;
    }
    FutureClient.prototype.refresh = function () {
        this.loadFuture();
    };
    FutureClient.prototype.loadFuture = function () {
        var oThis = this;
        $("#reload").addClass("disabled");
        var fileURL = "future"; // Default
        if (this.mainController.isRemote()) {
            if (this.mainController.isPredicting()) {
                fileURL = "future.json";
            }
            else {
                fileURL = "future_baseline.json";
            }
        }
        $.ajax({
            url: this.mainController.API_URL + fileURL,
            type: "GET",
        }).done(function (future) {
            oThis.checkRuleEffects(future);
            oThis.addAnchorTime(future);
            oThis.future = future;
            oThis.fillCache(future);
            oThis.mainController.futureLoaded(future);
        });
    };
    FutureClient.prototype.fillCache = function (future) {
    };
    FutureClient.prototype.checkRuleEffects = function (future) {
        var states = future["states"];
        var ruleExecutions = future["executions"];
        // Init
        for (var _i = 0, ruleExecutions_1 = ruleExecutions; _i < ruleExecutions_1.length; _i++) {
            var ruleExecution = ruleExecutions_1[_i];
            for (var _a = 0, _b = ruleExecution["action_executions"]; _a < _b.length; _a++) {
                var actionExecution = _b[_a];
                actionExecution["has_effects"] = false;
            }
        }
        for (var entityID in states) {
            var entityStates = states[entityID];
            for (var _c = 0, entityStates_1 = entityStates; _c < entityStates_1.length; _c++) {
                var entityState = entityStates_1[_c];
                if (entityState["is_new"]) {
                    // This state was an effect, look for its cause.
                    var actionExecution = this.getActionExecutionByResultingContextID(entityState["context"]["id"], ruleExecutions);
                    if (actionExecution != null) {
                        actionExecution["has_effects"] = true;
                    }
                }
            }
        }
    };
    /**
     * This function is only meant to be used when remote
     * @param actionExecutionID
     * @param newEnabled
     */
    FutureClient.prototype.loadAlternativeFuture = function (actionExecutionID, newEnabled) {
        var oThis = this;
        var expectedFile = this.deduceFileName(actionExecutionID, newEnabled);
        $.ajax({
            url: this.mainController.API_URL + expectedFile,
            type: "GET"
        }).done(function (future) {
            oThis.checkRuleEffects(future);
            oThis.addAnchorTime(future);
            oThis.future = future;
            oThis.mainController.futureLoaded(future);
        });
    };
    FutureClient.prototype.simulateAlternativeFuture = function (actionExecutionID, newEnabled) {
        var oThis = this;
        if (this.mainController.isRemote()) {
            var expectedFile = this.deduceFileName(actionExecutionID, newEnabled);
            //console.log(expectedFile);
            $.ajax({
                url: this.mainController.API_URL + expectedFile,
                type: "GET"
            }).done(function (alternativeFuture) {
                oThis.checkRuleEffects(alternativeFuture);
                oThis.addAnchorTime(alternativeFuture);
                oThis.mainController.alternativeFutureSimulationReady(alternativeFuture);
            });
        }
        else {
            var reEnabledActions = [];
            var snoozedActions = [];
            var ruleExecution = this.getRuleExecutionByActionExecutionID(actionExecutionID);
            if (ruleExecution != null) {
                var actionExecution = this.getActionExecutionByActionExecutionID(ruleExecution, actionExecutionID);
                if (newEnabled) {
                    // Now enabled -> remove snooze
                    reEnabledActions.push(actionExecution["snoozed_by"]);
                }
                else {
                    snoozedActions.push({
                        action_id: actionExecution["action_id"],
                        conflict_time_window: 20000,
                        trigger_entity_id: ruleExecution["trigger_entity"],
                        conflict_time: new Date(new Date(ruleExecution["datetime"]).getTime() - this.mainController.getAnchorDate().getTime())
                        // conflict_time: new Date(new Date(ruleExecution["datetime"]).getTime() - this.mainController.getAnchorDate().getTime())
                    });
                }
            }
            var simulationRequest = {
                extra_states: [],
                suppressed_state_contexts: [],
                snoozed_actions: snoozedActions,
                re_enabled_actions: reEnabledActions
            };
            $.ajax({
                url: this.mainController.API_URL + "future/simulate",
                type: "POST",
                data: JSON.stringify(simulationRequest),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
            }).done(function (alternativeFuture) {
                oThis.checkRuleEffects(alternativeFuture);
                oThis.addAnchorTime(alternativeFuture);
                oThis.mainController.alternativeFutureSimulationReady(alternativeFuture);
            });
        }
    };
    FutureClient.prototype.deduceFileName = function (newActionExecutionID, newEnabled) {
        var expectedFile = "future_";
        var start = true;
        for (var _i = 0, _a = this.future.executions; _i < _a.length; _i++) {
            var ruleExecution = _a[_i];
            for (var _b = 0, _c = ruleExecution["action_executions"]; _b < _c.length; _b++) {
                var actionExecution = _c[_b];
                var actionExecutionID = actionExecution["action_execution_id"];
                var snoozed = actionExecution["snoozed"];
                if (actionExecutionID == newActionExecutionID) {
                    snoozed = !newEnabled;
                }
                if (!start) {
                    expectedFile += ";";
                }
                expectedFile += actionExecutionID.replace("action_execution_id_", "") + (snoozed ? "t" : "f");
                start = false;
            }
        }
        return expectedFile + ".json";
    };
    FutureClient.prototype.findState = function (deviceID, date) {
        for (var _i = 0, _a = this.future.states; _i < _a.length; _i++) {
            var haystackState = _a[_i];
            if (haystackState.entity_id == deviceID && new Date(haystackState.last_updated).getTime() == date.getTime()) {
                return haystackState;
            }
        }
        return null;
    };
    /**
     * Find an action execution with similar characteristics
     * @param triggerEntity
     * @param actionID
     * @param date
     */
    FutureClient.prototype.findActionExecution = function (triggerEntity, actionID, date) {
        for (var _i = 0, _a = this.future.executions; _i < _a.length; _i++) {
            var ruleExecution = _a[_i];
            if (ruleExecution.trigger_entity == triggerEntity && new Date(ruleExecution.datetime).getTime() == date.getTime()) {
                for (var _b = 0, _c = ruleExecution["action_executions"]; _b < _c.length; _b++) {
                    var actionExecution = _c[_b];
                    if (actionExecution["action_id"] == actionID) {
                        return actionExecution;
                    }
                }
            }
        }
        return null;
    };
    FutureClient.prototype.getStateByContextID = function (stateContextID) {
        for (var _i = 0, _a = this.future.states; _i < _a.length; _i++) {
            var haystackState = _a[_i];
            if (haystackState.context.id == stateContextID) {
                return haystackState;
            }
        }
        return null;
    };
    /**
     * Get the execution that resulted in this state
     * @param actionContextID
     */
    FutureClient.prototype.getRuleExecutionByActionContextID = function (actionContextID, executions) {
        if (executions == null) {
            executions = this.future.executions;
        }
        for (var _i = 0, executions_1 = executions; _i < executions_1.length; _i++) {
            var execution = executions_1[_i];
            for (var _a = 0, _b = execution["action_executions"]; _a < _b.length; _a++) {
                var actionExecution = _b[_a];
                for (var _c = 0, _d = actionExecution["resulting_contexts"]; _c < _d.length; _c++) {
                    var actionContext = _d[_c];
                    if (actionContext["id"] === actionContextID) {
                        return execution;
                    }
                }
            }
        }
        return null;
    };
    /**
     * Get the ruleExecution that contains this actionExecution
     * @param actionExecutionID
     */
    FutureClient.prototype.getRuleExecutionByActionExecutionID = function (actionExecutionID) {
        for (var _i = 0, _a = this.future.executions; _i < _a.length; _i++) {
            var execution = _a[_i];
            for (var _b = 0, _c = execution["action_executions"]; _b < _c.length; _b++) {
                var actionExecution = _c[_b];
                if (actionExecution["action_execution_id"] == actionExecutionID) {
                    return execution;
                }
            }
        }
        return null;
    };
    /**
     * Get the executions that were triggered by this state
     * @param triggerContextID
     */
    FutureClient.prototype.getExecutionsByCondition = function (conditionContextID) {
        var result = [];
        for (var _i = 0, _a = this.future.executions; _i < _a.length; _i++) {
            var execution = _a[_i];
            for (var _b = 0, _c = execution["condition_satisfying_contexts"]; _b < _c.length; _b++) {
                var triggerContext = _c[_b];
                if (triggerContext["id"] === conditionContextID) {
                    result.push(execution["execution_id"]);
                }
            }
        }
        return result;
    };
    /**
     * Get the execution by providing its ID
     * @param execution
     */
    FutureClient.prototype.getExecutionByID = function (executionID) {
        for (var _i = 0, _a = this.future.executions; _i < _a.length; _i++) {
            var execution = _a[_i];
            if (execution["execution_id"] === executionID)
                return execution;
        }
        return null;
    };
    /**
     * Get the states that triggered this execution
     * @param execution
     */
    FutureClient.prototype.getTriggerContextIDsByExecution = function (execution) {
        var result = [];
        result.push(execution["trigger_context"]["id"]);
        return result;
    };
    /**
     * Get the states that were caused by this execution
     * @param execution
     */
    FutureClient.prototype.getActionContextIDsByExecution = function (execution) {
        var result = [];
        for (var _i = 0, _a = execution["action_executions"]; _i < _a.length; _i++) {
            var actionExecution = _a[_i];
            for (var _b = 0, _c = actionExecution["resulting_contexts"]; _b < _c.length; _b++) {
                var actionContext = _c[_b];
                result.push(actionContext["id"]);
            }
        }
        return result;
    };
    FutureClient.prototype.getActionExecutionByActionExecutionID = function (ruleExecution, actionExecutionID) {
        for (var _i = 0, _a = ruleExecution["action_executions"]; _i < _a.length; _i++) {
            var actionExecution = _a[_i];
            if (actionExecution["action_execution_id"] == actionExecutionID) {
                return actionExecution;
            }
        }
        return null;
    };
    /**
     * Which future executions to look for (null -> default, actual value for alternative future)
     * @param conflictedStateContextID
     * @param futureExecutions
     */
    FutureClient.prototype.getActionExecutionByResultingContextID = function (conflictedStateContextID, futureExecutions) {
        if (futureExecutions == null) {
            futureExecutions = this.future.executions;
        }
        for (var _i = 0, futureExecutions_1 = futureExecutions; _i < futureExecutions_1.length; _i++) {
            var ruleExecution = futureExecutions_1[_i];
            for (var _a = 0, _b = ruleExecution["action_executions"]; _a < _b.length; _a++) {
                var actionExecution = _b[_a];
                for (var _c = 0, _d = actionExecution["resulting_contexts"]; _c < _d.length; _c++) {
                    var resultingContext = _d[_c];
                    if (resultingContext["id"] == conflictedStateContextID) {
                        return actionExecution;
                    }
                }
            }
        }
        return null;
    };
    FutureClient.prototype.getRelatedConflict = function (stateContextID) {
        for (var conflictIndex in this.future.conflicts) {
            var conflict = this.future.conflicts[conflictIndex];
            for (var conflictingActionIndex in conflict["conflicting_states"]) {
                var conflictingActionState = conflict["conflicting_states"][conflictingActionIndex];
                if (conflictingActionState["context"]["id"] == stateContextID) {
                    return conflict;
                }
            }
        }
        return null;
    };
    FutureClient.prototype.getFuture = function () {
        return this.future;
    };
    FutureClient.prototype.addAnchorTime = function (future) {
        for (var entity in future.states) {
            for (var _i = 0, _a = future.states[entity]; _i < _a.length; _i++) {
                var entityState = _a[_i];
                entityState["last_changed"] = new Date(new Date(entityState["last_changed"]).getTime() + this.mainController.getAnchorDate().getTime());
                entityState["last_updated"] = new Date(new Date(entityState["last_updated"]).getTime() + this.mainController.getAnchorDate().getTime());
            }
        }
        for (var _b = 0, _c = future.executions; _b < _c.length; _b++) {
            var ruleExecution = _c[_b];
            ruleExecution["datetime"] = new Date(new Date(ruleExecution["datetime"]).getTime() + this.mainController.getAnchorDate().getTime());
            for (var _d = 0, _e = ruleExecution["action_executions"]; _d < _e.length; _d++) {
                var actionExecution = _e[_d];
                actionExecution["datetime"] = new Date(new Date(actionExecution["datetime"]).getTime() + this.mainController.getAnchorDate().getTime());
            }
        }
        // TODO: conflicts
        for (var _f = 0, _g = future.conflicts; _f < _g.length; _f++) {
            var conflict = _g[_f];
            for (var _h = 0, _j = conflict.conflicting_states; _h < _j.length; _h++) {
                var conflictingState = _j[_h];
                conflictingState["last_changed"] = new Date(new Date(conflictingState["last_changed"]).getTime() + this.mainController.getAnchorDate().getTime());
                conflictingState["last_updated"] = new Date(new Date(conflictingState["last_updated"]).getTime() + this.mainController.getAnchorDate().getTime());
            }
            conflict["conflict_time"] = new Date(new Date(conflict["conflict_time"]).getTime() + this.mainController.getAnchorDate().getTime());
        }
    };
    return FutureClient;
}());
//# sourceMappingURL=FutureClient.js.map