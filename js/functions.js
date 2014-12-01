var error = "";
var info  = "";

function log( msg ){
    dolog = true;
    if (dolog){
        console.log(msg);
    }
}

function render(template, args) {
    var source;
    var template;
    var path = 'js/templates/' +  template + '.html';

    if (! args){
        args = {};
    }
    args["msgerror"] = error;
    args["msginfo"]  = info;
    args["profile"]  = app.userProfile;

    $.ajax({
        url: path,
        cache: true,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            $('#maincontainer').html(template(args)).trigger('create');
        }
    });
    
    loading("hide");
    error = "";
    info = "";
};

function redirect(location){
    loading("show");
    if (location.charAt(0) != '#'){
        location = '#' + location;
    }
	app.route(location);
}

function loading(showOrHide) {
    setTimeout(function(){
        $.mobile.loading(showOrHide);
    }, 1); 
}

function setErrorMessage(msg){
    error = msg;
}
function setInfoMessage(msg){
    info = msg;
}

function goToScreen() {
    if (window.location.hash){
        window.history.back();//edirect(window.location.hash.substring(1));
    } else {
        redirect('overview', {});
    }
}