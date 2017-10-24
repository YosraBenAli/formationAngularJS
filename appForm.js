var app = angular.module('myApp', ['ui.bootstrap.showErrors']);

app.controller('studentController', function ($scope) {
    $scope.students = [
        {id: 1, firstName: 'Jack', lastName: 'Peterson', age: 17},
        {id: 2, firstName: 'Mary', lastName: 'Brown', age: 16},
        {id: 3, firstName: 'Jane', lastName: 'Doe', age: 19}
    ];
    $scope.student = {}; // initialise $scope , nécessaire pour la fonction editStudent

    // Ajouter un student
    $scope.addStudent = function (valid) {
        $scope.$broadcast('show-errors-check-validity');
        if (valid) {
            if ($scope.student.id == null) {
                $scope.student.id = new Date().getMilliseconds();
                $scope.students.push($scope.student);
                $scope.alert = 'Student added.';
                $scope.$broadcast('show-errors-reset');
                // Vider le formulaire après l'ajout
                $scope.student = {};

                //$scope.form1 = {}; ne peut pas ajouter un autre student sans actualiser la page

            } else {
                var index = _.findIndex($scope.students, {'id': $scope.student.id});
                angular.copy($scope.student, $scope.students[index]);
                $scope.alert = "Student's data updated.";
                $scope.$broadcast('show-errors-reset');
                // Vider le formulaire après la mise à jour
                $scope.student = {};

                //$scope.form1 = {}; ne peut pas mettre à jour les données d'un autre student sans actualiser la page
            }
        }
    };

    // Modifier les données d'un student
    $scope.editStudent = function (index) {
        angular.copy($scope.students[index], $scope.student);
    };

    // Supprimer un student
    $scope.deleteStudent = function (index) {
        if (confirm('Are you sure you want to remove ' + $scope.students[index].firstName + ' ' + $scope.students[index].lastName + ' ?')) {
            $scope.students.splice(index, 1);
            $scope.alert = 'Student deleted.';
        }
    }
});