/**
 * Created by Sahil Jain on 16/08/2014.
 */
var app = angular.module("mainApp");

app.service('Auth', ['API', '$cookieStore', '$location', function (API, $cookieStore, $location) {
    var token = "";
    var firstName = "";

    this.storeToken = function (token) {
        $cookieStore.put('token', token);
    };

    this.storeFirstName = function (firstName) {
        $cookieStore.put('firstName', firstName);
    };

    this.setToken = function (username, password, done) {
        API.getToken(username, password).success(function (data) {
            token = data.token;
            console.log(token);
            $cookieStore.put('token', token);
            API.getUser(token).success(function (data) {
                firstName = data.firstName;
                $cookieStore.put('firstName', firstName);
                return done();
            }).error(function (data) {
                $cookieStore.remove('token');
                $cookieStore.remove('firstName');
                return done(data.error);
            });
        }).error(function (data) {
            return done(data.error);
        });
    };

    this.getToken = function () {
        return $cookieStore.get('token') || "";
    };
    this.getFirstName = function () {
        return $cookieStore.get('firstName') || "";
    };
    this.logout = function () {
        $cookieStore.remove('token');
        $cookieStore.remove('firstName');
        $location.path("/login");
    };
}]);