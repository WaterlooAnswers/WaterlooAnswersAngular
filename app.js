/*
Use ng-annotate for build to add Dependency Injection
Annotations. This allows for reduced verbosity in dev.
https://github.com/olov/ng-annotate
*/

/*
$scope is replaced with vm (view model);
ContollerAs syntax is used;
Controllers start with caps;
For more information on best practices:
https://github.com/toddmotto/angularjs-styleguide
*/

(function () {
    angular.module("mainApp", [
        'ngRoute',
        'ngCookies',
        'yaru22.angular-timeago',
        'angular-loading-bar',
        'flash'
    ]);

function config($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login-form.html',
        controller: 'LoginFormCtrl as LoginForm',
        title: 'Login to Waterloo Answers'
    });

    $routeProvider.when('/signup', {
        templateUrl: 'signup.html',
        controller: 'SignUpCtrl as SignUp',
        title: 'Sign Up for Waterloo Answrs'
    });

    $routeProvider.when('/', {
        templateUrl: 'questions.html',
        controller: 'QuestionsCtrl as Questions',
        title: 'View Questions'
    });

    $routeProvider.when('/ask', {
        templateUrl: 'askquestion.html',
        controller: 'AskCtrl as Ask',
        title: 'Ask a Question'
    });

    $routeProvider.when('/question/:questionId', {
        templateUrl: 'singlequestion.html',
        controller: 'QuestionCtrl as Question',
        title: 'Waterloo Answers'
    });

    $routeProvider.when('/categories', {
        templateUrl: 'category.html',
        controller: 'CategoryCtrl as Category',
        title: 'Waterloo Answers'
    });

    $routeProvider.when('/profile', {
        templateUrl: 'profile.html',
        controller: 'ProfileCtrl as Profile',
        title: 'Your Profile'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
}

function run ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.hasOwnProperty('$$route')) {
            $rootScope.title = current.$$route.title;
        }
    });
}

function NavbarCtrl ($scope, Auth) {
    var vm = this;

    vm.firstName = Auth.getFirstName;
    vm.isLoggedIn = function(){
        return Auth.getToken().length > 0;
    };
     vm.logout = function(){
        Auth.logout();
    };
};

function LoginFormCtrl ($scope, $location, Auth, flash) {
    var vm = this;

	$scope.submit = function() {
        Auth.setToken(vm.username, vm.password, function (error) {
            if (!error) {
                flash("You've logged in!");
				$location.path("/questions");
            } else {
                flash("danger", error);
            }
		});
	};
};

function SignUpCtrl ($scope, $location, Auth, API, flash) {
    var vm = this;

    $scope.submit = function () {
        API.signUp(vm.email, vm.password, vm.firstName).success(function (data) {
            flash("You've signed up!");
            Auth.storeToken(data.token);
            Auth.storeFirstName(data.firstName);
            $location.path("/profile");
        }).error(function (data) {
            flash("danger", data.error);
        });
    }
};

function QuestionsCtrl ($scope, API, $location, Auth) {
    var vm = this;

    if (Auth.getToken().length < 1) {
        $location.path("/login");
    }
	var currentTab = 1;
	vm.questions = [];
    vm.categories = [];
    API.getQuestions().success(function (data) {
		vm.questions = data;
	});

	vm.switchTab = function(tab) {
		if(currentTab != tab){
			currentTab = tab;
            if (currentTab === 3) {
                API.getCategories().success(function (data) {
                    vm.categories = data;
                    $rootScope.categories = data;
                    vm.questions = [];
                });
            } else {
                API.getQuestions().success(function (data) {
                    vm.questions = data;
                    vm.categories = [];
                });
            }
		}
    };

	vm.isActive = function(tab) {
		return currentTab == tab;
	}

};

function CategoryCtrl ($scope, $rootScope, $routeParams, API, $location, Auth) {
    var vm = this;

    if (Auth.getToken().length < 1) {
        $location.path("/login");
    }
    vm.categoryName = $routeParams.categoryName;
    if ($rootScope.categories == null) {
        API.getCategories().success(function (data) {
            $rootScope.categories = data;
            console.log(data);
            vm.questions = [];
            var result = $.grep($rootScope.categories, function (e) {
                return e.categoryName == vm.categoryName;
            })[0].categoryId;
            console.log(result);
            API.getQuestionsForCategory(result).success(function (data) {
                vm.questions = data;
            });
        });
    } else {
        vm.questions = [];
        var result = $.grep($rootScope.categories, function (e) {
            return e.categoryName == vm.categoryName;
        })[0].categoryId;
        API.getQuestionsForCategory(result).success(function (data) {
            vm.questions = data;
        });
    }
};

function QuestionCtrl($scope, $routeParams, API, Auth, flash) {
    var vm = this;

    function onLoad() {
        API.getQuestion($routeParams.questionId).success(function (data) {
            vm.question = data;
            console.log(data);
        }).error(function (data) {
            //TODO handle error
            flash("danger", data.error);
        });
    }

    onLoad();

    vm.submitAnswer = function () {
        API.postAnswer(vm.question.questionId, vm.answerBody, Auth.getToken()).success(function () {
            flash("Posted new answer! Thank you!");
            onLoad();
            vm.answerBody = null;
        }).error(function (data) {
            flash("danger", data.error);
        });
    }
};

function AskCtrl ($scope, Auth, API, flash) {
    var vm = this;

    vm.submit = function () {
        //TODO assure that each value is selected/filled out correctly
        API.postQuestion(vm.title, vm.description, vm.categoryChoice, Auth.getToken()).success(function (data, status) {
            //TODO redirect to the individual question with a flash message
        }).error(function (data) {
            flash("danger", data.error);
        });
    };

    vm.categories = [];
    API.getCategories().success(function (data) {
        vm.categories = data;
        $rootScope.categories = data;
    }).error(function () {
        vm.categories.push({categoryId: -1, categoryName: "error, reload page"});
    });
};

function ProfileCtrl ($scope, Auth, API) {
    var vm = this;

    vm.user = {};
    vm.questions = [];
    vm.answers = [];

    API.getUser(Auth.getToken()).success(function (data) {
        vm.user.firstName = data.firstName || "";
        vm.user.email = data.email;
        vm.user.dateJoined = data.dateJoined;
        vm.questions = data.questionsAsked;
        vm.answers = data.answersGiven;
    });

};

function navbar(){
	return {
		restrict: 'E',
		templateUrl:'navbar.html'
	};
};

angular
    .module("mainApp")
    .config(config)
    .run(run)

    .controller('NavbarCtrl', NavbarCtrl)
    .controller('LoginFormCtrl', LoginFormCtrl)
    .controller('SignUpCtrl', SignUpCtrl)
    .controller('QuestionsCtrl', QuestionsCtrl)
    .controller('CategoryCtrl', CategoryCtrl)
    .controller('QuestionCtrl', QuestionCtrl)
    .controller('AskCtrl', AskCtrl)
    .controller('ProfileCtrl', ProfileCtrl)

    .directive('navbar', navbar);
}();


