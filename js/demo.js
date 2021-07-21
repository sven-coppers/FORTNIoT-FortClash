function toggle() {
    var newOpen = $("#explanation_toggle").hasClass("collapsed");

    if(newOpen) {
        $(".header p").slideDown(250);
        $("#explanation_toggle").removeClass("collapsed");
    } else {
        $(".header p").slideUp(250);
        $("#explanation_toggle").addClass("collapsed");
    }
}