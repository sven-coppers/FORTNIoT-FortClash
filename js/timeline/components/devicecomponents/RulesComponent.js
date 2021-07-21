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
var RulesComponent = /** @class */ (function (_super) {
    __extends(RulesComponent, _super);
    function RulesComponent(mainController, parentDevice, parentElement, rules, futureClient) {
        var _this = _super.call(this, mainController, parentDevice, parentElement, null, null) || this;
        _this.highlightedConflict = null;
        _this.futureClient = futureClient;
        _this.redrawing = false;
        _this.initRules(rules);
        return _this;
    }
    RulesComponent.prototype.initVisualisation = function (DOMElementID) {
        this.items = new vis.DataSet();
        this.groups = new vis.DataSet();
        this.options = this.getDefaultOptions();
        this.options["showMajorLabels"] = true;
        this.options["showMinorLabels"] = true;
        this.options["stack"] = true;
        this.visualisation = new vis.Timeline(document.getElementById(DOMElementID));
        this.visualisation.setOptions(this.options);
        this.visualisation.setGroups(this.groups);
        this.visualisation.setItems(this.items);
    };
    RulesComponent.prototype.initRules = function (rules) {
        for (var ruleID in rules) {
            var rule = rules[ruleID];
            if (!rule["available"])
                continue;
            if (ruleID.indexOf("implicit_behavior") == 0)
                continue;
            var ruleGroups = [];
            var actionIDs = [];
            for (var actionIndex in rule["actions"]) {
                var action = rule["actions"][actionIndex];
                ruleGroups.push({
                    id: action["id"],
                    content: action["description"],
                    treeLevel: 2
                });
                actionIDs.push(action["id"]);
            }
            // Push the trigger
            ruleGroups.push({
                id: ruleID,
                title: "IF " + rule["description"],
                content: "<img src=\"img/devices/rule.png\" />IF " + rule["description"],
                treeLevel: 1,
                nestedGroups: actionIDs /*,
                showNested: false */
            });
            this.groups.add(ruleGroups);
        }
    };
    /** Draw the action executions
     *
     * @param ruleExecutions
     */
    RulesComponent.prototype.redraw = function (ruleExecutions, feedforward) {
        if (feedforward) {
            this.removeFeedforwardBehavior();
            this.addFeedforward(ruleExecutions);
            this.addFeedforwardBehavior();
        }
        else {
            this.items.clear();
            this.drawExecutions(ruleExecutions);
        }
    };
    RulesComponent.prototype.drawExecutions = function (ruleExecutions) {
        for (var i = 0; i < ruleExecutions.length; i++) {
            var ruleExecution = ruleExecutions[i];
            for (var _i = 0, _a = ruleExecution["action_executions"]; _i < _a.length; _i++) {
                var actionExecution = _a[_i];
                this.items.add(this.createActionExecutionItem(actionExecution, ruleExecution));
            }
            /*  let RuleEvent = {
                  id: ruleExecution["execution_id"],
                  group: ruleExecution["rule_id"],
                  content: this.createHTML(ruleExecution["execution_id"]),
                  start: ruleExecution["datetime"],
                  type: 'point'
              }; */
            //  this.items.add(RuleEvent);
        }
        var oThis = this;
        setTimeout(function () {
            $(".action_execution").mouseenter(function (event) {
                oThis.mainController.previewActionExecutionChange($(this).attr("id"), !$(this).hasClass("checked"));
            });
        }, 10);
        this.addFeedforwardBehavior();
    };
    RulesComponent.prototype.addFeedforwardBehavior = function () {
        var oThis = this;
        // The tiny timeout makes sure mouseenter is not triggered when the user is hovering a checkbox that is redrawn
        setTimeout(function () {
            $(".action_execution").mouseleave(function () {
                oThis.mainController.cancelPreviewActionExecutionChange();
            });
        }, 10);
    };
    RulesComponent.prototype.removeFeedforwardBehavior = function () {
        $(".action_execution").unbind();
    };
    RulesComponent.prototype.addFeedforward = function (mergedRuleExecutions) {
        for (var _i = 0, mergedRuleExecutions_1 = mergedRuleExecutions; _i < mergedRuleExecutions_1.length; _i++) {
            var mergedRuleExecution = mergedRuleExecutions_1[_i];
            for (var _a = 0, _b = mergedRuleExecution["action_executions"]; _a < _b.length; _a++) {
                var actionExecution = _b[_a];
                //console.log("action_id: " + actionExecution["action_id"] + ", action_execution_id: " + actionExecution["action_execution_id"] + ", future: " + actionExecution["future"]);
                if (actionExecution["future"] == "new") {
                    this.items.add(this.createActionExecutionItem(actionExecution, mergedRuleExecution));
                }
                $("#" + actionExecution["action_execution_id"]).addClass(actionExecution["future"]);
            }
        }
    };
    RulesComponent.prototype.itemClicked = function (properties) {
        if (properties["item"] != null && properties["item"].indexOf('action_execution') !== -1) {
            var checkbox = $("#" + properties["item"]);
            // if(checkbox.hasClass("highlighted")) {
            this.mainController.actionExecutionChanged(properties["item"], properties["group"], !checkbox.hasClass("checked"));
            /*  } else {
                  this.mainController.selectActionExecution(properties["item"]);
              } */
        }
        else if (properties["what"] === "background" && this.highlightedConflict != null) {
            var conflictRange = this.findConflictRange(this.highlightedConflict);
            if (properties.event.target.closest(".vis-item.vis-background") != null) {
                // The conflict
                var conflictLength = conflictRange.end.getTime() - conflictRange.start.getTime();
                // 25% aan iedere kant
                var newWindow = {
                    start: new Date(conflictRange.start.getTime() - conflictLength / 2),
                    end: new Date(conflictRange.end.getTime() + conflictLength / 2)
                };
                this.mainController.setWindow(newWindow);
            }
            else {
                this.mainController.clearSelection(false);
            }
        }
        else {
            console.log("TODO DEFINE BEHAVIOR");
            this.mainController.clearSelection(false);
            this.mainController.cancelPreviewActionExecutionChange();
        }
        return false;
    };
    RulesComponent.prototype.createActionExecutionItem = function (actionExecution, ruleExecution) {
        return {
            id: actionExecution["action_execution_id"],
            group: actionExecution["action_id"],
            content: this.createActionExecutionVisualisation(actionExecution["action_execution_id"], actionExecution["snoozed"], actionExecution["has_effects"]),
            start: ruleExecution["datetime"],
            type: 'point'
        };
    };
    RulesComponent.prototype.createActionExecutionVisualisation = function (actionExecutionID, snoozed, hasEffects) {
        var result = "";
        var classNames = "action_execution";
        var title = "This action is snoozed by the user";
        if (!snoozed) {
            classNames += " checked";
            if (hasEffects) {
                classNames += " effective";
                title = "This action has one or more effects";
                title = "";
            }
            else {
                classNames += " ineffective";
                title = "This action has no effects";
            }
        }
        result += '<div class="' + classNames + '" id="' + actionExecutionID + '" title="' + title + '">&#10004</div>';
        return result;
    };
    RulesComponent.prototype.highlightConflict = function (conflict) {
        this.clearConflict();
        for (var conflictingStateIndex in conflict["conflicting_states"]) {
            // find the responsible action execution for this state
            var conflictingState = conflict["conflicting_states"][conflictingStateIndex];
            var conflictingAction = this.futureClient.getActionExecutionByResultingContextID(conflictingState["context"]["id"], null);
            if (conflictingAction != null) {
                $("#" + conflictingAction["action_execution_id"]).addClass("conflict_related");
                var conflictingRuleExecution = this.futureClient.getRuleExecutionByActionExecutionID(conflictingAction["action_execution_id"]);
                if (conflictingRuleExecution != null) {
                    $("#" + conflictingRuleExecution["execution_id"]).addClass("conflict");
                }
            }
        }
        //   $("#" + conflict["execution_id"]).addClass("conflict");
        var conflictRange = this.findConflictRange(conflict);
        var conflictEvent = {
            id: "conflict",
            className: 'conflict',
            content: conflict["conflict_type"],
            start: conflictRange.start,
            end: conflictRange.end,
            type: 'background'
        };
        this.items.add(conflictEvent);
        this.highlightedConflict = conflict;
    };
    RulesComponent.prototype.findConflictRange = function (conflict) {
        var conflictStart = new Date(conflict["conflicting_states"][0]["last_changed"]);
        var conflictEnd = new Date(conflict["conflicting_states"][0]["last_changed"]);
        for (var conflictingActionIndex in conflict["conflicting_states"]) {
            var conflictingAction = conflict["conflicting_states"][conflictingActionIndex];
            var conflictingActionDate = new Date(conflictingAction["last_changed"]);
            conflictStart = new Date(Math.min(conflictStart.getTime(), conflictingActionDate.getTime()));
            conflictEnd = new Date(Math.max(conflictEnd.getTime(), conflictingActionDate.getTime()));
            $("#" + conflictingAction["action_execution_id"]).addClass("conflict");
        }
        if (conflictStart.getTime() === conflictEnd.getTime()) {
            conflictStart = new Date(conflictStart.getTime() - 30000);
            conflictEnd = new Date(conflictEnd.getTime() + 30000);
        }
        return { start: conflictStart, end: conflictEnd };
    };
    RulesComponent.prototype.highlightActionExecution = function (actionExecutionID) {
        $("#" + actionExecutionID).addClass("highlighted");
    };
    RulesComponent.prototype.clearConflict = function () {
        this.items.remove("conflict");
        $(".event_item.conflict").removeClass("conflict");
        $(".checkbox.conflict").removeClass("conflict");
        $(".checkbox.highlighted").removeClass("highlighted");
        this.highlightedConflict = null;
    };
    return RulesComponent;
}(EventComponent));
//# sourceMappingURL=RulesComponent.js.map