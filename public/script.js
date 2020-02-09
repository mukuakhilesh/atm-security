console.log("hhh");
var inital="";
$(".tile button").click(function() {
    console.log("khusih priya");
    var fired_button = $(this).attr('value');
    var display=$('#qcCustomNumber');
    var htmlstring=fired_button;
    console.log(fired_button);
    display.val(htmlstring);
    console.log(display);
    //fired_button='';
});

$('#pinPad a').click(function(){
    var fired_button = $(this).attr('value');

    var display=$('#qcCustomNumber');
    var inital=$(display).val();
    if(inital==undefined)
    {
        inital="";
    }
    var htmlstring=inital+fired_button;
    console.log(fired_button);
    display.val(htmlstring);
    
    console.log(display);
});
$('#btnDelete').click(function(){
    var display=$('#qcCustomNumber');
    var htmlstring="";
    display.val(htmlstring);
});