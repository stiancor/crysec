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
                    var barcode = chars.join("");
                    console.log("RDID Scanned: " + barcode);
                    // assign value to some input (or do whatever you want)
                    $("#tokenField").val(barcode);
                    $.post( "verify", $( "#tokenForm" ).serialize() );
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