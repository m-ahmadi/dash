define(["config", "token", "uk"], (conf, token, uk) => {
	let log = console.log;
	
	const inst = u.extend( newPubSub() );
	const WIZ_1 = "[data-root='wiz1']";
	const WIZ_2 = "[data-root='wiz2']";
	const WIZ_3 = "[data-root='wiz3']";
	const WIZ_4 = "[data-root='wiz4']";
	const temp = Handlebars.templates;
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
	let data, openedModal;
	
	const newEmpty = () => {
		return {
			id: undefined,
			name: undefined
		}
	};
	function reset() {
		data = {
			widgetType: d.TYPE,
			startDate: moment().subtract(d.RANGE_COUNT, d.RANGE_TYPE).format(DATE_FORMAT),
			endDate: moment().format(DATE_FORMAT),
			rangeTitle: getRangeTitle(d.RANGE_TYPE, d.RANGE_COUNT),
			mapType: d.MAP,
			device: newEmpty(),
			service: newEmpty(),
			sensor: newEmpty()
		};
		wiz1.radios.eq(d.TYPE).prop({checked: true});
		wiz2.selects.val(null).trigger("change");
		wiz2.rangeType.find("option[value='m']").prop({selected: true});
		wiz2.toAppendAlert.find(".uk-alert-danger").remove();
		wiz2.submit.attr({disabled: true});
		wiz2.service.attr({disabled: true});
		wiz2.sensor.attr({disabled: true});
	}
	function open(str) {
		openedModal = str;
		uk.openModal(str);
	}
	function close() {
		uk.closeModal(openedModal);
	}
	function start() {
		reset();
		open(WIZ_1);
	}
	function alertMsg(w, msg) {
		let set;
		switch (w) {
			case 2: set = wiz2; break;
			case 3: set = wiz3; break;
			case 4: set = wiz4; break;
		}
		set.toAppendAlert.append( temp.alert({message: msg}) );
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
	function getUrl(type) {
		let route;
		switch (type) {
			case 0: route = "device/search"; break;
			case 1: route = "device/service/search"; break;
			case 2: route = "device/kpilist"; break;
		}
		return conf.BASE + route + token();
	}
	function initSelect2(el, type, toEnable, resKey, toClear, toDisable) {
		const key = d.INPUT[type];
		el.select2({
			width: "100%",
			placeholder: "Select an option",
			ajax: {
				method: type === 1 ? "POST" : "GET",
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
			multiple: false,
			minimumInputLength: 0
		})
		.on("select2:select", () => {
			const id = el.select2("data")[0].id;
			data[key].id = parseInt(id, 10);
			data[key].name = el.select2("data")[0].text;
			if (toEnable) {
				toEnable.attr({disabled: false});
			}
			if (toClear) {
				toClear.val(null).trigger("change");
				toDisable.attr({disabled: true});
			}
		})
		.on("change", () => {
			data[key] = newEmpty();
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
	function getDate(type, count) {
		if (type, count) {
			return moment().subtract(type, count).format(DATE_FORMAT);
		} else {
			return moment().format(DATE_FORMAT);
		}
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
				case 0: open(WIZ_2); break;
				case 1: open(WIZ_3); break;
				case 2: open(WIZ_3); break;
				case 3: open(WIZ_4); break; 
			}
		});
		wiz2.prev.on( "click", () => open(WIZ_1) );
		wiz3.prev.on( "click", () => open(WIZ_1) );
		wiz4.prev.on( "click", () => open(WIZ_1) );
		
		wiz2.rangeType.on("change", rangeType);
		wiz2.rangeCount.on("keyup", rangeCount);
		wiz3.rangeCount.on("keyup", rangeCount);
		wiz3.rangeCount.on("keyup", rangeCount);
		wiz2.selects.on("click", () => {
			wiz2.submit.attr({disabled: true});
		});
		wiz2.submit.on("click", () => {
			data.startDate = getDate(wiz2.rangeCount.val(), wiz2.rangeType.val());
			data.endDate = getDate();
			data.rangeTitle = getRangeTitle(wiz2.rangeType.val(), wiz2.rangeCount.val());
			
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
	
	inst.alertMsg = alertMsg;
	inst.init = init;
	inst.start = start;
	inst.close = close;
	
	window.dool = () => {return data};
	return inst;
});