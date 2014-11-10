function render(tmpl_name, tmpl_data) {
// Load our template using AJAX and insert our template data
	if ( !render.tmpl_cache ) { 
		render.tmpl_cache = {};
	}

	if ( ! render.tmpl_cache[tmpl_name] ) {
		var tmpl_dir = 'js/templates';
		var tmpl_url = tmpl_dir + '/' + tmpl_name + '.html';

		var tmpl_string;
		$.ajax({
			url: tmpl_url,
			method: 'GET',
			async: false,
			success: function(data) {
				tmpl_string = data;
			}
		});

		render.tmpl_cache[tmpl_name] = _.template(tmpl_string);
	}

	var rendered = render.tmpl_cache[tmpl_name](tmpl_data);
	//To create the jQuery classes styling, the Create event must be triggered.
	$('#maincontainer').html(rendered).trigger('create');
}