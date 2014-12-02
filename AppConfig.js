/**
 * Created by Sahil Jain on 16/08/2014.
 */
var app = angular.module("mainApp");

app.config(function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'login-form.html',
        controller: 'loginFormController',
        title: 'Login to Waterloo Answers'
    });

    $routeProvider.when('/signup', {
        templateUrl: 'signup.html',
        controller: 'signUpController',
        title: 'Sign Up for Waterloo Answrs'
    });

    $routeProvider.when('/', {
        templateUrl: 'questions.html',
        controller: 'questionsController',
        title: 'View Questions'
    });

    $routeProvider.when('/ask', {
        templateUrl: 'askquestion.html',
        controller: 'askController',
        title: 'Ask a Question'
    });

    $routeProvider.when('/question/:questionId', {
        templateUrl: 'singlequestion.html',
        controller: 'questionController',
        title: 'Waterloo Answers'
    });

    $routeProvider.when('/categories', {
        templateUrl: 'category.html',
        controller: 'categoryController',
        title: 'Waterloo Answers'
    });

    $routeProvider.when('/profile', {
        templateUrl: 'profile.html',
        controller: 'profileController',
        title: 'Your Profile'
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });
});

app.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.hasOwnProperty('$$route')) {
            $rootScope.title = current.$$route.title;
        }
    });
}]);