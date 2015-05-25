$(document).ready(function() {
    var pressed = false; 
    var chars = []; 
    $(window).keypress(function(e) {

        if (e.which >= 48 && e.which <= 57) {
            chars.push(String.fromCharCode(e.which));
        }
        if (pressed == false) {
            setTimeout(function(){
                if (chars.length >= 9) {
                    var tagCode = chars.join("");
                    $("#tokenField").val(tagCode);
                    $.post( $('#tokenForm').attr('action'), $( "#tokenForm" ).serialize(), function(data) {
                        $('#progressBar').html(data);
                    });
                }
                chars = [];
                pressed = false;
            },500);
        }
        pressed = true;
    });
});
$("#tokenField").keypress(function(e){
    if ( e.which === 13 ) {
        e.preventDefault();
    }
});