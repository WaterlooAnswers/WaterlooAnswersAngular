var app = angular.module("mainApp", ['ngRoute', 'ngCookies', 'yaru22.angular-timeago']);

app.config(function ($routeProvider) {
	$routeProvider.when('/login', {
		templateUrl: 'login-form.html',
		controller: 'loginFormController'
	});

	$routeProvider.when('/questions', {
		templateUrl: 'questions.html',
		controller: 'questionsController'
	});

	$routeProvider.otherwise({
		redirectTo: '/login'
	});
});

app.factory('API', function($http) {
	var urlBase = "http://localhost:8080/api";

	var dataFactory = {};

	dataFactory.getToken = function(username, password) {
		return $http({
        	method: 'POST',
        	url: urlBase + '/login',
        	params: {email: username, password: password}
     	});
	};

	dataFactory.getUser = function(token) {
		return $http.get(urlBase + '/user?token=' + token);
	}

	dataFactory.getQuestions = function() {
		return $http.get(urlBase + '/questions')
	}

	return dataFactory;
});

app.service('Auth', ['API', '$cookieStore', '$location', function(API, $cookieStore, $location) {
	var token = "";
	var firstName = "";
	this.setToken = function(username, password, done) {
    	API.getToken(username, password).success(function(data, status){
     		token = data.token;
     		$cookieStore.put('token', token);
     		API.getUser(token).success(function(data) {
     			firstName = data.firstName;
     			$cookieStore.put('firstName', firstName);
     			done();
     		});
    	}).error(function(data, status){
        	if (status == 401) {
        		//handle this
        	}
    	});
 	};
 	this.getToken = function() {
 		return $cookieStore.get('token') || "";
 	};
 	this.getFirstName = function() {
 		return $cookieStore.get('firstName') || "";
 	};
 	this.logout = function() {
 		$cookieStore.remove('token');
 		$cookieStore.remove('firstName');
 		$location.path("/login");
 	};
}]);

app.controller('navbarController', ['$scope', 'Auth', function($scope, Auth) {
		$scope.firstName = Auth.getFirstName;
		$scope.isLoggedIn = function(){
			return Auth.getToken().length > 0;
		};
		$scope.logout = function(){
			Auth.logout();
		};
}]);

app.controller("loginFormController", function($scope, $location, Auth){
	$scope.submit = function() {
		Auth.setToken($scope.username, $scope.password, function() {
			if (Auth.getToken().length > 0) {
				console.log("redirect now");
				$location.path("/questions");
			}	
		});
	};

});

app.controller('questionsController', function($scope, API) {
	var currentTab = 1;
	$scope.questions = [];
	API.getQuestions().success(function(data, status) {
		$scope.questions = data;
	});

	$scope.switchTab = function(tab) {
		if(currentTab != tab){
			currentTab = tab;
			API.getQuestions().success(function(data, status) {
				$scope.questions = data;
			});
		}
	}

	$scope.isActive = function(tab) {
		return currentTab == tab;
	}

});

app.directive('navbar', function(){
	return {
		restrict: 'E',
		templateUrl:'navbar.html'
	};
});