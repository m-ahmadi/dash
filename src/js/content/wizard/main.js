define(["config", "token", "uk"], (conf, token, uk) => {
	let log = console.log;
	
	const inst = u.extend( newPubSub() );
	const WIZ_1 = "[data-root='wiz1']";
	const WIZ_2 = "[data-root='wiz2']";
	const WIZ_3 = "[data-root='wiz3']";
	const WIZ_4 = "[data-root='wiz4']";
	const temp = Handlebars.templates;
	const MSG = [
		"Could not find CIRCUIT_ID of the selected service. ",
		"(circuits empty)",
		"(not found in circuits)"
	];
	let wiz1, wiz2, wiz3, wiz4;
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
		},
		INPUT: [
			"device",
			"service",
			"sensor"
		]
	};
	const DATE_FORMAT = "Y/MM/DD HH:mm";
	let data;

	function reset() {
		data = {
			widgetType: d.TYPE,
			startDate: moment().subtract(d.RANGE_COUNT, d.RANGE_TYPE).format(DATE_FORMAT),
			endDate: moment().format(DATE_FORMAT),
			mapType: d.MAP,
			device: undefined,
			service: undefined,
			sensor: undefined
		};
		wiz1.radios.eq(d.TYPE).prop({checked: true});
		wiz2.selects.val(null).trigger("change");
		wiz2.toAppendAlert.find(".uk-alert-danger").remove();
		wiz2.submit.attr({disabled: true});
		wiz2.service.attr({disabled: true});
		wiz2.sensor.attr({disabled: true});
	}
	function start() {
		reset();
		uk.openModal(WIZ_1);
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
	function _initSelect2(el, type, toEnable) {
		const key = d.INPUT[type];
		el.select2({
			width: "100%",
			placeholder: "Select an option",
			data: [{id: 1330557, text: "Skylight VCX Controller"}, {id: 1643887, text: "NID164-T2730-T2736"}],
			multiple: false,
			minimumInputLength: 0,
		})
		.on("select2:select", () => {
			const s = el.select2("data")[0].id;
			data[key] = parseInt(s, 10);
			if (toEnable) { toEnable.attr({disabled: false}); }
		});
	}
	function initSelect2(el, type, toEnable, resKey, toClear, toDisable) {
		const key = d.INPUT[type];
		el.select2({
			width: "100%",
			placeholder: "Select an option",
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
						o.device_ids = JSON.stringify([data.device]);
					} else if (type === 2) {
						o.services = JSON.stringify([data.service]);
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
			multiple: false,
			minimumInputLength: 0
		})
		.on("select2:select", () => {
			const s = el.select2("data")[0].id;
			data[key] = parseInt(s, 10);
			if (toEnable) {
				toEnable.attr({disabled: false});
			}
			if (toClear) {
				toClear.val(null).trigger("change");
				toDisable.attr({disabled: true});
			}
		})
		.on("change", () => {
			data[key] = undefined;
		});
	}
	function rangeType(e) {
		const val = e.target.value;
		const n1 = d.RANGE_COUNT_DEF[val];
		const n2 = d.RANGE_COUNT_MAX[val];
		wiz2.rangeCount.val(n1);
		wiz2.rangeCount.attr("max", n2);
	}
	function rangeCount(e) {
		const el = e.target;
		const type = wiz2.rangeType.val();
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
	function getDate(inp1, inp2) {
		if (inp1 && inp2) {
			return moment().subtract(inp1.val(), inp2.val()).format(DATE_FORMAT);
		} else {
			return moment().format(DATE_FORMAT);
		}
	}
	function msgAlert(w, t) {
		let set;
		switch (w) {
			case 2: set = wiz2; break;
			case 3: set = wiz3; break;
			case 4: set = wiz4; break;
		}
		const m = t === 1 ? MSG[0]+MSG[1] :
				  t === 2 ? MSG[0]+MSG[2] : "Say whaat?";
		set.toAppendAlert.append( temp.alert({message: m}) );
	}
	function init() {
		wiz1 = u.getEls(WIZ_1);
		wiz2 = u.getEls(WIZ_2);
		wiz3 = u.getEls(WIZ_3);
		wiz4 = u.getEls(WIZ_4);
		
		const toClear = wiz2.service.add(wiz2.sensor);
		initSelect2(wiz2.device, 0, wiz2.service, "devices", toClear, wiz2.submit);
		initSelect2(wiz2.service, 1, wiz2.sensor, "service", wiz2.sensor, wiz2.submit);
		initSelect2(wiz2.sensor, 2, wiz2.submit, "");
		
		reset();
		wiz1.next.on("click", () => {
			const checked = wiz1.radios.filter(":checked").val();
			const type = parseInt(checked, 10);
			data.widgetType = type;
			switch (type) {
				case 0: uk.openModal(WIZ_2); break;
				case 1: uk.openModal(WIZ_3); break;
				case 2: uk.openModal(WIZ_3); break;
				case 3: uk.openModal(WIZ_4); break; 
			}
			
		});
		wiz2.prev.on( "click", () => uk.openModal(WIZ_1) );
		wiz3.prev.on( "click", () => uk.openModal(WIZ_1) );
		wiz4.prev.on( "click", () => uk.openModal(WIZ_1) );
		
		
		
		wiz2.rangeType.on("change", rangeType);
		wiz2.rangeCount.on("keyup", rangeCount);
		wiz3.rangeCount.on("keyup", rangeCount);
		wiz3.rangeCount.on("keyup", rangeCount);
		wiz2.selects.on("click", () => {
			wiz2.submit.attr({disabled: true});
		});
		wiz2.submit.on("click", () => {
			data.startDate = getDate(wiz2.rangeCount, wiz2.rangeType);
			data.endDate = getDate();
			
			wiz2.toDisable.attr({disabled: true});
			data.cb = () => wiz2.toDisable.attr({disabled: false});
			inst.emit("submited", data);
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
	
	inst.msgAlert = msgAlert;
	inst.init = init;
	inst.start = start;
	
	window.dool = () => {return data};
	return inst;
});