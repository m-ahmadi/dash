function buildFormdata(o) {
	let res = new FormData();
	Object.keys(o).forEach(k => {
		res.append(k, o[k]);
	});
	return res;
}

function processData(data, clear, self) {
	if (!data)
		return;
	// var self = this;
	// Add Devices
	// TODO: can make function for this part
	if (clear && self.deviceSource.getFeatures().length)
		self.deviceSource.clear();
	self.center = undefined;
	self.coordinates = undefined;
	self.lastDevicePosition = [0, 0];
	if (data.device) {
		data.device.forEach(function(node) {
			var isSeleced = false;
			// if ([_SELECTED_DEVICES_IDS_].indexOf(node.id.toString()) !== -1) {
			/* if ($($scope.console.deviceSelectElement).val().split(",").indexOf(node.id.toString()) !== -1) {
			
				self.center = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
				isSeleced = true;
			} */
			self.lastDevicePosition = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
			self.deviceSource.addFeature(new ol.Feature({
				geometry: new ol.geom.Point(self.lastDevicePosition),
				color: node.color,
				name: node.name,
				id: node.id,
				location: node.location,
				lat: node.latitude,
				long: node.longtitude,
				selected: isSeleced
			}));
		});
	}
	// Add Circuits
	// TODO: can make function for this part
	if (clear)
		$.each(self.sources, function(key, source) {
			if (source.getFeatures().length)
				source.clear();
		});
	var sourceXY, destinationXY;
	if (data.circuits) {
		self.violatedServices.list = [];
		data.circuits.forEach(function(link) {
			data.device.forEach(function(node) {
				if (node.id === link.source) {
					sourceXY = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
					link.source_name = node.name;
					filterViolatedServices();
				}
				if (node.id === link.destination) {
					destinationXY = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
					link.destination_name = node.name;
					// filterViolatedServices();
				}

				function filterViolatedServices() {
					if (link.sla_violated) {
						var color = {info: "blue", minor: "#f7bb38", major: "orange", critical: "red"}[link.sla_violated_type];
						self.violatedServices.list.push({
							id: link.id,
							name: node.name,
							latitude: node.latitude,
							longtitude: node.longtitude,
							type: link.sla_violated_type,
							color: color
						});
					}
				}
			});
			if (!sourceXY || !destinationXY)
				return;
			if (link.id == self.defaultCircuitID) {
				var coordinates = {};
				if (sourceXY[0] === destinationXY[0] && sourceXY[1] === destinationXY[1]) {
					self.center = [sourceXY[0], sourceXY[1]];
				} else {
					if (sourceXY[0] < destinationXY[0]) {
						coordinates.maxLong = destinationXY[0];
						coordinates.minLong = sourceXY[0];
					} else {
						coordinates.maxLong = sourceXY[0];
						coordinates.minLong = destinationXY[0];
					}
					if (sourceXY[1] < destinationXY[1]) {
						coordinates.maxLat = destinationXY[1];
						coordinates.minLat = sourceXY[1];
					} else {
						coordinates.maxLat = sourceXY[1];
						coordinates.minLat = destinationXY[1];
					}
					self.coordinates = [coordinates.minLong, coordinates.minLat, coordinates.maxLong, coordinates.maxLat];
				}
			}
			if (link.sla_violated) {
				self.sources[link.sla_violated_type].addFeature(new ol.Feature({
					geometry: new ol.geom.LineString([sourceXY, destinationXY]),
					id: link.id,
					source_name: link.source_name,
					destination_name: link.destination_name,
					alias: link.source_name + "::" + link.destination_name,
					type: link.sla_violated_type
				}));
			} else {
				self.sources.circuit.addFeature(new ol.Feature({
					geometry: new ol.geom.LineString([sourceXY, destinationXY]),
					id: link.id,
					source_name: link.source_name,
					destination_name: link.destination_name,
					alias: link.source_name + "::" + link.destination_name,
					type: "circuit"
				}));
			}
		});
		self.violatedServices.redraw(self);
	}
	if (!self.autoRefresh) self.setCenter.trigger(self);
}

function newMap() {
	return {
        target: document.getElementById("full-map"),
        container: undefined,
        center: undefined,
        coordinates: undefined,
        lastDevicePosition: [0, 0],
        last: {
            center: [0, 0],
            zoom: 5
        },
        isViolated: false,
        live: true,
        autoRefresh: false,
        interval: undefined,
        defaultCircuitID: undefined, // $routeParams.circuitId,
        view: new ol.View({
            zoom: 5,
            maxZoom: 21,
            minZoom: 2.5,
            center: [0, 0]
        }),
        violationLayer: new ol.layer.Vector(),
        deviceLayer: new ol.layer.Vector(),
        layers: {
            circuit: new ol.layer.Vector(),
            info: new ol.layer.Vector(),
            minor: new ol.layer.Vector(),
            major: new ol.layer.Vector(),
            critical: new ol.layer.Vector()
        },
        violationSource: new ol.source.Vector({
            wrapX: false
        }),
        deviceSource: new ol.source.Vector({
            wrapX: false
        }),
        sources: {
            circuit: new ol.source.Vector({
                wrapX: false
            }),
            info: new ol.source.Vector({
                wrapX: false
            }),
            minor: new ol.source.Vector({
                wrapX: false
            }),
            major: new ol.source.Vector({
                wrapX: false
            }),
            critical: new ol.source.Vector({
                wrapX: false
            }),
        },
        violationStyle: function(feature, resolution) {
            return new ol.style.Style({
                text: new ol.style.Text({
                    font: '10px helvetica,sans-serif',
                    text: feature.get('name'),
                    fill: new ol.style.Fill({
                        color: feature.get("color")
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#fff',
                        width: 8
                    })
                })
            });
        },
        deviceStyle: function(feature, resolution) {
            var color = feature.get("color") || "green";
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: "/static/img/location-icon.svg",
                    color: color,
                    scale: feature.get("selected") ? 1.5 : 1,
                    opacity: 1,
                })
            });
        },
        lineStyle: function(type) {
            var self = this;
            var colorMap = {
                circuit: "green",
                info: "blue",
                minor: "#f7bb38",
                major: "orange",
                critical: "red"
            };
            return function(feature) {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: colorMap[type],
                        width: feature.get("id") == self.defaultCircuitID ? 5 : 2
                    })
                });
            };
        },
        refreshMap: function() {
            var self = this;
            if (self.interval) {
                //$interval.cancel(self.interval);
				clearInterval(self.interval);
                self.interval = undefined;
            }
            if (self.autoRefresh && self.live)
                //self.interval = $interval(function() {
				self.interval = setInterval(function() {
                    self.getData();
                }, 15000);
            self.getData();
        },
       
		addDataToMap: function(data, clear) {
            if (!data)
                return;
            var self = this;
            // Add Devices
            // TODO: can make function for this part
            if (clear && self.deviceSource.getFeatures().length)
                self.deviceSource.clear();
            self.center = undefined;
            self.coordinates = undefined;
            self.lastDevicePosition = [0, 0];
            if (data.device) {
                data.device.forEach(function(node) {
                    var isSeleced = false;
					// if ([_SELECTED_DEVICES_IDS_].indexOf(node.id.toString()) !== -1) {
                    /* if ($($scope.console.deviceSelectElement).val().split(",").indexOf(node.id.toString()) !== -1) {
                    
                        self.center = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
                        isSeleced = true;
                    } */
                    self.lastDevicePosition = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
                    self.deviceSource.addFeature(new ol.Feature({
                        geometry: new ol.geom.Point(self.lastDevicePosition),
                        color: node.color,
                        name: node.name,
                        id: node.id,
                        location: node.location,
                        lat: node.latitude,
                        long: node.longtitude,
                        selected: isSeleced
                    }));
                });
            }
            // Add Circuits
            // TODO: can make function for this part
            if (clear)
                $.each(self.sources, function(key, source) {
                    if (source.getFeatures().length)
                        source.clear();
                });
            var sourceXY, destinationXY;
            if (data.circuits) {
                self.violatedServices.list = [];
                data.circuits.forEach(function(link) {
                    data.device.forEach(function(node) {
                        if (node.id === link.source) {
                            sourceXY = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
                            link.source_name = node.name;
                            filterViolatedServices();
                        }
                        if (node.id === link.destination) {
                            destinationXY = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
                            link.destination_name = node.name;
                            // filterViolatedServices();
                        }

                        function filterViolatedServices() {
                            if (link.sla_violated) {
                                var color = {info: "blue", minor: "#f7bb38", major: "orange", critical: "red"}[link.sla_violated_type];
                                self.violatedServices.list.push({
                                    id: link.id,
                                    name: node.name,
                                    latitude: node.latitude,
                                    longtitude: node.longtitude,
                                    type: link.sla_violated_type,
                                    color: color
                                });
                            }
                        }
                    });
                    if (!sourceXY || !destinationXY)
                        return;
                    if (link.id == self.defaultCircuitID) {
                        var coordinates = {};
                        if (sourceXY[0] === destinationXY[0] && sourceXY[1] === destinationXY[1]) {
                            self.center = [sourceXY[0], sourceXY[1]];
                        } else {
                            if (sourceXY[0] < destinationXY[0]) {
                                coordinates.maxLong = destinationXY[0];
                                coordinates.minLong = sourceXY[0];
                            } else {
                                coordinates.maxLong = sourceXY[0];
                                coordinates.minLong = destinationXY[0];
                            }
                            if (sourceXY[1] < destinationXY[1]) {
                                coordinates.maxLat = destinationXY[1];
                                coordinates.minLat = sourceXY[1];
                            } else {
                                coordinates.maxLat = sourceXY[1];
                                coordinates.minLat = destinationXY[1];
                            }
                            self.coordinates = [coordinates.minLong, coordinates.minLat, coordinates.maxLong, coordinates.maxLat];
                        }
                    }
                    if (link.sla_violated) {
                        self.sources[link.sla_violated_type].addFeature(new ol.Feature({
                            geometry: new ol.geom.LineString([sourceXY, destinationXY]),
                            id: link.id,
                            source_name: link.source_name,
                            destination_name: link.destination_name,
                            alias: link.source_name + "::" + link.destination_name,
                            type: link.sla_violated_type
                        }));
                    } else {
                        self.sources.circuit.addFeature(new ol.Feature({
                            geometry: new ol.geom.LineString([sourceXY, destinationXY]),
                            id: link.id,
                            source_name: link.source_name,
                            destination_name: link.destination_name,
                            alias: link.source_name + "::" + link.destination_name,
                            type: "circuit"
                        }));
                    }
                });
                self.violatedServices.redraw(self);
            }

            if (!self.autoRefresh)
                self.setCenter.trigger(self);
        },
        setCenter: {
            timer: undefined,
            trigger: function(that, $center, $zoom) {
                var map = that.container;
                if (this.timer)
                    // $timeout.cancel(this.timer);
                    clearTimeout(this.timer);
                // this.timer = $timeout(function() {
                this.timer = setTimeout(function() {
                    var bounce = ol.animation.bounce({
                        resolution: that.view.getResolution() * 2
                    });
                    var pan = ol.animation.pan({
                        source: that.view.getCenter()
                    });
                    var zoom = ol.animation.zoom({
                        resolution: that.view.getResolution()
                    });
                    // map.beforeRender(bounce);
                    map.beforeRender(pan);
                    map.beforeRender(zoom);

                    that.last = {
                        center: that.view.getCenter(),
                        zoom: that.view.getZoom()
                    };

                    if ($center) {
                        that.view.setCenter($center);
                        that.view.setZoom($zoom || that.view.getZoom());
                    } else if (that.center) {
                        that.view.setCenter(that.center);
                        that.view.setZoom(15);
                    } else if (that.coordinates) {
                        that.view.fit(that.coordinates, that.container.getSize());
                    } else {
                        that.view.setCenter(that.lastDevicePosition);
                        that.view.setZoom(5);
                    }
                }, 100);
            }
        },
        violatedServices: {
            list: [],
            groups: function(map) {
                var groups = [];
                this.list.forEach(function(service) {
                    var assigned = false;
                    var coordinate = ol.proj.transform([service.longtitude, service.latitude], 'EPSG:4326', 'EPSG:3857');
                    service.pixel = map.getPixelFromCoordinate(coordinate);
                    groups.forEach(function(group) {
                        if (assigned) return;
                        if (service.pixel[0] <= group.pixel[0]+100 && service.pixel[0] > group.pixel[0]-100 && service.pixel[1] <= group.pixel[1]+100 && service.pixel[1] > group.pixel[1]-200) {
                            group.services[service.type].push(service);
                            assigned = true;
                        }
                    });
                    if (!assigned) {
                        var services = {
                            critical: [],
                            major: [],
                            minor: [],
                            info: []
                        };
                        services[service.type].push(service);
                        var group = {
                            latitude: service.latitude,
                            longtitude: service.longtitude,
                            coordinate: coordinate,
                            pixel: service.pixel,
                            services: services
                        };
                        groups.push(group);
                    }
                });
                return groups;
            },
            redraw: function(that) {
                var map = that.container;
                if (that.violationSource.getFeatures().length)
                    that.violationSource.clear();
                this.groups(map).forEach(function(group) {
                    var index = 0;
                    ["critical", "major", "minor", "info"].forEach(function(type) {
                        group.services[type].forEach(function(service) {
                            index += 1;
                            if (index > 10) return; // Filter for Groups
                            var geom = new ol.geom.Point(
                                map.getCoordinateFromPixel([group.pixel[0], group.pixel[1]+(-15*index)])
                            );
                            var feature = new ol.Feature({
                                geometry: geom,
                                color: service.color,
                                name: service.name,
                                id: service.id
                            });
                            feature.setStyle(that.violationStyle(feature));
                            that.violationSource.addFeature(feature);
                        });
                    });
                });
            }
        },
        addTooltip: function() {
            var self = this,
                map = self.container;
            var container = document.getElementById('popup'),
                content_element = document.getElementById('popup-content'),
                closer = document.getElementById('popup-closer');

                container.style.visibility = "visible";

            closer.onclick = closeTooltip;
            function closeTooltip() {
                overlay.setPosition(undefined);
                closer.blur();
                self.setCenter.trigger(self, self.last.center, self.last.zoom);
                return false;
            };

            var overlay = new ol.Overlay({
                element: container,
                autoPan: true,
                offset: [0, -10]
            });
            map.addOverlay(overlay);

            map.on('click', function(event) {
                var colorMap = {
                    circuit: "black",
                    info: "blue",
                    minor: "#f7bb38",
                    major: "orange",
                    critical: "red"
                };

                var devicesInPixel = [],
                    circuitsInPixel = [];

                map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
                    if (layer === self.deviceLayer) {
                        if (!devicesInPixel[feature.get("name")])
                            devicesInPixel[feature.get("name")] = {id: feature.get("id"), coord: feature.getGeometry().getCoordinates()};
                    } else if (layer === self.violationLayer) {
                        // getCircuit(feature.get("id"));
                        return;
                    } else {
                        if (!circuitsInPixel[feature.get("alias")])
                            circuitsInPixel[feature.get("alias")] = {id: feature.get("id"), color: colorMap[feature.get("type")]};
                    }
                });

                var content = "";
                if(Object.keys(devicesInPixel).length) {

                    // for find deiveces circuits
                    Object.keys(self.sources).forEach(function(type) {
                        var features = self.sources[type].getFeatures();
                        features.forEach(function(feature) {
                            Object.keys(devicesInPixel).forEach(function(device) {
                                if (feature.get("source_name") == device || feature.get("destination_name") == device)
                                    // if (!circuitsInPixel[feature.get("alias")])
                                    circuitsInPixel[feature.get("alias")] = {id: feature.get("id"), color: colorMap[feature.get("type")]};
                            });
                        });
                    });

                    content += "<h3>Devices:</h3><ul class='devices'>";
                    Object.keys(devicesInPixel).forEach(function(name) {
                        content += "<li data-id='" + devicesInPixel[name].id + "' data-coord='" + devicesInPixel[name].coord + "'>" + name + "</li>";
                    });
                    content += "</ul>";
                }
                if(Object.keys(circuitsInPixel).length) {
                    content += "<h3>Circuits:</h3><ul class='circuits'>";
                    Object.keys(circuitsInPixel).forEach(function(name) {
                        content += "<li style='color: " + circuitsInPixel[name].color + "' data-id='" + circuitsInPixel[name].id + "'>" + name + "</li>";
                    });
                    content += "</ul>";
                }

                if(content) {
                    content_element.innerHTML = content;
                    overlay.setPosition(event.coordinate);
                    self.setCenter.trigger(self, event.coordinate);
                } else {
                    closeTooltip();
                }
            });

            function getDevice(evt) {
                var details;
                var contex = $(this);
                var coord = contex.data("coord").split(',');
                coord = [Number(coord[0]), Number(coord[1])];
                
				/* $Ajax.get('device/' + contex.data("id") + '/detail', {}, function(detail) {
                    var content = '\
                    <div class="leaflet-popup-content" style="width: 251px;margin: 0;">\
                    <div class="colQuarter" style="color:red;text-align:center;"><p>Critcal</p><p>' + detail.device.Critical + '</p></div>\
                    <div class="colQuarter" style="color:orange;text-align:center;"><p>Major</p><p>' + detail.device.Major + '</p></div>\
                    <div class="colQuarter" style="color:rgb(185, 185, 0);text-align:center;"><p>Minor</p><p>' + detail.device.Minor + '</p></div>\
                    <div class="colQuarter" style="color:blue;text-align:center;"><p>Info</p><p>' + detail.device.Info + '</p></div>\
                    <div class="line"><div class="left"><p>Name :</p></div><div class="right"><p>' + contex.text() + '</p></div></div>\
                    <div class="line"><div class="left"><p>Device Serial :</p></div><div class="right"><p>' + detail.device.SerialNumber + '</p></div></div>\
                    <div class="line"><div class="left"><p>Hardware Version :</p></div><div class="right"><p>' + detail.device.HardwareVersion + '</p></div></div>\
                    <div class="line"><div class="left"><p>SNMP Last Seen Date :</p></div><div class="right"><p>' + detail.device.SnmpLastSeenDate + '</p></div></div>\
                    <div class="line"><div class="left"><p>CSV Last Seen Date :</p></div><div class="right"><p>' + detail.device.CsvLastSeenDate + '</p></div></div>\
                    <div class="clear"></div></div>';

                    content_element.innerHTML = content;
                    overlay.setPosition(coord);
                    self.setCenter.trigger(self, coord, 8);
                }); */
				
				$.ajax({
					url: "http://10.131.65.116:3000/device/" + contex.data("id") + "/detail?Token=e53c115211af80b34738&",
					method: "GET",
				})
				.done(detail => {
					var content = '\
						<div class="leaflet-popup-content" style="width: 251px;margin: 0;">\
						<div class="colQuarter" style="color:red;text-align:center;"><p>Critcal</p><p>' + detail.device.Critical + '</p></div>\
						<div class="colQuarter" style="color:orange;text-align:center;"><p>Major</p><p>' + detail.device.Major + '</p></div>\
						<div class="colQuarter" style="color:rgb(185, 185, 0);text-align:center;"><p>Minor</p><p>' + detail.device.Minor + '</p></div>\
						<div class="colQuarter" style="color:blue;text-align:center;"><p>Info</p><p>' + detail.device.Info + '</p></div>\
						<div class="line"><div class="left"><p>Name :</p></div><div class="right"><p>' + contex.text() + '</p></div></div>\
						<div class="line"><div class="left"><p>Device Serial :</p></div><div class="right"><p>' + detail.device.SerialNumber + '</p></div></div>\
						<div class="line"><div class="left"><p>Hardware Version :</p></div><div class="right"><p>' + detail.device.HardwareVersion + '</p></div></div>\
						<div class="line"><div class="left"><p>SNMP Last Seen Date :</p></div><div class="right"><p>' + detail.device.SnmpLastSeenDate + '</p></div></div>\
						<div class="line"><div class="left"><p>CSV Last Seen Date :</p></div><div class="right"><p>' + detail.device.CsvLastSeenDate + '</p></div></div>\
						<div class="clear"></div></div>';

					content_element.innerHTML = content;
					overlay.setPosition(coord);
					self.setCenter.trigger(self, coord, 8);
				});
            }
            $("#popup-content").on("click", ".devices li", getDevice);

            function getCircuit() {
                circuitID = $(this).data("id");
                $location.path('/device/circuit/view/' + circuitID);
            }
            $("#popup-content").on("click", ".circuits li", getCircuit);
        },
        addPanel: function() {
            var map = this.container;
            var fullscreen = new ol.control.FullScreen();
            map.addControl(fullscreen);
        },
		zoomEvent: function() {
            var self = this;
            var map = this.container;
            var lastZoomLevel = self.view.getZoom();
            map.on('moveend', function(event) {
                if (lastZoomLevel != self.view.getZoom()) {
                    lastZoomLevel = self.view.getZoom();
                    self.violatedServices.redraw(self);
                }
            });
        },
		setPointer: function() {
            var self = this;
            var map = this.container;
            map.on('pointermove', function(event) {
                if (event.dragging) return;

                // TODO: just for Devices and Circuits
                var isDevice = map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
                    if (layer !== self.violationLayer)
                        return true;
                });
                map.getTarget().style.cursor = isDevice ? 'pointer' : '';;

                // TODO: for all features
                // var pixel = map.getEventPixel(event.originalEvent);
                // var hit = map.hasFeatureAtPixel(pixel);
                // map.getTarget().style.cursor = hit ? 'pointer' : '';
            });
        },
		getData: function(params) {
            var self = this;
            params = params ? params : {};
            var page = params.page ? params.page : 1;
            var allowClear = params.loop === true ? false : true;

            /* var device_ids = function() {
                var array = [];
                if ($($scope.console.deviceSelectElement).val())
                    $($scope.console.deviceSelectElement).val().split(",").forEach(function(item) {
                        array.push(Number(item));
                    });
                return JSON.stringify(array);
            }; */

           /*  $Ajax.post('device/map/data', {
                group_ids: JSON.stringify($scope.console.selectedGroupIDs),
                device_ids: device_ids(),
                GET: {
                    page: page,
                    violated: self.isViolated,
                    live: self.live
                }
            }, function(data) {
                if (page < data.total_pages) {
                    self.addDataToMap(data, allowClear);
                    self.getData({
                        page: page += 1,
                        loop: true
                    });
                    return;
                }
                self.addDataToMap(data, allowClear);
            }); */
			var THE_DATA = {
				group_ids: JSON.stringify([47, 78, 103, 200, 229, 230, 238, 239, 240, 7]),
				device_ids: JSON.stringify([529, 1330557, 1643890, 1643889])
			};
			$.ajax({
				url: 'http://10.131.65.116:3000/device/map/data?Token=e53c115211af80b34738&page=1', // &violated=true &live=true
				method: "POST",
				contentType: false,
				processData: false,
				data: buildFormdata(THE_DATA)
			})
			.done(data => {
				if (page < data.total_pages) {
					// self.addDataToMap(data, allowClear);
					processData(data, allowClear, self);
					self.getData({
						page: page += 1,
						loop: true
					});
					return;
				}
				// self.addDataToMap(data, allowClear);
				processData(data, allowClear, self);
			});

        },
		makeMap: function() {
            var self = this;

            var layers = [
                new ol.layer.Tile({
                    source: new ol.source.OSM({
                        wrapX: true
                    })
                }),
                self.violationLayer,
                self.deviceLayer
            ];

            $.each(self.layers, function(key, layer) {
                layer.setSource(self.sources[key]);
                layer.setStyle(self.lineStyle(key));
                layers.push(layer);
            });

            self.container = new ol.Map({
                layers: layers,
                target: self.target,
                controls: ol.control.defaults({
                    attributionOptions: ({
                        collapsible: false
                    })
                }),
                view: self.view
            });
            self.deviceLayer.setSource(self.deviceSource);
            self.deviceLayer.setStyle(self.deviceStyle);
            self.deviceLayer.setZIndex(10);

            self.violationLayer.setSource(self.violationSource);
            self.violationLayer.setZIndex(20);

            // TODO: optional (use as a feauture)
            self.layers.circuit.setZIndex(0);
            self.layers.info.setZIndex(1);
            self.layers.minor.setZIndex(2);
            self.layers.major.setZIndex(3);
            self.layers.critical.setZIndex(4);
        },
		init: function() {
            var self = this;
			
            self.makeMap();
            self.getData();
            self.setPointer();
            self.zoomEvent();
            self.addTooltip();
            // self.addPanel();
        },
	};
}


$(function () {
	var map = newMap();
	
	map.init();
	
});


