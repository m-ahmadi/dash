define(["core/config", "core/token", "core/uk", "../share", "../defaults", "./device", "./service", "./sensors", "./dataTable"], function (conf, token, uk, share, d, device, service, sensors, dataTable) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='wiz2']";
	var jsonParse = JSON.parse;
	var jsonStr = JSON.stringify;

	var els = void 0;
	var c = { add: {}, edit: {} }; // event callbacks
	var toggle = {
		submit: function submit(b) {
			els.submit.attr({ disabled: !b });
			return this;
		},
		prev: function prev(b) {
			els.prev.attr({ disabled: !b });
			return this;
		},
		toDisable: function toDisable(b) {
			els.toDisable.attr({ disabled: !b });
			sensors.toggle(b);
			dataTable.toggleAll(b);
		},
		modal: function modal(b) {
			uk[b ? "openModal" : "closeModal"](ROOT);
		}
	};

	function sameKeys(a, b) {
		var k = Object.keys;
		var aKeys = k(a).sort();
		var bKeys = k(b).sort();
		return jsonStr(aKeys) === jsonStr(bKeys);
	}
	c.add.typeChange = function (e) {
		var val = e.target.value;
		var n1 = d.RANGE_COUNT_DEF[val];
		var n2 = d.RANGE_COUNT_MAX[val];
		els.rangeCount.val(n1);
		els.rangeCount.attr("max", n2);
	};
	c.add.countChange = function (e) {
		var el = $(e.target);
		var type = els.rangeType.val();
		var max = d.RANGE_COUNT_MAX[type];
		var min = parseInt(el.attr("min"), 10);
		var val = el.val();
		if (val) {
			var num = parseInt(val, 10);
			if (num > max) {
				el.val(max);
			} else if (num < min) {
				el.val(min);
			}
		} else {
			el.val(d.RANGE_COUNT_DEF[type]);
		}
	};
	c.edit.typeChange = function (e) {
		var curr = e.data;
		var v = e.target.value;
		var rc = els.rangeCount;
		var count = parseInt(rc.val(), 10);
		rc.attr("max", d.RANGE_COUNT_MAX[v]).change();
		toggle.submit(v !== curr.type || count !== curr.count);
	};
	c.edit.countChange = function (e) {
		var curr = e.data;
		var el = $(e.target);
		var type = els.rangeType.val();
		var max = d.RANGE_COUNT_MAX[type];
		var min = parseInt(el.attr("min"), 10);
		var val = el.val();
		if (val) {
			var num = parseInt(val, 10);
			if (num > max) {
				el.val(max);
			} else if (num < min) {
				el.val(min);
			}
			toggle.submit(num !== curr.count || type !== curr.type);
		} else {
			el.val(d.RANGE_COUNT_DEF[type]);
		}
	};
	function get() {
		var rangeTypeVal = els.rangeType.val();
		var rangeCountVal = els.rangeCount.val();

		var data = {
			device: device.getData(),
			service: service.getData(),
			sensors: dataTable.getData(),
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal)
		};

		return data;
	}
	function setForAdd() {
		inst.shallow = true;
		toggle.submit(false).prev(true);

		device.off().clear().on("select", function (id) {
			service.clear().setDeviceId(id).toggle(true);
			dataTable.removeAll();
			sensors.removeAll();
		});
		service.off().clear().toggle(false).on("select", function (id) {
			dataTable.removeAll();
			sensors.removeAll().setServiceId(id).load();
		});
		sensors.off().clearReloaders().clear().toggle(false).on("select", function (sensor) {
			dataTable.addRow(sensor);
		});

		dataTable.off().removeAll().once("sensor_add", toggle.submit, true).on("sensor_remove_all", function () {
			toggle.submit(false);
			dataTable.once("sensor_add", toggle.submit, true);
		});

		els.rangeType.off("change").on("change", c.add.typeChange).val(d.RANGE_TYPE).change();
		els.rangeCount.off("change").on("change", c.add.countChange).val(d.RANGE_COUNT).change();
	}
	function setForEdit(o) {
		var sens = o.sensors;
		toggle.submit(false).prev(false);

		dataTable.off().removeAll();
		device.clear().setValue(o.device);
		service.toggle(true).setValue(o.service);
		sensors.toggle(false).clearReloaders().setServiceId(o.service.id).load(Object.keys(sens).map(function (k) {
			return sens[k].id;
		})); // filter out already selected

		device.off().on("select", function (id) {
			service.clear().setDeviceId(id).toggle(true);
			dataTable.removeAll();
			sensors.removeAll();
		});
		service.off().on("select", function (id) {
			dataTable.removeAll();
			sensors.removeAll().setServiceId(id).load();
		});
		sensors.off().on("select", function (sensor) {

			dataTable.addRow(sensor);
		});

		Object.keys(sens).forEach(function (k) {
			return dataTable.addRow(sens[k]);
		});
		dataTable.on("unit_change", function (sensorId, newValue) {
			var sen = sens[sensorId];
			if (sen) {
				var _curr = sen.units.filter(function (o) {
					return o.selected;
				})[0].name;
				toggle.submit(_curr !== newValue);
			}
		}).on("sensor_remove", function (sensor) {
			sensors.add(sensor);
			var rows = dataTable.getData();
			if (rows) toggle.submit(!sameKeys(rows, sens));
		}).on("sensor_add", function (sensorId) {
			var rows = dataTable.getData();
			toggle.submit(!sameKeys(rows, sens));
		}).on("color_change", function (sensorId, newValue) {
			var sen = sens[sensorId];
			if (sen) toggle.submit(sen.color !== newValue);
		}).on("sensor_remove_all", function () {
			toggle.submit(false);
		});

		var type = o.rangeType;
		var count = o.rangeCount;
		var curr = {
			type: type,
			count: count
		};
		els.rangeType.off("change").on("change", curr, c.edit.typeChange).val(type).change();

		els.rangeCount.off("change").on("change", curr, c.edit.countChange).val(count).change();
	}
	function open() {
		toggle.modal(true);
		return inst;
	}
	function close() {
		inst.shallow = false;
		toggle.modal(false);
	}
	function emitLoingErr() {
		inst.emit("login_error");
	}

	inst.shallow = false;
	inst.open = open;
	inst.set = function (o) {
		o ? setForEdit(o) : setForAdd();
		return inst;
	};
	inst.init = function () {
		els = u.getEls(ROOT);

		device.init(els.device);
		service.init(els.service);
		sensors.init({ sensors: els.sensors, btnParent: els.btnParent, stat: els.stat });
		dataTable.init(els.table);

		els.prev.on("click", function (e) {
			if (e.target.disabled) return;
			inst.emit("prev");
		});
		els.submit.on("click", function (e) {
			if (e.target.disabled) return;
			var toggleAll = toggle.toDisable;

			toggleAll(false);
			inst.emit("submit", get(), function (success) {
				if (success) {
					close();
				}
				toggleAll(true);
			});
		});

		device.on("login_error", emitLoingErr);
		service.on("login_error", emitLoingErr);
		sensors.on("login_error", emitLoingErr);
	};

	return inst;
});
//# sourceMappingURL=wiz2.js.map