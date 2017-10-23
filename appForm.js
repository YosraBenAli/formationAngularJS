var app = angular.module('myApp',['ui.bootstrap.showErrors']);

app.controller('studentController', function($scope) {
     $scope.students = [
        { id : 1, firstName : 'Jack', lastName : 'Peterson', age : 17},
        { id : 2, firstName : 'Mary', lastName : 'Brown', age : 16},
        { id : 3, firstName : 'Jane', lastName : 'Doe', age : 19}
    ];
     $scope.student = {}; // initialise $scope , nécessaire pour la fonction editStudent

    // Ajouter un student
    $scope.addStudent = function(isValid) {
        $scope.$broadcast('show-errors-check-validity');
        if (isValid) {
            if($scope.student.id == null){
                $scope.student.id = new Date().getMilliseconds();
                $scope.students.push($scope.student);
                $scope.alert = 'Student added.';
                $scope.$broadcast('show-errors-reset');

                // Vider le formulaire après l'ajout
                $scope.student = {};
                //$scope.form1 = {};

            } else {
                var index = _.findIndex($scope.students, {'id': $scope.student.id});
                angular.copy($scope.student, $scope.students[index]);
                $scope.alert = "Student's data updated.";

                // vider le formulaire après la mise à jour
                $scope.student = {};
            }
        }
    };

    // Modifier les données d'un student
    $scope.editStudent = function(index) {
        angular.copy($scope.students[index], $scope.student);
    };

    // Supprimer un student
    $scope.deleteStudent = function(index) {
        $scope.students.splice(index, 1);
        $scope.alert = 'Student deleted.';
    }
});