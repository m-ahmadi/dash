define([
	"config",
	"token",
	"./makeLineChart",
], (conf, token, makeLineChart) => {
	const manager = u.extend( newPubSub() );
	const temp = Handlebars.templates;
	const extractor = newPubSub();
	
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
		worker = new Worker(conf.ROOT + "js/widget/worker.js");
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
				id: ""+sensor.id,
				type: "line",
				name: sensor.name,
				color: "#"+ sensor.color,
				data: [],
				tooltip: {
					// valueDecimals: 2
					valueSuffix: " " + sensor.unit
				}
			});
		});
		return res;
	}
	function makeBarChart(container, title, series) {
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
			series: series,
			rangeSelector: false,
			exporting: false,
			credits: false,
			legend: {
				enabled: true
			}
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
	function buildFormdata(o) {
		let res = new FormData();
		Object.keys(o).forEach(k => {
			res.append(k, o[k]);
		});
		return res;
	}
	function createPanel(parent, type, rangeTitle, id, expand, min) {
		const ctx = {
			title: makeTitle(type),
			rangeTitle: rangeTitle,
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
		let startDate, endDate; // for customized ranges
		let xhr;
		
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
						setExtremes: e => {
							let d = e.DOMEvent;
							let trigger = e.trigger;
							if ( (d && d.DOMType !== "mousemove") || trigger === "zoom" ) { // drag-end or zoom
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
				series: generateSeries(sensors)
			});
		}
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
			if (xhr) {
				xhr.abort();
				spinnerOff();
			}
			spinnerOn();
			chart ? chart.showLoading() : undefined;
			xhr = $.ajax({
				url: conf.BASE +"device/devicekpisensordata"+ token(),
				method: "POST",
				data: {
					start_date: startDate || getDate(w.rangeType, w.rangeCount),
					end_date: endDate || getDate(),
					device_ids: jsonStr([w.device.id]),
					service_ids: jsonStr([w.service.id]),
					kpis: jsonStr( getSensors(w.sensors) )
				}
			})
			.done(data => {
				let forworker = {reqId: w.id, rawData: []};
				if (!data) {
					worker.postMessage(forworker);
				} else if (data.length) {
					forworker.rawData = data;
					worker.postMessage(forworker);
				}
				spinnerOff();
				mark(true);
				chart.hideLoading();
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
		function loadStat() {
			$.ajax({
				url: conf.BASE +"stat/violation"+ token(),
				method: "POST",
				contentType: false,// "multipart/form-data",
				processData: false,
				data: buildFormdata({
					start_date: getDate(w.rangeType, w.rangeCount),
					end_date: getDate(),
					groups: jsonStr( [w.group] ),
					kpis: jsonStr( w.statKpis )
				})
			})
			.done(data => {
				let d = data[0];
				let a = d.kpis_data;
				let series = [];
				a.forEach(i => {
					series.push({
						name: i.KPI,
						data: [i.ratio]
					});
				});
				
				console.log(series);
				chart = makeBarChart(els.container, d.group, series);
				spinnerOff();
				mark(true);
				chart.hideLoading();
			})
			.fail(x => {
				spinnerOff();
				mark(false, true);
				chart.hideLoading();
				if (x.status === 403) manager.emit("login_error");
			})
		}
		function load() {
			switch (w.type) {
				case 0: loadGraphSensorData(); break;
				case 1: loadStat(); break;
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
				let firstTime = true;
				chart = makeLineChart(els.container, w.device.name, w.sensors);
				chart.setSize();
				
				extractor.on(""+w.id, o => {
					Object.keys(o).forEach(k => {
						chart.get(k).setData( o[k] );
					});
					/* d.forEach((i, x) => {
					//	chart.series[x].update({data: i});
						
						chart.series[x].setData(i);
					}); */
					if (firstTime) {
						chart.update({
							navigator: {
								series: {
									data: o[ Object.keys(o)[0] ],
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
						firstTime = false;
					}
					
				});
			
			} else if (type === 1) {
				//chart = makeBarChart(els.container);
				//chart.setSize();
			} else if (type === 2) {
				chart = makeBarChart(els.container);
				chart.setSize();
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
				case 0: chart = makeLineChart(els.body, w.device.name, w.sensors); break;
				case 1: chart = makeBarChart(els.body); break;
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