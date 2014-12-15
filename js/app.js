var app = {
    initialize: function() {
	// Application Constructor
		//Setup authenticator
		log('Setting up auth0Lock');
		this.lock = new Auth0Lock('vmUb00t7jWrGtysEAiyX6CwC5XlgRR4Y', 'quackr.auth0.com');

		this.model = new Model();

		this.setupURLS();

		this.setupAJAX();

		this.loggedin = (localStorage.getItem('userID') != null);
		if (this.loggedin == true){
			log('retrieving profile..');
			this.userProfile = this.model.getProfile();
			if (!this.userProfile) {
				log('Token has expired.');
				setInfoMessage('Your session has expired. Please login again.');
				app.loggedin = false;
			}
		}

		this.bindEvents();
		this.route(); //!!! temporary for testing
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
		this.categoryURL = /#category/;
		this.questionsURL = /#random/;
		this.questionURL = /#question/;
		this.profileURL = /#profile/;
		this.nextURL = /#next/;
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
		      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
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
    	this.loggedin = false;
    	localStorage.removeItem('token');
    	localStorage.removeItem('userID');
		this.userProfile = null;
		history.pushState("", document.title, window.location.pathname); //Reset hash to prevent logging us out when logging in!
		redirect('login');
    },

    getID: function(url) {
    	var idmatch = /\?id=(\d+)/;
    	var matches = url.match(idmatch);
    	if (matches){
    		return matches[1];
    	} else {
    		return false;
    	}
    },

    getPar: function(url, par) {
    	var match = new RegExp("(?:\\?|&)" + par + "=" + "(\\d+)");
    	log(match);
    	var result = url.match(match);
    	if (result){
    		return result[1];
    	} else {
    		return false;
    	}
    },


    route: function(eventt, input) {
    // route is called when a link is clicked
    	var hash = input;
    	if (!hash){
    		if (window.location.hash){
    			hash = window.location.hash;
    		} else {
    			hash = "";
    		}
    	}

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
		    } else if (hash.match(app.categoryURL)){
		    	var cid = this.getID(hash);
		    	if (cid){
		    		var cv = new CategoryView(cid);
		    	} else {
		    		setErrorMessage("No category chosen!");
		    		redirect("overview");
		    	}
		    	return;
		    } else if (hash.match(app.questionURL)){
		    	var qid = this.getID(hash);
		    	if (qid){
		    		var qv = new QuestionView(qid);
		    	} else {
		    		log('no question id given');
		    		setErrorMessage("No question chosen!");
		    		redirect('overview');
		    	}
		    	return;
		    } else if (hash.match(this.questionsURL)){
		    	var qv = new QuestionsView();
		    	return;
		    } else if (hash.match(this.nextURL)) {
		    	var cid = this.getID(hash);
		    	if (cid){
		    		var next_id = this.model.getRandomQuestion(cid).id;
		    		var qv = new QuestionView(next_id);
		    	} else {
		    		log('no cat id given');
		    		setErrorMessage('No category chosen!');
		    		redirect('overview');
		    	}
		    } else if (hash.match(app.profileURL)){
		    	var pv = new ProfileView();
		    	return;
		    } else {
		    	log(hash);
		    	var ov = new OverviewView();
		    	return;
		    }
		}
    }

};
