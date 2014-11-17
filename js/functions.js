function render(template, args, msginfo, msgerror) {
    var source;
    var template;
    var path = 'js/templates/' +  template + '.html';
    $.ajax({
        url: path,
        cache: true,
        success: function (data) {
            source = data;
            template = Handlebars.compile(source);
            $('#maincontainer').html(template(args)).trigger('create');
        }
    });
};
function redirect(location){
	app.route(location);
}