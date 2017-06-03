define([
	"config",
	"token",
	"./makeLineChart",
], (conf, token, makeLineChart) => {
	const manager = u.extend( newPubSub() );
	const temp = Handlebars.templates;
	const extractor = newPubSub();
	
	const BODY = "[data-container]";
	const KLASS_X1 = [
		"uk-width-1-1@s",
		"uk-width-1-1@m",
		"uk-width-1-2@l",
		"uk-width-1-2@xl"
	].join(" ");
	const KLASS_X2 = [
		"uk-width-1-1@s",
		"uk-width-1-1@m",
		"uk-width-2-3@l",
		"uk-width-3-4@xl"
	].join(" ");
	const KLASS_X3 = "uk-width-1-1";
	const KLASSES = `${KLASS_X1} ${KLASS_X2} ${KLASS_X3}`;
	
	const DATE_FORMAT = "Y/MM/DD HH:mm";
	const jsonStr = JSON.stringify;
	const jsonParse = JSON.parse;
	let worker;
	
	
	function init() {
		worker = new Worker(conf.ROOT + "js/content/Widget/worker.js");
		worker.onmessage = e => {
			let d = e.data;
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
		let a = [];
		Object.keys(o).forEach(i => {
			let p = o[i];
			a.push({
				id: p.id,
				unit: p.unit
			});
		});
		return a;
	}
	function generateSeries(sensors) {
		let res = [];
		Object.keys(sensors).forEach(i => {
			let sensor = sensors[i];
			res.push({
				type: "line",
				name: sensor.name,
				color: "#"+ sensor.color,
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
		let title;
		switch (type) {
			case 0: title = "Graph Sensor";           break;
			case 1: title = "Sensor Violation Ratio"; break;
			case 2: title = "Sensor Violation Stats"; break;
			case 3: title = "Map";                    break;
		}
		return title;
	}
	function createPanel(parent, type, rangeTitle, id, expand, min) {
		let body;
		const ctx = {
			title: makeTitle(type),
			rangeTitle: rangeTitle,
			body: body,
			id: id,
			xOne: expand === 1,
			xTwo: expand === 2,
			xThree: expand === 3,
			min: min
		};
		const html = temp.panel(ctx);
		parent.append(html);
		return parent.children().last();
	}
	
	function constructor(container, o) {
		const inst = {};
		let w = {},
			root, els,
			chart = {};
		
		if (!container || !o) {
			throw new TypeError("You must provide a container and a widget object.");
		}
		w = o;
		
		
		function min() {
			let el = els.body;
			root.data("min", true);
			els.menus.find("[data-resize]").html( temp.btnMax() );
			
			!el.is(":animated") ? el.slideUp(400, () => {
				//if (chart) chart.setSize();
			}) : undefined;
		}
		function max() {
			let el = els.body;
			root.data("min", false);
			els.menus.find("[data-resize]").html( temp.btnMin() );
			
			!el.is(":animated") ? el.slideDown(400, () => {
				if (chart) chart.setSize();
			}) : undefined;
		}
		function expand() {
			let curr = parseInt(root.attr("data-expand"), 10);
			let inced = curr + 1;
			let n = inced > 3 ? 3 :
					inced < 0 ? 0 : inced;
			root.attr("data-expand", n);
			root.removeClass(KLASSES);
			let toAdd;
			switch (curr) {
				case 0: toAdd = KLASS_X1; break;
				case 1: toAdd = KLASS_X2; break;
				case 2: toAdd = KLASS_X3; break;
				case 3: toAdd = KLASS_X3; break;
			}
			root.addClass(toAdd);
			if (chart) chart.setSize();
		}
		function shrink() {
			let curr = parseInt(root.attr("data-expand"), 10);
			let deced = curr - 1;
			let n = deced > 3 ? 3 :
					deced < 0 ? 0 : deced;
			root.attr("data-expand", n);
			root.removeClass(KLASSES);
			let toAdd;
			switch (curr) {
				case 0: toAdd = ""; break;
				case 1: toAdd = ""; break;
				case 2: toAdd = KLASS_X1; break;
				case 3: toAdd = KLASS_X2; break;
			}
			root.addClass(toAdd);
			if (chart) chart.setSize();
		}
		function mark(stat, keep) {
			let par = els.spinnerParent;
			par.html("&nbsp;");
			par.append( stat ? temp.markSuccess() : temp.markFail() );
			if (!keep) {
				setTimeout(() => par.html("&nbsp;"), 1200);
			}
		}
		function spinnerOn() {
			let par = els.spinnerParent;
			par.html("&nbsp;");
			par.append( temp.spinner() );
		}
		function spinnerOff() {
			els.spinnerParent.html("&nbsp;");
		}
		function loadGraphSensorData() {
			spinnerOn();
			chart ? chart.showLoading() : undefined;
			$.ajax({
				url: conf.BASE +"device/devicekpisensordata"+ token(),
				method: "POST",
				data: {
					start_date: getDate(w.rangeType, w.rangeCount),
					end_date: getDate(),
					device_ids: jsonStr([w.device.id]),
					service_ids: jsonStr([w.service.id]),
					kpis: jsonStr( getSensors(w.sensors) )
				}
			})
			.done(data => {
				if (!data) {
					worker.postMessage({reqId: w.id, rawData: []});
				} else if (data.length) {
					worker.postMessage({reqId: w.id, rawData: data});
				}
				spinnerOff();
				mark(true);
				chart.hideLoading()
			})
			.fail(x => {
				spinnerOff();
				mark(false, true);
				chart.hideLoading();
				// root.children().first().prepend( temp.alert({message: "Couldn't fetch widget data."}) );
				if (x.status === 403) manager.emit("login_error");
			})
			.always(() => els.refresh.attr({disabled: false}));
		}
		function load() {
			switch (w.type) {
				case 0: loadGraphSensorData(w); break;
				case 1: ; break;
				case 2: ; break;
				case 3: ; break;
			}
		}
		function init() {
			root = createPanel(container, w.type, w.rangeTitle, w.id, w.expand, w.min);
			els = u.getEls(root);
			
			// when creating dom stuff.
			 
			const type = w.type;
			if (type === 0) {
				chart = makeLineChart(els.body, w.device.name, w.sensors);
				
				extractor.on(""+w.id, d => {
					d.forEach((i, x) => {
						chart.series[x].update({data: i});
					});
				});
			
			} else if (type === 1) {
			
			} else if (type === 2) {
			
			} else if (type === 3) {
			
			}
			
			els.menus.on("click", "[data-menu]", e => {
				let action = $(e.target).data().action || $(e.currentTarget).data().action;
					action = parseInt(action, 10);
				if (action === 0) {
					max();
				} else if (action === 1) {
					min();
				}
			});
			els.expand.on("click", () => {
				expand();
			});
			els.shrink.on("click", () => {
				shrink();
			});
			els.remove.on("click", () => {
				els.menuBtn.mouseout();
				manager.emit("delete", w.id);
			});
			els.refresh.on("click", e => {
				$(e.target).attr({disabled: true});
				load();
			});
			els.edit.on("click", () => {
				els.menuBtn.mouseout();
				
				manager.emit("edit", w)
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
		inst.remove = () => {
			root.remove();
			chart ? chart.destroy() : undefined;
		};
		inst.update = obj => {
			w = obj;
			els.title.text( makeTitle(w.type) );
			els.rangeTitle.text( w.rangeTitle );
			switch (w.type) {
				case 0: editLineChart(chart, w.device.name, w.sensors); break;
				case 1: ; break;
				case 2: ; break;
				case 3: ; break;
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