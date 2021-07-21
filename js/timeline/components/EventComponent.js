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
var EventComponent = /** @class */ (function (_super) {
    __extends(EventComponent, _super);
    function EventComponent(mainController, parentDevice, parentElement, label, icon) {
        return _super.call(this, mainController, parentDevice, parentElement, label, "events", icon) || this;
    }
    EventComponent.prototype.initVisualisation = function (DOMElementID) {
        this.items = new vis.DataSet();
        this.groups = new vis.DataSet();
        this.groups.add([{ id: 1, content: '' }]);
        var options = this.getDefaultOptions();
        options["editable"] = true;
        // Create a Timeline
        this.visualisation = new vis.Timeline(document.getElementById(DOMElementID));
        this.visualisation.setOptions(options);
        this.visualisation.setGroups(this.groups);
        this.visualisation.setItems(this.items);
    };
    EventComponent.prototype.itemClicked = function (properties) {
        var executionID = properties.item;
        // DEPRECATED? OR SHOULD BE RE IMPLEMENTED
        //this.parentDevice.containerTimeline.executionClicked(executionID);
    };
    EventComponent.prototype.redraw = function (deviceChanges, feedforward) {
        this.items.clear();
        for (var i = 0; i < deviceChanges.length; i++) {
            var newItem = {
                id: deviceChanges[i]["execution_id"],
                group: 1,
                content: this.createHTML(deviceChanges[i]["execution_id"]),
                start: deviceChanges[i]["datetime"],
                type: 'point'
            };
            this.items.add(newItem);
        }
    };
    EventComponent.prototype.selectAction = function (identifier) {
        // Not supported for events
    };
    EventComponent.prototype.selectTrigger = function (identifier) {
        // Not supported for events
    };
    EventComponent.prototype.selectExecution = function (identifier) {
        var item = this.visualisation.itemsData.get(identifier);
        if (item != null) {
            item["content"] = item["content"].replace("event_item", "event_item selected");
            this.items.update(item);
            this.parentDevice.setVisible(true);
        }
    };
    EventComponent.prototype.createHTML = function (executionID) {
        var result = "";
        //    if(this.parentDevice.containerTimeline.anyActionsVisible(executionID)) {
        result += '<div class="event_item" id="' + executionID + '">&nbsp;</div>';
        /*    } else {
                result += '<div class="event_item without_changes">&nbsp;</div>';
            }*/
        return result;
    };
    return EventComponent;
}(StateComponent));
//# sourceMappingURL=EventComponent.js.map