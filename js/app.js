 log = true;

 var app = { 

    initialize: function() {
	// Application Constructor
		//Setup authenticator
		lock = new Auth0Lock('vmUb00t7jWrGtysEAiyX6CwC5XlgRR4Y', 'quackr.auth0.com');

		this.loggedin = false;

        this.bindEvents();
		
		this.setupURLS();
		
		this.route();
    },

    setupURLS: function() {
	// Setup RegEx URLs of our routes
		this.loginURL = /#login/;
		this.dologinURL = /#dologin/;
		this.registerURL = /#register/;
		this.doregisterURL = /#doregister/;
		this.overviewURL = /#overview/;
		this.logoutURL = /#logout/;
    },

    bindEvents: function() {
    // Bind all our events
    	document.addEventListener('deviceready', this.onDeviceReady, false); //cordova
    	$(window).hashchange( this.route );	//temp for without cordova
    },
	
    onDeviceReady: function() {
    // When everything is loaded, do this
    	//Setup routing
        $(window).on('hashchange', $.proxy(this.route, this));
    	
        //Setup authentication/login form
    	var userProfile;

		$('.loginbtn').click(function(e) {
		  e.preventDefault();
		  lock.show(function(err, profile, token) {
		    if (err) {
		      // Error callback
		      alert('There was an error');
		    } else {
		      // Success calback

		      // Save the JWT token.
		      localStorage.setItem('userToken', token);

		      // Save the profile
		      userProfile = profile;
		    }
		  });
		});
    },

    logout: function() {
    	app.loggedin = false;
    	//TODO: unset user variables
    },
	
	
    route: function() {
    // route is called when a link is clicked
	    var hash = window.location.hash;

	    if (!app.loggedin){
	    	log('user not logged in');
	    	if (hash.match(app.registerURL)){
	    		//Process register
	    		var rv = new RegisterView();
				return;
	    	} else if (hash.match(app.doregisterURL)){
    			var rv = new RegisterView(document.getElementById('login').value, document.getElementById('pass').value, document.getElementById('firstname').value, document.getElementById('lastname').value);
	    		return;
	    	} else if (hash.match(app.loginURL)){
	    		//Process login
	    		var lv = new LoginView();
	    		return;
	    	} else if (hash.match(app.dologinURL)) {
	    		var lv = new LoginView(document.getElementById('login').value, document.getElementById('pass').value);
	    		return;
	    	} else if (hash.match("")){
	    		render('login', {});
	    	} else {
		    	//Just show login as failsave
		    	log('ERROR Invalid or empty URL while not logged in: ' + hash);
		    	render('login', {});
	    		return;
	    	}
    	} else {
    		log('user is logged in!');
		    //-- we are sure user is logged in from now on
		    if (hash.match(app.overviewURL) || (hash == '')) {
		        render('overview', {});
				return;
		    } else if (hash.match(app.logoutURL)){
		    	this.logout();
		    	redirect('#login');
		    	return;
		    }

    	    log('ERROR Invalid URL while logged in: ' + hash);
	    	render('overview', {});
	    	return;
		}
    }
};

log = function ( msg ){
	if (log){
		log(msg);
	}
}
