define([
	"core/config",
	"core/token",
	"core/uk",
	"../share",
	"../defaults",
	"./device",
	"./service",
	"./sensors",
	"./dataTable"
], (
	conf,
	token,
	uk,
	share,
	d,
	device,
	service,
	sensors,
	dataTable
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz2']";
	const jsonParse = JSON.parse;
	const jsonStr = JSON.stringify;
	
	let els;
	let c = { add: {}, edit: {} }; // event callbacks
	let toggle = {
		submit(b) {
			els.submit.attr({disabled: !b});
			return this;
		},
		prev(b) {
			els.prev.attr({disabled: !b});
			return this;
		},
		toDisable(b) {
			els.toDisable.attr({disabled: !b});
			sensors.toggle(b);
			dataTable.toggleAll(b);
		},
		modal(b) {
			uk[b ? "openModal" : "closeModal"](ROOT);
		}
	};
	
	function sameKeys(a, b) {
		let k = Object.keys;
		let aKeys = k(a).sort();
		let bKeys = k(b).sort();
		return jsonStr(aKeys) === jsonStr(bKeys);
	}
	c.add.typeChange = e => {
		let val = e.target.value;
		let n1 = d.RANGE_COUNT_DEF[val];
		let n2 = d.RANGE_COUNT_MAX[val];
		els.rangeCount.val(n1);
		els.rangeCount.attr("max", n2);
	};
	c.add.countChange = e => {
		let el = $(e.target);
		let type = els.rangeType.val();
		let max = d.RANGE_COUNT_MAX[type];
		let min = parseInt(el.attr("min"), 10);
		let val = el.val();
		if (val) {
			let num = parseInt(val, 10);
			if (num > max) {
				el.val(max);
			} else if (num < min) {
				el.val(min);
			}
		} else {
			el.val( d.RANGE_COUNT_DEF[type] );
		}
	};
	c.edit.typeChange = e => {
		let curr = e.data;
		let v = e.target.value;
		let rc = els.rangeCount;
		let count = parseInt(rc.val(), 10);
		rc.attr("max", d.RANGE_COUNT_MAX[v]).change();
		toggle.submit( v !== curr.type || count !== curr.count );
	};
	c.edit.countChange = e => {
		let curr = e.data;
		let el = $(e.target);
		let type = els.rangeType.val();
		let max = d.RANGE_COUNT_MAX[type];
		let min = parseInt(el.attr("min"), 10);
		let val = el.val();
		if (val) {
			let num = parseInt(val, 10);
			if (num > max) {
				el.val(max);
			} else if (num < min) {
				el.val(min);
			}
			toggle.submit(num !== curr.count || type !== curr.type); 
		} else {
			el.val( d.RANGE_COUNT_DEF[type] );
		}
	};
	function get(o) {
		let rangeTypeVal = els.rangeType.val();
		let rangeCountVal = els.rangeCount.val();
		
		let data = {
			device: device.getData(),
			service: service.getData(),
			sensors: dataTable.getData(),
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle( rangeTypeVal, rangeCountVal ),
		};
		
		if (o) {
			Object.keys(data).forEach( k => o[k] = data[k] );
			return o;
		}
		return data;
	}
	function setForAdd() {
		inst.shallow = true;
		toggle.submit(false).prev(true);
		
		device
			.off()
			.clear()
			.on("select", id => {
				service
					.clear()
					.setDeviceId(id)
					.toggle(true);
				dataTable.removeAll();
				sensors.removeAll();
			});
		service
			.off()
			.clear()
			.toggle(false)
			.on("select", id => {
				dataTable.removeAll();
				sensors
					.removeAll()
					.setServiceId(id)
					.load();
			});
		sensors
			.off()
			.clearReloaders()
			.clear()
			.toggle(false)
			.on("select", sensor => {
				dataTable.addRow(sensor);
			});
		
		dataTable
			.off()
			.removeAll()
			.once("sensor_add", toggle.submit, true)
			.on("sensor_remove_all", () => {
				toggle.submit(false);
				dataTable.once("sensor_add", toggle.submit, true);
			});
		
		els.rangeType
			.off("change")
			.on("change", c.add.typeChange)
			.val(d.RANGE_TYPE)
			.change();
		els.rangeCount
			.off("change")
			.on("change", c.add.countChange)
			.val(d.RANGE_COUNT)
			.change();
		
		els.submit
			.text("Save")
			.off()
			.on("click", e => {
				if (e.target.disabled) return;
				let toggleAll = toggle.toDisable;
				
				toggleAll(false);
				inst.emit("submit", get(), success => {
					if (success) close();
					toggleAll(true);
				});
			});
	}
	function setForEdit(o) {
		let sens = o.sensors;
		toggle.submit(false).prev(false);
		
		dataTable.off().removeAll();
		device.clear().setValue(o.device);
		service
			.toggle(true)
			.setValue(o.service);
		sensors
			.toggle(false)
			.clearReloaders()
			.setServiceId(o.service.id)
			.load( Object.keys(sens).map( k => sens[k].id ) ); // filter out already selected
		
		device
			.off()
			.on("select", id => {
				service
					.clear()
					.setDeviceId(id)
					.toggle(true);
				dataTable.removeAll();
				sensors.removeAll();
			});
		service
			.off()
			.on("select", id => {
				dataTable.removeAll();
				sensors
					.removeAll()
					.setServiceId(id)
					.load();
			});
		sensors
			.off()
			.on("select", sensor => {
				
				dataTable.addRow(sensor);
			});
		
		Object.keys(sens).forEach( k => dataTable.addRow(sens[k]) );
		dataTable
			.on("unit_change", (sensorId, newValue) => {
				let sen = sens[sensorId];
				if (sen) {
					let curr = sen.units.filter(o => o.selected)[0].name;
					toggle.submit(curr !== newValue);
				}
			})
			.on("sensor_remove", sensor => {
				sensors.add(sensor);
				let rows = dataTable.getData();
				if (rows) toggle.submit( !sameKeys(rows, sens) );
			})
			.on("sensor_add", sensorId => {
				let rows = dataTable.getData();
				toggle.submit( !sameKeys(rows, sens) );
			})
			.on("color_change", (sensorId, newValue) => {
				let sen = sens[sensorId];
				if (sen) toggle.submit(sen.color !== newValue);
			})
			.on("sensor_remove_all", () => {
				toggle.submit(false);
			});
		
		let type = o.rangeType;
		let count = o.rangeCount;
		let curr = {
			type: type,
			count: count
		};
		els.rangeType
			.off("change")
			.on("change", curr, c.edit.typeChange)
			.val(type)
			.change();
			
		els.rangeCount
			.off("change")
			.on("change", curr, c.edit.countChange)
			.val(count)
			.change();
		
		els.submit
			.text("Apply")
			.off()
			.on("click", e => {
				if (e.target.disabled) return;
				let toggleAll = toggle.toDisable;
				
				toggleAll(false);
				inst.emit("submit", get(o), success => {
					if (success) close();
					toggleAll(true);
				});
			});
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
	inst.set = o => {
		o ? setForEdit(o) : setForAdd();
		return inst;
	};
	inst.init = () => {
		els = u.getEls(ROOT);
		
		device.init(els.device);
		service.init(els.service);
		sensors.init( {sensors: els.sensors, btnParent: els.btnParent, stat: els.stat} );
		dataTable.init(els.table);
		
		els.prev.on("click", e => {
			if (e.target.disabled) return;
			inst.emit("prev");
		});
		
		device.on("login_error", emitLoingErr);
		service.on("login_error", emitLoingErr);
		sensors.on("login_error", emitLoingErr);
	};
	
	return inst;
});