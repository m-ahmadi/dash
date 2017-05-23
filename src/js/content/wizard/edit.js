define(["config", "token", "uk", "../colorpick"], (conf, token, uk, colorpick) => {
	let log = console.log;
	
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='edit']";
	const temp = Handlebars.templates;
	let els;
	const d = { // defaults
		TYPE: 0,
		MAP: 0,
		RANGE_COUNT: 15,
		RANGE_TYPE: "m",
		RANGE_COUNT_MAX: {
			m: 10080,
			h: 168,
			d: 7,
			w: 1
		},
		RANGE_COUNT_DEF: {
			m: 25,
			h: 6,
			d: 2,
			w: 1
		}
	};
	const DATE_FORMAT = "Y/MM/DD HH:mm";
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
	function reset(order) {
		data = {
			id: uid(),
			type: d.TYPE,
			rangeType: d.RANGE_TYPE,
			rangeCount: d.RANGE_COUNT,
			startDate: moment().subtract(this.rangeCount, this.rangeType).format(DATE_FORMAT),
			endDate: moment().format(DATE_FORMAT),
			rangeTitle: getRangeTitle(this.rangeType, this.rangeCount),
			map: d.MAP,
			device: newEmpty(),
			service: newEmpty(),
			sensors: [],
			sensorNames: [],
			order: order+=1,
			expand: false
		};
		wiz1.radios.eq(d.TYPE).prop({checked: true});
		els.selects.val(null).trigger("change");
		els.rangeType.find("option[value='m']").prop({selected: true});
		els.toAppendAlert.find(".uk-alert-danger").remove();
		els.submit.attr({disabled: true});
		els.service.attr({disabled: true});
		els.sensors.attr({disabled: true});
		els.units.empty();
	}
	function open() {
		uk.openModal(ROOT);
	}
	function close() {
		uk.closeModal(ROOT);
	}
	function start() {
		open();
	}
	function alertMsg(msg) {
		els.root.toAppendAlert.append( temp.alert({message: msg}) );
	}
	function getRangeTitle(type, count) {
		let s = "Last ";
		s += count > 1 ? `${count} ` : "";
		switch (type) {
			case "m": s += "Minute"; break;
			case "h": s += "Hour"; break;
			case "d": s += "Day"; break;
			case "w": s += "Week"; break;
		}
		s+= count > 1 ? "s" : "";
		return s;
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
	function getDate(type, count) {
		if (type, count) {
			return moment().subtract(type, count).format(DATE_FORMAT);
		} else {
			return moment().format(DATE_FORMAT);
		}
	}
	function getUrl(type) {
		let route;
		switch (type) {
			case 0: route = "device/search"; break;
			case 1: route = "device/service/search"; break;
			case 2: route = "device/service/kpilist"; break;
		}
		return conf.BASE + route + token();
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
				url: getUrl(type),
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
						o.device_ids = JSON.stringify([data.device.id]);
					} else if (type === 2) {
						o.services = JSON.stringify([data.service.id]);
					}
					return o;
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
				els.units.append( temp.sensorUnit({name: selected.text, id: selected.id}) );
				const el = els.units.find("[data-colorpick]:last-child");
				colorpick.init( el, randColor(1) );
				
			} else {
				data[key].id = parseInt(selected.id, 10);
				data[key].name = selected.text;
			}
			if (toEnable) {
				toEnable.attr({disabled: false});
			}
			if (toClear) {
				toClear.val(null).trigger("change");
				toDisable.attr({disabled: true});
				toErase.empty();
			}
		})
		.on("change", () => {
			if (!type === 2) {
				data[key] = newEmpty();
			}
		})
		.on("select2:unselect", e => {
			if (type === 2) {
				const id = e.params.data.id.toString();
				els.units.find(`[data-sensor-id=${id}]`).remove();
				if (!el.val().length) {
					els.submit.attr({disabled: true});
				}
			}
		});
	}
	function init() {
		els = u.getEls(ROOT);
		reset();
		
		const toClear = els.service.add(els.sensors);
		const toDisable = els.sensors.add(els.submit);
		const toErase = els.units;
		initSelect2(els.device, 0, els.service, "devices", toClear, toDisable, toErase);
		initSelect2(els.service, 1, els.sensors, "service", els.sensors, els.submit, toErase);
		initSelect2(els.sensors, 2, els.submit, "");
		
		
		wiz1.next.on("click", () => {
			const checked = wiz1.radios.filter(":checked").val();
			const type = parseInt(checked, 10);
			data.type = type;
			switch (type) {
				case 0: open(WIZ_2); break;
				case 1: open(WIZ_3); break;
				case 2: open(WIZ_3); break;
				case 3: open(WIZ_4); break; 
			}
		});
		els.prev.on( "click", () => open(WIZ_1) );
		wiz3.prev.on( "click", () => open(WIZ_1) );
		wiz4.prev.on( "click", () => open(WIZ_1) );
		
		els.rangeType.on("change", rangeType);
		els.rangeCount.on("keyup", rangeCount);
		wiz3.rangeCount.on("keyup", rangeCount);
		wiz3.rangeCount.on("keyup", rangeCount);
		els.selects.on("click", () => {
			els.submit.attr({disabled: true});
		});
		els.units.on("click", "[data-delete-sensor]", e => {
			const el = $(e.currentTarget);
			const id = el.closest("[data-sensor-id]").data().sensorId.toString();
			const sensors = els.sensors;
			const val = sensors.val();
			const index = val.indexOf(id);
			val.splice(index, 1);
			sensors.val(val).trigger("change");
			el.parent().parent().remove();
			if (!sensors.val().length) {
				els.submit.attr({disabled: true});
			}
		});
		els.submit.on("click", () => {
			data.rangeType = els.rangeType.val();
			data.rangeCount = parseInt( els.rangeCount.val() );
			data.startDate = getDate(els.rangeCount.val(), els.rangeType.val());
			data.endDate = getDate();
			data.rangeTitle = getRangeTitle(els.rangeType.val(), els.rangeCount.val());
			// els.sensors.select2("data").forEach(i => data.sensors[i.id] = i.text);
			
			data.sensors = [];
			data.sensorOption = {};
			els.units.find("[data-sensor-id]").each((i, l) => {
				const el = $(l);
				const elData = el.data();
				const sensorId = elData.sensorId;
				const sensorName = elData.sensorName;
				data.sensors.push({
					id: sensorId,
					unit: el.find("[data-select]").val()
				});
				data.sensorOption[sensorId] = {
					color: el.find("[data-colorpick]").spectrum("get").toHex(),
					name: sensorName
				};
				data.sensorNames.push(sensorName);
			});
			log(data);
			
			els.toDisable.attr({disabled: true});
			els.units.find("[data-todisable]").attr({disabled: true});
			els.units.find("[data-colorpick]").spectrum("disable");
			
			inst.emit("submit", data, () => {
				els.toDisable.attr({disabled: false}); 
				els.units.find("[data-todisable]").attr({disabled: false});
				els.units.find("[data-colorpick]").spectrum("enable");
			});
		});
		wiz3.submit.on("click", () => {
			const t = data.type;
			if (t === 1) {
				// sensor_violation_ratio
			} else if (t === 2) {
				// sensor_violation_stat
			}
		});
		wiz4.submit.on("click", () => {
			inst.emit(data.type);
		});
	}
	
	inst.alertMsg = alertMsg;
	inst.init = init;
	inst.start = start;
	inst.close = close;
	inst.isOpen = isOpen;
	
	window.edit = inst;
	return inst;
});