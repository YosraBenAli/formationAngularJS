var myApp = angular.module('helloworld', ['ui.router']);


myApp.config(function ($stateProvider) {
    var helloState = {
        name: 'hello',
        url: '/helloo',
        templateUrl: 'views/hello.html'
    }

    var aboutState = {
        name: 'about',
        url: '/aboutt',
        templateUrl: 'views/about.html'
    }

    var contactState = {
        name: 'contact',
        url: '/contactt',
        templateUrl: 'views/contact.html'
    }

    var productsState = {
        name: 'products',
        url: '/productss',
        templateUrl: 'views/products.html',
        controller: 'productsController'
    }

    $stateProvider.state(helloState);
    $stateProvider.state(aboutState);
    $stateProvider.state(contactState);
    $stateProvider.state(productsState);


});

myApp.controller('routerCtrl', function ($scope, $state) {

    $scope.redirect = function () {
        $state.go('contact');

    }
});

myApp.controller('productsController', function ($scope, $http) {
    // Afficher la liste des produits
    $http.get('http://carla.naxidia.com:8083/api/produits')
        .then(function (response) {
            $scope.produits = response.data;
        }, function (response) {
            $scope.produits = response.statusText;
        });
});