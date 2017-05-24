define([
	"config",
	"token",
	"./makeLineChart"
], (conf, token, makeLineChart) => {
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
		worker = new Worker(conf.ROOT + "js/content/Wiget/worker.js");
		worker.onmessage = e => {
			let d = e.data;
			extractor.emit(d.reqId, d.result);
		};
	}
	function extract() {
		
	}
	function generateSeries(sensors) {
		let res = [];
		sensors.forEach(i => {
			res.push({
				type: "line",
				name: i.name,
				color: "#"+ i.color,
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
		
		
		function loadGraphSensorData(e) {
			$.ajax({
				url: conf.BASE +`device/devicekpisensordata`+ token(),
				method: "POST",
				data: {
					start_date: e.startDate,
					end_date: e.endDate,
					device_ids: jsonStr([e.device.id]),
					service_ids: jsonStr([e.service.id]),
					kpis: jsonStr(e.sensors)
				},
			})
			.done(data => {
				if (data.length) {
					worker.postMessage({reqId: e.id, rawData: data});
				}
			})
			.fail(() => {
				console.log(root, els);
				els.root.prepend( temp.alert({message: "Couldn't fetch widget data."}) );
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
				let el = $(e.target);
				let action = parseInt(el.data().action, 10);
				if (action === 0) {
					if ( !el.hasClass(KLASS) ) {
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
				alert(4);
			});
			els.refresh.on("click", () => {
				alert(5);
			});
		}
		
		inst.shrink = () => {
			el.removeClass(KLASS);
			el.find("[data-resize]").html(temp.btnExpand);
			el.find(BODY).highcharts().setSize();
		};
		inst.chart = () => {return chart};
		
		
		init();
		load();
		
		return inst;
	}
	
	
	window.newWidget = constructor;
	return {constructor, init};
});