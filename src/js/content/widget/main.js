define([
	"config",
	"token",
	"./makeLineChart",
	"./barChart",
	"./table",
	"./map"
], (conf, token, makeLineChart, barChart, table, map) => {
	const inst = u.extend( newPubSub() );
	const temp = Handlebars.templates;
	let widgets = {};
	let parent, e;
	
	let counter = 0;
	function uid() {
		return "w" + (counter+=1);
	}
	function findCircuitId(cb) {
		const deviceId = e.device;
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
			data.circuits.forEach(i => {
				if (i.ServiceForward === e.serviceId ||
					i.ServiceBackward === e.serviceId) {
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
	function addLinechart() {
		findCircuitId((circuitId, empty) => {
			if (!circuitId) {
				inst.emit("no_circuit_id", empty ? 1 : 2);
				// return;
			}
			$.ajax({
				url: conf.BASE +""+ token(),
				method: "POST",
				data: {
					startDate: e.startDate,
					endDate: e.endDate,
					sensors: JSON.stringify( [{id: e.sensor}] )
				},
			})
			.done(data => {
				debugger
			})
			.fail();
			const html = temp.panel( {body: temp.lineChart()} );
			parent.append(html);
			const container = getLast();
			makeLineChart(container);
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
	function add(data, parent_, cb) {
		e = data;
		parent = parent_;
		
		switch (data.widgetType) {
			case 0: addLinechart(); break;
			case 1: addBarchart(); break;
			case 2: addTable(); break;
			case 3: addMap(); break;
		}
	}
	
	inst.add = add;
	// , update, fetch
	return inst;
});