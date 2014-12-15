var Model = function () {

	this.getDataOnline = function(input) {
	// Get data and transform
		result = false;
		$.ajax({
			async: false,
			crossDomain: true,
			url: input
		})
			.done(function (data){
				if (!data) {
					log('getData error failed but completed, data = null: ' + url);
				} else {
					log(data);
					if (typeof data === "object" && data !== null) {
						log('object returned');
						result = data;
					} else {
						log('JSON returned');
						try {
							result = $.parseJSON(data);
						} catch (err) {
							log('getData Json parse error: ' + err);
							result = false;
						}
					}
				}
			})
			.error(function (request, status, error){
				log('getData error failed : ' + input + ", " + request + ", " + status + ", " + error);
				log(error);
			});
		return result;
	},

	this.getImage = function(input,ext) {
		result = false;
		log('getting image ' + input);

		var img = new Image();
		img.src = input;
		img.width = 100;
		img.height = 100;
	
	    // Create an empty canvas element
	    var canvas = document.createElement("canvas");
	    canvas.width = img.width;
	    canvas.height = img.height;

	    // Copy the image contents to the canvas
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);

	    if (!ext){
	    	ext = "jpg";
	    }
	    var dataURL = canvas.toDataURL("image/png", 1.0);

	    return dataURL;
	},

	//Requirement: questions must be fetched at least once on first boot
	this.getData = function (input){
		var ttl = this.getLocal('TTL_' + input.trim());
		log('TTL is ' + ttl + ' for ' + input);
		var now = new Date();
		if ((!ttl) || (Date(ttl) < now)){
			log('TTL expired or not existant. Fetching online..');
			//if it doesnt exist cached or TTL is more than a day old
			var result = this.getDataOnline(input);
			if (result){
				// Fill our local database
				this.putLocal(input.trim(), result);
				// Adjust/add the TTL
				this.putLocal('TTL_' + input.trim(), now);
				log('Putting result in cache..');
				return result;
			} else {
				if (ttl){
					log('No network, but we have a cached version.');
					//Online doesnt work, but we have a local copy!
					return this.getLocal(input.trim());
				} else {
					log('No network and no cached version.. Returning false..');
					//Online doesnt work and we dont have a local copy..
					return false;
				}
			}
		} else {
			log('TTL valid, opening from cache..');
			//Safe to use our cached copy
			return this.getLocal(input.trim());
		}
	},

	this.submit = function(url, data) {
		var xhr = new XMLHttpRequest();
		xhr.open(form.method, form.action, true);
		xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
		xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('userToken'));
		if (app.userProfile){
			xhr.setRequestHeader('ID', app.userProfile.user_id);
		}

		xhr.send(JSON.stringify(data));
	}

	this.getQuestions = function(catid) {
		//GET secured/category/{id}(/random)
		return this.getData(this.categoryURL + catid);
	},

	this.getQuestion = function(questionid) {
		return this.getData(this.questionURL + questionid);
	}

	this.getRandomQuestion = function(catid) {
		return this.getData(this.categoryURL + catid + '/random');
	},

	this.getCategories = function() {
		return this.getData(this.categoriesURL);
	},

	this.getProfile = function() {
		var result = this.getData(this.profileURL);
		// double pass to include the actual image instead of the URL
		result.picture = this.getImage(result.picture);
		log(result.picture);
		return result;
	},

	this.getCategoryAnswered = function(catid) {
		return this.getData(this.userURL + catid + '/progress');
	},

	this.getRandomQuestions = function(catid, count) {
		return this.getData(this.categoryURL + catid + '/random/' + count);
	},
	
	this.setupURLs = function () {
		this.baseURL = 'http://d00med.net/quackr/';
		this.secURL = this.baseURL + 'secured/';
		this.profileURL = 'https://quackr.auth0.com/api/users/' + localStorage.getItem('userID');

		this.categoriesURL = this.secURL + 'categories';
		this.categoryURL   = this.secURL + 'category/';
		this.questionURL   = this.secURL + 'question/';
		this.userURL 	   = this.secURL + 'user/';

		this.submitURL	   = this.userURL + 'submit';
	},

	this.sendNumbers = function() {
		var solved_arr = this.getLocal('solved');
		var wrong_arr  = this.getLocal('wrong');
		if (solved_arr || wrong_arr){
			error = false;
			try {
				data = {};
				// Question ids of wrong answers
				data['wrong'] = [];
				wrong_arr.forEach(function (entry){
					data['wrong'].push(entry);
				});
				// Question ids of correct answers
				data['solved'] = [];
				solved_arr.forEach(function (entry){
					data['solved'].push(entry);
				});
				this.submit(this.submitURL, data);
			} catch (err) {
				log('Submit failed; ' + err);
				error = true;
			}
			return error;
		} else {
			return true;
		}
	},

	this.correct = function (questionid) {
		var solved_arr = this.getLocal('solved');
		if (solved_arr){
			solved_arr.put(questionid);
			if (this.sendNumbers()){
				this.removeLocal('solved');
			} else {
				this.putLocal('solved', solved_arr);
			}
		} else {
			this.putLocal('solved', [ questionid ]);
		}
	},

	this.incorrect = function (questionid) {
		var wrong = this.getLocal('wrong');
		if (wrong){
			wrong.put(questionid);
			if (this.setNumbers()){
				this.removeLocal('wrong');
			} else {
				this.putLocal('wrong', wrong);
			}
		} else {
			this.putLocal('wrong', [ questionid ]);
		}
	},

	this.removeLocal = function (key) {
		return $.jStorage.deleteKey(key);
	},

	this.getLocal = function (key) {
		return $.jStorage.get(key, false);
	},

	this.putLocal = function (key, value) {
		return $.jStorage.set(key, value);
	},

	this.initialize = function () {
	// Model constructor
		//all online URLs
		this.setupURLs();

		//do we need to work offline?
		this.online = (navigator.onLine);
		log('Network status: ' + this.online);

		//is this our first run?
		if (!this.getLocal('first')){
			//redirect('we_need_internet');
			//TODO: show page until internet connection is reached
			//TODO: fetchFirstLevels(all_categories)
		}
	},

	this.initialize();
};