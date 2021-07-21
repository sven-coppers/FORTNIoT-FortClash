var TimelineComponent = /** @class */ (function () {
    function TimelineComponent(mainController, parentDevice, parentElement, label, property, icon) {
        this.mainController = mainController;
        this.parentDevice = parentDevice;
        this.parentElement = parentElement;
        this.label = label;
        this.property = property;
        this.icon = icon;
        this.hasCustomTime = false;
        this.init();
    }
    /**
     * The HTML needs to be created before this function is called
     * @param DOMElementID
     */
    TimelineComponent.prototype.init = function () {
        this.initHTML(this.parentElement, this.parentDevice.getHTMLPrefix(), this.label, this.property, this.icon);
        this.initVisualisation(this.parentDevice.getHTMLPrefix() + '_' + this.property + '_timeline');
        this.initBehavior();
    };
    TimelineComponent.prototype.initHTML = function (parentElement, htmlPrefix, label, property, icon) {
        var shorthandLabel = label;
        var html = "";
        html += '<div class="timeline_device_attribute" id="' + htmlPrefix + '_' + property + '">';
        html += '   <div class="timeline_label" id="' + htmlPrefix + '_' + property + '_label">';
        if (icon != null) {
            html += '       <img title="' + label + '" src="img/devices/' + icon + '" />';
        }
        html += '       <div class="label_wrapper"><h2 title="' + label + '"> ' + shorthandLabel + '</h2></div>';
        html += '   </div>';
        html += '   <div class="timeline_timeline" id="' + htmlPrefix + '_' + property + '_timeline"></div>';
        html += '   <div class="clearfix"></div>';
        html += '</div>';
        parentElement.append(html);
    };
    TimelineComponent.prototype.initBehavior = function () {
        var oThis = this;
        this.visualisation.on('rangechange', function (range) {
            if (range.byUser) {
                oThis.mainController.reAlign(range);
            }
        });
        this.visualisation.on('click', function (properties) {
            oThis.itemClicked(properties);
        });
    };
    TimelineComponent.prototype.initDummyData = function (itemCount) {
        var startDate = new Date();
        var endDate = new Date(startDate.getTime() + 60 * 60 * 24 * 1000);
        var groupIds = this.groups.getIds();
        var types = ['box', 'point', 'range', 'background'];
        for (var i = 0; i < itemCount; i++) {
            var rInt = this.randomIntFromInterval(1, 30);
            var start = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
            var end = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
            var randomGroupId = groupIds[this.randomIntFromInterval(1, groupIds.length)];
            var type = types[this.randomIntFromInterval(0, 3)];
            var item = {
                id: i,
                group: randomGroupId,
                content: 'item ' + i + ' ' + rInt,
                start: start,
                end: end,
                type: type
            };
            this.items.add(item);
        }
    };
    TimelineComponent.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    TimelineComponent.prototype.reAlign = function (range) {
        this.visualisation.setOptions({ start: range.start, end: range.end });
        this.visibleRange = range;
    };
    TimelineComponent.prototype.drawCustomTime = function (date) {
        this.visualisation.addCustomTime(date, "explainer");
        this.hasCustomTime = true;
    };
    TimelineComponent.prototype.clearCustomTime = function () {
        if (this.hasCustomTime) {
            this.visualisation.removeCustomTime("explainer");
            this.hasCustomTime = false;
        }
    };
    TimelineComponent.prototype.anyActionsVisible = function (actionContextID) {
        if (this.items != null) {
            return this.items.get(actionContextID) != null;
        }
        return false;
    };
    TimelineComponent.prototype.setWindow = function (range) {
        this.visualisation.setWindow({ start: range.start, end: range.end, duration: 750 });
        this.visibleRange = range;
    };
    return TimelineComponent;
}());
//# sourceMappingURL=TimelineComponent.js.map