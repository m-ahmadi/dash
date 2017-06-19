define([
	"config",
	"token",
	"uk",
	"./share",
	"./defaults",
	"./colorpick"
], (
	conf,
	token,
	uk,
	share,
	d,
	colorpick
) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz2']";
	const temp = Handlebars.templates;
	let els;
	const KEYS = [
		"device",
		"service",
		"sensors"
	];
	function randColor(brightness) {
		// Six levels of brightness from 0 to 5, 0 being the darkest
		var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
		var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
		var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) {
			return Math.round(x / 2.0)
		})
		return "rgb(" + mixedrgb.join(",") + ")";
	}
	function getUrl(type) {
		let route;
		switch (type) {
			case 0: route = "device/search"; break;
			case 1: route = "device/service/search"; break;
			case 2: route = "device/service/kpilist"; break;
		}
		return conf.BASE + route;
	}
	function initSelect2(el, type, toEnable, resKey, toClear, toDisable, toErase) {
		const key = KEYS[type];
		el.select2({
			width: "100%",
			placeholder: type === 0 ? "Select a device" :
						 type === 1 ? "Select a service" :
						 type === 2 ? "Select sensors" : "",
			ajax: {
				method: type === 0 ? "GET" : "POST",
				url: () => { return getUrl(type) + token() },
				dataType: "json",
				delay: 250,
				data: params => {
					let o = {};
					if (params.term) {
						o.search = params.term;
					}
					o.page = params.page || 1;
					if (type === 0) {
						// nothing
					} else if (type === 1) {
						o.device_ids = JSON.stringify([ parseInt(els.device.val(), 10) ]);
					} else if (type === 2) {
						o.services = JSON.stringify([ parseInt(els.service.val(), 10) ]);
					}
					return o;
				},
				error: x => {
					if (x.status === 403) {
						el.select2("close");
						inst.emit("login_error", () => open(WIZ_2));
					}
				},
				processResults: (data, params) => {
					let target = resKey ? data[resKey]: data;
					let targetProp = resKey ? ["ID", "Name"] : ["id", "name"];
					let res = [];
					params.page = params.page || 1;
					if (target) {
						target.forEach((item) => {
							res.push({
								id: item[ targetProp[0] ],
								text: item[ targetProp[1] ]
							});
						});
					}
					return {
						results: res,
						pagination: {
							more: params.page < data.total_page
						}
					};
				},
				cache: false
			},
			multiple: type === 2 ? true : false,
			minimumInputLength: 0
		})
		.on("select2:select", e => {
			const selected = e.params.data;
			if (type === 2) {
				let units = els.units;
				addSensor({name: selected.text, id: selected.id});
				el.val(null).trigger("change");
			}
			if (toEnable) {
				toEnable.attr({disabled: false});
			}
			if (toClear) {
				toClear.val(null).trigger("change");
				toDisable.attr({disabled: true});
				toErase.empty();
			}
		});
	}
	function rangeType(e) {
		const val = e.target.value;
		const n1 = d.RANGE_COUNT_DEF[val];
		const n2 = d.RANGE_COUNT_MAX[val];
		els.rangeCount.val(n1);
		els.rangeCount.attr("max", n2);
	}
	function rangeCount(e) {
		const el = e.target;
		const type = els.rangeType.val();
		const max = d.RANGE_COUNT_MAX[type];
		const min = parseInt($(el).attr("min"), 10);
		const val = el.value;
		if (val) {
			let num = parseInt(val, 10);
			if (num > max) {
				el.value = max;
			} else if (num < min) {
				el.value = min;
			}
		}
	}
	function addSensor(sensor, onColorChange) {
		let units = els.units;
		if ( !units.find(`[data-sensor-id="${sensor.id}"]`).length ) {
			let unit = sensor.unit;
			let html = temp.sensorUnit({
				name: sensor.name,
				id: sensor.id,
				micro: unit === "Microsecond",
				mili: unit === "Milisecond",
				sec: unit === "Second"
			});
			units.append(html);
			const colorEl = units.find("[data-colorpick]:last-child");
			colorpick.init( colorEl, sensor.color || randColor( u.randInt(0, 6) ), onColorChange );
		}
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
			sensors: {},
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle( rangeTypeVal, rangeCountVal ),
		};
		
		data.sensors = {};
		els.units.find("[data-sensor-id]").each((i, l) => {
			let el = $(l);
			let elData = el.data();
			let sensorId = elData.sensorId;
			let colorEl = el.find("[data-colorpick]");
			data.sensors[sensorId] = {
				id: sensorId,
				name: elData.sensorName,
				unit: el.find("[data-select]").val(),
				color: el.find("[data-colorpick]").spectrum("get").toHex()
			};
		});
		return data;
	}
	function reset() {
		els.selects.empty();
		els.selects.val(null).trigger("change");
		
		els.rangeType.off("change").on("change", rangeType).val(d.RANGE_TYPE).change();
		els.rangeCount.off("keyup").on("keyup", rangeCount);
		
		els.toAppendAlert.find(".uk-alert-danger").remove();
		els.submit.attr({disabled: true});
		els.service.attr({disabled: true});
		els.sensors.attr({disabled: true});
		els.units.empty();
	}
	function set(o) {
		els.rangeType.val(o.rangeType).change();
		els.rangeCount.val(o.rangeCount);
		
		els.device.append( $("<option></option>").val(o.device.id).text(o.device.name) ).trigger("change");
		els.service.attr({disabled: false}).append( $("<option></option>").val(o.service.id).text(o.service.name) ).trigger("change");
		els.sensors.attr({disabled: false});
		Object.keys(o.sensors).forEach( k => {
			addSensor( o.sensors[k], () => els.submit.attr({disabled: false}) )
		});
		
		let colorpicks = els.units.find("[data-select]");
		let delBtns = els.units.find("[data-delete-sensor]");
		let enableSubmit = () => {
			els.submit.attr({disabled: false})
			colorpicks.off("change", enableSubmit);
			els.rangeType.off("change", enableSubmit);
			els.rangeCount.off("change", enableSubmit);
			delBtns.off("click", enableSubmit);
		};
		delBtns.one("click", enableSubmit);
		colorpicks.one("change", enableSubmit);
		els.rangeType.one("change", enableSubmit);
		els.rangeCount.one("change", enableSubmit);
	}
	function start(o) {
		reset();
		if (o) set(o);
		uk.openModal(ROOT);
	}
	function init() {
		els = u.getEls(ROOT);
		
		const toClear = els.service.add(els.sensors);
		const toDisable = els.sensors.add(els.submit);
		const toErase = els.units;
		initSelect2(els.device, 0, els.service, "devices", toClear, toDisable, toErase);
		initSelect2(els.service, 1, els.sensors, "service", els.sensors, els.submit, toErase);
		initSelect2(els.sensors, 2, els.submit, "");
		
		els.prev.on( "click", () => inst.emit("prev") );
		
		els.units.on("click", "[data-delete-sensor]", e => {
			const el = $(e.currentTarget);
			el.parent().parent().remove();
			
			if (!els.units.children().length) {
				els.submit.attr({disabled: true});
			}
		});
		els.submit.on("click", () => {
			let dis1 = els.toDisable.attr({disabled: true});
			let dis2 = els.units.find("[data-todisable]").attr({disabled: true});
			let dis3 = els.units.find("[data-colorpick]").spectrum("disable");
			inst.emit("submit", get(), success => {
				dis1.attr({disabled: false});
				if (success) {
					dis3.spectrum("destroy");
					uk.closeModal(ROOT);
				} else {
					dis2.attr({disabled: false});
					dis3.spectrum("enable");
				}
			});
		});
	}
	
	
	inst.set = set;
	inst.start = start;
	inst.init = init;
	
	return inst;
});