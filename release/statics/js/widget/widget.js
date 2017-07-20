define(["core/config", "core/token", "./mapMaker"], function (conf, token, mapMaker) {
	var manager = u.extend(newPubSub());
	var temp = u.getTemps("widget");
	var extractor = newPubSub();

	var KLASS_X1 = ["uk-width-1-1@s", "uk-width-1-1@m", "uk-width-1-2@l", "uk-width-1-2@xl"].join(" ");
	var KLASS_X2 = ["uk-width-1-1@s", "uk-width-1-1@m", "uk-width-2-3@l", "uk-width-3-4@xl"].join(" ");
	var KLASS_X3 = "uk-width-1-1";
	var KLASSES = KLASS_X1 + " " + KLASS_X2 + " " + KLASS_X3;

	var DATE_FORMAT = "Y/MM/DD HH:mm";
	var jsonStr = JSON.stringify;
	var jsonParse = JSON.parse;
	var worker = void 0;

	function init() {
		worker = new Worker(conf.ROOT + "js/worker.js");
		worker.onmessage = function (e) {
			var d = e.data;
			extractor.emit(d.reqId, d.result);
		};
		setGlobalTZ();
	}

	function setGlobalTZ(userOffset) {
		var offset = userOffset || 16200;
		Highcharts.setOptions({
			global: {
				timezoneOffset: -offset / 60
			}
		});
	}
	function getDate(type, count) {
		if (type && count) {
			return moment().subtract(count, type).format(DATE_FORMAT);
		} else {
			return moment().format(DATE_FORMAT);
		}
	}
	function getSensors(o) {
		var a = [];
		Object.keys(o).forEach(function (i) {
			var p = o[i];
			a.push({
				id: p.id,
				unit: p.unit
			});
		});
		return a;
	}
	function genSeries(sensors) {
		// for line charts
		var res = [];
		Object.keys(sensors).forEach(function (i) {
			var sensor = sensors[i];
			res.push({
				id: "" + sensor.id,
				type: "line",
				name: sensor.name,
				color: "#" + sensor.color,
				data: [],
				tooltip: {
					valueDecimals: 2,
					valueSuffix: " " + sensor.units.filter(function (o) {
						return o.selected;
					})[0].name
				}
			});
		});
		return res;
	}
	function genSeries2(sensors) {
		// for bar charts
		var res = [];
		Object.keys(sensors).forEach(function (k) {
			var sensor = sensors[k];
			res.push({
				id: sensor.id,
				name: sensor.name,
				tooltip: {
					valueDecimals: 2
				},
				data: []
			});
		});
		return res;
	}
	function makeBarChart(container, title, sensors) {
		return Highcharts.chart(container[0], {
			chart: {
				type: "column"
			},
			title: {
				align: "left",
				text: title || "",
				style: {
					color: "#717171",
					fontSize: "14px"
				}
			},
			yAxis: {
				title: false
			},
			series: genSeries2(sensors),
			rangeSelector: false,
			exporting: false,
			credits: false,
			legend: {
				enabled: true
			}
		});
	}
	function makeTitle(type) {
		var title = void 0;
		switch (type) {
			case 0:
				title = "Graph Sensor";break;
			case 1:
				title = "Violation Ratio";break;
			case 2:
				title = "Stat";break;
			case 3:
				title = "Map";break;
		}
		return title;
	}
	function buildFormdata(o) {
		var res = new FormData();
		Object.keys(o).forEach(function (k) {
			res.append(k, o[k]);
		});
		return res;
	}
	function updateTable(d, tEls) {
		Object.keys(d).forEach(function (k) {
			var el = tEls[k];
			var n = d[k];
			el.text(n);
			/* switch (true) {
   	case (n < 10):          el.addClass("green-text");  break;
   	case (n > 10 && n< 30): el.addClass("orange-text"); break;
   	case (n > 30):          el.addClass("red-text");    break;
   } */
		});
	}
	function createPanel(parent, type, rangeTitle, id, expand, min) {
		var ctx = {
			title: makeTitle(type),
			rangeTitle: type === 3 ? undefined : rangeTitle,
			id: id,
			xOne: expand === 1,
			xTwo: expand === 2,
			xThree: expand === 3,
			min: min,
			map: type === 3
		};
		var html = temp.panel(ctx);
		parent.append(html);
		return parent.children().last();
	}

	function constructor(container, o) {
		var inst = {};
		var w = {};
		var root = void 0,
		    els = void 0;
		var chart = void 0;
		var startDate = void 0,
		    endDate = void 0; // for customized ranges
		var map = void 0;
		var xhr = void 0;
		var updateNavigator = true;
		var toggle = {
			refresh: function refresh(b) {
				els.refresh.attr({ disabled: !b });
			}
		};

		if (!container || !o) {
			throw new TypeError("You must provide a container and a widget object.");
		}
		w = o;

		function makeLineChart(container, title, sensors) {
			return Highcharts.stockChart(container[0], {
				rangeSelector: false,
				exporting: false,
				credits: false,
				title: {
					align: "left",
					text: title || "",
					style: {
						color: "#717171",
						fontSize: "14px"
					}
				},
				chart: {
					zoomType: "x"
					/* resetZoomButton: { // works only with Highcharts.chart
     	relativeTo: "chart",
     	position: {
     		align: "right",
     		verticalAlign: "top",
     		x: 0,
     		y: 0
     	}
     } */
				},
				navigator: {
					adaptToUpdatedData: false
				},
				xAxis: {
					events: {
						setExtremes: function setExtremes(e) {
							var d = e.DOMEvent;
							var trigger = e.trigger;
							if (d && d.DOMType !== "mousemove" || trigger === "zoom") {
								// drag-end or zoom
								startDate = moment(e.min).format(DATE_FORMAT);
								endDate = moment(e.max).format(DATE_FORMAT);
								loadGraphSensorData();
							}
						}
					}
				},
				legend: {
					enabled: true
				},
				series: genSeries(sensors)
			});
		}
		function min() {
			var el = els.body;
			root.data("min", true);
			els.menus.find("[data-resize]").html(temp.btnMax());

			!el.is(":animated") ? el.slideUp(400, function () {
				// if (chart) chart.setSize();
			}) : undefined;
		}
		function max() {
			var el = els.body;
			root.data("min", false);
			els.menus.find("[data-resize]").html(temp.btnMin());

			!el.is(":animated") ? el.slideDown(400, function () {
				if (chart) chart.setSize();
				if (map) map.container.updateSize();
			}) : undefined;
		}
		function expand() {
			var curr = parseInt(root.attr("data-expand"), 10);
			var inced = curr + 1;
			var n = inced > 3 ? 3 : inced < 0 ? 0 : inced;
			root.attr("data-expand", n);
			root.removeClass(KLASSES);
			var toAdd = void 0;
			switch (curr) {
				case 0:
					toAdd = KLASS_X1;break;
				case 1:
					toAdd = KLASS_X2;break;
				case 2:
					toAdd = KLASS_X3;break;
				case 3:
					toAdd = KLASS_X3;break;
			}
			root.addClass(toAdd);
			if (chart) chart.setSize();
			if (map && els.body.is(":visible")) map.container.updateSize();
		}
		function shrink() {
			var curr = parseInt(root.attr("data-expand"), 10);
			var deced = curr - 1;
			var n = deced > 3 ? 3 : deced < 0 ? 0 : deced;
			root.attr("data-expand", n);
			root.removeClass(KLASSES);
			var toAdd = void 0;
			switch (curr) {
				case 0:
					toAdd = "";break;
				case 1:
					toAdd = "";break;
				case 2:
					toAdd = KLASS_X1;break;
				case 3:
					toAdd = KLASS_X2;break;
			}
			root.addClass(toAdd);
			if (chart) chart.setSize();
			if (map && els.body.is(":visible")) map.container.updateSize();
		}
		function mark(stat, keep) {
			var par = els.spinnerParent;
			par.html("&nbsp;");
			par.append(stat ? temp.markSuccess() : temp.markFail());
			if (!keep) {
				setTimeout(function () {
					return par.html("&nbsp;");
				}, 1200);
			}
		}
		function spinnerOn() {
			var par = els.spinnerParent;
			par.html("&nbsp;");
			par.append(temp.spinner());
		}
		function spinnerOff() {
			els.spinnerParent.html("&nbsp;");
		}
		function loadGraphSensorData(cb) {
			if (xhr) {
				xhr.abort();
				spinnerOff();
			}
			spinnerOn();
			if (chart) chart.showLoading();
			xhr = $.ajax({
				url: conf.BASE + "device/devicekpisensordata" + token(),
				method: "POST",
				data: {
					start_date: startDate || getDate(w.rangeType, w.rangeCount),
					end_date: endDate || getDate(),
					device_ids: jsonStr([w.device.id]),
					service_ids: jsonStr([w.service.id]),
					kpis: jsonStr(getSensors(w.sensors))
				}
			}).done(function (data) {
				var forworker = { action: "line_chart", reqId: w.id, rawData: [] };
				if (!data) {
					worker.postMessage(forworker);
				} else if (data.length) {
					forworker.rawData = data;
					worker.postMessage(forworker);
				}
				spinnerOff();
				mark(true);
				chart.hideLoading();
			}).fail(function (x) {
				spinnerOff();
				mark(false, true);
				chart.hideLoading();
				// root.children().first().prepend( temp.alert({message: "Couldn't fetch widget data."}) );
				if (x.status === 403) manager.emit("login_error");
			}).always(function () {
				return toggle.refresh(true);
			});
		}
		function loadStat(statOnly) {
			spinnerOn();
			if (chart) chart.showLoading();
			$.ajax({
				url: conf.BASE + "stat/violation" + token(),
				method: "POST",
				contentType: false, // "multipart/form-data",
				processData: false,
				data: buildFormdata({
					start_date: getDate(w.rangeType, w.rangeCount),
					end_date: getDate(),
					groups: jsonStr([w.group.id]),
					kpis: jsonStr(w.statKpis.map(function (v) {
						return v.name;
					}))
				})
			}).done(function (data) {
				var target = data[0].kpis_data;
				var forworker = {
					action: statOnly ? "table" : "bar_chart",
					reqId: w.id,
					rawData: statOnly ? data[0] : data[0].kpis_data,
					statKpis: w.statKpis
				};
				worker.postMessage(forworker);
				spinnerOff();
				mark(true);
				if (chart) chart.hideLoading();
			}).fail(function (x) {
				spinnerOff();
				mark(false, true);
				if (chart) chart.hideLoading();
				if (x.status === 403) manager.emit("login_error");
			}).always(function () {
				return toggle.refresh(true);
			});
		}
		function loadMapData() {
			map.getData();
		}
		function load() {
			switch (w.type) {
				case 0:
					loadGraphSensorData();break;
				case 1:
					loadStat();break;
				case 2:
					loadStat(true);break;
				case 3:
					loadMapData();break;
			}
		}
		function init() {
			root = createPanel(container, w.type, w.rangeTitle, w.id, w.expand, w.min);
			els = u.getEls(root);

			// when creating dom stuff.
			var type = w.type;
			if (type === 0) {
				chart = makeLineChart(els.container, w.device.name, w.sensors);
				chart.setSize();

				extractor.on("" + w.id, function (o) {
					Object.keys(o).forEach(function (k) {
						return chart.get(k).setData(o[k]);
					});
					if (!updateNavigator) return;
					chart.update({
						navigator: {
							series: {
								data: o[Object.keys(o)[0]],
								type: 'areaspline',
								color: '#4572A7',
								fillOpacity: 0.05,
								dataGrouping: {
									smoothed: true
								},
								lineWidth: 1,
								marker: {
									enabled: false
								}
							}
						}
					});
					updateNavigator = false;
				});
			} else if (type === 1) {
				chart = makeBarChart(els.container, w.group.name, w.statKpis);
				chart.setSize();

				extractor.on("" + w.id, function (d) {
					d.forEach(function (i) {
						return chart.get(i.id).setData(i.data);
					});
				});
			} else if (type === 2) {
				var body = els.body;
				body.html(temp.statTable({ title: w.group.name, root: conf.ROOT }));
				var tEls = u.getEls(body);
				extractor.on("" + w.id, updateTable, tEls);
			} else if (type === 3) {
				els.body.prepend(temp.mapPopup());
				map = mapMaker.newMap();
				map.target = els.container[0];
				map.events.on("login_error", function () {
					manager.emit("login_error");
				}).on("data_start", spinnerOn).on("data_succ", function () {
					spinnerOff();
					mark(true);
				}).on("data_fail", function () {
					spinnerOff();
					mark(false);
				}).on("data_always", toggle.refresh, true).on("detail_fail", function () {});
				map.toSend = w.map;
				map.init(false);
			}

			els.menus.on("click", "[data-menu]", function (e) {
				var action = $(e.target).data().action || $(e.currentTarget).data().action;
				action = parseInt(action, 10);
				if (action === 0) {
					max();
				} else if (action === 1) {
					min();
				}
			});
			els.expand.on("click", function () {
				expand();
			});
			els.shrink.on("click", function () {

				shrink();
			});
			els.remove.on("click", function () {
				els.menuBtn.mouseout();
				manager.emit("delete", w.id);
			});
			els.refresh.on("click", function (e) {
				if (e.target.disabled) return;
				toggle.refresh(false);
				load();
			});
			els.edit.on("click", function () {
				els.menuBtn.mouseout();
				manager.emit("edit", w);
			});
		}

		init();
		load();

		inst.chart = chart;
		inst.mark = mark;
		inst.refresh = load;
		inst.min = min;
		inst.max = max;
		inst.expand = expand;
		inst.shrink = shrink;
		inst.remove = function () {
			root.remove();
			if (chart) chart.destroy();
		};
		inst.update = function (obj) {
			w = obj;
			els.title.text(makeTitle(w.type));
			els.rangeTitle.text(w.rangeTitle);
			switch (w.type) {
				case 0:
					chart = makeLineChart(els.body, w.device.name, w.sensors);break;
				case 1:
					chart = makeBarChart(els.body, w.group.name, w.statKpis);break;
				case 2:
					els.body.html(temp.statTable({ title: w.group.name, root: conf.ROOT }));
					var tEls = u.getEls(els.body);
					extractor.off("" + w.id, updateTable).on("" + w.id, updateTable, tEls);
					break;
				case 3:
					map.toSend = w.map;
					map.getData();
					break;
			}
			updateNavigator = true;
			load();
		};

		manager.emit("create_node", w.id, inst);
		return inst;
	}

	manager.setGlobalTZ = setGlobalTZ;
	manager.create = constructor;
	manager.init = init;

	return manager;
});
//# sourceMappingURL=widget.js.map