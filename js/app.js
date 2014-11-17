 log = true;

 var app = { 

    initialize: function() {
	// Application Constructor
		//Setup authenticator
		log('Setting up auth0Lock');
		this.lock = new Auth0Lock('vmUb00t7jWrGtysEAiyX6CwC5XlgRR4Y', 'quackr.auth0.com');

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
    	this.onDeviceReady(); //temp for without cordova
    },
	
    onDeviceReady: function() {
    // When everything is loaded, do this
    	//Setup routing
    	log('Setting up routes');
        $(window).on('hashchange', $.proxy(this.route, this));

        log('Setting up secure AjaX calls');
        $.ajaxSetup({
		  'beforeSend': function(xhr) {
		    if (localStorage.getItem('userToken')) {
		      xhr.setRequestHeader('Authorization',
		            'Bearer ' + localStorage.getItem('userToken'));
		    }
		  }
		});
    },

    logout: function() {
    	app.loggedin = false;
    	localStorage.removeItem('token');
		userProfile = null;
		redirect('#login');
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
	    	} else if (hash.match(app.doregisterURL)) {
    			var rv = new RegisterView(document.getElementById('login').value, document.getElementById('pass').value, document.getElementById('firstname').value, document.getElementById('lastname').value);
	    		return;
	    	} else if (hash.match(app.dologinURL)) {
	    		var lv = new LoginView(document.getElementById('login').value, document.getElementById('pass').value);
	    		return;
	    	} else {
	    		//Process login
	    		var lv = new LoginView();
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
		console.log(msg);
	}
}
