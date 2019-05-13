angular.module('starter.directives', [])
	.directive('threeJsCanvas', function (dataService, prService, mobileService) {
		'use strict';
		return {
			restrict: 'E',
			link: function (scope, element) {
				var scene, camera, renderer, material, cube, group, globalTexts = [],
					localTexts = [],
					container;

				var colors = [{
					hex: "#F22613",
					rgb: 'rgb(242, 38, 19)',
					light: "#c0392b"
				}, {
					hex: "#2ECC71",
					rgb: 'rgb(46, 204, 113)',
					light: "#16a085"
				}, {
					hex: "#3498db",
					rgb: 'rgb(52, 152, 219)',
					light: "#2980b9"
				}];

				function initScene() {
					var vMargin = (mobileService.isMobile || window.innerWidth < 786) ? 0 : 700;
					var hMargin = 270;
					if (Detector.webgl)
						renderer = new THREE.WebGLRenderer({
							antialias: true
						});
					else
						renderer = new THREE.CanvasRenderer();
					renderer.setSize(window.innerWidth - vMargin, window.innerHeight - hMargin);
					renderer.setClearColor(0xffffff, 1);
					element[0].appendChild(renderer.domElement);

					scene = new THREE.Scene;
					camera = new THREE.PerspectiveCamera(70, (window.innerWidth - vMargin) /
						(window.innerHeight - hMargin), 0.1, 10000);
					camera.position.x = 400;
					camera.position.y = 400;
					camera.position.z = -400;

					new THREE.OrbitControls(camera, renderer.domElement);
					scene.add(camera);

					container = new THREE.Group();
					group = new THREE.Group();
					var geometry = new THREE.BoxGeometry(
						dataService.getSize().width, dataService.getSize().height, dataService.getSize().depth);

					colors.forEach(function (color, index) {
						for (var i = 0; i < 4; i++) {
							geometry.faces[index * 4 + i].color.set(color.light);
						}
					});

					material = new THREE.MeshBasicMaterial({
						color: 0xffffff,
						vertexColors: THREE.FaceColors
					});
					cube = new THREE.Mesh(geometry, material);
					addAxis(200, group);
					group.add(cube);
					container.add(group);
					container.rotation.x = -Math.PI / 2;
					scene.add(container);
				}

				function render() {
					requestAnimationFrame(render);
					if (prService.isRunning()) {
						if (dataService.getTime() <= dataService.getInputs().t) {
							if (dataService.isNextSec(dataService.getTime())) {
								scope.$apply(dataService.addTime());
							} else dataService.addTime();
							var sol = dataService.getSolution().at(dataService.getTime());
							group.rotation.setFromQuaternion(new THREE.Quaternion(sol[4], sol[5], sol[6], sol[3]).normalize());
						}
					}
					renderer.render(scene, camera);
				}

				function addAxis(axisLength, parent) {
					function v(x, y, z) {
						return new THREE.Vector3(x, y, z);
					}

					function createAxis(p1, p2, color) {
						var lineGeometry = new THREE.Geometry();
						var lineMat = new THREE.LineBasicMaterial({
							color: color,
							lineWidth: 1
						});
						lineGeometry.vertices.push(p1, p2);
						var line = new THREE.Line(lineGeometry, lineMat);
						parent.add(line);
					}

					function createText(x, y, z, color, string) {

						function makeTextSprite(message) {
							var canvas = document.createElement('canvas');
							var context = canvas.getContext('2d');
							context.font = ((parent === group) ? "Italic " : "") + 120 + "px " + "Arial";
							context.fillStyle = color;
							context.fillText(message, 0, 100);

							var texture = new THREE.Texture(canvas);
							texture.needsUpdate = true;
							texture.minFilter = THREE.LinearFilter;
							var spriteMaterial = new THREE.SpriteMaterial({
								map: texture,
								useScreenCoordinates: false
							});
							var sprite = new THREE.Sprite(spriteMaterial);
							sprite.scale.set(100, 50, 1.0);
							return sprite;
						}

						var text = makeTextSprite(string);
						text.position.set(x, y, z);
						parent.add(text);
						if (parent === group) localTexts.push(text);
						else globalTexts.push(text);
					}

					createAxis(v(-axisLength, 0, 0), v(0, 0, 0), colors[0].hex);
					createAxis(v(0, 0, 0), v(axisLength, 0, 0), colors[0].hex);
					createAxis(v(0, -axisLength, 0), v(0, 0, 0), colors[1].hex);
					createAxis(v(0, 0, 0), v(0, axisLength, 0), colors[1].hex);
					createAxis(v(0, 0, -axisLength), v(0, 0, 0), colors[2].hex);
					createAxis(v(0, 0, 0), v(0, 0, axisLength), colors[2].hex);
					if (parent === group) {
						createText(axisLength, 0, 0, colors[0].rgb, "x");
						createText(0, axisLength, 0, colors[1].rgb, "y");
						createText(0, 0, axisLength, colors[2].rgb, "z");
					} else {
						createText(axisLength, 0, 0, colors[0].rgb, "X");
						createText(0, axisLength, 0, colors[1].rgb, "Y");
						createText(0, 0, axisLength, colors[2].rgb, "Z");
					}
				}

				initScene();
				addAxis(300, container);
				render();

				scope.$on('resizeCube', function () {
					group.remove(cube);
					var geometry = new THREE.BoxGeometry(
						dataService.getSize().width, dataService.getSize().height, dataService.getSize().depth);

					colors.forEach(function (color, index) {
						for (var i = 0; i < 4; i++) {
							geometry.faces[index * 4 + i].color.set(color.light);
						}
					});
					cube = new THREE.Mesh(geometry, material);
					group.add(cube);
				});

				scope.$on('reorient', function () {
					camera.position.x = 400;
					camera.position.y = 400;
					camera.position.z = -400;
					camera.lookAt(scene.position)
				});

				scope.$on('restart', function () {
					dataService.setTime(0);
					dataService.resetSec();
				});
			}
		};
	})
	.directive('range', function () {
		return {
			restrict: 'C',
			link: function (scope, element) {
				element.bind('touchstart mousedown', function (event) {
					event.stopPropagation();
					event.stopImmediatePropagation();
				});
			}
		}
	});

// TODO: upload new version to openshift
// FIXED: euler angles conversion
// FIXED: graphs not updating on mobile
// FIXED: graphs not working in mobile
// FIXED: check with canvas renderer
// FIXED: Change charting library
// FIXED: Top ion bar height on android
// FIXED: slider not working in desktop mode
// FIXED: prButton up and add choice box and card for displaying values
// FIXED: time does not update if restarted
// FIXED: top bar not hiding
// FIXED: convert form 1 to 3 graphs
// FIXED: make prButton small so make space for things
// FIXED: e3 not working after reverting forth and back
// FIXED: fix conventions
// FIXED: limit sliders
// FIXED: shade different side different color
// FIXED: fix orbiting
// FIXED: reset orientation button : in place of selector there will be reset button
// FIXED: add speed slider
// FIXED: cube not resizing on first redraw
// FIXED: create web version
// FIXED: fix seconds not updating automatically
// FIXED: add card around choicebox
// FIXED: fix header buttons
// FIXED: for color check https://github.com/defmech/Three.js-Object-Rotation-with-Quaternion/blob/master/Rotation.js !!
// FIXED: only when input changes recalculate things and restart simulation !!
// FIXED: create drop down inside a card for inputs --working
// FIXED: added tablet support

// HINT: ng-model should be used not ng-bind + function approach as it is designed for two way binding so it registers
// watches automatically.
// IGNORED: Add material design
