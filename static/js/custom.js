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

/*
** Button On Click Block
** Apply button on click
*/
$("div.apply button[apply-type='apply']").click(function() {
    $("input[name='pos']").val(parseInt($(this).attr('apply-pos')));
    var str = $(this).attr('apply-time') + ' ' + ((parseInt($(this).attr('apply-pos')) - 1) % 6 + 1) + '번 자리';
    $("#apply-description").text(str);
});
/*
** Cancel button on click
*/
$("div.apply button[apply-type='cancel']").click(function() {
    if (confirm('신청을 취소하시겠습니까?')) {
        $.post($(this).attr('apply-url'), function(res) {
            if (typeof(res) !== "object") res = JSON.parse(res);
            alert(res.message);
            location.reload();
        });
    }
});
/*
** Show button on click
*/
$("div.apply button[apply-type='show']").click(function() {
    $("input[name='pos']").val(parseInt($(this).attr('apply-pos')));
    var str = $(this).attr('apply-time') + ' ' + ((parseInt($(this).attr('apply-pos')) - 1) % 6 + 1) + '번 자리';
    $("#apply-description").text(str);
    $("#apply-info").html("신청자: " + $(this).attr('apply-name') + "<br>" +
    "신청 일시: " + $(this).attr('apply-timestamp'));
});
/*
** Button On Click Block End
*/

/*
** Date input Block
*/
$("#date-submit").click(function(e) {
    location.href = $("#date-ipt").attr('base-url').replace(/\/?(\d{4}-\d{2}-\d{2})?$/, '/') + $("#date-ipt").val();
});
$("#date-today").click(function(e) {
    location.href = $("#date-ipt").attr('base-url').replace(/\/?(\d{4}-\d{2}-\d{2})?$/, '/')
});
/*
** Date input Block End
*/

/*
** Dimibob Block
*/
$(document).ready(function() {
    if ($("#dimibob-list").length) {
        var date = new Date();
        var year = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();
        var dateString = "" + year + (month < 10 ? "0"+month : month) + (day < 10 ? "0"+day : day);

        $.get(
            "http://dimigo.in/pages/dimibob_getdata.php",
            {"d": dateString}
        ).done(function(res) {
            if (res === "false") {
                res = {
                    "date": dateString,
                    "breakfast": "데이터가 없습니다",
                    "lunch": "데이터가 없습니다",
                    "dinner": "데이터가 없습니다",
                    "snack": "데이터가 없습니다"
                }
            } else if (typeof(res) !== "object") {
                res = JSON.parse(res);

                for (var key in res) {
                    res[key] = res[key].replace(/\//g, " / ");
                    res[key] = res[key].replace(/[^가-힣a-zA-Z0-9\s\/]/g, "");
                }
            }
            if (res.date.replace(/\D/g, "") != dateString) {
                res = {
                    "date": dateString,
                    "breakfast": "데이터가 없습니다",
                    "lunch": "데이터가 없습니다",
                    "dinner": "데이터가 없습니다",
                    "snack": "데이터가 없습니다"
                }
            }

            str = "<li><span class='bold'>아침:</span> " + res.breakfast + "</li>" +
            "<li><span class='bold'>점심:</span> " + res.lunch + "</li>" +
            "<li><span class='bold'>저녁:</span> " + res.dinner + "</li>" +
            "<li><span class='bold'>간식:</span> " + res.snack + "</li>";

            $("#dimibob-list").html(str);
        }).fail(function(err) {
            $("#dimibob-list").html("<li>급식 로딩 중 에러가 발생했습니다</li>");
        });
    }
});
/*
** Dimibob Block End
*/
