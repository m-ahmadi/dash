define(["config", "token"], (conf, token) => {
	const inst = u.extend( newPubSub() );
	const temp = Handlebars.templates;
	const jsonStr = JSON.stringify;
	const jsonParse = JSON.parse;
	
	let els;
	let serviceId;
	
	function filter(data, toFilter) {
		return data.filter(o => toFilter.indexOf(o.id) === -1 );
	}
	function reOrder(data) {
		let el = els.sensors;
		el.empty();
		data.forEach(i => {
			el.append(`<option value='${i.id}' data-units='${jsonStr(i.units)}'>${i.text}</option>`);
		});
		el.change();
	}
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
					text: i.name,
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
	function init(els_) {
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
			let d = e.params.data;
			let sensor = {
				id: parseInt(d.id, 10),
				name: d.text,
				units: jsonParse(d.element.dataset.units)
			};
			remove(d.id);
			inst.emit("select", sensor);
		});
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
	
	inst.remove = remove;
	inst.toggle = toggle;
	inst.clear = clear;
	inst.load = load;
	inst.init = init;
	
	return inst;
});