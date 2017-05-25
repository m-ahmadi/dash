define([
	"config",
	"token",
	"./makeLineChart",
	"../wizard"
], (conf, token, makeLineChart, wizard) => {
	const temp = Handlebars.templates;
	const BODY = "[data-container]";
	const KLASS = [
		"uk-width-1-1@s",
		"uk-width-1-1@m",
		"uk-width-1-2@l",
		"uk-width-1-2@xl"
	].join(" ");
	const jsonStr = JSON.stringify;
	const jsonParse = JSON.parse;
	let worker;
	
	const extractor = newPubSub();
	function init() {
		worker = new Worker(conf.ROOT + "js/content/Widget/worker.js");
		worker.onmessage = e => {
			let d = e.data;
			extractor.emit(d.reqId, d.result);
		};
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
	function createPanel(parent, type, rangeTitle, id, expand) {
		let body, title;
		switch (type) {
			case 0: body = temp.lineChart(); title = "Graph Sensor";           break;
			case 1: body = temp.barChart();  title = "Sensor Violation Ratio"; break;
			case 2: body = "";               title = "Sensor Violation Stats"; break;
			case 3: body = "";               title = "Map";                    break;
		}
		const ctx = {
			title: title,
			range: rangeTitle,
			body: body,
			id: id,
			expand: expand
		};
		const html = temp.panel(ctx);
		parent.append(html);
		return parent.children().last();
	}
	
	function constructor(container, e) {
		let inst = {};
		let root,
			els,
			chart = {};
		
		if (!container || !e) {
			throw new TypeError("You must provive a container and a widget object.");
		}
		
		function toggleSpinner() {
			let len = els.spinnerParent.children().length;
			if (len) {
				els.spinnerParent.empty();
			} else {
				els.spinnerParent.append( temp.spinner() );
			}
		}
		function loadGraphSensorData(e) {
			toggleSpinner();
			$.ajax({
				url: conf.BASE +`device/devicekpisensordata`+ token(),
				method: "POST",
				data: {
					start_date: e.startDate,
					end_date: e.endDate,
					device_ids: jsonStr([e.device.id]),
					service_ids: jsonStr([e.service.id]),
					kpis: jsonStr( getSensors(e.sensors) )
				}
			})
			.done(data => {
				if (!data) {
					worker.postMessage({reqId: e.id, rawData: []});
				} else if (data.length) {
					worker.postMessage({reqId: e.id, rawData: data});
				}
				toggleSpinner();
			})
			.fail(() => {
				console.log(root, els);
				els.root.prepend( temp.alert({message: "Couldn't fetch widget data."}) );
				toggleSpinner();
			});
		}
		function load() {
			switch (e.type) {
				case 0: loadGraphSensorData(e); break;
				case 1: ; break;
				case 2: ; break;
				case 3: ; break;
			}
		}
		function init() {
			root = createPanel(container, e.type, e.rangeTitle, e.id, e.expand);
			els = u.getEls(root);
			
			// when creating dom stuff.
			 
			const type = e.type;
			if (type === 0) {
				// debugger
				chart = makeLineChart(els.body, e.device.name, e.sensors);
				
				extractor.on(e.id, d => {
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
				console.log(action);
				if (action === 0) {
					if ( !root.hasClass(KLASS) ) {
						root.addClass(KLASS);
						els.menus.find("[data-resize]").html( temp.btnShrink() );
						if (chart) {
							chart.setSize();
						}
					}
				} else if (action === 1) {
					root.removeClass(KLASS);
					els.menus.find("[data-resize]").html( temp.btnExpand() );
					if (chart) {
						chart.setSize();
					}
				}
			});
			els.edit.on("click", () => {
				switch (e.type) {
					case 0: ; break;
					case 1: ; break;
					case 2: ; break;
					case 3: ; break;
				}
			});
			els.remove.on("click", () => {
				wizard.deleteConfirm(e.id);
			});
			els.refresh.on("click", () => {
				load();
			});
		}
		
		inst.shrink = () => {
			el.removeClass(KLASS);
			el.find("[data-resize]").html(temp.btnExpand);
			el.find(BODY).highcharts().setSize();
		};
		inst.remove = () => {
			root.remove();
		};
		inst.chart = () => {return chart};
		
		
		init();
		load();
		
		return inst;
	}
	
	
	window.newWidget = constructor;
	return {newWidget, init};
});