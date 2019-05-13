angular.module('starter.services', [])
	.factory('F16456A98566EB8EF', function () {
		// This factory tells whether this a pro version or not
		// As ionic code can be easily viewed using chrome inspector
		// So to protect against easily finding this variable
		// I have given it a random name
		return {
			cond: true,
			// This is an example url, change it to actual url
			url: "https://itunes.apple.com/app/id1139514273"
		};
	})
	.factory('firstRun', function ($window) {
		return {
			setInitialRun: function (initial) {
				$window.localStorage["initialRun"] = (initial ? "true" : "false");
			},
			isInitialRun: function () {
				var value = $window.localStorage["initialRun"] || "true";
				return value == "true";
			}
		};
	})
	.factory('dataService', function (graphService) {
		var savedInputs = {};
		var savedSolution = {};
		var savedTime = 0;
		var savedDt = 0.03;
		var savedSize = {};
		var currentSec = 0;

		function setInputs(data) {
			savedInputs = data;
			var ix = savedInputs.ix,
				iy = savedInputs.iy,
				iz = savedInputs.iz,
				wx = savedInputs.wx,
				wy = savedInputs.wy,
				wz = savedInputs.wz,
				mx = savedInputs.mx,
				my = savedInputs.my,
				mz = savedInputs.mz,
				t = savedInputs.t;

			var equations = function (t, y) {
				return [
					(mx + (iy - iz) * y[1] * y[2]) /
					ix, (my + (iz - ix) * y[2] * y[0]) /
					iy, (mz + (ix - iy) * y[0] * y[1]) / iz,
					0.5 * (-y[4] * y[0] - y[5] * y[1] - y[6] * y[2]),
					0.5 * (+y[3] * y[0] - y[6] * y[1] + y[5] * y[2]),
					0.5 * (+y[6] * y[0] + y[3] * y[1] - y[4] * y[2]),
					0.5 * (-y[5] * y[0] + y[4] * y[1] + y[3] * y[2])
				];
			};

			var initRot = new THREE.Quaternion();
			initRot.setFromEuler(new THREE.Euler(0, 0, 0, "XYZ"));
			savedSolution = numeric.dopri(0, t, [wx, wy, wz, initRot.w, initRot.x, initRot.y, initRot.z], equations);
			graphService.setSolution(savedSolution);
			savedTime = 0;
			var height = Math.sqrt(6 * (iz - ix + iy));
			var depth = Math.sqrt(6 * (iy - iz + ix));
			var width = Math.sqrt(6 * (ix - iy + iz));
			var max = Math.max(width, height, depth);
			width = (width / max) * 200;
			height = (height / max) * 200;
			depth = (depth / max) * 200;
			savedSize = {
				width: width,
				height: height,
				depth: depth
			};
		}

		function getInputs() {
			return savedInputs;
		}

		function setSolution(data) {
			savedSolution = data;
		}

		function getSolution() {
			return savedSolution;
		}

		function setTime(data) {
			savedTime = data;
		}

		function getTime() {
			return parseFloat(savedTime);
		}

		function addTime() {
			savedTime += savedDt;
		}

		function setDt(data) {
			savedDt = data;
		}

		function setSize(width, height, depth) {
			savedSize = {
				width: width,
				height: height,
				depth: depth
			};
		}

		function getSize() {
			return savedSize;
		}

		function resetSec() {
			currentSec = 0;
		}

		function isNextSec(data) {
			if (data > currentSec + 1) {
				currentSec++;
				return true;
			}
			return false;
		}

		setInputs({
			ix: 0.43,
			iy: 0.6,
			iz: 1,
			wx: 0.1,
			wy: 1,
			wz: 0,
			mx: 0,
			my: 0,
			mz: 0,
			t: 60
		});

		return {
			setInputs: setInputs,
			getInputs: getInputs,
			setSolution: setSolution,
			getSolution: getSolution,
			setTime: setTime,
			getTime: getTime,
			addTime: addTime,
			resetSec: resetSec,
			isNextSec: isNextSec,
			setDt: setDt,
			setSize: setSize,
			getSize: getSize
		}
	})
	.factory('prService', function () {
		var pauseState = {
			pause: true,
			class: "ion-pause"
		};
		var resumeState = {
			pause: false,
			class: "ion-play"
		};
		var buttonState = pauseState;

		function toggleState() {
			buttonState = (buttonState.pause) ? resumeState : pauseState;
			return buttonState;
		}

		function getState() {
			return buttonState;
		}

		function isRunning() {
			return buttonState.pause;
		}

		function resetState() {
			buttonState = pauseState;
			return buttonState;
		}

		return {
			toggleState: toggleState,
			getState: getState,
			isRunning: isRunning,
			resetState: resetState
		}
	})
	.factory('graphService', function (converter) {
		var solution, t;
		var i, sol, labels, wx, wy, wz, e0, e1, e2, e3, O1array, O2array, O3array;

		function setSolution(newSolution) {
			solution = newSolution;
			t = solution.x[solution.x.length - 1];
			labels = [];
			for (i = 0.1; i <= t; i += 0.3) {
				labels.push(Math.round(i / 10) * 10);
			}
		}

		function getGraphData(option) {
			switch (option) {
				case 'Angular Velocities':
					wx = [];
					wy = [];
					wz = [];
					for (i = 0.1; i <= t; i += 0.3) {
						sol = solution.at(i);
						wx.push(sol[0].toFixed(5));
						wy.push(sol[1].toFixed(5));
						wz.push(sol[2].toFixed(5));
					}
					return {
						data1: [wx],
						data2: [wy],
						data3: [wz],
						names: ["Angular Velocity: &omega;<sub>x</sub>", "Angular Velocity: &omega;<sub>y</sub>", "Angular Velocity: &omega;<sub>z</sub>"],
						labels: labels
					};
					break;
				case 'Euler Parameters':
					e0 = [];
					e1 = [];
					e2 = [];
					e3 = [];
					for (i = 0.1; i <= t; i += 0.3) {
						sol = solution.at(i);
						e0.push(sol[3].toFixed(5));
						e1.push(sol[4].toFixed(5));
						e2.push(sol[5].toFixed(5));
						e3.push(sol[6].toFixed(5));
					}
					return {
						data1: [e0],
						data2: [e1],
						data3: [e2],
						data4: [e3],
						names: ["Euler parameter: e<sub>0</sub>", "Euler parameter: e<sub>1</sub>",
							"Euler parameter: e<sub>2</sub>", "Euler parameter: e<sub>3</sub>"
						],
						labels: labels
					};
				case 'Euler Angles: 1-2-1':
					return convertToAngles("Euler Angles: 1-2-1");
				case 'Euler Angles: 1-2-3':
					return convertToAngles("Euler Angles: 1-2-3");
				case 'Euler Angles: 1-3-1':
					return convertToAngles("Euler Angles: 1-3-1");
				case 'Euler Angles: 1-3-2':
					return convertToAngles("Euler Angles: 1-3-2");
				case 'Euler Angles: 2-1-2':
					return convertToAngles("Euler Angles: 2-1-2");
				case 'Euler Angles: 2-1-3':
					return convertToAngles("Euler Angles: 2-1-3");
				case 'Euler Angles: 2-3-1':
					return convertToAngles("Euler Angles: 2-3-1");
				case 'Euler Angles: 2-3-2':
					return convertToAngles("Euler Angles: 2-3-2");
				case 'Euler Angles: 3-1-2':
					return convertToAngles("Euler Angles: 3-1-2");
				case 'Euler Angles: 3-1-3':
					return convertToAngles("Euler Angles: 3-1-3");
				case 'Euler Angles: 3-2-1':
					return convertToAngles("Euler Angles: 3-2-1");
				case 'Euler Angles: 3-2-3':
					return convertToAngles("Euler Angles: 3-2-3");
			}
		}

		function convertToAngles(order) {
			O1array = [];
			O2array = [];
			O3array = [];
			for (var i = 0.1; i <= t; i += 0.3) {
				var sol = solution.at(i);
				var O = converter.toAngles(sol, order);
				O1array.push(O[0].toFixed(5));
				O2array.push(O[1].toFixed(5));
				O3array.push(O[2].toFixed(5));
			}
			return {
				data1: [O1array],
				data2: [O2array],
				data3: [O3array],
				names: ["Euler Angle: &theta;<sub>a</sub>", "Euler Angle: &theta;<sub>b</sub>",
					"Euler Angle: &theta;<sub>c</sub>"
				],
				labels: labels
			};
		}

		return {
			setSolution: setSolution,
			getGraphData: getGraphData
		}
	})

	.factory('converter', function () {
		function toAngles(sol, order) {
			var O1, O2, O3;
			var a11 = Math.pow(sol[3], 2) + Math.pow(sol[4], 2) - Math.pow(sol[5], 2) - Math.pow(sol[6], 2),
				a12 = 2 * (sol[4] * sol[5] + sol[3] * sol[6]),
				a13 = 2 * (sol[4] * sol[6] - sol[3] * sol[5]),
				a21 = 2 * (sol[4] * sol[5] - sol[3] * sol[6]),
				a22 = Math.pow(sol[3], 2) - Math.pow(sol[4], 2) + Math.pow(sol[5], 2) - Math.pow(sol[6], 2),
				a23 = 2 * (sol[5] * sol[6] + sol[3] * sol[4]),
				a31 = 2 * (sol[4] * sol[6] + sol[3] * sol[5]),
				a32 = 2 * (sol[5] * sol[6] - sol[3] * sol[4]),
				a33 = Math.pow(sol[3], 2) - Math.pow(sol[4], 2) - Math.pow(sol[5], 2) + Math.pow(sol[6], 2);
			switch (order) {
				case "Euler Angles: 1-2-1":
					O2 = Math.acos(a11);
					O1 = Math.atan2(a12, -a13);
					O3 = Math.atan2(a21, a31);
					break;
				case "Euler Angles: 1-2-3":
					O2 = Math.asin(a31);
					O1 = Math.atan2(-a32, a33);
					O3 = Math.atan2(-a21, a11);
					break;
				case "Euler Angles: 1-3-1":
					O2 = Math.acos(a11);
					O1 = Math.atan2(a13, a12);
					O3 = Math.atan2(a31, -a21);
					break;
				case "Euler Angles: 1-3-2":
					O2 = Math.asin(-a21);
					O1 = Math.atan2(a23, a22);
					O3 = Math.atan2(a31, a11);
					break;
				case "Euler Angles: 2-1-2":
					O2 = Math.acos(a22);
					O1 = Math.atan2(a21, a23);
					O3 = Math.atan2(a12, -a32);
					break;
				case "Euler Angles: 2-1-3":
					O2 = Math.asin(-a32);
					O1 = Math.atan2(a31, a33);
					O3 = Math.atan2(a21, a22);
					break;
				case "Euler Angles: 2-3-1":
					O2 = Math.asin(a12);
					O1 = Math.atan2(-a13, a11);
					O3 = Math.atan2(-a32, a22);
					break;
				case "Euler Angles: 2-3-2":
					O2 = Math.acos(a22);
					O1 = Math.atan2(a23, -a21);
					O3 = Math.atan2(a32, a12);
					break;
				case "Euler Angles: 3-1-2":
					O2 = Math.asin(a23);
					O1 = Math.atan2(-a21, a22);
					O3 = Math.atan2(-a13, a33);
					break;
				case "Euler Angles: 3-1-3":
					O2 = Math.acos(a33);
					O1 = Math.atan2(a31, -a32);
					O3 = Math.atan2(a13, a23);
					break;
				case "Euler Angles: 3-2-1":
					O2 = Math.asin(-a13);
					O1 = Math.atan2(a12, a11);
					O3 = Math.atan2(a23, a33);
					break;
				case "Euler Angles: 3-2-3":
					O2 = Math.acos(a33);
					O1 = Math.atan2(a32, a31);
					O3 = Math.atan2(a23, -a13);
					break;
			}
			return [O1, O2, O3];
		}

		return {
			toAngles: toAngles
		}
	})
	.factory('mobileService', function () {
		var isMobile = false;
		(function (a) {
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) isMobile = true;
		})(navigator.userAgent || navigator.vendor || window.opera);
		return {
			isMobile: isMobile
		}
	});
