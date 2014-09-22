// Foundation JavaScript
// Documentation can be found at: http://foundation.zurb.com/docs
//$(document).foundation();

var launcherMakerApp = angular.module('launcherMakerApp', [
    'mm.foundation',
    'angularFileUpload'
]);

launcherMakerApp.controller('LauncherController', function ($scope, $modal) {
  'use strict';

  $scope.icons = {};
  $scope.iconLength = 0;
  $scope.name = '';
  $scope.description = '';
  $scope.url = '';
  /*

  var unregisterDataFormWatch = $scope.$watch('dataForm', function() {
    unregisterDataFormWatch();
    $scope.dataForm.icon.$setValidity('required', false);
    console.log($scope.dataForm);
  });
  */

  $scope.generate = function() {
    $scope.data = {
      'name': $scope.name,
      'description': $scope.description,
      'version': '1.0.0',
      'manifest_version': 2,
      'icons': $scope.icons,
      'app': {
        'urls': [ $scope.url ],
        'launch': { 'web_url': $scope.url }
      }
    };
    var zip = new JSZip();
    angular.forEach($scope.icons, function(image, size) {
      $scope.data.icons[size] = 'icon_' + size + '.png';
      zip.file($scope.data.icons[size], image.replace('data:image/png;base64,', ''), {base64: true});
    });
    zip.file('manifest.json', JSON.stringify($scope.data));

    var content = zip.generate({type:"blob"});
    // see FileSaver.js
    saveAs(content, "example.zip");
  };

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
      $scope.icons[imageData.size] = imageData.image;
      $scope.iconLength = Object.keys($scope.icons).length;
    }, function () {
//      $log.info('Modal dismissed at: ' + new Date());
    });
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
