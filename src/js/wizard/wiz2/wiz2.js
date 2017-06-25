define([
	"config",
	"token",
	"uk",
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
	const temp = Handlebars.templates;
	const jsonParse = JSON.parse;
	const jsonStr = JSON.stringify;
	
	let els;
	let c = { add: {}, edit: {} }; // event callbacks
	let toggle = {
		submit(b) {
			els.submit.attr({disabled: !b});
		},
		all(b) {
			els.toDisable.attr({disabled: !b});
			sensors.toggle(b);
			dataTable.toggleAll(b);
		}
	};
	
	function addCustomEvt() {
		device.on("select", id => {
			service
				.clear()
				.setDeviceId(id)
				.toggle(true);
			dataTable.removeAll();
			sensors.removeAll();
		});
		service.on("select", id => {
			dataTable.removeAll();
			sensors
				.removeAll()
				.setServiceId(id)
				.load();
		});
		sensors.on("select", sensor => {
			dataTable.addRow(sensor);
		});
	}
	function get() {
		let device = els.device;
		let service = els.service;
		let rangeTypeVal = els.rangeType.val();
		let rangeCountVal = els.rangeCount.val();
		
		let data = {
			device: {
				id: parseInt(device.val(), 10),
				name: device.text()
			},
			service: {
				id: parseInt(service.val(), 10),
				name: service.text()
			},
			sensors: dataTable.getData(),
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle( rangeTypeVal, rangeCountVal ),
		};
		
		return data;
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
		rc.attr("max", d.RANGE_COUNT_MAX[v]);
		toggle.submit( v !== curr.type && count !== curr.count );
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
			toggle.submit(num !== curr.count && type !== curr.type); 
		} else {
			el.val( d.RANGE_COUNT_DEF[type] );
		}
	};
	
	function setForAdd() {
		sensors.clearReloaders();
		
		toggle.submit(false);
		service.clear().toggle(false);
		sensors.clear().toggle(false);
		
		els.selects.empty().val(null).trigger("change");
		
		els.rangeType
			.off("change")
			.on("change", c.add.typeChange)
			.val(d.RANGE_TYPE)
			.change();
		els.rangeCount
			.off("change")
			.on("change", c.add.countChange);
		
		els.toAppendAlert.find(".uk-alert-danger").remove();
		
		
		dataTable.removeAll();
		dataTable
			.off()
			.once("sensor_add", toggle.submit, true)
			.on("sensor_remove_all", () => {
				toggle.submit(false);
				dataTable.once("sensor_add", toggle.submit, true);
			});
	}
	function setForEdit(o) {
		sensors.clearReloaders();
		
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
		
		dataTable.removeAll();
		dataTable.on("unit_change", e => {
			
		});
		dataTable.on("sensor_remove", e => {
			
		});
		dataTable.on("sensor_add", e => {
			
		});
		dataTable.on("color_change", e => {
			
		});
		
		service.toggle(true);
		sensors.toggle(true);
		toggle.submit(false);
		
		els.device
			.append( $("<option></option>").val(o.device.id).text(o.device.name) )
			.trigger("change");
		els.service
			.append( $("<option></option>").val(o.service.id).text(o.service.name) )
			.trigger("change");
		
		let sens = o.sensors;
		sensors.load( {toFilter: Object.keys(sens).map( k => sens[k].id ), serviceId: o.service.id} );
		
		Object.keys(sens).forEach( k => {
			dataTable.addRow( sens[k] ) // () => els.submit.attr({disabled: false})
		});
	}
	function start(o) {
		o ? setForEdit(o) : setForAdd();
		uk.openModal(ROOT);
	}
	function init() {
		els = u.getEls(ROOT);
		let { submit } = els;
		
		device.init(els.device);
		service.init(els.service);
		sensors.init( {sensors: els.sensors, btnParent: els.btnParent, stat: els.stat} );
		dataTable.init(els.table);
		
		addCustomEvt();
		
		sensors.on( "login_error", () => inst.emit("login_error") );
		
		els.prev.on( "click", () => inst.emit("prev") );
		
		submit.on("click", e => {
			if (e.target.disabled) return;
			let toggleAll = toggle.all;
			
			toggleAll(false);
			inst.emit("submit", get(), success => {
				if (success) {
					uk.closeModal(ROOT);
				} else {
					toggleAll(true);
				}
			});
		});
	}
	
	window.dataTable = dataTable;
	inst.start = start;
	inst.init = init;
	
	return inst;
});