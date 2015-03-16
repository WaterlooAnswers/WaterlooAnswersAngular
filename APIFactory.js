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

    dataFactory.getQuestionsForCategory = function (id) {
        return $http({
            method: 'GET',
            url: urlBase + '/questions?categoryId=' + id,
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
            data: {
                questionTitle: questionTitle,
                questionDescription: questionDescription,
                categoryIndex: categoryIndex,
                token: token
            }
        });
    };

    dataFactory.postAnswer = function (questionId, answerBody, token) {
        return $http({
            method: 'POST',
            url: urlBase + '/answers',
            data: {
                questionId: questionId,
                answerBody: answerBody,
                token: token
            }
        });
    };

    return dataFactory;
});