angular.module('flash', [])
    .factory('flash', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
        var messages = [];

        var reset;
        var cleanup = function () {
            $timeout.cancel(reset);
            reset = $timeout(function () {
                messages = [];
            });
        };

        var emit = function () {
            $rootScope.$emit('flash:message', messages, cleanup);
        };

        $rootScope.$on('$locationChangeSuccess', emit);

        var asMessage = function (level, text) {
            if (!text) {
                text = level;
                level = 'success';
            }
            return { level: level, text: text };
        };

        var asArrayOfMessages = function (level, text) {
            if (level instanceof Array) return level.map(function (message) {
                return message.text ? message : asMessage(message);
            });
            return text ? [
                { level: level, text: text }
            ] : [asMessage(level)];
        };

        var flash = function (level, text) {
            emit(messages = asArrayOfMessages(level, text));
        };

        ['danger', 'warning', 'info', 'success'].forEach(function (level) {
            flash[level] = function (text) {
                flash(level, text);
            };
        });

        return flash;
    }])

    .directive('flashMessages', [function () {
        var directive = { restrict: 'EA', replace: true };
        directive.template =
            '<div ng-repeat="m in messages" class="alert alert-dismissable alert-{{m.level}}" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert">' +
            '<span aria-hidden="true">&times;</span>' +
            '<span class="sr-only">Close</span>' +
            '</button>{{m.text}}' +
            '</div>';
        directive.controller = ['$scope', '$rootScope', function ($scope, $rootScope) {
            $rootScope.$on('flash:message', function (_, messages, done) {
                $scope.messages = messages;
                done();
            });
        }];

        return directive;
    }]);