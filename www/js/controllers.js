angular.module('starter.controllers', ['ionic'])

	.controller('introCtrl', function ($scope, $state, firstRun) {
		$scope.ischecked=false;
		$scope.printCheck = function (showagain) {
			// console.log(showagain);
			$scope.ischecked = showagain;
			// console.log($scope.ischecked);
		}
		$scope.proceed = function () {
			// $scope.showagain=true;	
			// console.log("Proceed");
			// console.log($scope.showagain);

			// console.log($scope.ischecked);
			if ($scope.ischecked == true) {
				// console.log("loop");
				// $scope.showagain = false;
				// $state.go('tab.inputs')
				firstRun.setInitialRun(false)
			}
			$state.go('tab.inputs');
		}

	})

	.controller('rootCtrl', function ($scope, $rootScope, F16456A98566EB8EF) {
		$scope.updateGraphs = function () {
			$rootScope.$broadcast('updateGraphs');
		};
		$scope.F16456A98566EB8EF = F16456A98566EB8EF.cond;
		$scope.setInputs = function () {
			$scope.$broadcast('setInputs');
		}
	})

	.controller('inputsCtrl', function ($scope, dataService, $ionicPopup, $rootScope, mobileService, F16456A98566EB8EF) {
		$scope.isMobile = mobileService.isMobile;

		$scope.$on('setInputs', setInputs);

		$scope.inputs = {};

		$scope.inputsEnabled = F16456A98566EB8EF.cond;

		$scope.shownGroup = 'Shapes';

		$scope.$watch('inputs.ix', function (val) {
			if ((iy() + iz()) < p(val)) {
				$scope.inputs.ix = iy() + iz() - 0.01;
			} else if (p(val) <= Math.abs(iz() - iy())) {
				$scope.inputs.ix = Math.abs(iz() - iy()) + 0.01;
			}
		});

		$scope.$watch('inputs.iy', function (val) {
			if ((ix() + iz()) < p(val)) {
				$scope.inputs.iy = ix() + iz() - 0.01;
			} else if (p(val) <= Math.abs(ix() - iz())) {
				$scope.inputs.iy = Math.abs(ix() - iz()) + 0.01;
			}
		});

		$scope.$watch('inputs.iz', function (val) {
			if ((ix() + iy()) < p(val)) {
				$scope.inputs.iz = ix() + iy() - 0.01;
			} else if (p(val) <= Math.abs(ix() - iy())) {
				$scope.inputs.iz = Math.abs(ix() - iy()) + 0.01;
			}
		});

		$scope.select = function (selected) {
			$scope.selected = selected;
			if (selected == 'brick') {
				$scope.inputs.ix = "0.43";
				$scope.inputs.iy = "0.6";
				$scope.inputs.iz = "1";
				$scope.inputs.wx = "0.1";
				$scope.inputs.wy = "1";
				$scope.inputs.wz = "0";
				$scope.inputs.mx = "0";
				$scope.inputs.my = "0";
				$scope.inputs.mz = "0";
				$scope.inputs.t = "60";
			} else if (selected == 'cube') {
				$scope.inputs.ix = "1";
				$scope.inputs.iy = "1";
				$scope.inputs.iz = "1";
				$scope.inputs.wx = "0.1";
				$scope.inputs.wy = "1";
				$scope.inputs.wz = "0";
				$scope.inputs.mx = "0";
				$scope.inputs.my = "0";
				$scope.inputs.mz = "0";
				$scope.inputs.t = "60";
			} else if (selected == 'prolate') {
				$scope.inputs.ix = "0.43";
				$scope.inputs.iy = "0.6";
				$scope.inputs.iz = "1";
				$scope.inputs.wx = "0.1";
				$scope.inputs.wy = "1";
				$scope.inputs.wz = "0";
				$scope.inputs.mx = "0";
				$scope.inputs.my = "0";
				$scope.inputs.mz = "0";
				$scope.inputs.t = "60";
			} else if (selected == 'oblate') {
				$scope.inputs.ix = "0.43";
				$scope.inputs.iy = "0.6";
				$scope.inputs.iz = "1";
				$scope.inputs.wx = "0.1";
				$scope.inputs.wy = "1";
				$scope.inputs.wz = "0";
				$scope.inputs.mx = "0";
				$scope.inputs.my = "0";
				$scope.inputs.mz = "0";
				$scope.inputs.t = "60";
			}
		};

		$scope.select('brick');

		$scope.toggleGroup = function (group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		};

		$scope.isGroupShown = function (group) {
			return $scope.shownGroup === group;
		};

		$scope.showAlert = function () {
			$ionicPopup.alert({
				title: 'Moment of Inertia',
				template: 'Moment of inertia is a quantity that determines the torque needed for a desired angular acceleration about a rotational axis.',
				okType: 'button-light'
			});
		};

		$scope.showAlertAngularVelocity = function () {
			$ionicPopup.alert({
				title: 'Angular Velocity',
				template: 'Angular velocity refers to how fast an object rotates or revolves relative to another point, i.e. how fast the angular position or orientation of an object changes with time. Spin angular velocity refers to how fast a rigid body rotates with respect to its centre of rotation',
				okType: 'button-light'
			});
		};

		$scope.showAlertTorques = function () {
			$ionicPopup.alert({
				title: 'Torque',
				template: 'A torque is a force applied to a point on an object about the axis of rotation.',
				okType: 'button-light'
			});
		};


		$scope.showAlertTime = function () {
			$ionicPopup.alert({
				title: 'Time',
				template: 'Time of simulation.',
				okType: 'button-light'
			});
		};


		function ix() {
			return parseFloat($scope.inputs.ix)
		}

		function iy() {
			return parseFloat($scope.inputs.iy)
		}

		function iz() {
			return parseFloat($scope.inputs.iz)
		}

		function p(v) {
			return parseFloat(v)
		}

		function setInputs() {
			var inputs = {
				ix: parseFloat($scope.inputs.ix),
				iy: parseFloat($scope.inputs.iy),
				iz: parseFloat($scope.inputs.iz),
				wx: parseFloat($scope.inputs.wx),
				wy: parseFloat($scope.inputs.wy),
				wz: parseFloat($scope.inputs.wz),
				mx: parseFloat($scope.inputs.mx),
				my: parseFloat($scope.inputs.my),
				mz: parseFloat($scope.inputs.mz),
				t: parseFloat($scope.inputs.t)
			};
			dataService.setInputs(inputs);
			dataService.resetSec();
			$rootScope.$broadcast('resizeCube');
			$rootScope.$broadcast('updateButton');
			if (!$scope.isMobile) $rootScope.$broadcast('updateGraphs');
		}
	})

	.controller('simulationCtrl', function ($scope, dataService, prService, $ionicModal, converter, $rootScope, mobileService) {
		$scope.isMobile = mobileService.isMobile;
		$scope.t = dataService.getTime;
		$scope.wx = function () {
			return dataService.getSolution().at($scope.t())[0];
		};
		$scope.wy = function () {
			return dataService.getSolution().at($scope.t())[1];
		};
		$scope.wz = function () {
			return dataService.getSolution().at($scope.t())[2];
		};
		$scope.e0 = function () {
			return dataService.getSolution().at($scope.t())[3];
		};
		$scope.e1 = function () {
			return dataService.getSolution().at($scope.t())[4];
		};
		$scope.e2 = function () {
			return dataService.getSolution().at($scope.t())[5];
		};
		$scope.e3 = function () {
			return dataService.getSolution().at($scope.t())[6];
		};
		$scope.O1 = function () {
			return converter.toAngles(dataService.getSolution().at($scope.t()), $scope.selectedOption.name)[0];
		};
		$scope.O2 = function () {
			return converter.toAngles(dataService.getSolution().at($scope.t()), $scope.selectedOption.name)[1];
		};
		$scope.O3 = function () {
			return converter.toAngles(dataService.getSolution().at($scope.t()), $scope.selectedOption.name)[2];
		};
		$scope.inputs = {};
		$scope.inputs.dt = 0.03;

		$scope.setDt = function () {
			var val = parseFloat($scope.inputs.dt);
			dataService.setDt(val);
		};

		$scope.buttonState = prService.getState();
		$scope.$on("updateButton", function () {
			$scope.buttonState = prService.resetState();
		});
		$scope.pauseResume = function () {
			$scope.buttonState = prService.toggleState();
		};

		$scope.selOptions = [{
			name: 'Angular Velocities'
		}, {
			name: 'Euler Parameters'
		}, {
			name: 'Euler Angles',
			items: [{
				name: 'Euler Angles: 1-2-1'
			}, {
				name: 'Euler Angles: 1-2-3'
			}, {
				name: 'Euler Angles: 1-3-1'
			}, {
				name: 'Euler Angles: 1-3-2'
			}, {
				name: 'Euler Angles: 2-1-2'
			}, {
				name: 'Euler Angles: 2-1-3'
			}, {
				name: 'Euler Angles: 2-3-1'
			}, {
				name: 'Euler Angles: 2-3-2'
			}, {
				name: 'Euler Angles: 3-1-2'
			}, {
				name: 'Euler Angles: 3-1-3'
			}, {
				name: 'Euler Angles: 3-2-1'
			}, {
				name: 'Euler Angles: 3-2-3'
			}]
		}];
		$scope.selectedOption = $scope.selOptions[0];
		$ionicModal.fromTemplateUrl('templates/sel-options-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.selOptionsModal = modal;
		});

		$scope.$on('$destroy', function () {
			$scope.selOptionsModal.remove();
		});

		$scope.clickOptionItem = function (option) {
			$scope.selectedOption = option;
			$scope.selOptionsModal.hide();
			$rootScope.$broadcast('updateGraphs');
		};

		$scope.toggleGroup = function (group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		};

		$scope.isGroupShown = function (group) {
			return $scope.shownGroup === group;
		};

		$scope.reorient = function () {
			$scope.$broadcast('reorient');
		};

		$scope.restart = function () {
			$scope.$broadcast('restart');
		};
	})

	.controller('outputsCtrl', function ($scope, $ionicModal, dataService, graphService, $sce, mobileService, F16456A98566EB8EF) {
		$scope.openUrl = function () {
			window.open(F16456A98566EB8EF.url, '_system');
		};

		$scope.isMobile = mobileService.isMobile;
		$scope.selOptions = [{
			name: 'Angular Velocities'
		}, {
			name: 'Euler Parameters'
		}, {
			name: 'Euler Angles',
			items: [{
				name: 'Euler Angles: 1-2-1'
			}, {
				name: 'Euler Angles: 1-2-3'
			}, {
				name: 'Euler Angles: 1-3-1'
			}, {
				name: 'Euler Angles: 1-3-2'
			}, {
				name: 'Euler Angles: 2-1-2'
			}, {
				name: 'Euler Angles: 2-1-3'
			}, {
				name: 'Euler Angles: 2-3-1'
			}, {
				name: 'Euler Angles: 2-3-2'
			}, {
				name: 'Euler Angles: 3-1-2'
			}, {
				name: 'Euler Angles: 3-1-3'
			}, {
				name: 'Euler Angles: 3-2-1'
			}, {
				name: 'Euler Angles: 3-2-3'
			}]
		}];

		$scope.selectedOption = $scope.selOptions[0];
		$scope.trust = $sce.trustAsHtml;
		$scope.options = {
			showPoint: false,
			lineSmooth: false,
			axisX: {
				showGrid: true,
				labelInterpolationFnc: function (value, index) {
					return index % 33 === 0 ? value | 0 : null
				}
			},
			axisY: {
				showGrid: true
			}
		};

		function updateGraphs() {
			var graphs = graphService.getGraphData($scope.selectedOption.name);
			$scope.data1 = {
				labels: graphs.labels,
				series: graphs.data1
			};
			$scope.data2 = {
				labels: graphs.labels,
				series: graphs.data2
			};
			$scope.data3 = {
				labels: graphs.labels,
				series: graphs.data3
			};
			$scope.data4 = {
				labels: graphs.labels,
				series: graphs.data4
			};
			new Chartist.Line('#chart1', $scope.data1, $scope.options);
			new Chartist.Line('#chart2', $scope.data2, $scope.options);
			new Chartist.Line('#chart3', $scope.data3, $scope.options);
			if (graphs.data4)
				new Chartist.Line('#chart4', $scope.data4, $scope.options);
			$scope.names = graphs.names;
		}

		updateGraphs();

		$scope.$on('updateGraphs', updateGraphs);

		$ionicModal.fromTemplateUrl('templates/sel-options-modal.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function (modal) {
			$scope.selOptionsModal = modal;
		});

		$scope.$on('$destroy', function () {
			$scope.selOptionsModal.remove();
		});

		$scope.$on('modal.hidden', updateGraphs);

		$scope.clickOptionItem = function (option) {
			$scope.selectedOption = option;
			$scope.selOptionsModal.hide();
			updateGraphs();
		};

		$scope.toggleGroup = function (group) {
			if ($scope.isGroupShown(group)) {
				$scope.shownGroup = null;
			} else {
				$scope.shownGroup = group;
			}
		};
		$scope.isGroupShown = function (group) {
			return $scope.shownGroup === group;
		};
	});
