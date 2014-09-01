/**
 * Created by Sahil Jain on 16/08/2014.
 */
var app = angular.module("mainApp");
app.factory('API', function ($http) {
    var urlBase = "/api";

    var dataFactory = {};

    dataFactory.getToken = function (username, password) {
        return $http({
            method: 'POST',
            url: urlBase + '/login',
            params: {email: username, password: password}
        });
    };

    dataFactory.signUp = function (email, password, firstName) {
        return $http({
            method: 'POST',
            url: urlBase + '/signup',
            params: {email: email, password: password, firstName: firstName}
        });
    };

    dataFactory.getUser = function (token) {
        return $http.get(urlBase + '/user?token=' + token); //TODO add params using angular, not concat
    };

    dataFactory.getQuestions = function () {
        return $http({
            method: 'GET',
            url: urlBase + '/questions',
            params: {}
        });
    };

    dataFactory.getQuestion = function (questionId) {
        return $http.get(urlBase + '/questions/' + questionId);
    };

    dataFactory.getCategories = function () {
        return $http.get(urlBase + '/categories');
    };

    dataFactory.postQuestion = function (questionTitle, questionDescription, categoryIndex, token) {
        return $http({
            method: 'POST',
            url: urlBase + '/questions',
            data: $.param({
                questionTitle: questionTitle,
                questionDescription: questionDescription,
                categoryIndex: categoryIndex,
                token: token
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        });
    };

    dataFactory.postAnswer = function (questionId, answerBody, token) {
        return $http({
            method: 'POST',
            url: urlBase + '/answers',
            data: $.param({
                questionId: questionId,
                answerBody: answerBody,
                token: token
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        });
    };

    return dataFactory;
});