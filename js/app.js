// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
//$(document).foundation();

var launcherMakerApp = angular.module('launcherMakerApp', [
    'mm.foundation',
    'angularFileUpload'
]);

launcherMakerApp.controller('LauncherController', function ($scope, $modal) {
  'use strict';
  $scope.rawIcons = [];

  $scope.addImage = function() {
    var modalInstance = $modal.open({
      templateUrl: 'views/addImageModal.html',
        controller: 'AddImageModalController',
        resolve: {
          data: function () {
            return $scope.data;
          }
        }
    });

    modalInstance.result.then(function (imageData) {
      $scope.data.icons[imageData.size] = imageData.image;
      console.log(imageData);
    }, function () {
//      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.data = {
    'name': 'App Name',
    'description': 'App description (132 characters or less, no HTML)',
    'version': '1.0.0',
    'manifest_version': 2,
    'icons': { },
    'app': {
      'urls': [ 'http://mysubdomain.example.com/' ],
      'launch': { 'web_url': 'http://mysubdomain.example.com/' }
    }
  };
});

launcherMakerApp.controller('AddImageModalController', function ($scope, $modalInstance) {
  'use strict';
  $scope.sizes = [16, 48, 128];

  $scope.scope = $scope; // hax
  $scope.scope.imageSize = null;
  $scope.image = null;

  $scope.ok = function() {
    $modalInstance.close({size: $scope.scope.imageSize, image: $scope.image});
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.onFileSelect = function($files) {
    angular.forEach($files, function(file) {
      //Only pics
      if(!file.type.match('image')) { return; }
      var reader = new FileReader();
      reader.addEventListener('loadend', function() {
        var img = new Image();
        img.src = reader.result;

        img.onload = function() {
          var canvas = document.createElement('canvas');
          canvas.width = $scope.scope.imageSize;
          canvas.height = $scope.scope.imageSize;
          console.log(canvas.width);
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img,0,0,$scope.scope.imageSize,$scope.scope.imageSize);

          $scope.$apply(function() {
            $scope.image = canvas.toDataURL('image/png');
          });

        };
      });
      reader.readAsDataURL(file);
    });
  };
});
