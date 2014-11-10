 var app = { 

    initialize: function() {
	// Application Constructor	
		this.loggedin = false;

        this.bindEvents();
		
		this.setupURLS();
		
		this.route();
    },

    setupURLS: function() {
	// Setup RegEx URLs of our routes
		this.loginURL = /#login/;
		this.registerURL = /#register/;
		this.overviewURL = /#overview/;
    },

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
	    if (!this.loggedin){
	    	if (hash.match(app.registerURL)){
	    		//Process register
	    		//TODO: Process register
	    		render('register', {});
	    		return;
	    	} else if (hash.match(app.loginURL)){
	    		//Process login
	    		//TODO: Process login
	    		render('login', {});
	    		return;
	    	}

	    	//Just show register as failsave
	    	console.log('ERROR Invalid URL while not logged in: ' + hash);
	    	render('login', {});
    		return;
    	} else {
		    //-- we are sure user is logged in from now on
		    if (!hash || hash.match(app.loginURL)) {
		        //var lv = new LoginView(document.getElementById('login').value, document.getElementById('pass').value);
		        render('login', {});
		        return;
		    }
		    var match = hash.match(app.overviewURL);
		    if (match) {
		        render('overview', {});
				return;
		    }

    	    console.log('ERROR Invalid URL while logged in: ' + hash);
	    	render('overview', {});
	    	return;
		}
    }
};
