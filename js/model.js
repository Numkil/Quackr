var Model = function () {

	this.getData = function(input) {
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
		return this.getData(this.profileURL);
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
	},

	this.correct = function (questionid) {
		//TODO
	}

	this.incorrect = function (questionid) {
		//TODO
	}

	this.initialize = function () {
	// Model constructor
		this.setupURLs();
	},

	this.initialize();
};