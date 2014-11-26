var app = {
    initialize: function() {
	// Application Constructor
		//Setup authenticator
		log('Setting up auth0Lock');
		this.lock = new Auth0Lock('vmUb00t7jWrGtysEAiyX6CwC5XlgRR4Y', 'quackr.auth0.com');

		this.setupURLS();

		this.setupAJAX();

		this.loggedin = (localStorage.getItem('userID') != null);
		if (this.loggedin == true){
			log('retrieving profile..');
			$.ajax({
				url: 'https://quackr.auth0.com/api/users/' + localStorage.getItem('userID'),
				success: function (data){
					app.userProfile = data;
					log('User was logged in, profile set.');
					app.bindEvents();
					app.route();
				}
			});
		} else {
			this.bindEvents();
			this.route(); //cordova temp
		}
    },

    setupURLS: function() {
	// Setup RegEx URLs of our routes
		this.loginURL = /#login/;
		this.dologinURL = /#dologin/;
		this.registerURL = /#register/;
		this.doregisterURL = /#doregister/;
		this.overviewURL = /#overview/;
		this.logoutURL = /#logout/;
		this.exitURL = /#exit/;
		this.categoriesURL = /#categories/;
    },

    bindEvents: function() {
    // Bind all our events
    	document.addEventListener('deviceready', this.onDeviceReady, false); //cordova
    	this.onDeviceReady(); //temp cuz no cordova
    },

    setupAJAX: function() {
    // Setup secure AjaX calls
        log('Setting up secure AjaX calls');
        $.ajaxSetup({
		  'beforeSend': function(xhr) {
		    if (localStorage.getItem('userToken')) {
		      xhr.setRequestHeader('AUTHORIZATION', 'Bearer ' + localStorage.getItem('userToken'));
		      if (app.userProfile){
			      xhr.setRequestHeader('ID', app.userProfile.user_id);
			  }
		    }
		  }
		});
    },

    onDeviceReady: function() {
    // When everything is loaded, do this
    	//Setup routing
    	log('Setting up routes');
        $(window).on('hashchange', $.proxy(this.route, this));
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
	    if (hash.match(app.exitURL)){
	    	if(navigator.app){
        		navigator.app.exitApp();
			} else if(navigator.device){
        		navigator.device.exitApp();
			}
	    } else
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
		    if (hash.match(app.logoutURL)){
		    	this.logout();
		    	return;
		    } else if (hash.match(app.categoriesURL)){
		    	var cv = new CategoriesView();
		    	return;
		    } else {
		    	var ov = new OverviewView();
		    	return;
		    }
		}
    }
};
var log = function( msg ){
	dolog = true;
    if (dolog){
        console.log(msg);
    }
}
