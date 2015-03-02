var app = angular.module("mainApp", ['ngRoute', 'ngCookies', 'yaru22.angular-timeago', 'angular-loading-bar', 'flash']);

app.controller('navbarController', ['$scope', 'Auth', function($scope, Auth) {
		$scope.firstName = Auth.getFirstName;
		$scope.isLoggedIn = function(){
			return Auth.getToken().length > 0;
		};
        $scope.isLoggedOut = function(){
            return !Auth.getToken().length >0;
        }
		$scope.logout = function(){
			Auth.logout();
		};
}]);

app.controller("loginFormController", function ($scope, $location, Auth, flash) {
	$scope.submit = function() {
        Auth.setToken($scope.username, $scope.password, function (error) {
            if (!error) {
                flash("You've logged in!");
				$location.path("/questions");
            } else {
                flash("danger", error);
            }
		});
	};
});

app.controller("signUpController", function ($scope, $location, Auth, API, flash) {
    $scope.submit = function () {
        API.signUp($scope.email, $scope.password, $scope.firstName).success(function (data) {
            flash("You've signed up!");
            Auth.storeToken(data.token);
            Auth.storeFirstName(data.firstName);
            $location.path("/profile");
        }).error(function (data) {
            flash("danger", data.error);
        });
    }
});

app.controller('questionsController', function ($scope, API, $location, Auth) {
    if (Auth.getToken().length < 1) {
        $location.path("/login");
    }
	var currentTab = 1;
	$scope.questions = [];
    $scope.categories = [];
    API.getQuestions().success(function (data) {
		$scope.questions = data;
	});

	$scope.switchTab = function(tab) {
		if(currentTab != tab){
			currentTab = tab;
            if (currentTab === 3) {
                API.getCategories().success(function (data) {
                    $scope.categories = data;
                    $rootScope.categories = data;
                    $scope.questions = [];
                });
            } else {
                API.getQuestions().success(function (data) {
                    $scope.questions = data;
                    $scope.categories = [];
                });
            }
		}
    };

	$scope.isActive = function(tab) {
		return currentTab == tab;
	}

});

app.controller('categoryController', function ($scope, $rootScope, $routeParams, API, $location, Auth) {
    if (Auth.getToken().length < 1) {
        $location.path("/login");
    }
    $scope.categoryName = $routeParams.categoryName;
    if ($rootScope.categories == null) {
        API.getCategories().success(function (data) {
            $rootScope.categories = data;
            console.log(data);
            $scope.questions = [];
            var result = $.grep($rootScope.categories, function (e) {
                return e.categoryName == $scope.categoryName;
            })[0].categoryId;
            console.log(result);
            API.getQuestionsForCategory(result).success(function (data) {
                $scope.questions = data;
            });
        });
    } else {
        $scope.questions = [];
        var result = $.grep($rootScope.categories, function (e) {
            return e.categoryName == $scope.categoryName;
        })[0].categoryId;
        API.getQuestionsForCategory(result).success(function (data) {
            $scope.questions = data;
        });
    }


});

app.controller('questionController', function ($scope, $routeParams, API, Auth, flash) {
    function onLoad() {
        API.getQuestion($routeParams.questionId).success(function (data) {
            $scope.question = data;
            console.log(data);
        }).error(function (data) {
            //TODO handle error
            flash("danger", data.error);
        });
    }

    onLoad();

    $scope.submitAnswer = function () {
        API.postAnswer($scope.question.questionId, $scope.answerBody, Auth.getToken()).success(function () {
            flash("Posted new answer! Thank you!");
            onLoad();
            $scope.answerBody = null;
        }).error(function (data) {
            flash("danger", data.error);
        });
    }
});

app.controller('askController', function ($scope, Auth, API, flash) {
    $scope.submit = function () {
        //TODO assure that each value is selected/filled out correctly
        API.postQuestion($scope.title, $scope.description, $scope.categoryChoice, Auth.getToken()).success(function (data, status) {
            //TODO redirect to the individual question with a flash message
        }).error(function (data) {
            flash("danger", data.error);
        });
    };

    $scope.categories = [];
    API.getCategories().success(function (data) {
        $scope.categories = data;
        $rootScope.categories = data;
    }).error(function () {
        $scope.categories.push({categoryId: -1, categoryName: "error, reload page"});
    });
});

app.controller('profileController', function ($scope, Auth, API) {

    $scope.user = {};
    $scope.questions = [];
    $scope.answers = [];

    API.getUser(Auth.getToken()).success(function (data) {
        $scope.user.firstName = data.firstName || "";
        $scope.user.email = data.email;
        $scope.user.dateJoined = data.dateJoined;
        $scope.questions = data.questionsAsked;
        $scope.answers = data.answersGiven;
    });

});

app.directive('navbar', function(){
	return {
		restrict: 'E',
		templateUrl:'navbar.html'
	};
});