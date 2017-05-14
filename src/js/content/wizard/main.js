define(["config", "uk"], (conf, uk) => {
	let log = console.log;
	
	const inst = u.extend( newPubSub() );
	const WIZ_1 = "[data-root='wiz1']";
	const WIZ_2 = "[data-root='wiz2']";
	const WIZ_3 = "[data-root='wiz3']";
	const WIZ_4 = "[data-root='wiz4']";
	let wiz1, wiz2, wiz3, wiz4;
	const d = {
		TYPE: 0,
		MAP: 0,
		RANGE_COUNT: 15,
		RANGE_TYPE: 0, // minute hour day week
		RANGE_COUNT_MAX: {
			MIN: 10080,
			HOUR: 168,
			DAY: 7,
			WEEK: 1
		},
		RANGE_COUNT_DEF: {
			MIN: 25,
			HOUR: 6,
			DAY: 2,
			WEEK: 1
		},
		INPUT: [
			"device",
			"service",
			"sensor"
		]
	};
	let data;

	function reset() {
		data = {
			widgetType: d.TYPE,
			rangeCount: d.RANGE_COUNT,
			rangeType: d.RANGE_TYPE,
			mapType: d.MAP,
			device: "",
			service: "",
			sensor: ""
		};
		wiz1.radios.eq(d.TYPE).prop({checked: true});
		wiz2.submit.attr({disabled: true});
		wiz2.service.attr({disabled: true});
		wiz2.sensor.attr({disabled: true});
	}
	function start() {
		reset();
		uk.openModal(WIZ_1);
	}
	function getUrl(type) {
		let s;
		switch (type) {
			case 0: s = "/device/search"; break;
			case 1: s = "/device/service/search"; break;
			case 2: s = "/device/service/kpilist"; break;
		}
		return conf.BASE + s;
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
	function initSelect2(el, type, toEnable) {
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
					let userCookie; // = Cookies.get("user");
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
					o.Token = userCookie ? JSON.parse(userCookie).Token :  __Token;
					return o;
				},
				processResults: (data, params) => {
					let res = [];
					params.page = params.page || 1;
					data.devices.forEach((item) => {
						res.push({
							id: item.ID,
							text: item.Name
						});
					});
					return {
						results: res,
						pagination: {
							more: params.page < data.total_page
						}
					};
				},
			//	cache: true
			},
			multiple: false,
			minimumInputLength: 0,
		})
		.on("select2:select", () => {
			const s = el.select2("data")[0].id;
			data[key] = parseInt(s, 10);
			if (toEnable) { toEnable.attr({disabled: false}); }
		});
	}
	
	function init() {
		wiz1 = u.getEls(WIZ_1);
		wiz2 = u.getEls(WIZ_2);
		wiz3 = u.getEls(WIZ_3);
		wiz4 = u.getEls(WIZ_4);
		
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
		
		initSelect2(wiz2.device, 0, wiz2.service);
		initSelect2(wiz2.service, 1, wiz2.sensor);
		initSelect2(wiz2.sensor, 2, wiz2.submit);
		
		
		
		wiz2.rangeType.on("change", e => {
			const val = e.target.value;
			const n1 = d.RANGE_COUNT_DEF[val];
			const n2 = d.RANGE_COUNT_MAX[val];
			wiz2.rangeCount.val(n1);
			wiz2.rangeCount.attr("max", n2);
		});;
		wiz2.rangeCount.on("blue", () => {
			
		});
		wiz2.rangeCount.on("keyup", e => {
			const el = e.target;
			const type = wiz2.rangeType.val();
			const max = d.RANGE_COUNT_MAX[type];
			const min = parseInt($(el).attr("min"), 10);
			const val = el.value;
			if (val) {
				let num = parseInt(val, 10);
				if (num > max) {
					e.target.value = max;
				} else if (num < min) {
					e.target.value = min;
				}
			}
		});
		wiz2.submit.on("click", () => {
			inst.emit("submit", data);
			log(data);
		});
		wiz3.submit.on("click", () => {
			const t = data.type;
			let evtName = "";
			if (t === 1) {
				evtName = "sensor_violation_ratio";
			} else if (t === 2) {
				evtName = "sensor_violation_stat";
			}
			inst.emit(evtName, data);
		});
		wiz4.submit.on("click", () => {
			inst.emit(data.type);
		});
		window.w2 = wiz2;
	}
	
	inst.init = init;
	inst.start = start;
	return inst;
});