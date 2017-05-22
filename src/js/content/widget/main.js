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
	
	function buildServerData() {
		const o = {
			type: e.type
		};
		
	}
	function shrink(el) {
		const id = el.data().id;
		let e = widgets[id];
		e.expand = false;
		$.ajax({
			url: conf.TMP + "widget/edit",
			method: "GET",
			data: JSON.stringify(e)
		})
		.done(() => {
			el.removeClass(k);
			el.find("[data-resize]").html(temp.btnExpand);
			el.find(BODY).highcharts().setSize();
		})
		.fail();
	}
	function expand(el) {
		if ( !el.hasClass(k) ) {
			el.addClass(k);
			el.find("[data-resize]").html(temp.btnShrink);
			el.find(BODY).highcharts().setSize();
		}
	}
	function save(e, route, cb) {
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
	function findCircuitId(e, cb) {
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
	function getLast(el) {
		return el.find(`[data-panel]:last-child [data-container]`);
	}
	function addLinechart(e, parent, many, cb) {
		findCircuitId(e, (circuitId, empty) => {
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
					widgets[e.id] = e;
					const html = temp.panel( {title: "Graph Sensor", range: e.rangeTitle, body: temp.lineChart(), id: e.id} );
					parent.append(html);
					const container = getLast(parent);
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
	function add(e, parent, noSave, cb) {
		switch (e.type) {
			case 0:
				addLinechart(e, parent, cb ? true : false, () => {
					if (!noSave) {
						$.ajax({
							url: conf.TMP + "widget/add",
							method: "GET",
							data: {
								widget: JSON.stringify(e)
							}
						})
						.done(cb)
						.fail( (x, err) => inst.emit("error", { set: 2, msg: MSG[4]+m }) );
					} else {
						cb ? cb() : undefined;
					}
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
				add(i, parent, true, cb);
			} else {
				add(i, parent, true);
			}
		});
	}
	function remove(id) {
		$.ajax({
			url: conf.TMP + "widget/delete",
			method: "GET",
			dataType: "json",
			data: {
				id: id
			}
		})
		.done()
		.fail();
	}
	
	inst.expand = expand;
	inst.shrink = shrink;
	inst.add = add;
	inst.remove = remove;
	inst.addMany = addMany;
	// , update, fetch
	
	window.widgets = widgets;
	return inst;
});