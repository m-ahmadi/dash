define(["core/config", "core/token"], function (conf, token) {
	var inst = u.extend(newPubSub());
	var temp = u.getTemps("wizard/wiz2");
	var jsonStr = JSON.stringify;
	var jsonParse = JSON.parse;

	var els = void 0;
	var serviceId = void 0;

	function load(toFilter) {
		if (!serviceId) throw new Error("wizard/wiz2/sensors.load(): serviceId must be set before loading.");
		var _els = els,
		    btnParent = _els.btnParent,
		    stat = _els.stat;


		stat.html(temp.smallSpinner());
		if (btnParent.children().length) btnParent.empty();
		$.ajax({
			url: conf.BASE + "device/service/kpilist" + token(),
			method: "POST",
			data: {
				services: jsonStr([serviceId])
			}
		}).done(function (data) {
			stat.empty();
			var res = [];
			data.forEach(function (i) {
				res.push({
					id: i.id,
					name: i.name,
					units: i.available_units.map(function (v) {
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
		}).fail(function (x) {
			btnParent.html(temp.sensorLoadBtn());
			stat.empty().html(temp.sensorLoadDanger());

			if (x.status === 403) inst.emit("login_error");
		});
	}
	function filter(arr, toFilter) {
		return arr.filter(function (o) {
			return toFilter.indexOf(o.id) === -1;
		});
	}
	function reOrder(data) {
		var el = els.sensors;
		el.empty();
		data.forEach(function (i) {
			return appendItem(i);
		});
		el.change();
	}
	function appendItem(sensor) {
		var newOpt = $("<option></option>").val(sensor.id).attr("data-units", jsonStr(sensor.units)).text(sensor.name);
		var color = sensor.color;
		if (color) newOpt.attr("data-color", color);
		els.sensors.append(newOpt);
	}
	function remove(id) {
		els.sensors.find("option[value='" + id + "']").remove().change();
		return inst;
	}
	function toggle(b) {
		els.sensors.attr({ disabled: !b });
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

	inst.add = function (sensor) {
		appendItem(sensor);
		els.sensors.change();
		return inst;
	};
	inst.clearReloaders = function () {
		els.btnParent.empty();
		els.stat.empty();
		return inst;
	};
	inst.setServiceId = function (id) {
		serviceId = id;
		return inst;
	};
	inst.removeAll = function () {
		els.sensors.empty().val(null).change();
		return inst;
	};
	inst.init = function (els_) {
		els = els_;

		els.btnParent.on("click", "[data-retry]", load);

		els.sensors.select2({
			width: "100%",
			placeholder: "Select sensors",
			data: [],
			minimumInputLength: 0,
			disabled: true,
			multiple: true
		}).on("select2:select", function (e) {
			clear();
			var s = e.params.data;
			var data = s.element.dataset;
			var color = data.color;
			var sensor = {
				id: parseInt(s.id, 10),
				name: s.text,
				units: jsonParse(data.units)
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
//# sourceMappingURL=sensors.js.map