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
var GraphComponent = /** @class */ (function (_super) {
    __extends(GraphComponent, _super);
    function GraphComponent(mainController, parentDevice, parentElement, label, property, icon) {
        var _this = _super.call(this, mainController, parentDevice, parentElement, label, property, icon) || this;
        _this.visibleRange = _this.getDefaultOptions();
        return _this;
    }
    GraphComponent.prototype.getDefaultOptions = function () {
        return {
            min: new Date(new Date().getTime() - 1000 * 60 * 60 * 4.5),
            max: new Date(new Date().getTime() + 1000 * 60 * 60 * 24.5),
            start: new Date(new Date().getTime() - 1000 * 60 * 60 * 4.5),
            end: new Date(new Date().getTime() + 1000 * 60 * 60 * 24.5),
            height: '100%',
            drawPoints: false,
            showMajorLabels: false,
            showMinorLabels: false,
            moment: function (date) {
                return vis.moment(date).utcOffset('+02:00');
            },
            defaultGroup: 'ungrouped'
        };
    };
    GraphComponent.prototype.initVisualisation = function (DOMElementID) {
        this.items = new vis.DataSet();
        this.groups = new vis.DataSet();
        this.groups.add({ id: "normal", content: 'default', className: 'graph_normal', interpolation: {
                parametrization: 'centripetal'
            } });
        this.groups.add({ id: "feedforward", content: 'feedforward', className: 'graph_feedforward' });
        this.groups.add({ id: "causality", content: 'causality', className: 'graph_causality' });
        this.visualisation = new vis.Graph2d(document.getElementById(DOMElementID));
        this.visualisation.setOptions(this.getDefaultOptions());
        this.visualisation.setGroups(this.groups);
        this.visualisation.setItems(this.items);
    };
    /* initBehavior() {
         let oThis = this;
 
         this.visualisation.on('rangechange', function(range) {
             if(range.byUser) {
                 oThis.parentDevice.propagateReAlign(range);
             }
         });
     } */
    GraphComponent.prototype.itemClicked = function (properties) {
        var date = new Date(properties.time);
        var startDate = this.visibleRange.start;
        var endDate = this.visibleRange.end;
        var timelineWidth = this.parentDevice.getMainAttributeContainer().find(".vis-content").width();
        var timePerPixel = (endDate.getTime() - startDate.getTime()) / timelineWidth;
        var minX = 68;
        var minOffset = 60;
        var maxX = 1600;
        var maxOffset = 360;
        var screenSpaceOffset = minOffset + properties.x / (maxX - minX) * (maxOffset - minOffset); // pixels
        var timeOffset = timePerPixel * screenSpaceOffset;
        date.setTime(date.getTime() - timeOffset);
        var stateContextID = this.getClosestItemID(date);
        if (stateContextID != null) {
            this.mainController.selectState(stateContextID);
        }
        else {
            this.mainController.clearSelection(false);
        }
    };
    GraphComponent.prototype.getClosestItemID = function (date) {
        var items = this.items.get({
            fields: ['id', 'x', 'group'] // output the specified fields only
        });
        if (items.length == 0)
            return null;
        var closestDatapointID = items[0].id;
        var closestDatapointDeltaTime = Math.abs(items[0].x["_d"].getTime() - date.getTime());
        for (var i = 1; i < items.length; i++) {
            var itemDate = items[i].x["_d"];
            var itemDeltaTime = Math.abs(itemDate.getTime() - date.getTime());
            if (itemDeltaTime < closestDatapointDeltaTime) {
                closestDatapointDeltaTime = itemDeltaTime;
                closestDatapointID = items[i].id;
            }
        }
        return closestDatapointID;
    };
    GraphComponent.prototype.redraw = function (deviceChanges) {
        this.items.clear();
        if (deviceChanges.length == 0)
            return;
        var thisValue = this.getValueFromJson(deviceChanges[0]);
        var thisValueFloat = parseFloat(thisValue);
        var thisTime = deviceChanges[0]["last_updated"];
        var thisID = deviceChanges[0]["context"]["id"];
        this.items.add({ x: vis.moment(thisTime), y: thisValue, group: "normal", label: this.valueToLabel(thisValueFloat) });
        for (var i = 1; i < deviceChanges.length - 1; i++) {
            thisValue = this.getValueFromJson(deviceChanges[i]);
            thisTime = deviceChanges[i]["last_updated"];
            thisID = deviceChanges[i]["context"]["id"];
            var previousValue = parseFloat(this.getValueFromJson(deviceChanges[i - 1]));
            var nextValue = parseFloat(this.getValueFromJson(deviceChanges[i + 1]));
            thisValueFloat = parseFloat(thisValue);
            // IF local minimum or maximum, show label
            var isOptimum = (thisValueFloat < previousValue && thisValueFloat < nextValue) || (thisValueFloat > previousValue && thisValueFloat > nextValue);
            var isCutOff = (thisValueFloat == previousValue && thisValueFloat != nextValue) || (thisValueFloat != previousValue && thisValueFloat == nextValue);
            if (isOptimum || isCutOff) {
                this.items.add({ x: vis.moment(thisTime), y: thisValue, group: "normal", id: thisID, label: this.valueToLabel(thisValueFloat) });
                continue;
            }
            this.items.add({ x: vis.moment(thisTime), y: thisValue, group: "normal", id: thisID, label: null /* {content: thisValueFloat.toFixed(1), xOffset: -5, yOffset: 18} */ });
        }
        thisValue = this.getValueFromJson(deviceChanges[deviceChanges.length - 1]);
        thisTime = deviceChanges[deviceChanges.length - 1]["last_updated"];
        thisValueFloat = parseFloat(thisValue);
        this.items.add({ x: vis.moment(thisTime), y: thisValue, group: "normal", label: this.valueToLabel(thisValueFloat) });
        if (Date.parse(thisTime) < new Date().getTime()) {
            this.items.add({ x: vis.moment(new Date()), y: thisValue, group: "normal", label: this.valueToLabel(thisValueFloat) });
        }
    };
    GraphComponent.prototype.valueToLabel = function (value) {
        return { content: value.toFixed(1), xOffset: -5, yOffset: 18 };
    };
    GraphComponent.prototype.selectAction = function (identifier) {
        var item = this.visualisation.itemsData.get(identifier);
        if (item != null) {
            this.items.add({ x: item.x, y: item.y, group: "causality", label: { content: parseFloat(item.y).toFixed(1), xOffset: -5, yOffset: 18 } });
            // item["content"] = item["content"].replace("state_item_wrapper", "state_item_wrapper action");
            // this.items.update(item);
            this.parentDevice.setVisible(true);
        }
    };
    GraphComponent.prototype.selectTrigger = function (identifier) {
        var item = this.visualisation.itemsData.get(identifier);
        if (item != null) {
            this.items.add({ x: item.x, y: item.y, group: "causality", label: { content: parseFloat(item.y).toFixed(1), xOffset: -5, yOffset: 18 } });
            // item["content"] = item["content"].replace("state_item_wrapper", "state_item_wrapper trigger");
            // this.items.update(item);
            this.parentDevice.setVisible(true);
        }
    };
    GraphComponent.prototype.selectExecution = function (identifier) {
        // TODO: Not supported for graphs??
    };
    GraphComponent.prototype.getValueFromJson = function (deviceChange) {
        if (this.property != null) {
            return deviceChange["attributes"][this.property];
        }
        else {
            return deviceChange["state"];
        }
    };
    GraphComponent.prototype.clearHighlights = function () {
        var items = this.visualisation.itemsData.get({
            filter: function (item) {
                return (item.group == "causality");
            }
        });
        this.visualisation.itemsData.remove(items);
    };
    GraphComponent.prototype.highlightConflictingState = function (conflictingState) {
        // TODO: draw in graphs
        console.log(conflictingState);
    };
    return GraphComponent;
}(TimelineComponent));
//# sourceMappingURL=GraphComponent.js.map