define([
	"config",
	"token",
	"./makeLineChart",
	"./barChart",
	"./table",
	"./map"
], (conf, token, makeLineChart, barChart, table, map) => {
	const inst = u.extend( newPubSub() );
	const MSG = [
		"Could not find CIRCUIT_ID of the selected service. ",
		"(circuits empty)",
		"(not found in circuits)",
		"Selected sensor does not have any chart_data in the ",
		"Network Error.",
		"Saving Failed. "
	];
	const temp = Handlebars.templates;
	let widgets = {};
	let parent, e = {};
	let counter = 0;
	
	function uid() {
		var d = new Date().getTime();
		if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
			d += performance.now(); //use high-precision timer if available
		}
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}
	
	
	function buildServerData() {
		const o = {
			type: e.type
		};
		
	}
	function save(route, cb) {
		$.ajax({
			url: conf.TMP + route,
			method: "GET",
			data: {
				widget: JSON.stringify(e)
			}
		})
		.done( d => cb(false) )
		.fail( (x, err) => cb(true, err) );
	}
	function findCircuitId(cb) {
		const deviceId = e.device.id;
		const tok = token();
		$.ajax({
			url: conf.BASE + `device/${deviceId}/detail${tok}`,
			method: "GET"
		})
		.done(data => {
			let circuitId;
			let target = data.circuits;
			if (!target.length) {
				cb(false, true);
				return;
			}
			target.forEach(i => {
				if (i.ServiceForward === e.service.id ||
					i.ServiceBackward === e.service.id) {
					circuitId = i.ID;
					return;
				}
			});
			cb(circuitId);
		})
		.fail( () => cb(false) );
	}
	function getLast() {
		return parent.find(`[data-panel]:last-child [data-container]`);
	}
	function addLinechart(many, cb) {
		findCircuitId((circuitId, empty) => {
			if ( !u.isNum(circuitId) ) {
				inst.emit("error", { set: 2, msg: MSG[0] + MSG[empty? 1 : 2] });
				return;
			}
			$.ajax({
				url: conf.BASE +`device/circuit/${circuitId}/sensor`+ token(),
				method: "POST",
				data: {
					start_date: e.startDate,
					end_date: e.endDate,
					sensors: JSON.stringify(e.sensors),
					is_snmp: false
				},
			})
			.done(data => {
				let target = data.chart_response;
				if (!target) {
					inst.emit("error", { set: 2, msg: MSG[3]+e.rangeTitle.toLowerCase()+"." });
				}
				if (target) {
					const html = temp.panel( {title: "Graph Sensor", range: e.rangeTitle, body: temp.lineChart()} );
					parent.append(html);
					const container = getLast();
					const names = e.sensorNames;
					makeLineChart(container, target, temp.graphTitle({
						device: e.device.name,
						service: e.service.name,
						sensors: names.length > 1 ? names.join(", ") : names[0]
					}));
					cb ? cb() : undefined;
					inst.emit("add", many);
				}
			})
			.fail( () => inst.emit("error", { set: 2, msg: MSG[4]}) );
		});
	}
	function _add(type, parentEl) {
		let html;
		let o = {body: undefined};
		switch (type) {
			case 0: o.body = temp.lineChart(); break;
			case 1: o.body = temp.barChart(); break;
			case 2: o.body = temp.table( gen() ); break;
			case 3: o.body = temp.map(); break;
		}
		html = temp.panel(o);
		parentEl.append(html);
		const container = getLast();
		switch (type) {
			case 0: lineChart.init(container); break;
			case 1: barChart(container); break;
			case 2: undefined; break;
			case 3: map(container); break;
		}
	}
	
	function main() {
		
	}
	function add(data, toAppend, saveIt, cb) {
		e = data;
		parent = toAppend;
		
		switch (e.type) {
			case 0:
				addLinechart(!saveIt, () => {
					if (saveIt) {
						save("widget/add", (err, m) => {
							if (err) {
								inst.emit("error", { set: 2, msg: MSG[4]+m });
							}
						});
					}
					cb ? cb() : undefined;
				});
				break;
			case 1: addBarchart(); break;
			case 2: addTable(); break;
			case 3: addMap(); break;
		}
		
	}
	function addMany(arr, parent, cb) {
		const last = arr.length - 1;
		arr.forEach((i, x) => {
			if (x === last) {
				add(i, parent, false, cb);
			} else {
				add(i, parent, false);
			}
		});
	}
	
	
	inst.add = add;
	inst.addMany = addMany;
	// , update, fetch
	return inst;
});