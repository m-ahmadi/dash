define(["config", "token", "./makeLineChart"], function (conf, token, makeLineChart) {
	var manager = u.extend(newPubSub());
	var temp = Handlebars.templates;
	var extractor = newPubSub();

	var BODY = "[data-container]";
	var KLASS_X1 = ["uk-width-1-1@s", "uk-width-1-1@m", "uk-width-1-2@l", "uk-width-1-2@xl"].join(" ");
	var KLASS_X2 = ["uk-width-1-1@s", "uk-width-1-1@m", "uk-width-2-3@l", "uk-width-3-4@xl"].join(" ");
	var KLASS_X3 = "uk-width-1-1";
	var KLASSES = KLASS_X1 + " " + KLASS_X2 + " " + KLASS_X3;

	var DATE_FORMAT = "Y/MM/DD HH:mm";
	var jsonStr = JSON.stringify;
	var jsonParse = JSON.parse;
	var worker = void 0;

	function init() {
		worker = new Worker(conf.ROOT + "js/content/Widget/worker.js");
		worker.onmessage = function (e) {
			var d = e.data;
			extractor.emit(d.reqId, d.result);
		};
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
	function generateSeries(sensors) {
		var res = [];
		Object.keys(sensors).forEach(function (i) {
			var sensor = sensors[i];
			res.push({
				type: "line",
				name: sensor.name,
				color: "#" + sensor.color,
				data: [],
				tooltip: {
					valueDecimals: 2
				}
			});
		});
		return res;
	}
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
			},
			legend: {
				enabled: true
			},
			series: generateSeries(sensors)
		});
	}
	function editLineChart(chart, title, sensors) {
		chart.update({
			title: {
				text: title
			},
			series: generateSeries(sensors)
		});
	}
	function makeTitle(type) {
		var title = void 0;
		switch (type) {
			case 0:
				title = "Graph Sensor";break;
			case 1:
				title = "Sensor Violation Ratio";break;
			case 2:
				title = "Sensor Violation Stats";break;
			case 3:
				title = "Map";break;
		}
		return title;
	}
	function createPanel(parent, type, rangeTitle, id, expand, min) {
		var body = void 0;
		var ctx = {
			title: makeTitle(type),
			rangeTitle: rangeTitle,
			body: body,
			id: id,
			xOne: expand === 1,
			xTwo: expand === 2,
			xThree: expand === 3,
			min: min
		};
		var html = temp.panel(ctx);
		parent.append(html);
		return parent.children().last();
	}

	function constructor(container, o) {
		var inst = {};
		var w = {},
		    root = void 0,
		    els = void 0,
		    chart = {};

		if (!container || !o) {
			throw new TypeError("You must provide a container and a widget object.");
		}
		w = o;

		function min() {
			var el = els.body;
			root.data("min", true);
			els.menus.find("[data-resize]").html(temp.btnMax());

			!el.is(":animated") ? el.slideUp(400, function () {
				//if (chart) chart.setSize();
			}) : undefined;
		}
		function max() {
			var el = els.body;
			root.data("min", false);
			els.menus.find("[data-resize]").html(temp.btnMin());

			!el.is(":animated") ? el.slideDown(400, function () {
				if (chart) chart.setSize();
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
		function loadGraphSensorData() {
			spinnerOn();
			chart ? chart.showLoading() : undefined;
			$.ajax({
				url: conf.BASE + "device/devicekpisensordata" + token(),
				method: "POST",
				data: {
					start_date: getDate(w.rangeType, w.rangeCount),
					end_date: getDate(),
					device_ids: jsonStr([w.device.id]),
					service_ids: jsonStr([w.service.id]),
					kpis: jsonStr(getSensors(w.sensors))
				}
			}).done(function (data) {
				if (!data) {
					worker.postMessage({ reqId: w.id, rawData: [] });
				} else if (data.length) {
					worker.postMessage({ reqId: w.id, rawData: data });
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
				return els.refresh.attr({ disabled: false });
			});
		}
		function load() {
			switch (w.type) {
				case 0:
					loadGraphSensorData(w);break;
				case 1:
					;break;
				case 2:
					;break;
				case 3:
					;break;
			}
		}
		function init() {
			root = createPanel(container, w.type, w.rangeTitle, w.id, w.expand, w.min);
			els = u.getEls(root);

			// when creating dom stuff.

			var type = w.type;
			if (type === 0) {
				chart = makeLineChart(els.body, w.device.name, w.sensors);

				extractor.on("" + w.id, function (d) {
					d.forEach(function (i, x) {
						chart.series[x].update({ data: i });
					});
				});
			} else if (type === 1) {} else if (type === 2) {} else if (type === 3) {}

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
				$(e.target).attr({ disabled: true });
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
			chart ? chart.destroy() : undefined;
		};
		inst.update = function (obj) {
			w = obj;
			els.title.text(makeTitle(w.type));
			els.rangeTitle.text(w.rangeTitle);
			switch (w.type) {
				//	case 0: editLineChart(chart, w.device.name, w.sensors); break;
				case 0:
					chart = makeLineChart(els.body, w.device.name, w.sensors);break;
				case 1:
					;break;
				case 2:
					;break;
				case 3:
					;break;
			}

			load();
		};

		manager.emit("create_node", w.id, inst);
		window.asad = inst;
		return inst;
	}

	manager.create = constructor;
	manager.init = init;

	return manager;
});
//# sourceMappingURL=widget.js.map