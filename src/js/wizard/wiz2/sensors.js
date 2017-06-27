define(["core/config", "core/token"], (conf, token) => {
	const inst = u.extend( newPubSub() );
	const temp = Handlebars.templates;
	const jsonStr = JSON.stringify;
	const jsonParse = JSON.parse;
	
	let els;
	let serviceId;
	
	function load(toFilter) {
		if (!serviceId) throw new Error("wizard/wiz2/sensors.load(): serviceId must be set before loading.");
		let { btnParent, stat } = els;
		
		stat.html( temp.smallSpinner() );
		if ( btnParent.children().length ) btnParent.empty();
		$.ajax({
			url: conf.BASE + "device/service/kpilist" + token(),
			method: "POST",
			data: {
				services: jsonStr( [ serviceId ] )
			}
		})
		.done(data => {
			stat.empty();
			let res = [];
			data.forEach(i => {
				res.push({
					id: i.id,
					name: i.name,
					units: i.available_units.map(v => {
						return {
							name: v,
							selected: false
						};
					})
				});
			});
			toggle(true);
			if (toFilter) {
				res = filter(res, toFilter);
			}
			reOrder(res);
		})
		.fail(x => {
			btnParent.html( temp.sensorLoadBtn() );
			stat.empty().html( temp.sensorLoadDanger() );
			
			if (x.status === 403) inst.emit("login_error");
		});
	}
	function filter(arr, toFilter) {
		return arr.filter(o => toFilter.indexOf(o.id) === -1 );
	}
	function reOrder(data) {
		let el = els.sensors;
		el.empty();
		data.forEach( i => appendItem(i) );
		el.change();
	}
	function appendItem(sensor) {
		let newOpt = $("<option></option>")
			.val(sensor.id)
			.attr( "data-units", jsonStr(sensor.units) )
			.text(sensor.name);
		let color = sensor.color;
		if (color) newOpt.attr("data-color", color);
		els.sensors.append(newOpt);
	}
	function remove(id) {
		els.sensors.find(`option[value='${id}']`).remove().change();
		return inst;
	}
	function toggle(b) {
		els.sensors.attr({disabled: !b});
		return inst;
	}
	function clear() {
		els.sensors.val(null).change();
		return inst;
	}
	
	inst.remove = remove;
	inst.toggle = toggle;
	inst.clear = clear;
	inst.load = load;
	
	inst.add = (sensor) => {
		appendItem(sensor);
		els.sensors.change();
		return inst;
	};
	inst.clearReloaders = () => {
		els.btnParent.empty();
		els.stat.empty();
		return inst;
	};
	inst.setServiceId = id => {
		serviceId = id;
		return inst;
	};
	inst.removeAll = () => {
		els.sensors.empty().val(null).change();
		return inst;
	};
	inst.init = els_ => {
		els = els_;
		
		els.btnParent.on("click", "[data-retry]", load);
		
		els.sensors.select2({
			width: "100%",
			placeholder: "Select sensors",
			data: [],
			minimumInputLength: 0,
			disabled: true,
			multiple: true
		})
		.on("select2:select", e => {
			clear();
			let s = e.params.data;
			let data = s.element.dataset;
			let color = data.color;
			let sensor = {
				id: parseInt(s.id, 10),
				name: s.text,
				units: jsonParse(data.units),
			};
			if (color) {
				sensor.color = color;
			}
			remove(s.id);
			inst.emit("select", sensor);
		});
		// we can use a normal select instead of select2.
		// (only downside is searching in the input by typing will no longer be available.)
		/* els.sensors.on("change", e => {
			let data = $(e.target).data();
			clear();
			let color = data.color;
			let sensor = {
				id: parseInt(s.id, 10),
				name: s.text,
				units: jsonParse(data.units),
			};
			if (color) {
				sensor.color = color;
			}
			remove(s.id);
			inst.emit("select", sensor);
		}); */
	};
	
	return inst;
});