'use strict';

angular.module('medicationReminderApp').directive('medicationTile', function ($http) {
  return {
    templateUrl: 'components/medication-tile/medication-tile.html',
    restrict: 'E',
    scope: {
      medication: '=',
      selectedDate: '=',
      refreshMedications: '&'
    },
    link: function($scope) {
      // Private directive functions
      var getTimeDifference = function() {
        var now = moment(),
            medTime = moment($scope.medication.time);

        return medTime.diff(now, 'minutes');
      };

      // Public template attributes and functions
      $scope.medication.prettyTime = moment($scope.medication.time).format('h:mm a');
      $scope.medication.compelted = true;

      // Helper function to get tile icon based on current time vs med time.
      $scope.tileIcon = function() {
        var timeDifference = getTimeDifference();

        if ($scope.medication.completed) {
          return 'ok';
        } else if (timeDifference > 5) {
          return 'time';
        } else {
          return 'exclamation-sign';
        }
      };

      $scope.showCompleteButton = function() {
        var timeDifference = getTimeDifference();

        return !$scope.medication.completed && timeDifference <= 5;
      };

      // Hit the API and set the med's completed attribute to true.
      $scope.completeMed = function() {
        $http.patch('/api/medications/' + $scope.medication._id, {
          completed: true
        }).then(function () {
          $scope.refreshMedications();
        });
      };
    }
  };
});
