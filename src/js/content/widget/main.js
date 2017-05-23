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
		"empty chart_data",
		"Network Error.",
		"Saving Failed. "
	];
	const BODY = "[data-container]";
	const KLASS = [
		"uk-width-1-1@s",
		"uk-width-1-1@m",
		"uk-width-1-2@l",
		"uk-width-1-2@xl"
	].join(" ");
	const temp = Handlebars.templates;
	
	let widgets = {};
	let jsonStr = JSON.stringify;
	
	function buildServerData() {
		const o = {
			type: e.type
		};
		
	}
	function shrink(el) {
		el.removeClass(KLASS);
		el.find("[data-resize]").html(temp.btnExpand);
		el.find(BODY).highcharts().setSize();
			
		/* const id = el.data().id;
		let e = widgets[id];
		e.expand = false;
		$.ajax({
			url: conf.TMP + "widget/edit",
			method: "GET",
			data: jsonStr(e)
		})
		.done(() => {
			
		})
		.fail(); */
	}
	function expand(el) {
		if ( !el.hasClass(KLASS) ) {
			el.addClass(KLASS);
			el.find("[data-resize]").html(temp.btnShrink);
			el.find(BODY).highcharts().setSize();
		}
	}
	function save(e, route, cb) {
		$.ajax({
			url: conf.TMP + route,
			method: "GET",
			data: {
				widget: jsonStr(e)
			}
		})
		.done( d => cb(false) )
		.fail( (x, err) => cb(true, err) );
	}
	function getLast(el) {
		return el.find(`[data-panel]:last-child [data-container]`);
	}
	function addLinechart(e, parent, many, cb) {
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
			// debugger
			const target = data;
			const rangeTitle = e.rangeTitle.toLowerCase();
			if (!target || !target.length) {
				inst.emit("create_err", `${MSG[0]} for ${rangeTitle}`);
			}
			if (target && target.length) {
				widgets[e.id] = e;
				const html = temp.panel( {title: "Graph Sensor", range: e.rangeTitle, body: temp.lineChart(), id: e.id} );
				parent.append(html);
				const container = getLast(parent);
				const names = e.sensorNames;
				makeLineChart(container, target, e.sensorOption, temp.graphTitle({
					device: e.device.name,
					service: e.service.name,
					sensors: names.length > 1 ? names.join(", ") : names[0]
				}));
				cb ? cb() : undefined;
				inst.emit("add", many);
			}
		})
		.fail( () => inst.emit("error", { set: 2, msg: MSG[4]}) );
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
								widget: jsonStr(e)
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