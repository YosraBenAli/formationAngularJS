var myApp = angular.module('helloworld', ['ui.router', 'ngMaterial']);

myApp.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    var homeState = {
        name: 'home',
        url: '/',
        templateUrl: 'views/home.html'
    }

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
        templateUrl: 'views/contact.html',
    }

    var productsState = {
        name: 'products',
        url: '/productss',
        templateUrl: 'views/products.html',
        controller: 'productsController'
    }

    $stateProvider.state(homeState);
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

myApp.controller('productsController', function ($scope, $http, $state, $mdToast) {
    // Afficher la liste des produits
    $http.get('http://carla.naxidia.com:8083/api/produits')
        .then(function (response) {
            $scope.produits = response.data;
        }, function (response) {
            $scope.produits = response.statusText;
        });

    // Supprimer un produit
    $scope.deleteProduct = function (id, index) {
        if (confirm('Ëtes-vous sûr de vouloir supprimer ' + $scope.produits[index].libelle + '?')) {

            $http.delete('http://carla.naxidia.com:8083/api/produits/' + id)
                .then(
                    function (response) {
                        console.log('Success');
                        $state.go('products', {}, {reload: true});

                        // Afficher une notification avec mdToast
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Produit ' + $scope.produits[index].libelle + ' supprimé !')
                                .position('top right')
                                .hideDelay(7000)
                        );
                    },
                    function (response) {
                        console.log('Error');
                    }
                );
        }
    }
});