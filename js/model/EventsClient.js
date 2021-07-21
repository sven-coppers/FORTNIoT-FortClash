var EventsClient = /** @class */ (function () {
    function EventsClient(mainController) {
        this.mainController = mainController;
    }
    EventsClient.prototype.startListening = function () {
        var oThis = this;
        var source = new EventSource("http://localhost:8080/intelligibleIoT/api/events/stream");
        source.addEventListener("message", function (event) {
            oThis.drawEvent(JSON.parse(event.data));
            document.getElementById("sven_events").innerHTML = event.data;
        });
    };
    EventsClient.prototype.drawEvent = function (event) {
        var date = new Date(event["timestamp"]);
        var identifier = event["identifier"];
        var htmlContainerSelector = identifier.replace("button.", "#");
        var htmlContainer = $(htmlContainerSelector).find(".event_history");
        htmlContainer.append("<p>" + timeToString(date) + ": " + event["action"] + " (" + event["user"] + "@" + event["client"] + ")</p>");
    };
    EventsClient.prototype.refresh = function () {
        var oThis = this;
        $.ajax({
            url: "http://localhost:8080/intelligibleIoT/api/events/history",
            type: "GET",
        }).done(function (data) {
            oThis.drawEventLog(data);
        });
    };
    EventsClient.prototype.drawEventLog = function (events) {
        for (var i = events.length - 1; i >= 0; i--) {
            var event_1 = events[i];
            var identifier = event_1["identifier"];
            this.mainController.devices[identifier].drawEventLogItem(event_1);
        }
    };
    return EventsClient;
}());
//# sourceMappingURL=EventsClient.js.map