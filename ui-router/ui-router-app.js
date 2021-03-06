'use strict';

var myModuleConfig = function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'views/home.html'
    }).state('hello', {
        url: '/hello',
        templateUrl: 'views/hello.html'
    }).state('about', {
        url: '/about',
        templateUrl: 'views/about.html'
    }).state('contact', {
        url: '/contact',
        templateUrl: 'views/contact.html'
    }).state('products', {
        url: '/products',
        templateUrl: 'views/products/productsIndex.html',
        controller: 'productsController'
    }).state('products.products-add', {
        url: '/add',
        templateUrl: 'views/products/productsAdd.html',
        controller: 'productsAddController'
    }).state('products.products-edit', {
        url: '/edit/:id',
        templateUrl: 'views/products/productsEdit.html',
        controller: 'productsEditController'
    });
};
myModuleConfig.$inject = ["$stateProvider", "$urlRouterProvider"];

// service $http

var productsService = function ($http) {
    return ({
        getAllProduits: getAllProduits,
        addProduit: addProduit,
        deleteProduit: deleteProduit,
        getProduitById: getProduitById,
        updateProduit: updateProduit
    });

    function getAllProduits() {
        return $http.get("http://carla.naxidia.com:8083/api/produits");
    }

    function addProduit(produit) {
        return $http.post("http://carla.naxidia.com:8083/api/produits", produit);
    }

    function deleteProduit(id) {
        return $http.delete("http://carla.naxidia.com:8083/api/produits/" + id);
    }

    function getProduitById(id) {
        return $http.get("http://carla.naxidia.com:8083/api/produits/" + id);
    }

    function updateProduit(produit) {
        return $http.put("http://carla.naxidia.com:8083/api/produits/", produit);
    }
};
productsService.$inject = ["$http"];


// Les contrôleurs

var routerCtrl = function ($scope, $state) {
    $scope.redirect = function () {
        $state.go('contact');
    }
};
routerCtrl.$inject = ["$scope", "$state"];

var productsController = function (productsService, $scope, $state, $mdToast) {
    // Afficher la liste des produits
    productsService.getAllProduits()
        .then(function (response) {
            $scope.produits = response.data;
        }, function (response) {
            $scope.produits = response.status + ' : ' + response.statusText;
        });

    // Supprimer un produit
    $scope.deleteProduct = function (id, index) {
        if (confirm('Ëtes-vous sûr de vouloir supprimer ' + $scope.produits[index].libelle + ' ?')) {
            productsService.deleteProduit(id)
                .then(
                    function (response) {
                        $state.go('products', {}, {reload: true});
                        console.log('Success');

                        // Afficher une notification avec mdToast
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Produit ' + $scope.produits[index].libelle + ' supprimé !')
                                .position('bottom right')
                                .hideDelay(6000)
                        );
                    },
                    function (response) {
                        console.log(response.status + ' : ' + response.statusText);
                    }
                );
        }
    }
};
productsController.$inject = ["productsService", "$scope", "$state", "$mdToast"];

var productsAddController = function (productsService, $scope, $state, $mdToast) {
    // Ajouter un produit
    $scope.addProduct = function (valid) {
        $scope.$broadcast('show-errors-check-validity');
        if (valid) {
            productsService.addProduit($scope.produit)
                .then(function (response) {
                    $state.go('products', {}, {reload: true});
                    console.log(response.data);

                    // Afficher une notification avec mdToast
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Produit ' + response.data.libelle + '  ajouté !')
                            .position('bottom right')
                            .hideDelay(6000)
                    );
                }, (function (response) {
                        console.log(response.status + ' : ' + response.statusText);
                    }
                ))
        }
    }
};
productsAddController.$inject = ["productsService", "$scope", "$state", "$mdToast"];

var productsEditController = function (productsService, $scope, $state, $stateParams, $mdToast) {
    // Récupérer un produit et l'afficher dans le formulaire de modification
    $scope.produit = {};
    productsService.getProduitById($stateParams.id)
        .then(function (response) {
            angular.copy(response.data, $scope.produit);
        }, function (response) {
            console.log(response.status + ' : ' + response.statusText);
        });
    // Modifier un produit
    $scope.editProduct = function (valid) {
        $scope.$broadcast('show-errors-check-validity');
        if (valid) {
            productsService.updateProduit($scope.produit)
                .then(
                    function (response) {
                        $state.go('products', {}, {reload: true});
                        console.log(response.data);

                        // Afficher une notification avec mdToast
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Produit ' + response.data.libelle + '  modifié !')
                                .position('bottom right')
                                .hideDelay(6000)
                        );
                    },
                    function (response) {
                        console.log(response.status + ' : ' + response.statusText);
                    }
                );
        }
    }
};
productsEditController.$inject = ["productsService", "$scope", "$state", "$stateParams", "$mdToast"];

// Initialisation du module
angular.module("myApp", ['ui.router', 'ngMaterial', 'ui.bootstrap.showErrors'])
    .config(myModuleConfig)
    .factory("productsService", productsService)
    .controller("routerCtrl", routerCtrl)
    .controller("productsController", productsController)
    .controller("productsAddController", productsAddController)
    .controller("productsEditController", productsEditController);


// Première syntaxe

// var myApp = angular.module('myApp', ['ui.router', 'ngMaterial', 'ui.bootstrap.showErrors']).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
//     $urlRouterProvider.otherwise("/");
//     $stateProvider.state('home', {
//         url: '/',
//         templateUrl: 'views/home.html'
//     }).state('hello', {
//         url: '/hello',
//         templateUrl: 'views/hello.html'
//     }).state('about', {
//         url: '/about',
//         templateUrl: 'views/about.html'
//     }).state('contact', {
//         url: '/contact',
//         templateUrl: 'views/contact.html'
//     }).state('products', {
//         url: '/products',
//         templateUrl: 'views/products/productsIndex.html',
//         controller: 'productsController'
//     }).state('products.products-add', {
//         url: '/add',
//         templateUrl: 'views/products/productsAdd.html',
//         controller: 'productsAddController'
//     }).state('products.products-edit', {
//         url: '/edit/:id',
//         templateUrl: 'views/products/productsEdit.html',
//         controller: 'productsEditController'
//     });
// }]);
//
// myApp.controller('routerCtrl', function ($scope, $state) {
//     $scope.redirect = function () {
//         $state.go('contact');
//     }
// });
//
// myApp.controller('productsController', function ($scope, $http, $state, $mdToast) {
//     // Afficher la liste des produits
//     $http.get('http://carla.naxidia.com:8083/api/produits')
//         .then(function (response) {
//             $scope.produits = response.data;
//         }, function (response) {
//             $scope.produits = response.status + ' : ' + response.statusText;
//         });
//
//     // Supprimer un produit
//     $scope.deleteProduct = function (id, index) {
//         if (confirm('Ëtes-vous sûr de vouloir supprimer ' + $scope.produits[index].libelle + ' ?')) {
//             $http.delete('http://carla.naxidia.com:8083/api/produits/' + id)
//                 .then(
//                     function (response) {
//                         $state.go('products', {}, {reload: true});
//                         console.log('Success');
//
//                         // Afficher une notification avec mdToast
//                         $mdToast.show(
//                             $mdToast.simple()
//                                 .textContent('Produit ' + $scope.produits[index].libelle + ' supprimé !')
//                                 .position('bottom right')
//                                 .hideDelay(6000)
//                         );
//                     },
//                     function (response) {
//                         console.log(response.status + ' : ' + response.statusText);
//                     }
//                 );
//         }
//     }
// });
//
// myApp.controller('productsAddController', function ($scope, $http, $state, $mdToast) {
//     // Ajouter un produit
//     $scope.addProduct = function (valid) {
//         $scope.$broadcast('show-errors-check-validity');
//         if (valid) {
//             $http.post('http://carla.naxidia.com:8083/api/produits', $scope.produit)
//                 .then(function (response) {
//                     $state.go('products', {}, {reload: true});
//                     console.log(response.data);
//
//                     // Afficher une notification avec mdToast
//                     $mdToast.show(
//                         $mdToast.simple()
//                             .textContent('Produit ' + response.data.libelle + '  ajouté !')
//                             .position('bottom right')
//                             .hideDelay(6000)
//                     );
//                 }, (function (response) {
//                         console.log(response.status + ' : ' + response.statusText);
//                     }
//                 ))
//         }
//     }
// });
//
// myApp.controller('productsEditController', function ($scope, $http, $state, $stateParams, $mdToast) {
//     // Récupérer un produit et l'afficher dans le formulaire de modification
//     $scope.produit = {};
//     $http.get('http://carla.naxidia.com:8083/api/produits/' + $stateParams.id)
//         .then(function (response) {
//             angular.copy(response.data, $scope.produit);
//         }, function (response) {
//             console.log(response.status + ' : ' + response.statusText);
//         });
//     // Modifier un produit
//     $scope.editProduct = function (valid) {
//         $scope.$broadcast('show-errors-check-validity');
//         if (valid) {
//             $http.put('http://carla.naxidia.com:8083/api/produits/', $scope.produit)
//                 .then(
//                     function (response) {
//                         $state.go('products', {}, {reload: true});
//                         console.log(response.data);
//
//                         // Afficher une notification avec mdToast
//                         $mdToast.show(
//                             $mdToast.simple()
//                                 .textContent('Produit ' + response.data.libelle + '  modifié !')
//                                 .position('bottom right')
//                                 .hideDelay(6000)
//                         );
//                     },
//                     function (response) {
//                         console.log(response.status + ' : ' + response.statusText);
//                     }
//                 );
//         }
//     }
// });