/*
** Sticky Footer Block
** Setting <body> margin by footer size
*/
$(document).ready(setBodyMarginBottom);
$(window).resize(setBodyMarginBottom);
function setBodyMarginBottom() {
    $('body').css('margin-bottom', $('.footer').outerHeight() + 'px');
}
/*
** Sticky Footer Block End
*/

$(document).ready(setPointHeight);
$(window).resize(setPointHeight);
function setPointHeight() {
    $("#wrap-winner").css("height", $(window).height() - $("nav").outerHeight(true) - $("footer").outerHeight(true) - $("#point").outerHeight(true));
}
