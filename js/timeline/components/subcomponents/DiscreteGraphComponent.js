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
var DiscreteGraphComponent = /** @class */ (function (_super) {
    __extends(DiscreteGraphComponent, _super);
    function DiscreteGraphComponent(mainController, parentDevice, parentElement, label, property, icon) {
        return _super.call(this, mainController, parentDevice, parentElement, label, property, icon) || this;
    }
    DiscreteGraphComponent.prototype.initVisualisation = function (DOMElementID) {
        this.groups = new vis.DataSet();
        this.groups.add([{
                id: 1,
                content: "Brightness",
                options: {
                    interpolation: false,
                    dataAxis: {
                        left: {
                            range: { min: 0, max: 1 }
                        }
                    }
                }
            }]);
        this.visualisation = new vis.Graph2d(document.getElementById(DOMElementID));
        this.visualisation.setOptions(this.getDefaultOptions());
        this.visualisation.setGroups(this.groups);
    };
    DiscreteGraphComponent.prototype.jsonToItem = function (json, startTime, endTime) {
    };
    DiscreteGraphComponent.prototype.areDifferent = function (firstJson, secondJson) {
        return false;
    };
    return DiscreteGraphComponent;
}(GraphComponent));
//# sourceMappingURL=DiscreteGraphComponent.js.map