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
		
	this.loginURL = /#login/;
	this.registerURL = /#register/;
	this.overviewURL = /#overview/;
	
	this.route();
},

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
	
    onDeviceReady: function() {
        $(window).on('hashchange', $.proxy(this.route, this));
    },
	
	
    route: function() {
	    var hash = window.location.hash;
	    if (!hash || hash.match(app.loginURL)) {
	        render('home', {});
	        return;
	    }
	    var match = hash.match(app.registerURL);
	    if (match) {
	        render('register', {});
			return;
	    }
	    var match = hash.match(app.overviewURL);
	    if (match) {
	        render('overview', {});
			return;
	    }
    }
};
