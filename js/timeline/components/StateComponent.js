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
var StateComponent = /** @class */ (function (_super) {
    __extends(StateComponent, _super);
    function StateComponent(mainController, parentDevice, parentElement, label, property, icon) {
        return _super.call(this, mainController, parentDevice, parentElement, label, property, icon) || this;
    }
    StateComponent.prototype.getDefaultOptions = function () {
        return {
            autoResize: true,
            min: new Date(new Date().getTime() - 1000 * 60 * 60 * 4.5),
            max: new Date(new Date().getTime() + 1000 * 60 * 60 * 24.5),
            stack: false,
            start: new Date(new Date().getTime() - 1000 * 60 * 60 * 4.5),
            end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24.5),
            // rollingMode: {follow: true, offset: 0.3},
            showMajorLabels: false,
            showMinorLabels: false,
            moment: function (date) {
                return vis.moment(date).utcOffset('+02:00');
            }
        };
    };
    StateComponent.prototype.initVisualisation = function (DOMElementID) {
        this.items = new vis.DataSet();
        this.groups = new vis.DataSet();
        this.groups.add([{ id: 1, content: '' }]);
        this.visualisation = new vis.Timeline(document.getElementById(DOMElementID));
        this.visualisation.setOptions(this.getDefaultOptions());
        this.visualisation.setGroups(this.groups);
        this.visualisation.setItems(this.items);
    };
    StateComponent.prototype.itemClicked = function (properties) {
        var clickedElement = $(properties.event.path[0]);
        var stateContextID = clickedElement.closest(".state_item_wrapper").find(".state_option").first().attr("id");
        // If a sub state was selected
        if (clickedElement.hasClass("state_option")) {
            stateContextID = clickedElement.attr("id");
        }
        if (stateContextID != null) {
            this.mainController.selectState(stateContextID);
        }
        else {
            this.mainController.clearSelection(true);
        }
    };
    StateComponent.prototype.redraw = function (deviceChanges, feedforward) {
        if (deviceChanges.length == 0)
            return;
        if (!feedforward) {
            for (var _i = 0, deviceChanges_1 = deviceChanges; _i < deviceChanges_1.length; _i++) {
                var deviceChange = deviceChanges_1[_i];
                deviceChange["future"] = "unchanged";
            }
        }
        if (deviceChanges[0]["entity_id"] == "light.living_spots") {
            for (var _a = 0, deviceChanges_2 = deviceChanges; _a < deviceChanges_2.length; _a++) {
                var deviceChange = deviceChanges_2[_a];
                //       console.log((feedforward? "feedforward: " : "normal: ") + deviceChange["entity_id"] + " - " + deviceChange["state"] + " (" + deviceChange["future"] + ")");
            }
        }
        //let config: ConfigClient = this.mainController.getConfigClient();
        this.items.clear();
        var endDate = new Date();
        endDate.setTime(new Date().getTime() + (24 * 60 * 60 * 1000)); // Convert minutes to milliseconds
        this.redrawWithPredictions(deviceChanges, feedforward, endDate);
    };
    StateComponent.prototype.redrawWithPredictions = function (deviceChanges, feedforward, predictionEnd) {
        var jsonObjects = [];
        var similarIndex = 0;
        for (var startIndex = 0; startIndex < deviceChanges.length;) {
            jsonObjects.push(deviceChanges[startIndex]);
            // Find states that happen at exactly the same time
            for (similarIndex = startIndex + 1; similarIndex < deviceChanges.length; similarIndex++) {
                if (deviceChanges[startIndex]["last_changed"] == deviceChanges[similarIndex]["last_changed"]) {
                    jsonObjects.push(deviceChanges[similarIndex]);
                }
                else {
                    break;
                }
            }
            var found = false;
            // Try to group states
            for (var endIndex = similarIndex; endIndex < deviceChanges.length; endIndex++) {
                var laterStateInConflict = endIndex + 1 < deviceChanges.length && deviceChanges[endIndex]["last_changed"] == deviceChanges[endIndex + 1]["last_changed"];
                if (jsonObjects.length > 1 || laterStateInConflict || deviceChanges[endIndex]["is_new"]) {
                    this.items.add(this.mergedJsonToItem(jsonObjects, deviceChanges[endIndex]["last_changed"]));
                    startIndex = endIndex;
                    found = true;
                    jsonObjects = [];
                    break;
                }
            }
            if (!found) { // THIS WAS THE LAST ELEMENT
                this.items.add(this.mergedJsonToItem(jsonObjects, predictionEnd));
                jsonObjects = [];
                break;
            }
        }
    };
    StateComponent.prototype.selectExecution = function (identifier) {
        // Not supported for states
    };
    StateComponent.prototype.mergedJsonToItem = function (jsonObjects, endTime) {
        var ids = [];
        var labels = [];
        var futures = [];
        for (var index in jsonObjects) {
            var jsonObject = jsonObjects[index];
            ids.push(jsonObject["context"]["id"]);
            labels.push(this.jsonToLabel(jsonObject));
            futures.push(jsonObject["future"]);
        }
        var item = {
            id: jsonObjects[0]["context"]["id"],
            group: 1,
            start: jsonObjects[0]["last_changed"]
        };
        if (endTime != null) {
            item["end"] = endTime;
            item["type"] = 'range';
            item["content"] = this.createMergedHTML(ids, labels, futures, true);
        }
        else {
            item["type"] = 'point';
            item["content"] = this.createMergedHTML(ids, labels, futures, false);
        }
        return item;
    };
    StateComponent.prototype.jsonToItem = function (json, id, startTime, endTime) {
        var label = this.jsonToLabel(json);
        var item = {
            id: id,
            group: 1,
            start: startTime
        };
        if (endTime != null) {
            item["end"] = endTime;
            item["type"] = 'range';
            item["content"] = this.createHTML(id, '<span class="state_option" id="' + id + '">' + label + '</span>', true, json["future"]);
        }
        else {
            item["type"] = 'point';
            item["content"] = this.createHTML(id, '<span class="state_option" id="' + id + '">' + label + '</span>', false, json["future"]);
        }
        return item;
    };
    StateComponent.prototype.jsonToLabel = function (json) {
        return capitalizeFirstLetter(json["state"].replace("_", " "));
    };
    /**
     * Multiple states that happen at the same time
     * @param ids
     * @param contents
     * @param futures
     * @param hasEnd
     */
    StateComponent.prototype.createMergedHTML = function (ids, contents, futures, hasEnd) {
        var mergedIds = ids[0];
        var mergedContents = '<span class="state_option ' + futures[0] + '" id="' + ids[0] + '">' + contents[0] + '</span>';
        var hasNewOptions = false;
        var hasDeprecatedOptions = false;
        for (var i = 1; i < ids.length; ++i) {
            mergedIds += " " + ids[i];
            mergedContents += ' / <span class="state_option ' + futures[i] + '" id="' + ids[i] + '">' + contents[i] + '</span>';
        }
        for (var i = 0; i < ids.length; ++i) {
            if (futures[i] == "new")
                hasNewOptions = true;
            if (futures[i] == "deprecated")
                hasDeprecatedOptions = true;
        }
        var future = "unchanged";
        if (hasDeprecatedOptions)
            future = "deprecated";
        if (hasNewOptions)
            future = "new"; // krijgt voorrang
        return this.createHTML(mergedIds, mergedContents, hasEnd, future);
    };
    StateComponent.prototype.createHTML = function (id, content, hasEnd, future) {
        var additionalClasses = "";
        if (!hasEnd) {
            additionalClasses += " unfinished";
        }
        if (typeof future !== "undefined") {
            additionalClasses += " " + future.toLowerCase();
        }
        var result = '<div class="state_item_wrapper' + additionalClasses + '">';
        result += '    <div class="state_item_icon"><img src="img/warning.png" title="This state will be involved in a conflict" /></div>';
        result += '    <div class="state_item_arrow">&nbsp;</div>';
        result += '    <div class="state_item_content">' + content + '</div>';
        if (!hasEnd) {
            result += '     <div class="state_item_mask">&nbsp;</div>';
        }
        result += '</div>';
        return result;
    };
    StateComponent.prototype.clearHighlights = function () {
    };
    StateComponent.prototype.highlightConflictingState = function (conflict) {
        var item = this.visualisation.itemsData.get(conflict["context"]["id"]);
        if (item != null) {
            item["content"] = item["content"].split("trigger").join("").replace("state_item_wrapper", "state_item_wrapper conflict");
            this.items.update(item);
            this.parentDevice.setVisible(true);
        }
    };
    StateComponent.prototype.selectAction = function (identifier) {
        // Do nothing
    };
    StateComponent.prototype.selectTrigger = function (identifier) {
        // Do nothing
    };
    return StateComponent;
}(TimelineComponent));
//# sourceMappingURL=StateComponent.js.map