var error = "";
var info  = "";

function render(template, args) {
    var source;
    var template;
    var path = 'js/templates/' +  template + '.html';

    if (! args){
        args = {};
    }
    args["msgerror"] = error;
    args["msginfo"] = info;

    $.ajax({
        url: path,
        cache: true,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            $('#maincontainer').html(template(args)).trigger('create');
        }
    });
    
    error = "";
    info = "";
};
function redirect(location){
	app.route(location);
}
function setErrorMessage(msg){
    error = msg;
}
function setInfoMessage(msg){
    info = msg;
}