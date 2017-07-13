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
