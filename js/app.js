'use strict';
angular.module('myApp', ['ngRoute', 'ngMaterial'])
    .controller('MainController', ['$scope', '$mdDialog', '$rootScope',
        function ($scope, $mdDialog, $rootScope) {
            $scope.contactNameSearched = [];
            $scope.people = [
                {
                    firstName: "Yair",
                    lastName: "Weisman",
                    phone: "0525292519",
                    email: "yair.weisman@gmail.com"
                },
                {
                    firstName: "Tal",
                    lastName: "Weisman",
                    phone: "0528991209"
                },
                {
                    firstName: "Michal",
                    lastName: "Weisman",
                    company: "EL-AL",
                    phone: "0525675519",
                    email: "michal.weisman13@gmail.com"
                },
                {
                    firstName: "Arik",
                    lastName: "Weisman",
                    company: "IEC",
                    phone: "0523995286",
                    email: "arik_w@bezeqint.net"
                },
                {
                    firstName: "Meirav",
                    lastName: "Weisman",
                    company: "Ministry of Education",
                    phone: "0524440009"
                }
            ];

            $scope.showAdd = function (ev) {
                $mdDialog.show({
                    controller: PersonController,
                    templateUrl: './views/addContact.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    locals: { person : this.person }
                });
            };

            $scope.showEdit = function (index, person, ev) {
                $scope.index = index;
                $mdDialog.show({
                    controller: PersonController,
                    templateUrl: './views/editContact.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    preserveScope: true,
                    clickOutsideToClose: true,
                    locals: { person : this.person }
                });
            };

            function PersonController($scope, $mdDialog, $rootScope, person) {
                $scope.person = person;

                $scope.cancel = function() {
                    $mdDialog.cancel();
                };

                $scope.saveContact = function (contactInfo) {
                    $rootScope.$broadcast("contactToSave",
                        {
                            firstName: contactInfo.newFirstName,lastName: contactInfo.newLastName,company: contactInfo.newCompany,phone: contactInfo.newPhone,email: contactInfo.newEmail
                        }
                    );
                    /*exit dialog*/
                    $mdDialog.cancel();
                };

                $scope.updateContact = function () {
                    $mdDialog.show(
                        $mdDialog.alert()
                            .title('Contact has been updated!')
                            .ok('OK')
                    );
                    $mdDialog.cancel();
                };
            }

            /*get input from form*/
            $scope.$on("contactToSave", function (event, args) {
                $scope.people.push({
                    firstName: args.firstName,
                    lastName: args.lastName,
                    company: args.company,
                    phone: args.phone,
                    email: args.email
                })
            });

            /*pop details*/
            $scope.goToPerson = function(person, event) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title(person.firstName + " " + person.lastName + ' details')
                        .textContent('Company: ' + person.company +
                                    ', Phone Number: '+ person.phone +
                                    ', Email: ' + person.email)
                        .textContent('Company: ' + person.company +
                            ', Phone Number: '+ person.phone +
                            ', Email: ' + person.email)
                        .ariaLabel('Person inspect')
                        .ok('Got it!')
                        .targetEvent(event)
                );
            };

            $scope.deleteContact = function (index, event) {
                var confirm = $mdDialog.confirm()
                    .title('Are you sure you want to delete?')
                    .targetEvent(event)
                    .ok('YES')
                    .cancel('NO');
                $mdDialog.show(confirm).then(function() {
                    $scope.people.splice(index, 1);
                });
            };
        }])

    /*routes*/
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'index.html',
            controller: 'MainController'
        }).otherwise({
            redirectTo: '/home'
        });
    }])

    /*theme*/
    .config(function ($mdThemingProvider) {
        var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });
        $mdThemingProvider.definePalette('customBlue', customBlueMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('customBlue', {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('pink');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey')
    })
