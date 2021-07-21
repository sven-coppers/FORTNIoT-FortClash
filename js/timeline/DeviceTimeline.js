var DeviceTimeline = /** @class */ (function () {
    function DeviceTimeline(containerTimeline, deviceName) {
        this.containerTimeline = containerTimeline;
        this.deviceName = deviceName;
        this.hasCustomTime = false;
        this.available = true;
        this.visible = true;
        this.initHTML();
        this.initBehavior();
    }
    DeviceTimeline.prototype.initHTML = function () {
        var html = "";
        html += '<div class="timeline_device device">';
        html += '   <div class="timeline_device_main_attribute" id="' + this.getHTMLPrefix() + '_main_attribute">';
        html += '   </div>';
        html += '   <div class="timeline_device_attributes" id="' + this.getHTMLPrefix() + '_attributes">';
        html += '   </div>';
        html += '</div>';
        $(".timeline_wrapper").append(html);
    };
    DeviceTimeline.prototype.getMainAttributeContainer = function () {
        return $("#" + this.getHTMLPrefix() + '_main_attribute');
    };
    DeviceTimeline.prototype.getOtherAttributesContainer = function () {
        return $("#" + this.getHTMLPrefix() + '_attributes');
    };
    DeviceTimeline.prototype.initBehavior = function () {
        var oThis = this;
        this.getMainAttributeContainer().find(".timeline_label").click(function () {
            oThis.getOtherAttributesContainer().toggle();
        });
    };
    DeviceTimeline.prototype.redrawVisualisation = function (deviceChanges, feedforward) {
        for (var componentIndex in this.components) {
            this.components[componentIndex].redraw(deviceChanges, feedforward);
        }
    };
    DeviceTimeline.prototype.setRedundancyBad = function (redundancyBad) {
        this.redundancyBad = redundancyBad;
    };
    DeviceTimeline.prototype.isRedundancyBad = function () {
        return this.redundancyBad;
    };
    DeviceTimeline.prototype.setChangeCoolDown = function (changeCoolDown) {
        this.changeCoolDown = changeCoolDown;
    };
    DeviceTimeline.prototype.getChangeCoolDown = function () {
        return this.changeCoolDown;
    };
    DeviceTimeline.prototype.reAlign = function (range) {
        if (!this.available)
            return;
        for (var componentIndex in this.components) {
            this.components[componentIndex].reAlign(range);
        }
    };
    DeviceTimeline.prototype.setWindow = function (range) {
        if (!this.available)
            return;
        for (var componentIndex in this.components) {
            this.components[componentIndex].setWindow(range);
        }
    };
    DeviceTimeline.prototype.anyActionsVisible = function (actionContextID) {
        for (var componentIndex in this.components) {
            if (this.components[componentIndex].anyActionsVisible(actionContextID))
                return true;
        }
        return false;
    };
    DeviceTimeline.prototype.drawCustomTime = function (date) {
        for (var componentIndex in this.components) {
            this.components[componentIndex].drawCustomTime(date);
        }
    };
    // Only if a timeline has the item, set the item for that timeline
    DeviceTimeline.prototype.clearCustomTime = function () {
        for (var componentIndex in this.components) {
            this.components[componentIndex].clearCustomTime();
        }
    };
    DeviceTimeline.prototype.selectTrigger = function (stateContext) {
        for (var componentIndex in this.components) {
            this.components[componentIndex].selectTrigger(stateContext);
        }
    };
    DeviceTimeline.prototype.selectAction = function (stateContext) {
        for (var componentIndex in this.components) {
            this.components[componentIndex].selectAction(stateContext);
        }
    };
    DeviceTimeline.prototype.selectExecution = function (stateContext) {
        for (var componentIndex in this.components) {
            this.components[componentIndex].selectExecution(stateContext);
        }
    };
    DeviceTimeline.prototype.getHTMLPrefix = function () {
        return this.deviceName.replace(".", "_");
    };
    DeviceTimeline.prototype.setVisible = function (visible) {
        if (visible && this.available) {
            this.getMainAttributeContainer().parent().stop().slideDown(750);
            //this.getMainAttributeContainer().parent().removeClass("hidden");
            // this.getMainAttributeContainer().parent().removeClass("collapsed");
        }
        else {
            this.getMainAttributeContainer().parent().stop().slideUp(750);
            // this.getMainAttributeContainer().parent().addClass("collapsed");
        }
    };
    DeviceTimeline.prototype.setAvailable = function (available) {
        if (available) {
            this.getMainAttributeContainer().parent().show();
        }
        else {
            this.getMainAttributeContainer().parent().hide();
        }
        this.available = available;
    };
    DeviceTimeline.prototype.clearHighlights = function () {
        for (var componentIndex in this.components) {
            this.components[componentIndex].clearHighlights();
        }
    };
    DeviceTimeline.prototype.addComponent = function (component) {
        this.components.push(component);
    };
    DeviceTimeline.prototype.setCollapsed = function (collapsed) {
        if (collapsed) {
            this.getOtherAttributesContainer().hide();
        }
        else {
            this.getOtherAttributesContainer().show();
        }
    };
    DeviceTimeline.prototype.highlightConflictingState = function (conflictingState) {
        for (var componentIndex in this.components) {
            this.components[componentIndex].highlightConflictingState(conflictingState);
        }
    };
    return DeviceTimeline;
}());
//# sourceMappingURL=DeviceTimeline.js.map