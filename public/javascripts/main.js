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

var addTextByDelay = function(text,elem){
    var delay = 100;
    if(text.length >0){
        elem.append(text[0]);
        setTimeout(
            function(){
                //Slice text by 1 character and call function again                
                addTextByDelay(text.slice(1),elem,delay);            
             },delay                 
        );
    }
}
