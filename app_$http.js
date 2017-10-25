var app = angular.module('myApp', ['ui.bootstrap.showErrors']);
app.controller('produitsController', function ($scope, $http) {
    $scope.produit = {}; //utile pour copyProduct

    // Afficher la liste des produits
    $http.get('http://carla.naxidia.com:8083/api/produits')
        .then(function (response) {
            $scope.produits = response.data;
        }, function (response) {
            $scope.produits = response.statusText;
        });

    // Ajouter un produit
    $scope.addProduct = function (valid) {
        $scope.$broadcast('show-errors-check-validity');
        if (valid) {
            if ($scope.produit.id == null) {
                $http.post('http://carla.naxidia.com:8083/api/produits', $scope.produit)
                    .then(function (response) {
                        $scope.addSuccess = 'Produit ajouté';
                        $scope.$broadcast('show-errors-reset');
                        //Ajouter l'id de $scope.produit à partir de la BDD
                        $scope.produit.id = response.data.id;
                        // Ajouter le produit en live (sans actualiser la page)
                        $scope.produits.unshift($scope.produit);

                        $scope.form1 = {}; //ne peut pas ajouter un autre produit sans actualiser la page

                        // Vider le formulaire après l'ajout pour qu'on puisse ajouter d'autres produits
                        $scope.produit = {};

                    }, (function (response) {
                            // En cas d'erreur lors de l'ajout, l'erreur s'affiche
                            $scope.addError = response.status + ' : ' + response.statusText;
                        }
                    ))
            } else {
                // Ce bout de code est pour la modification (id!=null)
                $http.put('http://carla.naxidia.com:8083/api/produits/', $scope.produit)
                    .then(
                        function (response) {
                            $scope.modifySuccess = "Produit " + $scope.produit.libelle + " modifié.";
                            // Modifier le produit en live (sans actualiser la page)
                            var index = _.findIndex($scope.produits, {'id': $scope.produit.id});
                            angular.copy($scope.produit, $scope.produits[index]);
                        },
                        function (response) {
                            // En cas d'erreur lors de l'ajout, l'erreur s'affiche
                            $scope.modifyError = response.status + ' : ' + response.statusText;
                        }
                    );
            }
        }
    }

    // Supprimer un produit
    $scope.deleteProduct = function (id, index) {
        if (confirm('Ëtes-vous sûr de vouloir supprimer ' + $scope.produits[index].libelle + '?')) {
            $http.delete('http://carla.naxidia.com:8083/api/produits/' + id)
                .then(
                    function (response) {
                        $scope.addSuccess = 'Produit ' + $scope.produits[index].libelle + ' supprimé';
                        // Supprimer le produit en live (sans actualiser la page)
                        $scope.produits.splice(index, 1);
                    },
                    function (response) {
                        // En cas d'erreur lors de la suppression, l'erreur s'affiche
                        $scope.addError = response.status + ' : ' + response.statusText;
                    }
                );
        }
    }

    // Copier les données d'un produit dans le formulaire de modification
    $scope.copyProduct = function (index) {
        angular.copy($scope.produits[index], $scope.produit);
    };

});