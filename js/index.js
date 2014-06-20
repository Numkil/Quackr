function render(tmpl_name, tmpl_data) {
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
	$('#maincontainer').html(rendered);
}
	
	
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		this.navigate('home');
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
    onDeviceReady: function() {
        
    },
	
	
	
	navigate: function( location ) {
		render(location, {});
	}
};
