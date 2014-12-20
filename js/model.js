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
				log('getData error failed : ' + input + ", " + status + ", " + error);
			});
		return result;
	},


	this.getImage = function(url, callback, output) {
	    var canvas = document.createElement('CANVAS'),
	        ctx = canvas.getContext('2d'),
	        img = new Image;
	    img.crossOrigin = 'Anonymous';
	    img.onload = function(){
	        var dataURL;
	        canvas.height = img.height;
	        canvas.width = img.width;
	        ctx.drawImage(img, 0, 0);
	        dataURL = canvas.toDataURL(output);
	        canvas = null;
	        //log(dataURL);
	        callback.call(this, dataURL);
	    };
	    img.src = url;
	},

	//Requirement: questions must be fetched at least once on first boot
	this.getData = function (input){
		var auth0_request = (input.indexOf('quackr.auth0.com') > -1);
		if (!auth0_request){
			var ttl = this.getLocal('TTL_' + input.trim());
			log('TTL is ' + ttl + ' for ' + input);
			var now = new Date();
		}
		if (auth0_request || (!ttl) || (Date(ttl) < now)){
			log('Auth0 request or TTL expired/not existant. Fetching online..');
			//if it doesnt exist cached or TTL is more than a day old
			var result = this.getDataOnline(input);
			//result = this.convertAPIdata(result);
			if (auth0_request){
				return result;
			} else {
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
			}
		} else {
			log('TTL valid, opening from cache..');
			var local = this.getLocal(input.trim());
			log(local);
			if (local){
				//Safe to use our cached copy
				return local;
			} else {
				//Local db is non existant. Try to fetch online by removing TTL and recursive call.
				log('Local db is empty. Removing TTL and recursive calling myself.');
				this.removeLocal('TTL_' + input.trim());
				return this.getData(input);
			}
		}
	},

	this.getMoreQuestions = function () {
		var categories = this.getCategories();
		categories.forEach(function (entry){
			//Will be cached automagically.
			//NOTE TO MYSELF: what about /random/x ?
			var r = this.getQuestions(entry.id);
		});
		return ((r) && (r.length > 0));
	},
/**
	this.convertAPIdata = function (input) {
		//Converts API JSON to something easier to work with
		var result = [];

		input.questions.forEach(function (entry) {
			//
		});

		return result;
	},
**/
	this.submit = function(url, data) {
		$.post( url, JSON.stringify(data),
		  function( result ) {
		  	log('submit result: ' + result);
		    return result;
		}, "json");
	},

    this.deleteProgress = function(){
        var deferration = $.Deferred();
        $.ajax({
            url: this.userURL + 'reset',
            type: "POST",
            cache: false,
            success: function (data) {
                log('delete result:' +result);
    		    $.jStorage.flush();
            },
            complete: function (){
                deferration.resolve();
            },
        });
    return deferration;
    },

	this.getQuestions = function(catid) {
		//GET secured/category/{id}(/random)
		var r = this.getData(this.categoryURL + catid + '/random/' + '20');
		log('getQuestions for category ' + catid);
		log(r);
		return r;
	},
/**
	this.getQuestion_DEL = function(catid, questionid) {
		//return this.getData(this.questionURL + questionid);
		var result = false;
		this.getQuestions(catid).forEach(function (entry){
			log(entry);
		});
		return result;
	}
**/
	this.getRandomQuestion = function(catid) {
		//return this.getData(this.categoryURL + catid + '/random');
		var all = this.getQuestions(catid);
		if (all && all.length > 0){
			var r = all.questions[Math.floor(Math.random()*all.questions.length)];
			log('Random question;');
			log(r);
		} else {
			log('no random questions available');
			r = false;
		}
		return r;
	},

	this.getCategories = function() {
		return this.getData(this.categoriesURL);
	},


	this.getProfile = function() {
		var profile = this.getData(this.profileURL);
		this.getImage(profile.picture, function(base64Img){
			profile.picture = base64Img;
			log('Set profile.picture to ' + profile.picture);
		});

		return profile;
	},

	this.getCategoryAnswered = function(catid) {
		return this.getData(this.userURL + catid + '/progress');
		//return this.getQuestions(catid); //everything is removed when it is answered
	},


	this.getRandomQuestions = function(catid, count) {
		//return this.getData(this.categoryURL + catid + '/random/' + count);
		var result = [];
		var all = this.getQuestions(catid);
		if (all.questions.length > 0){
			for (i = 0; i < count && i <= all.questions.length; i++) {
				var item = all.questions[Math.floor(Math.random()*all.questions.length)];
				all.questions.splice(all.questions.indexOf(item), 1);
				result.push(item);
			}
		}
		log('random questions:');
		log(result);
		return result;
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
			log('Submitting to server..');
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
				log('Submitted progress.');
				log(data);
			} catch (err) {
				log('Submit failed; ' + err);
				error = true;
			}
			return error;
		} else {
			log('Nothing to submit');
			return true;
		}
	},

	this.removeQuestionFromCache = function (questionid) {
		var all = this.getCategories();
		var done = false;
		all.forEach(function(cat){
			if (!done){
				var cat_id = cat.id;
				var all_question = this.getQuestions(cat_id);
				all_question.forEach(function(question){
					var question_id = question.id;
					if (question.id != questionid){
						new_arr.push(question);
					} else {
						log('question ' + questionid + ' found!');
						//found the category
						done = true;
					}
				});
				if (done){
					//this is the category you're looking for. Replace cached questions with a version without the question
					log('New cached version:');
					log(new_arr);
					this.putLocal(this.categoryURL + cat.id, new_arr);
				}
			}
		});
		return done;
	},

	this.correct = function (questionid) {
		//remove question from cache
		log('Removing question id ' + questionid + ' from cache.');
		//update numbers
		//http://d00med.net/quackr/secured/user/1/progress
		this.removeQuestionFromCache(questionid);

		var solved_arr = this.getLocal('solved');
		if (solved_arr){
			solved_arr.push(questionid);
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
		//update numbers
		//http://d00med.net/quackr/secured/user/1/progress
		//TODO: update wrong

		var wrong = this.getLocal('wrong');
		if (wrong){
			wrong.push(questionid);
			if (this.sendNumbers()){
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
