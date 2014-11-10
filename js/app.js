    initialize: function() {
	// Application Constructor	
        this.bindEvents();
		
		this.setupURLS();
		
		this.route();
    },

    setupURLS: function() {
	// Setup RegEx URLs of our routes
		this.loginURL = /#login/;
		this.registerURL = /#register/;
		this.overviewURL = /#overview/;
    }

    bindEvents: function() {
    // Bind all our events
    	document.addEventListener('deviceready', this.onDeviceReady, false); //cordova
    	$(window).hashchange( this.route );	//temp for without cordova
    },
	
    onDeviceReady: function() {
    // When everything is loaded, do this
        $(window).on('hashchange', $.proxy(this.route, this));
    },
	
	
    route: function() {
    // route is called when a link is clicked

	    var hash = window.location.hash;
	    if (!hash || hash.match(app.loginURL)) {
	        var lv = new LoginView({document.getElementById('login').value, document.getElementById('pass').value});
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
	    console.log('ERROR Invalid URL: ' + hash);
    }
};
