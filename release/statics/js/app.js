define('core/config',{
	ROOT: "/statics/",
	LOAD: "dashboard/load",
	BASE: "/",
	ALT: "/",
	OFC: "/",
	STAT_KPIS: [{ id: 56, name: "packet_loss_ne" }, { id: 38, name: "two_way_delay_max" }, { id: 41, name: "two_way_dv_max" }]
});
define('core/token',[],function () {
	function main(pure) {
		var cookie = void 0,
		    o = void 0,
		    res = void 0;
		cookie = Cookies.get("user");

		if (cookie && u.isStr(cookie)) {
			o = JSON.parse(cookie);
			res = o.Token;
		} else {
			res = false;
		}

		return pure ? res : "?Token=" + res;
	}

	window.tok = main;
	return main;
});
define('core/uk',[],function () {
	var inst = {},
	    modals = {};
	var DISPLAY = "no-display";

	function getModal(str) {
		return UIkit.modal(str);
	}

	function disable(el) {
		if (!el.is(":disabled")) {
			el.attr("disabled", "");
		}
	}
	function enable(el) {
		if (!el.is(":enabled")) {
			el.removeAttr("disabled");
		}
	}
	function closeModal(s) {
		var m = getModal(s);
		if (m.isToggled()) {
			m.hide();
		}
	}
	function openModal(s) {
		var m = getModal(s);
		if (!m.isToggled()) {
			m.show();
		}
	}
	var note = function () {
		var DEFAULT_MSG = "NO_MESSAGE_WAS_SPECIFIED";
		var icons = {
			INFO: '<i class="fa  fa-info-circle           fa-lg"  aria-hidden="true"></i>',
			SUCCESS: '<i class="fa  fa-check-circle          fa-lg"  aria-hidden="true"></i>',
			WARNING: '<i class="fa  fa-exclamation           fa-lg"  aria-hidden="true"></i>',
			ERROR: '<i class="fa  fa-exclamation-triangle  fa-lg"  aria-hidden="true"></i>',
			PROCESS: '<i class="fa  fa-refresh               fa-lg   fa-fw fa-spin"></i>'
		};
		function make(o) {
			var v;

			v = UIkit.notification(o);

			return v;
		}
		function create(type, msg, timeout, pos) {
			var icon, status, res;

			if (type === "info") {
				// no such thing in uk3 but it works
				icon = icons.INFO;
				status = "info" || "primary";
			} else if (type === "success") {
				icon = icons.SUCCESS;
				status = "success";
			} else if (type === "warning") {
				icon = icons.WARNING;
				status = "warning";
			} else if (type === "error") {
				icon = icons.ERROR;
				status = "danger";
			} else if (type === "process") {
				icon = icons.PROCESS;
				timeout = 0;
				status = "info" || "primary";
			}

			res = make({
				message: icon + " " + (msg || DEFAULT_MSG),
				status: status,
				timeout: u.isNum(timeout) ? timeout : 1000,
				pos: pos || "top-right"
			});

			return res;
		}
		function info(msg, timeout, pos) {
			return create("info", msg, timeout, pos);
		}
		function success(msg, timeout, pos) {
			return create("success", msg, timeout, pos);
		}
		function warning(msg, timeout, pos) {
			return create("warning", msg, timeout, pos);
		}
		function error(msg, timeout, pos) {
			return create("error", msg, timeout, pos);
		}
		function process(msg, timeout, pos) {
			return create("process", msg, timeout, pos);
		}
		return {
			info: info,
			success: success,
			warning: warning,
			error: error,
			process: process
		};
	}();

	inst.toggleDisplay = function ($el) {
		$el.hasClass(DISPLAY) ? $el.removeClass(DISPLAY) : $el.addClass(DISPLAY);
	};
	inst.show = function ($el) {
		$el.hasClass(DISPLAY) ? $el.removeClass(DISPLAY) : undefined;
	};
	inst.hide = function ($el) {
		!$el.hasClass(DISPLAY) ? $el.addClass(DISPLAY) : undefined;
	};
	inst.note = note;
	inst.disable = disable;
	inst.enable = enable;
	inst.closeModal = closeModal;
	inst.openModal = openModal;

	window.uk = inst;
	return inst;
});
define('login',["core/config", "core/uk"], function (conf, uk) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='login']";
	var temp = u.getTemps("login/");

	var MIN_USER_CHARS = 4;
	var MIN_PASS_CHARS = 4;
	var ALERT_TIMEOUT = 4000;

	var data = {
		username: undefined,
		password: undefined
	};
	var els = void 0,
	    callback = void 0;

	function alert(ctx, keep) {
		var alerts = els.alerts;
		alerts.append(temp.alert(ctx));
		if (!keep) {
			var el = alerts.find("[uk-alert]:last-child [uk-close]");
			setTimeout(function () {
				return el.click();
			}, ALERT_TIMEOUT);
		}
	}
	function request() {
		els.toDisable.attr({ disabled: true });
		els.process.append(temp.alert({ type: "primary", process: true, message: "Processing your request...", noClose: true }));
		$.ajax({
			url: conf.BASE + "user/login",
			method: "POST",
			data: data
		}).done(function (d) {
			els.process.empty();
			alert({ type: "success", success: true, message: "Login Succesfull." }, true);
			Cookies.remove("user");
			Cookies.set("user", d);
			callback();
		}).fail(function (x, stat) {
			var resTxt = x.responseText;
			o = resTxt ? JSON.parse(x.responseText) : { Msg: stat + ": " + x.state() };
			els.process.empty();
			alert({ type: "danger", danger: true, message: o.Msg + "." });
			els.toDisable.attr({ disabled: false });
		});
	}
	function changeSubmitBtn() {
		var u = data.username;
		var p = data.password;
		if (u && u.length >= MIN_USER_CHARS && p && p.length >= MIN_PASS_CHARS) {
			els.submit.attr({ disabled: false });
		} else {
			els.submit.attr({ disabled: true });
		}
	}
	function keyup(e) {
		var el = $(e.target);
		var val = el.val();
		var key = el.data().el;
		var min = key === "username" ? MIN_USER_CHARS : MIN_PASS_CHARS;
		data[key] = val;
		if (val.length >= min) {
			el.removeClass("uk-form-danger").addClass("uk-form-success");
		} else {
			el.removeClass("uk-form-success").addClass("uk-form-danger");
		}
		changeSubmitBtn();
	}
	function start(cb) {
		$("#overlay").remove();
		callback = cb;
		uk.openModal(ROOT);
		var inpust = els.username.add(els.password);
		inpust.val("");
		inpust.attr({ disabled: false });
		els.username.val("").focus();
		changeSubmitBtn();
	}
	function init() {
		els = u.getEls(ROOT);

		els.username.on("keyup blur input change", keyup);
		els.password.on("keyup blur input change", keyup);
		els.submit.on("click", function (e) {
			request();
		});
	}

	inst.init = init;
	inst.start = start;
	window.login = inst;
	return inst;
});
define('header',["core/config", "core/token", "login"], function (conf, token, login) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='header']";
	var temp = u.getTemps("header/");
	var FORMAT = "MMMM Do YYYY, h:mm:ss a";
	var HIDE_KLASS = "uk-hidden";
	var els = void 0;

	function getUserInfo(userCookie) {
		var o = userCookie;
		return {
			name: o.Name,
			username: o.Username,
			admin: o.Admin,
			unreadMsg: o.UnreadMassage
		};
	}
	function fetchTime() {
		els.now.html(temp.smallSpinner());
		$.ajax({
			url: conf.BASE + "time" + token(),
			method: "GET"
		}).done(function (data) {
			if (data && u.isNum(data.offset)) {
				els.now.empty();
				timer();
				inst.emit("time", data.offset);
			} else {
				els.now.html(temp.danger());
			}
		}).fail(function (x) {
			els.now.html(temp.danger());
		});
	}
	function timer(ts) {
		els.now.text(moment(ts).format(FORMAT));
		setTimeout(timer, 1000);
	}

	inst.adjust = function () {
		fetchTime();
		var user = getUserInfo(JSON.parse(Cookies.get("user")));
		if (!user) throw new Error("No user cookie.");
		var umsg = user.UnreadMassage;
		if (user.admin) {
			els.adonly.removeClass(HIDE_KLASS);
		}
		els.name.text(user.name);
		// els.username.text(user.username);
		if (u.isNum(umsg) && umsg > 0) {
			els.unredMsg.text(umsg).removeClass(HIDE_KLASS);
		}
	};
	inst.init = function () {
		els = u.getEls(ROOT);
		els.now.on("click", "[data-retry]", fetchTime);
	};

	return inst;
});
define('toolbar',[], function () {
	var inst = u.extend(newPubSub());
	var els = void 0;
	var autorefOn = void 0,
	    gapCount = void 0,
	    gapType = void 0;

	var DEFAULT_GAP = 15000;
	var DEFAULT_MINUTES = 2;
	var DEFAULT_SECONDS = 15;
	var MIN_MINUTES = 1;
	var MAX_MINUTES = 5;
	var MIN_SECONDS = 15;
	var MAX_SECONDS = 300;

	function gap(count, type) {
		return type === "s" ? count * 1000 : type === "m" ? count * 60000 : DEFAULT_GAP;
	}
	function parseGapCount() {
		return parseInt(els.gapCount.val(), 10);
	}
	function enableBtns() {
		els.cancel.attr({ disabled: false }).addClass("danger");
		els.apply.attr({ disabled: false }).addClass("success");
	}
	function disableBtns() {
		els.cancel.attr({ disabled: true }).removeClass("danger");
		els.apply.attr({ disabled: true }).removeClass("success");
	}
	function emitStart() {
		var count = parseGapCount();
		var type = els.gapType.val();
		inst.emit("start_auto_refresh", gap(type, count));
	}
	function emitEnd() {
		inst.emit("end_auto_refresh");
	}
	function init(root) {
		els = u.getEls(root);
		gapCount = parseGapCount();
		gapType = els.gapType.val();

		new Switchery(els.autoref[0], {
			color: "#64bd63",
			secondaryColor: "#dfdfdf",
			jackColor: "#fff",
			jackSecondaryColor: null,
			className: "switchery",
			disabled: false,
			disabledOpacity: 0.5,
			speed: "0.2s",
			size: "default"
		});
		els.autoref.on("click", function (e) {
			var checked = e.target.checked;
			var toDis = els.gapCount.add(els.gapType);
			if (checked) {
				autorefOn = true;
				emitStart();
				toDis.attr({ disabled: false });
			} else {
				autorefOn = false;
				emitEnd();
				toDis.attr({ disabled: true });
				disableBtns();
			}
		});
		els.gapCount.on("input keyup change", function (e) {
			var el = $(e.target);
			var val = parseInt(el.val(), 10);
			var type = els.gapType.val();
			if (type === "m") {
				if (val > MAX_MINUTES) {
					el.val(MAX_MINUTES);
				} else if (val < MIN_MINUTES) {
					el.val(MIN_MINUTES);
				}
			} else if (type === "s") {
				if (val > MAX_SECONDS) {
					el.val(MAX_SECONDS);
				} else if (val < MIN_SECONDS) {
					el.val(MIN_SECONDS);
				}
			}
			if (gap(gapCount, gapType) !== gap(val, type)) {
				enableBtns();
			} else {
				disableBtns();
			}
		});
		els.gapType.on("change", function (e) {
			if (autorefOn) {
				var val = e.target.value;
				var _gapCount = els.gapCount;
				if (val === "m") {
					_gapCount.attr("min", MIN_MINUTES).val(DEFAULT_MINUTES);
				} else if (val === "s") {
					_gapCount.attr("min", MIN_SECONDS).val(DEFAULT_SECONDS);
				}
				_gapCount.change();
			}
		});

		els.cancel.on("click", function (e) {
			if (e.target.disabled) return;
			disableBtns();
		});
		els.apply.on("click", function (e) {
			if (e.target.disabled) return;
			gapCount = parseGapCount();
			gapType = els.gapType.val();
			emitEnd();
			emitStart();
			disableBtns();
		});

		els.add.on("click", function () {
			return inst.emit("add");
		});
		els.save.on("click", function () {
			return inst.emit("save_all");
		});
		els.deleteAll.on("click", function () {
			return inst.emit("delete_all");
		});
		els.minAll.on("click", function () {
			return inst.emit("min_all");
		});
		els.maxAll.on("click", function () {
			return inst.emit("max_all");
		});
		els.shrinkAll.on("click", function () {
			return inst.emit("shrink_all");
		});
		els.expandAll.on("click", function () {
			return inst.emit("expand_all");
		});
	}

	inst.init = init;

	return inst;
});
define('wizard/defaults',{
	TYPE: 0,
	MAP: false,
	RANGE_COUNT: 15,
	RANGE_TYPE: "m",
	RANGE_COUNT_MAX: {
		m: 10080,
		h: 168,
		d: 7,
		w: 1
	},
	RANGE_COUNT_DEF: {
		m: 15,
		h: 6,
		d: 2,
		w: 1
	}
});
define('wizard/share',[],function () {

	function getRangeTitle(type, count) {
		var s = "Last ";
		s += count > 1 ? count + " " : "";
		switch (type) {
			case "m":
				s += "Minute";break;
			case "h":
				s += "Hour";break;
			case "d":
				s += "Day";break;
			case "w":
				s += "Week";break;
		}
		s += count > 1 ? "s" : "";
		return s;
	}

	return { getRangeTitle: getRangeTitle };
});
define('wizard/wiz1',["core/uk", "./defaults"], function (uk, d) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='wiz1']";
	var els = void 0;

	function checked() {
		var v = els.radios.filter(":checked").val();
		return parseInt(v, 10);
	}

	inst.get = function () {
		return checked();
	};
	inst.open = function () {
		uk.openModal(ROOT);
		return inst;
	};
	inst.set = function (o) {
		type = o ? o.type : d.TYPE;
		els.radios.eq(type).prop({ checked: true });
		return inst;
	};
	inst.init = function () {
		els = u.getEls(ROOT);

		els.next.on("click", function () {
			inst.emit("next", checked());
		});
	};

	return inst;
});
define('wizard/wiz2/device',["core/config", "core/token"], function (conf, token) {
	var inst = u.extend(newPubSub());

	var el = void 0;

	function initSelect2() {
		el.select2({
			width: "100%",
			placeholder: "Select a node",
			ajax: {
				method: "GET",
				url: function url() {
					return conf.BASE + "device/search" + token();
				},
				dataType: "json",
				delay: 250,
				data: function data(params) {
					var o = {};
					if (params.term) {
						o.search = params.term;
					}
					o.page = params.page || 1;
					return o;
				},
				error: function error(x) {
					if (x.status === 403) {
						el.select2("close");
						inst.emit("login_error");
					}
				},
				processResults: function processResults(data, params) {
					var target = data.devices;
					var res = [];
					params.page = params.page || 1;
					if (target) {
						target.forEach(function (i) {
							res.push({
								id: i.ID,
								text: i.Name
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
		}).on("select2:select", function (e) {
			inst.emit("select", e.params.data.id);
		});
	}

	inst.getData = function () {
		return {
			id: parseInt(el.val(), 10),
			name: el.text()
		};
	};
	inst.setValue = function (device) {
		el.append($("<option></option>").val(device.id).text(device.name)).change();
		return inst;
	};
	inst.toggle = function (b) {
		el.attr({ disabled: !b });
		return inst;
	};
	inst.clear = function () {
		el.empty().val(null).change();
		return inst;
	};
	inst.init = function (el_) {
		el = el_;

		initSelect2();
		return inst;
	};

	return inst;
});
define('wizard/wiz2/service',["core/config", "core/token"], function (conf, token) {
	var inst = u.extend(newPubSub());
	var el = void 0;
	var deviceId = void 0;

	function initSelect2() {
		el.select2({
			width: "100%",
			placeholder: "Select a service",
			ajax: {
				method: "POST",
				url: function url() {
					return conf.BASE + "device/service/search" + token();
				},
				dataType: "json",
				delay: 250,
				data: function data(params) {
					var o = {};
					if (params.term) {
						o.search = params.term;
					}
					o.page = params.page || 1;
					o.device_ids = JSON.stringify([deviceId]);
					return o;
				},
				error: function error(x) {
					if (x.status === 403) {
						el.select2("close");
						inst.emit("login_error");
					}
				},
				processResults: function processResults(data, params) {
					var target = data.service;
					var res = [];
					params.page = params.page || 1;
					if (target) {
						target.forEach(function (i) {
							res.push({
								id: i.ID,
								text: i.Name
								//	text: u.substrAfterLast(".", i.Name)
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
		}).on("select2:select", function (e) {
			inst.emit("select", e.params.data.id);
		});
	}

	inst.getData = function () {
		return {
			id: parseInt(el.val(), 10),
			name: el.text()
		};
	};
	inst.setValue = function (service) {
		el.append($("<option></option>").val(service.id).text(service.name)).change();
		return inst;
	};
	inst.clear = function () {
		el.empty().val(null).change();
		return inst;
	};
	inst.setDeviceId = function (id) {
		deviceId = id;
		return inst;
	};
	inst.toggle = function (b) {
		el.attr({ disabled: !b });
		return inst;
	};
	inst.init = function (el_) {
		el = el_;
		initSelect2();
	};

	return inst;
});
define('wizard/wiz2/sensors',["core/config", "core/token"], function (conf, token) {
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
define('wizard/wiz2/colorpick',[],function () {
	function init($el, color, onChange) {
		$el.spectrum({
			color: color || "#ECC",
			showInput: true,
			showAlpha: true,
			className: "full-spectrum",
			showInitial: true,
			showPalette: true,
			showSelectionPalette: true,
			maxSelectionSize: 10,
			preferredFormat: "hex",
			localStorageKey: "spectrum.demo",
			change: onChange,
			palette: [["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"], ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]]
		});
	}
	return { init: init };
});
define('wizard/wiz2/dataTable',["./colorpick"], function (colorpick) {
	var inst = u.extend(newPubSub());
	var temp = u.getTemps("wizard/wiz2");

	var parent = void 0;
	var rows = {};

	function randColor(brightness) {
		// Six levels of brightness from 0 to 5, 0 being the darkest
		var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
		var mix = [brightness * 51, brightness * 51, brightness * 51]; //51 => 255/5
		var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) {
			return Math.round(x / 2.0);
		});
		return "rgb(" + mixedrgb.join(",") + ")";
	}

	function newRow(sensor) {
		var id = sensor.id;
		var units = sensor.units;
		parent.append(temp.sensorRow({
			name: sensor.name,
			id: id,
			units: units
		}));
		var root = parent.children().last();
		var els = u.getEls(root);

		var selectedUnit = units.filter(function (o) {
			return o.selected ? o.name : undefined;
		})[0];
		if (selectedUnit) {
			els.select.val(selectedUnit.name).change();
		}
		colorpick.init(els.colorpick, sensor.color || randColor(u.randInt(0, 6)), onColorChange);
		sensor.color = color();

		els.select.on("change", function (e) {
			var newVal = e.target.value;
			sensor.color = newVal;
			inst.emit("unit_change", id, newVal);
		});
		els.remove.on("click", remove);

		function onColorChange(color) {
			inst.emit("color_change", id, color.toHex());
		}
		function toggle(b) {
			els.toDisable.attr({ disabled: !b });
			els.colorpick.spectrum(b ? "enable" : "disable");
		}
		function remove() {
			els.colorpick.spectrum("destroy");
			parent.find("> tr[data-id=\"" + id + "\"]").remove();
			delete rows[id];

			inst.emit("sensor_remove", sensor);
			if (u.isEmptyObj(rows)) inst.emit("sensor_remove_all");
		}
		function getUnits() {
			var selectedVal = els.select.val().trim();
			return sensor.units.map(function (o) {
				var name = o.name;
				var res = {
					name: name,
					selected: false
				};
				if (name === selectedVal) {
					res.selected = true;
				}
				return res;
			});
		}
		function color() {
			return els.colorpick.spectrum("get").toHex();
		}

		return {
			id: id,
			name: sensor.name,
			toggle: toggle, remove: remove, getUnits: getUnits, color: color
		};
	}
	function addRow(sensor) {
		var id = sensor.id;
		if (!rows[id]) {
			rows[id] = newRow(sensor);
			inst.emit("sensor_add", id);
		}
	}
	function getData() {
		if (u.isEmptyObj(rows)) return;
		var data = {};
		Object.keys(rows).forEach(function (k) {
			var row = rows[k];
			var id = row.id;
			data[id] = {
				id: id,
				name: row.name,
				units: row.getUnits(),
				color: row.color()
			};
		});
		return data;
	}
	function doAll(action, arg) {
		Object.keys(rows).forEach(function (k) {
			return rows[k][action](arg);
		});
	}
	function init(root) {
		parent = root;
	}

	inst.removeAll = function () {
		doAll("remove");
		return inst;
	};
	inst.toggleAll = function (b) {
		return doAll("toggle", b);
	};
	inst.addRow = addRow;
	inst.getData = getData;
	inst.init = init;

	return inst;
});
define('wizard/wiz2/wiz2',["core/config", "core/token", "core/uk", "../share", "../defaults", "./device", "./service", "./sensors", "./dataTable"], function (conf, token, uk, share, d, device, service, sensors, dataTable) {
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
define('wizard/wiz3',["core/uk", "core/config", "core/token", "./defaults", "./share"], function (uk, conf, token, d, share) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='wiz3']";
	var temp = u.getTemps("wizard/wiz3");

	var els = void 0;
	var firstGroupFetch = true;
	var c = { add: {}, edit: {} }; // event callbacks
	var toggle = {
		submit: function submit(b) {
			els.submit.attr({ disabled: !b });
		},
		prev: function prev(b) {
			els.prev.attr({ disabled: !b });
		},
		toDisable: function toDisable(b) {
			els.toDisable.attr({ disabled: !b });
		},
		modal: function modal(b) {
			uk[b ? "openModal" : "closeModal"](ROOT);
		}
	};

	function groupSucc(arr) {
		if (!els) {
			setTimeout(groupSucc, 1000);return;
		}
		els.stat.empty();
		arr.forEach(function (i) {
			els.groups.append(temp.groupOpt({ name: i.name, value: i.id }));
		});
	}
	function groupFail() {
		if (!els) {
			setTimeout(groupFail, 1000);return;
		}
		els.btnParent.empty().append(temp.groupOptBtn());
		els.stat.empty().append(temp.groupOptDanger());
	}
	function fetchGroups() {
		if (!firstGroupFetch) {
			els.btnParent.empty();
			els.stat.empty().append(temp.smallSpinner());
		}
		$.ajax({
			url: conf.BASE + "device/grouptree" + token(),
			method: "GET",
			data: "parent_only=true"
		}).done(function (d) {
			var arr = [];
			d.groups[0].Groups.forEach(function (i) {
				return arr.push({ name: i.Name, id: i.ID });
			});
			groupSucc(arr);
			inst.emit("group_fetch_succ", arr);
		}).fail(function (x) {
			if (x.status === 403) {
				inst.emit("login_error");
			} else {
				inst.emit("group_fetch_fail");
			}
			groupFail();
		});
		firstGroupFetch = false;
	}

	c.groupChange = function (e) {
		var curr = e.data;
		var v = e.target.value;
		if (curr) {
			els.submit.attr({ disabled: !v || parseInt(v, 10) === curr.groupId });
		} else {
			els.submit.attr({ disabled: v ? false : true });
		}
	};
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
	function setForAdd() {
		inst.shallow = true;
		toggle.prev(true);
		els.rangeType.off("change").on("change", c.add.typeChange).val(d.RANGE_TYPE).change();
		els.rangeCount.off("change").on("change", c.add.countChange);
		els.groups.off("change").on("change", c.groupChange).val("").change();
	}
	function setForEdit(o) {
		toggle.prev(false);
		var type = o.rangeType;
		var count = o.rangeCount;
		var groupId = o.group.id;
		var curr = {
			type: type,
			count: count
		};

		els.rangeType.off("change").on("change", curr, c.edit.typeChange).val(type).change();

		els.rangeCount.off("change").on("change", curr, c.edit.countChange).val(count).change();

		els.groups.off("change").on("change", { groupId: groupId }, c.groupChange).val(groupId).change();
	}
	function get() {
		var rangeTypeVal = els.rangeType.val();
		var rangeCountVal = els.rangeCount.val();
		var groups = els.groups;
		return {
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal),
			group: {
				id: parseInt(groups.val(), 10),
				name: groups.find(":selected").text()
			},
			statKpis: conf.STAT_KPIS
		};
	}
	function close() {
		inst.shallow = false;
		toggle.modal(false);
	}

	inst.open = function () {
		toggle.modal(true);
		return inst;
	};
	inst.set = function (o) {
		o ? setForEdit(o) : setForAdd();
		return inst;
	};
	inst.fetchGroups = fetchGroups;
	inst.init = function () {
		els = u.getEls(ROOT);

		els.prev.on("click", function (e) {
			if (e.target.disabled) return;
			inst.emit("prev");
		});

		els.btnParent.on("click", "[data-retry]", fetchGroups);

		els.submit.on("click", function (e) {
			if (e.target.disabled) return;
			var toDis = els.toDisable;
			toDis.attr({ disabled: true });
			inst.emit("submit", get(), function (success) {
				toDis.attr({ disabled: false });
				if (success) close();
			});
		});
	};

	return inst;
});
define('wizard/wiz4/device',["core/config", "core/token"], function (conf, token) {
	var inst = u.extend(newPubSub());

	var el = void 0;

	function initSelect2() {
		el.select2({
			width: "100%",
			placeholder: "Nodes",
			ajax: {
				method: "GET",
				url: function url() {
					return conf.BASE + "device/search" + token();
				},
				dataType: "json",
				delay: 250,
				data: function data(params) {
					var o = {};
					if (params.term) {
						o.search = params.term;
					}
					o.page = params.page || 1;
					return o;
				},
				error: function error(x) {
					if (x.status === 403) {
						el.select2("close");
						inst.emit("login_error");
					}
				},
				processResults: function processResults(data, params) {
					var target = data.devices;
					var res = [];
					params.page = params.page || 1;
					if (target) {
						target.forEach(function (i) {
							res.push({
								id: i.ID,
								text: i.Name
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
		}).on("select2:select", function (e) {
			el.val(null).change();
			var selected = e.params.data;
			var device = {
				id: selected.id,
				name: selected.text
			};
			inst.emit("select", device);
		});
	}

	inst.init = function (root) {
		el = root;
		initSelect2();
	};

	return inst;
});
define('wizard/wiz4/dataTable',[], function () {
	var inst = u.extend(newPubSub());
	var temp = u.getTemps("wizard/wiz4");

	var parent = void 0;
	var rows = {};

	function newRow(device) {
		var id = device.id;
		parent.append(temp.deviceRow({
			id: id,
			name: device.name
		}));
		var root = parent.children().last();
		var els = u.getEls(root);
		els.remove.on("click", remove);

		function bleep() {
			els.root.effect("highlight", { color: "#bcff65" }, 400);
		}
		function toggle(b) {
			els.toDisable.attr({ disabled: !b });
		}
		function remove() {
			parent.find("> tr[data-id=\"" + id + "\"]").remove();
			delete rows[id];
			inst.emit("remove", id);
			if (u.isEmptyObj(rows)) inst.emit("remove_all");
		}

		return {
			id: id,
			name: device.name,
			toggle: toggle, remove: remove, bleep: bleep
		};
	}

	function addRow(device) {
		var id = device.id;
		if (!rows[id]) {
			rows[id] = newRow(device);
			inst.emit("add", id);
		} else {
			rows[id].bleep();
		}
	}
	function getData() {
		if (u.isEmptyObj(rows)) return;
		var data = {};
		Object.keys(rows).forEach(function (k) {
			var row = rows[k];
			var id = row.id;
			data[id] = {
				id: id,
				name: row.name
			};
		});
		return data;
	}
	function doAll(action, arg) {
		Object.keys(rows).forEach(function (k) {
			return rows[k][action](arg);
		});
	}

	inst.addRow = addRow;
	inst.getData = getData;

	inst.removeAll = function () {
		doAll("remove");
		return inst;
	};
	inst.toggleAll = function (b) {
		doAll("toggle", b);
		return inst;
	};

	inst.init = function (root) {
		parent = root;
	};
	return inst;
});
define('wizard/wiz4/wiz4',["core/uk", "core/config", "core/token", "../defaults", "../share", "./device", "./dataTable"], function (uk, conf, token, d, share, device, dataTable) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='wiz4']";
	var temp = u.getTemps("wizard/wiz4");

	var els = void 0;
	var c = { add: {}, edit: {} };
	var groups = void 0;
	var checkboxes = newPubSub();
	var firstGroupFetch = true;
	var toggle = {
		submit: function submit(b) {
			els.submit.attr({ disabled: !b });
		},
		prev: function prev(b) {
			els.prev.attr({ disabled: !b });
		},
		toDisable: function toDisable(b) {
			els.toDisable.prop({ disabled: !b });
		}
	};

	function fetchGroups() {
		if (!firstGroupFetch) {
			els.groups.html(temp.loading());
		}
		$.ajax({
			url: conf.BASE + "device/grouptree" + token(),
			method: "GET",
			data: "parent_only=true"
		}).done(function (d) {
			var arr = [];
			d.groups[0].Groups.forEach(function (i) {
				return arr.push({ name: i.Name, id: i.ID });
			});
			setGroups(arr);
			renderForm();
		}).fail(function (x) {
			if (x.status === 403) inst.emit("login_error");
			firstGroupFetch = false;
			clearAlerts();
			els.groups.html(temp.danger());
		});
	}
	function clearAlerts() {
		els.groups.empty();
	}
	function setGroups(arr) {
		arr.unshift({ id: "all", name: "All" });
		groups = arr;

		return inst;
	}
	function renderForm() {
		if (!groups) throw new Error("renderForm(): groups must be set before calling.");
		clearAlerts();
		var g = els.groups;
		g.html(temp.formRow({ groups: groups }));
		els.checkboxes = g.find(":checkbox");
		els.toDisable = els.toDisable.add(els.checkboxes);
		checkboxes.emit("ready", els.checkboxes);
		return inst;
	}

	c.retry = function () {
		clearAlerts();
		fetchGroups();
	};
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
		// toggle.submit( v !== curr.type || count !== curr.count );
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
			// toggle.submit(num !== curr.count || type !== curr.type);
		} else {
			el.val(d.RANGE_COUNT_DEF[type]);
		}
	};

	function setChk(checkboxes, selected) {
		checkboxes.prop({ checked: false }).each(function (x, l) {
			this.checked = selected.indexOf(parseInt(this.value, 10)) !== -1;
		});
		if (selected.indexOf('all') !== -1) {
			checkboxes.filter("[value='all']").prop({ checked: true });
		}
	}
	function setForAdd() {
		inst.shallow = true;
		toggle.prev(true);
		if (els.checkboxes) {
			els.checkboxes.prop({ checked: false });
		} else {
			checkboxes.on("ready", function (els) {
				els.prop({ checked: false });
			});
		}

		dataTable.removeAll();
		device.off().on("select", function (device) {
			dataTable.addRow(device);
		});

		els.violated.prop({ checked: false });
		els.live.prop({ checked: false });

		/* els.rangeType
  	.off("change")
  	.on("change", c.add.typeChange)
  	.val(d.RANGE_TYPE)
  	.change();
  els.rangeCount
  	.off("change")
  	.on("change", c.add.countChange); */
	}
	function setForEdit(o) {
		var m = o.map;
		var devices = m.devices;
		toggle.prev(false);
		if (els.checkboxes) {
			setChk(els.checkboxes, m.groups);
		} else {
			checkboxes.on("ready", function (els) {
				setChk(els, m.groups);
			});
		}

		dataTable.removeAll();
		if (devices) {
			Object.keys(devices).forEach(function (k) {
				return dataTable.addRow(devices[k]);
			});
		}

		device.off().on("select", function (device) {
			dataTable.addRow(device);
		});

		els.violated.prop({ checked: m.violated });
		els.live.prop({ checked: m.live });

		/* let type = o.rangeType;
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
  	.change(); */
	}
	function get() {
		// let rangeTypeVal = els.rangeType.val();
		// let rangeCountVal = els.rangeCount.val();
		var res = {
			// rangeType: rangeTypeVal,
			// rangeCount: parseInt(rangeCountVal, 10),
			// rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal),
			map: {
				groups: null,
				devices: dataTable.getData() || null,
				violated: els.violated.prop("checked"),
				live: els.live.prop("checked")
			}
		};
		var groups = [];
		els.groups.find(":checkbox:checked").each(function (x, l) {
			var v = l.value;
			var id = v === "all" ? v : parseInt(v, 10);
			if (id) groups.push(id);
		});
		res.map.groups = groups;
		return res;
	}
	function close() {
		inst.shallow = false;
		uk.closeModal(ROOT);
	}

	inst.shallow = false;
	inst.setGroups = setGroups;
	inst.renderForm = renderForm;
	inst.fetchGroups = fetchGroups;

	inst.set = function (o) {
		o ? setForEdit(o) : setForAdd();
		return inst;
	};
	inst.open = function () {
		uk.openModal(ROOT);
	};
	inst.init = function () {
		els = u.getEls(ROOT);
		device.init(els.device);
		dataTable.init(els.table);

		els.prev.on("click", function (e) {
			if (e.target.disabled) return;
			inst.emit("prev");
		});
		els.groups.on("click", "[data-retry]", c.retry).on("click", "input:checkbox", function (e) {
			var chks = els.checkboxes;
			var el = e.target;
			var v = el.value;
			if (v === "all") {
				chks.prop({ checked: el.checked });
			} else {
				chks.filter("[value='all']").prop({ checked: false });
			}
		});

		els.submit.on("click", function (e) {
			if (e.target.disabled) return;
			toggle.toDisable(false);
			dataTable.toggleAll(false);
			inst.emit("submit", get(), function (success) {
				toggle.toDisable(true);
				dataTable.toggleAll(true);
				if (success) close();
			});
		});
	};

	window.w4 = function () {
		return els;
	};
	return inst;
});
define('wizard/wizard',["core/config", "core/token", "core/uk", "./defaults", "./share", "./wiz1", "./wiz2/wiz2", "./wiz3", "./wiz4/wiz4"], function (conf, token, uk, d, share, wiz1, wiz2, wiz3, wiz4) {
	var inst = u.extend(newPubSub());

	var id = void 0,
	    order = void 0,
	    addMode = void 0,
	    shallow = void 0;
	var w = void 0;
	var prefetch = true;

	function uid() {
		return Math.floor(Math.random() * 1000);
	}
	function newData() {
		var data = {
			id: id || uid(),
			type: null,
			rangeType: null,
			rangeCount: null,
			rangeTitle: null,
			device: null,
			service: null,
			sensors: null,
			group: null,
			statKpis: null,
			order: order,
			expand: 0,
			min: false
		};
		return data;
	}
	function merge(o) {
		var data = newData();

		data.type = wiz1.get();

		Object.keys(o).forEach(function (k) {
			data[k] = o[k];
		});

		return data;
	}
	function start(childs) {
		addMode = true;
		shallow = false;
		w = undefined;
		id = undefined;
		order = childs ? childs : 0;
		wiz1.set().open();
	}
	function edit(o) {
		addMode = false;
		shallow = false;
		w = JSON.parse(JSON.stringify(o)); // deep copy
		id = w.id;
		order = w.order;
		wiz1.set(w);
		switch (w.type) {
			case 0:
				wiz2.set(w).open();break;
			case 1:
				wiz3.set(w).open();break;
			case 2:
				wiz3.set(w).open();break;
			case 3:
				wiz4.set(w).open();break;
		}
	}
	function emitLoginErr(cb) {
		inst.emit("login_error", cb);
	}
	function emitSubmit(data, cb) {
		var eStr = addMode ? "submit:create" : "submit:edit";
		inst.emit(eStr, merge(data), cb);
	}
	function go(which) {
		if (!which.shallow) {
			if (addMode) {
				which.set();
			} else {
				which.set(w);
			}
		}
		which.open();
	}
	function back(state) {
		shallow = state;
		wiz1.open();
	}
	function addCustomEvt() {
		wiz1.on("next", function (t) {
			if (t === 0) {
				go(wiz2);
			} else if (t === 1) {
				go(wiz3);
			} else if (t === 2) {
				go(wiz3);
			} else if (t === 3) {
				go(wiz4);
			}
		});
		wiz2.on("prev", back);
		wiz3.on("prev", back);
		wiz4.on("prev", back);

		wiz2.on("submit", emitSubmit).on("login_error", emitLoginErr, wiz2.open);

		wiz3.on("submit", emitSubmit).on("login_error", emitLoginErr, wiz3.open).on("group_fetch_succ", function (groupsArr) {
			wiz4.setGroups(groupsArr).renderForm();
		}).on("group_fetch_fail", function () {
			wiz4.fetchGroups();
		});

		wiz4.on("submit", emitSubmit).on("login_error", emitLoginErr, wiz4.open);
	}

	inst.start = start;
	inst.edit = edit;

	inst.init = function () {
		wiz1.init();
		wiz2.init();
		wiz3.init();
		wiz4.init();

		addCustomEvt();
	};
	inst.fetchGroups = function () {
		wiz3.fetchGroups();
	};

	return inst;
});
define('confirm',["core/uk"], function (uk) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='confirm']";
	var els = void 0,
	    confirmId = void 0;

	function close() {
		confirmId = undefined;
		uk.closeModal(ROOT);
	}
	function open(id) {
		confirmId = id;
		uk.openModal(ROOT);
	}
	function init() {
		els = u.getEls(ROOT);
		els.submit.on("click", function () {
			els.toDisable.attr({ disabled: true });
			inst.emit("submit", confirmId, function () {
				els.toDisable.attr({ disabled: false });
				close();
			});
		});
	}

	inst.open = open;
	inst.init = init;

	return inst;
});
define('process',["core/uk"], function (uk) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='process']";
	var temp = u.getTemps("process");
	var els = void 0;
	var doingMsg = "";
	var timer = void 0;

	function resume() {
		uk.openModal(ROOT);
	}
	function open() {
		$("#overlay").remove();
		clear();
		reset();
		uk.openModal(ROOT);
	}
	function close() {
		setTimeout(function () {
			return uk.closeModal(ROOT);
		}, 1000);
	}
	function clear() {
		els.logs.empty();
	}
	function reset() {
		set(0);
	}
	function log(msg, type) {
		var ctx = {};
		var str = type || "primary";
		ctx.message = msg;
		ctx.type = str;
		ctx[str] = true;
		els.logs.append(temp.alert(ctx));
	}
	function inc(steps) {
		var n = parseFloat(els.bar.val(), 10);
		set(n += steps || 1);
	}
	function set(n) {
		els.bar.val(n).trigger("change");
	}
	function get(n) {
		return parseInt(els.bar.val(), 10);
	}
	function init() {
		els = u.getEls(ROOT);
		els.bar.on("change", function (e) {
			els.percent.text($(e.target).val());
		});
	}
	function doing(msg, append) {
		if (append) {
			els.currently.text(doingMsg + msg);
		} else {
			doingMsg = msg;
			els.currently.text(doingMsg);
		}
	}
	function start(steps) {
		timer = setTimeout(function () {
			inc(1);
			start();
		}, 800);
	}
	function stop() {
		clearTimeout(timer);
	}
	function finish() {
		set(100);
		close();
	}

	inst.resume = resume;
	inst.open = open;
	inst.close = close;
	inst.log = log;
	inst.clear = clear;
	inst.reset = reset;
	inst.set = set;
	inst.get = get;
	inst.inc = inc;
	inst.doing = doing;
	inst.start = start;
	inst.stop = stop;
	inst.finish = finish;
	inst.init = init;

	window.proc = inst;
	return inst;
});
define('widget/mapMaker',["core/config", "core/token"], function (conf, token) {
	var inst = {};

	function buildFormdata(o) {
		var res = new FormData();
		Object.keys(o).forEach(function (k) {
			res.append(k, o[k]);
		});
		return res;
	}

	function newMap() {
		return {
			events: newPubSub(),
			toSend: undefined,

			target: undefined,
			container: undefined,
			center: undefined,
			coordinates: undefined,
			lastDevicePosition: [0, 0],
			last: {
				center: [0, 0],
				zoom: 5
			},
			isViolated: false,
			live: true,
			autoRefresh: false,
			interval: undefined,
			defaultCircuitID: undefined, // $routeParams.circuitId,
			view: new ol.View({
				zoom: 5,
				maxZoom: 21,
				minZoom: 2.5,
				center: [0, 0]
			}),
			violationLayer: new ol.layer.Vector(),
			deviceLayer: new ol.layer.Vector(),
			layers: {
				circuit: new ol.layer.Vector(),
				info: new ol.layer.Vector(),
				minor: new ol.layer.Vector(),
				major: new ol.layer.Vector(),
				critical: new ol.layer.Vector()
			},
			violationSource: new ol.source.Vector({
				wrapX: false
			}),
			deviceSource: new ol.source.Vector({
				wrapX: false
			}),
			sources: {
				circuit: new ol.source.Vector({
					wrapX: false
				}),
				info: new ol.source.Vector({
					wrapX: false
				}),
				minor: new ol.source.Vector({
					wrapX: false
				}),
				major: new ol.source.Vector({
					wrapX: false
				}),
				critical: new ol.source.Vector({
					wrapX: false
				})
			},
			violationStyle: function violationStyle(feature, resolution) {
				return new ol.style.Style({
					text: new ol.style.Text({
						font: '10px helvetica,sans-serif',
						text: feature.get('name'),
						fill: new ol.style.Fill({
							color: feature.get("color")
						}),
						stroke: new ol.style.Stroke({
							color: '#fff',
							width: 8
						})
					})
				});
			},
			deviceStyle: function deviceStyle(feature, resolution) {
				var color = feature.get("color") || "green";
				return new ol.style.Style({
					image: new ol.style.Icon({
						src: conf.ROOT + "images/location-icon.svg",
						color: color,
						scale: feature.get("selected") ? 1.5 : 1,
						opacity: 1
					})
				});
			},
			lineStyle: function lineStyle(type) {
				var self = this;
				var colorMap = {
					circuit: "green",
					info: "blue",
					minor: "#f7bb38",
					major: "orange",
					critical: "red"
				};
				return function (feature) {
					return new ol.style.Style({
						stroke: new ol.style.Stroke({
							color: colorMap[type],
							width: feature.get("id") == self.defaultCircuitID ? 5 : 2
						})
					});
				};
			},
			refreshMap: function refreshMap() {
				var self = this;
				if (self.interval) {
					//$interval.cancel(self.interval);
					clearInterval(self.interval);
					self.interval = undefined;
				}
				if (self.autoRefresh && self.live)
					//self.interval = $interval(function() {
					self.interval = setInterval(function () {
						self.getData();
					}, 15000);
				self.getData();
			},

			addDataToMap: function addDataToMap(data, clear) {
				if (!data) return;
				var self = this;
				// Add Devices
				// TODO: can make function for this part
				if (clear && self.deviceSource.getFeatures().length) self.deviceSource.clear();
				self.center = undefined;
				self.coordinates = undefined;
				self.lastDevicePosition = [0, 0];
				if (data.device) {
					data.device.forEach(function (node) {
						var isSeleced = false;
						// if ([_SELECTED_DEVICES_IDS_].indexOf(node.id.toString()) !== -1) {
						/* if ($($scope.console.deviceSelectElement).val().split(",").indexOf(node.id.toString()) !== -1) {
      
      	self.center = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
      	isSeleced = true;
      } */
						self.lastDevicePosition = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
						self.deviceSource.addFeature(new ol.Feature({
							geometry: new ol.geom.Point(self.lastDevicePosition),
							color: node.color,
							name: node.name,
							id: node.id,
							location: node.location,
							lat: node.latitude,
							long: node.longtitude,
							selected: isSeleced
						}));
					});
				}
				// Add Circuits
				// TODO: can make function for this part
				if (clear) $.each(self.sources, function (key, source) {
					if (source.getFeatures().length) source.clear();
				});
				var sourceXY, destinationXY;
				if (data.circuits) {
					self.violatedServices.list = [];
					data.circuits.forEach(function (link) {
						data.device.forEach(function (node) {
							if (node.id === link.source) {
								sourceXY = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
								link.source_name = node.name;
								filterViolatedServices();
							}
							if (node.id === link.destination) {
								destinationXY = ol.proj.transform([node.longtitude % 180, node.latitude % 90], 'EPSG:4326', 'EPSG:3857');
								link.destination_name = node.name;
								// filterViolatedServices();
							}

							function filterViolatedServices() {
								if (link.sla_violated) {
									var color = { info: "blue", minor: "#f7bb38", major: "orange", critical: "red" }[link.sla_violated_type];
									self.violatedServices.list.push({
										id: link.id,
										name: node.name,
										latitude: node.latitude,
										longtitude: node.longtitude,
										type: link.sla_violated_type,
										color: color
									});
								}
							}
						});
						if (!sourceXY || !destinationXY) return;
						if (link.id == self.defaultCircuitID) {
							var coordinates = {};
							if (sourceXY[0] === destinationXY[0] && sourceXY[1] === destinationXY[1]) {
								self.center = [sourceXY[0], sourceXY[1]];
							} else {
								if (sourceXY[0] < destinationXY[0]) {
									coordinates.maxLong = destinationXY[0];
									coordinates.minLong = sourceXY[0];
								} else {
									coordinates.maxLong = sourceXY[0];
									coordinates.minLong = destinationXY[0];
								}
								if (sourceXY[1] < destinationXY[1]) {
									coordinates.maxLat = destinationXY[1];
									coordinates.minLat = sourceXY[1];
								} else {
									coordinates.maxLat = sourceXY[1];
									coordinates.minLat = destinationXY[1];
								}
								self.coordinates = [coordinates.minLong, coordinates.minLat, coordinates.maxLong, coordinates.maxLat];
							}
						}
						if (link.sla_violated) {
							self.sources[link.sla_violated_type].addFeature(new ol.Feature({
								geometry: new ol.geom.LineString([sourceXY, destinationXY]),
								id: link.id,
								source_name: link.source_name,
								destination_name: link.destination_name,
								alias: link.source_name + "::" + link.destination_name,
								type: link.sla_violated_type
							}));
						} else {
							self.sources.circuit.addFeature(new ol.Feature({
								geometry: new ol.geom.LineString([sourceXY, destinationXY]),
								id: link.id,
								source_name: link.source_name,
								destination_name: link.destination_name,
								alias: link.source_name + "::" + link.destination_name,
								type: "circuit"
							}));
						}
					});
					self.violatedServices.redraw(self);
				}

				if (!self.autoRefresh) self.setCenter.trigger(self);
			},
			setCenter: {
				timer: undefined,
				trigger: function trigger(that, $center, $zoom) {
					var map = that.container;
					if (this.timer)
						// $timeout.cancel(this.timer);
						clearTimeout(this.timer);
					// this.timer = $timeout(function() {
					this.timer = setTimeout(function () {
						var bounce = ol.animation.bounce({
							resolution: that.view.getResolution() * 2
						});
						var pan = ol.animation.pan({
							source: that.view.getCenter()
						});
						var zoom = ol.animation.zoom({
							resolution: that.view.getResolution()
						});
						// map.beforeRender(bounce);
						map.beforeRender(pan);
						map.beforeRender(zoom);

						that.last = {
							center: that.view.getCenter(),
							zoom: that.view.getZoom()
						};

						if ($center) {
							that.view.setCenter($center);
							that.view.setZoom($zoom || that.view.getZoom());
						} else if (that.center) {
							that.view.setCenter(that.center);
							that.view.setZoom(15);
						} else if (that.coordinates) {
							that.view.fit(that.coordinates, that.container.getSize());
						} else {
							that.view.setCenter(that.lastDevicePosition);
							that.view.setZoom(5);
						}
					}, 100);
				}
			},
			violatedServices: {
				list: [],
				groups: function groups(map) {
					var groups = [];
					this.list.forEach(function (service) {
						var assigned = false;
						var coordinate = ol.proj.transform([service.longtitude, service.latitude], 'EPSG:4326', 'EPSG:3857');
						service.pixel = map.getPixelFromCoordinate(coordinate);
						groups.forEach(function (group) {
							if (assigned) return;
							if (service.pixel[0] <= group.pixel[0] + 100 && service.pixel[0] > group.pixel[0] - 100 && service.pixel[1] <= group.pixel[1] + 100 && service.pixel[1] > group.pixel[1] - 200) {
								group.services[service.type].push(service);
								assigned = true;
							}
						});
						if (!assigned) {
							var services = {
								critical: [],
								major: [],
								minor: [],
								info: []
							};
							services[service.type].push(service);
							var group = {
								latitude: service.latitude,
								longtitude: service.longtitude,
								coordinate: coordinate,
								pixel: service.pixel,
								services: services
							};
							groups.push(group);
						}
					});
					return groups;
				},
				redraw: function redraw(that) {
					var map = that.container;
					if (that.violationSource.getFeatures().length) that.violationSource.clear();
					this.groups(map).forEach(function (group) {
						var index = 0;
						["critical", "major", "minor", "info"].forEach(function (type) {
							group.services[type].forEach(function (service) {
								index += 1;
								if (index > 10) return; // Filter for Groups
								var geom = new ol.geom.Point(map.getCoordinateFromPixel([group.pixel[0], group.pixel[1] + -15 * index]));
								var feature = new ol.Feature({
									geometry: geom,
									color: service.color,
									name: service.name,
									id: service.id
								});
								feature.setStyle(that.violationStyle(feature));
								that.violationSource.addFeature(feature);
							});
						});
					});
				}
			},
			addTooltip: function addTooltip() {
				var self = this,
				    map = self.container;
				var container = document.getElementById('popup'),
				    content_element = document.getElementById('popup-content'),
				    closer = document.getElementById('popup-closer');

				container.style.visibility = "visible";

				closer.onclick = closeTooltip;
				function closeTooltip() {
					overlay.setPosition(undefined);
					closer.blur();
					self.setCenter.trigger(self, self.last.center, self.last.zoom);
					return false;
				};

				var overlay = new ol.Overlay({
					element: container,
					autoPan: true,
					offset: [0, -10]
				});
				map.addOverlay(overlay);

				map.on('click', function (event) {
					var colorMap = {
						circuit: "black",
						info: "blue",
						minor: "#f7bb38",
						major: "orange",
						critical: "red"
					};

					var devicesInPixel = [],
					    circuitsInPixel = [];

					map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
						if (layer === self.deviceLayer) {
							if (!devicesInPixel[feature.get("name")]) devicesInPixel[feature.get("name")] = { id: feature.get("id"), coord: feature.getGeometry().getCoordinates() };
						} else if (layer === self.violationLayer) {
							// getCircuit(feature.get("id"));
							return;
						} else {
							if (!circuitsInPixel[feature.get("alias")]) circuitsInPixel[feature.get("alias")] = { id: feature.get("id"), color: colorMap[feature.get("type")] };
						}
					});

					var content = "";
					if (Object.keys(devicesInPixel).length) {

						// for find deiveces circuits
						Object.keys(self.sources).forEach(function (type) {
							var features = self.sources[type].getFeatures();
							features.forEach(function (feature) {
								Object.keys(devicesInPixel).forEach(function (device) {
									if (feature.get("source_name") == device || feature.get("destination_name") == device)
										// if (!circuitsInPixel[feature.get("alias")])
										circuitsInPixel[feature.get("alias")] = { id: feature.get("id"), color: colorMap[feature.get("type")] };
								});
							});
						});

						content += "<h3>Devices:</h3><ul class='devices'>";
						Object.keys(devicesInPixel).forEach(function (name) {
							content += "<li data-id='" + devicesInPixel[name].id + "' data-coord='" + devicesInPixel[name].coord + "'>" + name + "</li>";
						});
						content += "</ul>";
					}
					if (Object.keys(circuitsInPixel).length) {
						content += "<h3>Circuits:</h3><ul class='circuits'>";
						Object.keys(circuitsInPixel).forEach(function (name) {
							content += "<li style='color: " + circuitsInPixel[name].color + "' data-id='" + circuitsInPixel[name].id + "'>" + name + "</li>";
						});
						content += "</ul>";
					}

					if (content) {
						content_element.innerHTML = content;
						overlay.setPosition(event.coordinate);
						self.setCenter.trigger(self, event.coordinate);
					} else {
						closeTooltip();
					}
				});

				function getDevice(evt) {
					var _this = this;

					var details;
					var contex = $(this);
					var coord = contex.data("coord").split(',');
					coord = [Number(coord[0]), Number(coord[1])];

					/* $Ajax.get('device/' + contex.data("id") + '/detail', {}, function(detail) {
     	var content = '\
     	<div class="leaflet-popup-content" style="width: 251px;margin: 0;">\
     	<div class="colQuarter" style="color:red;text-align:center;"><p>Critcal</p><p>' + detail.device.Critical + '</p></div>\
     	<div class="colQuarter" style="color:orange;text-align:center;"><p>Major</p><p>' + detail.device.Major + '</p></div>\
     	<div class="colQuarter" style="color:rgb(185, 185, 0);text-align:center;"><p>Minor</p><p>' + detail.device.Minor + '</p></div>\
     	<div class="colQuarter" style="color:blue;text-align:center;"><p>Info</p><p>' + detail.device.Info + '</p></div>\
     	<div class="line"><div class="left"><p>Name :</p></div><div class="right"><p>' + contex.text() + '</p></div></div>\
     	<div class="line"><div class="left"><p>Device Serial :</p></div><div class="right"><p>' + detail.device.SerialNumber + '</p></div></div>\
     	<div class="line"><div class="left"><p>Hardware Version :</p></div><div class="right"><p>' + detail.device.HardwareVersion + '</p></div></div>\
     	<div class="line"><div class="left"><p>SNMP Last Seen Date :</p></div><div class="right"><p>' + detail.device.SnmpLastSeenDate + '</p></div></div>\
     	<div class="line"><div class="left"><p>CSV Last Seen Date :</p></div><div class="right"><p>' + detail.device.CsvLastSeenDate + '</p></div></div>\
     	<div class="clear"></div></div>';
     			content_element.innerHTML = content;
     	overlay.setPosition(coord);
     	self.setCenter.trigger(self, coord, 8);
     }); */

					$.ajax({
						url: conf.BASE + "device/" + contex.data("id") + "/detail" + token(),
						method: "GET"
					}).done(function (detail) {
						var content = '\
							<div class="leaflet-popup-content" style="width: 251px;margin: 0;">\
							<div class="colQuarter" style="color:red;text-align:center;"><p>Critcal</p><p>' + detail.device.Critical + '</p></div>\
							<div class="colQuarter" style="color:orange;text-align:center;"><p>Major</p><p>' + detail.device.Major + '</p></div>\
							<div class="colQuarter" style="color:rgb(185, 185, 0);text-align:center;"><p>Minor</p><p>' + detail.device.Minor + '</p></div>\
							<div class="colQuarter" style="color:blue;text-align:center;"><p>Info</p><p>' + detail.device.Info + '</p></div>\
							<div class="line"><div class="left"><p>Name :</p></div><div class="right"><p>' + contex.text() + '</p></div></div>\
							<div class="line"><div class="left"><p>Device Serial :</p></div><div class="right"><p>' + detail.device.SerialNumber + '</p></div></div>\
							<div class="line"><div class="left"><p>Hardware Version :</p></div><div class="right"><p>' + detail.device.HardwareVersion + '</p></div></div>\
							<div class="line"><div class="left"><p>SNMP Last Seen Date :</p></div><div class="right"><p>' + detail.device.SnmpLastSeenDate + '</p></div></div>\
							<div class="line"><div class="left"><p>CSV Last Seen Date :</p></div><div class="right"><p>' + detail.device.CsvLastSeenDate + '</p></div></div>\
							<div class="clear"></div></div>';

						content_element.innerHTML = content;
						overlay.setPosition(coord);
						self.setCenter.trigger(self, coord, 8);
					}).fail(function (x) {
						if (x.status === 403) {
							_this.events.emit("login_error");
						}
						_this.events.emit("detail_fail");
					});
				}
				$("#popup-content").on("click", ".devices li", getDevice);

				function getCircuit() {
					circuitID = $(this).data("id");
					$location.path('/device/circuit/view/' + circuitID);
				}
				$("#popup-content").on("click", ".circuits li", getCircuit);
			},
			addPanel: function addPanel() {
				var map = this.container;
				var fullscreen = new ol.control.FullScreen();
				map.addControl(fullscreen);
			},
			zoomEvent: function zoomEvent() {
				var self = this;
				var map = this.container;
				var lastZoomLevel = self.view.getZoom();
				map.on('moveend', function (event) {
					if (lastZoomLevel != self.view.getZoom()) {
						lastZoomLevel = self.view.getZoom();
						self.violatedServices.redraw(self);
					}
				});
			},
			setPointer: function setPointer() {
				var self = this;
				var map = this.container;
				map.on('pointermove', function (event) {
					if (event.dragging) return;

					// TODO: just for Devices and Circuits
					var isDevice = map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
						if (layer !== self.violationLayer) return true;
					});
					map.getTarget().style.cursor = isDevice ? 'pointer' : '';;

					// TODO: for all features
					// var pixel = map.getEventPixel(event.originalEvent);
					// var hit = map.hasFeatureAtPixel(pixel);
					// map.getTarget().style.cursor = hit ? 'pointer' : '';
				});
			},
			getData: function getData(params) {
				var _this2 = this;

				var self = this;
				params = params ? params : {};
				var page = params.page ? params.page : 1;
				var allowClear = params.loop === true ? false : true;

				/* var device_ids = function() {
    	var array = [];
    	if ($($scope.console.deviceSelectElement).val())
    		$($scope.console.deviceSelectElement).val().split(",").forEach(function(item) {
    			array.push(Number(item));
    		});
    	return JSON.stringify(array);
    }; */

				/*  $Ajax.post('device/map/data', {
    group_ids: JSON.stringify($scope.console.selectedGroupIDs),
    device_ids: device_ids(),
    GET: {
    page: page,
    violated: self.isViolated,
    live: self.live
    }
    }, function(data) {
    if (page < data.total_pages) {
    self.addDataToMap(data, allowClear);
    self.getData({
    	page: page += 1,
    	loop: true
    });
    return;
    }
    self.addDataToMap(data, allowClear);
    }); */

				/* var THE_DATA = {
    	group_ids: JSON.stringify([47, 78, 103, 200, 229, 230, 238, 239, 240, 7]),
    	device_ids: JSON.stringify([529, 1330557, 1643890, 1643889])
    }; */

				var o = this.toSend;

				var data = {};
				var d = o.devices;
				if (o.groups) data.group_ids = JSON.stringify(o.groups);
				if (d) data.device_ids = JSON.stringify(Object.keys(d).map(function (k) {
					return d[k].id;
				}));
				var append = "&page=1";
				append += o.violated ? "&violated=true" : "";
				append += o.live ? "&live=true" : "";
				this.events.emit("data_start");
				$.ajax({
					url: conf.BASE + "device/map/data" + token() + append, // &violated=true &live=true
					method: "POST",
					contentType: false,
					processData: false,
					data: buildFormdata(data)
				}).done(function (data) {
					_this2.events.emit("data_succ");
					if (page < data.total_pages) {
						// self.addDataToMap(data, allowClear);
						processData(data, allowClear, self);
						self.getData({
							page: page += 1,
							loop: true
						});
						return;
					}
					self.addDataToMap(data, allowClear);
				}).fail(function (x) {
					if (x.status === 403) {
						_this2.events.emit("login_error");
					}
					_this2.events.emit("data_fail");
				}).always(function () {
					return _this2.events.emit("data_always");
				});
			},
			makeMap: function makeMap() {
				var self = this;

				var layers = [new ol.layer.Tile({
					source: new ol.source.OSM({
						wrapX: true
					})
				}), self.violationLayer, self.deviceLayer];

				$.each(self.layers, function (key, layer) {
					layer.setSource(self.sources[key]);
					layer.setStyle(self.lineStyle(key));
					layers.push(layer);
				});

				self.container = new ol.Map({
					layers: layers,
					target: self.target,
					controls: ol.control.defaults({
						attributionOptions: {
							collapsible: false
						}
					}),
					view: self.view
				});
				self.deviceLayer.setSource(self.deviceSource);
				self.deviceLayer.setStyle(self.deviceStyle);
				self.deviceLayer.setZIndex(10);

				self.violationLayer.setSource(self.violationSource);
				self.violationLayer.setZIndex(20);

				// TODO: optional (use as a feauture)
				self.layers.circuit.setZIndex(0);
				self.layers.info.setZIndex(1);
				self.layers.minor.setZIndex(2);
				self.layers.major.setZIndex(3);
				self.layers.critical.setZIndex(4);
			},
			init: function init(load) {
				var self = this;

				self.makeMap();
				if (load) self.getData();
				self.setPointer();
				self.zoomEvent();
				self.addTooltip();
				// self.addPanel();
			}
		};
	}

	inst.newMap = newMap;
	return inst;
});
define('widget/widget',["core/config", "core/token", "./mapMaker"], function (conf, token, mapMaker) {
	var manager = u.extend(newPubSub());
	var temp = u.getTemps("widget");
	var extractor = newPubSub();

	var KLASS_X1 = ["uk-width-1-1@s", "uk-width-1-1@m", "uk-width-1-2@l", "uk-width-1-2@xl"].join(" ");
	var KLASS_X2 = ["uk-width-1-1@s", "uk-width-1-1@m", "uk-width-2-3@l", "uk-width-3-4@xl"].join(" ");
	var KLASS_X3 = "uk-width-1-1";
	var KLASSES = KLASS_X1 + " " + KLASS_X2 + " " + KLASS_X3;

	var DATE_FORMAT = "Y/MM/DD HH:mm";
	var jsonStr = JSON.stringify;
	var jsonParse = JSON.parse;
	var worker = void 0;

	function init() {
		worker = new Worker(conf.ROOT + "js/worker.js");
		worker.onmessage = function (e) {
			var d = e.data;
			extractor.emit(d.reqId, d.result);
		};
		setGlobalTZ();
	}

	function setGlobalTZ(userOffset) {
		var offset = userOffset || 16200;
		Highcharts.setOptions({
			global: {
				timezoneOffset: -offset / 60
			}
		});
	}
	function getDate(type, count) {
		if (type && count) {
			return moment().subtract(count, type).format(DATE_FORMAT);
		} else {
			return moment().format(DATE_FORMAT);
		}
	}
	function getSensors(o) {
		var a = [];
		Object.keys(o).forEach(function (i) {
			var p = o[i];
			a.push({
				id: p.id,
				unit: p.unit
			});
		});
		return a;
	}
	function genSeries(sensors) {
		// for line charts
		var res = [];
		Object.keys(sensors).forEach(function (i) {
			var sensor = sensors[i];
			res.push({
				id: "" + sensor.id,
				type: "line",
				name: sensor.name,
				color: "#" + sensor.color,
				data: [],
				tooltip: {
					valueDecimals: 2,
					valueSuffix: " " + sensor.units.filter(function (o) {
						return o.selected;
					})[0].name
				}
			});
		});
		return res;
	}
	function genSeries2(sensors) {
		// for bar charts
		var res = [];
		Object.keys(sensors).forEach(function (k) {
			var sensor = sensors[k];
			res.push({
				id: sensor.id,
				name: sensor.name,
				tooltip: {
					valueDecimals: 2
				},
				data: []
			});
		});
		return res;
	}
	function makeBarChart(container, title, sensors) {
		return Highcharts.chart(container[0], {
			chart: {
				type: "column"
			},
			title: {
				align: "left",
				text: title || "",
				style: {
					color: "#717171",
					fontSize: "14px"
				}
			},
			yAxis: {
				title: false
			},
			series: genSeries2(sensors),
			rangeSelector: false,
			exporting: false,
			credits: false,
			legend: {
				enabled: true
			}
		});
	}
	function makeTitle(type) {
		var title = void 0;
		switch (type) {
			case 0:
				title = "Graph Sensor";break;
			case 1:
				title = "Violation Ratio";break;
			case 2:
				title = "Stat";break;
			case 3:
				title = "Map";break;
		}
		return title;
	}
	function buildFormdata(o) {
		var res = new FormData();
		Object.keys(o).forEach(function (k) {
			res.append(k, o[k]);
		});
		return res;
	}
	function updateTable(d, tEls) {
		Object.keys(d).forEach(function (k) {
			var el = tEls[k];
			var n = d[k];
			el.text(n);
			/* switch (true) {
   	case (n < 10):          el.addClass("green-text");  break;
   	case (n > 10 && n< 30): el.addClass("orange-text"); break;
   	case (n > 30):          el.addClass("red-text");    break;
   } */
		});
	}
	function createPanel(parent, type, rangeTitle, id, expand, min) {
		var ctx = {
			title: makeTitle(type),
			rangeTitle: type === 3 ? undefined : rangeTitle,
			id: id,
			xOne: expand === 1,
			xTwo: expand === 2,
			xThree: expand === 3,
			min: min,
			map: type === 3
		};
		var html = temp.panel(ctx);
		parent.append(html);
		return parent.children().last();
	}

	function constructor(container, o) {
		var inst = {};
		var w = {};
		var root = void 0,
		    els = void 0;
		var chart = void 0;
		var startDate = void 0,
		    endDate = void 0; // for customized ranges
		var map = void 0;
		var xhr = void 0;
		var updateNavigator = true;
		var toggle = {
			refresh: function refresh(b) {
				els.refresh.attr({ disabled: !b });
			}
		};

		if (!container || !o) {
			throw new TypeError("You must provide a container and a widget object.");
		}
		w = o;

		function makeLineChart(container, title, sensors) {
			return Highcharts.stockChart(container[0], {
				rangeSelector: false,
				exporting: false,
				credits: false,
				title: {
					align: "left",
					text: title || "",
					style: {
						color: "#717171",
						fontSize: "14px"
					}
				},
				chart: {
					zoomType: "x"
					/* resetZoomButton: { // works only with Highcharts.chart
     	relativeTo: "chart",
     	position: {
     		align: "right",
     		verticalAlign: "top",
     		x: 0,
     		y: 0
     	}
     } */
				},
				navigator: {
					adaptToUpdatedData: false
				},
				xAxis: {
					events: {
						setExtremes: function setExtremes(e) {
							var d = e.DOMEvent;
							var trigger = e.trigger;
							if (d && d.DOMType !== "mousemove" || trigger === "zoom") {
								// drag-end or zoom
								startDate = moment(e.min).format(DATE_FORMAT);
								endDate = moment(e.max).format(DATE_FORMAT);
								loadGraphSensorData();
							}
						}
					}
				},
				legend: {
					enabled: true
				},
				series: genSeries(sensors)
			});
		}
		function min() {
			var el = els.body;
			root.data("min", true);
			els.menus.find("[data-resize]").html(temp.btnMax());

			!el.is(":animated") ? el.slideUp(400, function () {
				// if (chart) chart.setSize();
			}) : undefined;
		}
		function max() {
			var el = els.body;
			root.data("min", false);
			els.menus.find("[data-resize]").html(temp.btnMin());

			!el.is(":animated") ? el.slideDown(400, function () {
				if (chart) chart.setSize();
				if (map) map.container.updateSize();
			}) : undefined;
		}
		function expand() {
			var curr = parseInt(root.attr("data-expand"), 10);
			var inced = curr + 1;
			var n = inced > 3 ? 3 : inced < 0 ? 0 : inced;
			root.attr("data-expand", n);
			root.removeClass(KLASSES);
			var toAdd = void 0;
			switch (curr) {
				case 0:
					toAdd = KLASS_X1;break;
				case 1:
					toAdd = KLASS_X2;break;
				case 2:
					toAdd = KLASS_X3;break;
				case 3:
					toAdd = KLASS_X3;break;
			}
			root.addClass(toAdd);
			if (chart) chart.setSize();
			if (map && els.body.is(":visible")) map.container.updateSize();
		}
		function shrink() {
			var curr = parseInt(root.attr("data-expand"), 10);
			var deced = curr - 1;
			var n = deced > 3 ? 3 : deced < 0 ? 0 : deced;
			root.attr("data-expand", n);
			root.removeClass(KLASSES);
			var toAdd = void 0;
			switch (curr) {
				case 0:
					toAdd = "";break;
				case 1:
					toAdd = "";break;
				case 2:
					toAdd = KLASS_X1;break;
				case 3:
					toAdd = KLASS_X2;break;
			}
			root.addClass(toAdd);
			if (chart) chart.setSize();
			if (map && els.body.is(":visible")) map.container.updateSize();
		}
		function mark(stat, keep) {
			var par = els.spinnerParent;
			par.html("&nbsp;");
			par.append(stat ? temp.markSuccess() : temp.markFail());
			if (!keep) {
				setTimeout(function () {
					return par.html("&nbsp;");
				}, 1200);
			}
		}
		function spinnerOn() {
			var par = els.spinnerParent;
			par.html("&nbsp;");
			par.append(temp.spinner());
		}
		function spinnerOff() {
			els.spinnerParent.html("&nbsp;");
		}
		function loadGraphSensorData(cb) {
			if (xhr) {
				xhr.abort();
				spinnerOff();
			}
			spinnerOn();
			chart ? chart.showLoading() : undefined;
			xhr = $.ajax({
				url: conf.BASE + "device/devicekpisensordata" + token(),
				method: "POST",
				data: {
					start_date: startDate || getDate(w.rangeType, w.rangeCount),
					end_date: endDate || getDate(),
					device_ids: jsonStr([w.device.id]),
					service_ids: jsonStr([w.service.id]),
					kpis: jsonStr(getSensors(w.sensors))
				}
			}).done(function (data) {
				var forworker = { action: "line_chart", reqId: w.id, rawData: [] };
				if (!data) {
					worker.postMessage(forworker);
				} else if (data.length) {
					forworker.rawData = data;
					worker.postMessage(forworker);
				}
				spinnerOff();
				mark(true);
				chart.hideLoading();
			}).fail(function (x) {
				spinnerOff();
				mark(false, true);
				chart.hideLoading();
				// root.children().first().prepend( temp.alert({message: "Couldn't fetch widget data."}) );
				if (x.status === 403) manager.emit("login_error");
			}).always(function () {
				return toggle.refresh(true);
			});
		}
		function loadStat(statOnly) {
			spinnerOn();
			chart ? chart.showLoading() : undefined;
			$.ajax({
				url: conf.BASE + "stat/violation" + token(),
				method: "POST",
				contentType: false, // "multipart/form-data",
				processData: false,
				data: buildFormdata({
					start_date: getDate(w.rangeType, w.rangeCount),
					end_date: getDate(),
					groups: jsonStr([w.group.id]),
					kpis: jsonStr(w.statKpis.map(function (v) {
						return v.name;
					}))
				})
			}).done(function (data) {
				var target = data[0].kpis_data;
				var forworker = {
					action: statOnly ? "table" : "bar_chart",
					reqId: w.id,
					rawData: statOnly ? data[0] : data[0].kpis_data,
					statKpis: w.statKpis
				};
				worker.postMessage(forworker);
				spinnerOff();
				mark(true);
				if (chart) chart.hideLoading();
			}).fail(function (x) {
				spinnerOff();
				mark(false, true);
				if (chart) chart.hideLoading();
				if (x.status === 403) manager.emit("login_error");
			}).always(function () {
				return toggle.refresh(true);
			});
		}
		function loadMapData() {
			map.getData();
		}
		function load() {
			switch (w.type) {
				case 0:
					loadGraphSensorData();break;
				case 1:
					loadStat();break;
				case 2:
					loadStat(true);break;
				case 3:
					loadMapData();break;
			}
		}
		function init() {
			root = createPanel(container, w.type, w.rangeTitle, w.id, w.expand, w.min);
			els = u.getEls(root);

			// when creating dom stuff.
			var type = w.type;
			if (type === 0) {
				chart = makeLineChart(els.container, w.device.name, w.sensors);
				chart.setSize();

				extractor.on("" + w.id, function (o) {
					Object.keys(o).forEach(function (k) {
						return chart.get(k).setData(o[k]);
					});
					if (!updateNavigator) return;
					chart.update({
						navigator: {
							series: {
								data: o[Object.keys(o)[0]],
								type: 'areaspline',
								color: '#4572A7',
								fillOpacity: 0.05,
								dataGrouping: {
									smoothed: true
								},
								lineWidth: 1,
								marker: {
									enabled: false
								}
							}
						}
					});
					updateNavigator = false;
				});
			} else if (type === 1) {
				chart = makeBarChart(els.container, w.group.name, w.statKpis);
				chart.setSize();

				extractor.on("" + w.id, function (d) {
					d.forEach(function (i) {
						return chart.get(i.id).setData(i.data);
					});
				});
			} else if (type === 2) {
				var body = els.body;
				body.html(temp.statTable({ title: w.group.name, root: conf.ROOT }));
				var tEls = u.getEls(body);
				extractor.on("" + w.id, updateTable, tEls);
			} else if (type === 3) {
				els.body.prepend(temp.mapPopup());
				map = mapMaker.newMap();
				map.target = els.container[0];
				map.events.on("login_error", function () {
					manager.emit("login_error");
				}).on("data_start", spinnerOn).on("data_succ", function () {
					spinnerOff();
					mark(true);
				}).on("data_fail", function () {
					spinnerOff();
					mark(false);
				}).on("data_always", toggle.refresh, true).on("detail_fail", function () {});
				map.toSend = w.map;
				map.init(false);
			}

			els.menus.on("click", "[data-menu]", function (e) {
				var action = $(e.target).data().action || $(e.currentTarget).data().action;
				action = parseInt(action, 10);
				if (action === 0) {
					max();
				} else if (action === 1) {
					min();
				}
			});
			els.expand.on("click", function () {
				expand();
			});
			els.shrink.on("click", function () {

				shrink();
			});
			els.remove.on("click", function () {
				els.menuBtn.mouseout();
				manager.emit("delete", w.id);
			});
			els.refresh.on("click", function (e) {
				if (e.target.disabled) return;
				toggle.refresh(false);
				load();
			});
			els.edit.on("click", function () {
				els.menuBtn.mouseout();
				manager.emit("edit", w);
			});
		}

		init();
		load();

		inst.chart = chart;
		inst.mark = mark;
		inst.refresh = load;
		inst.min = min;
		inst.max = max;
		inst.expand = expand;
		inst.shrink = shrink;
		inst.remove = function () {
			root.remove();
			chart ? chart.destroy() : undefined;
		};
		inst.update = function (obj) {
			w = obj;
			els.title.text(makeTitle(w.type));
			els.rangeTitle.text(w.rangeTitle);
			switch (w.type) {
				case 0:
					chart = makeLineChart(els.body, w.device.name, w.sensors);break;
				case 1:
					chart = makeBarChart(els.body, w.group.name, w.statKpis);break;
				case 2:
					els.body.html(temp.statTable({ title: w.group.name, root: conf.ROOT }));
					var tEls = u.getEls(els.body);
					extractor.off("" + w.id, updateTable).on("" + w.id, updateTable, tEls);
					break;
				case 3:
					map.toSend = w.map;
					map.getData();
					break;
			}
			updateNavigator = true;
			load();
		};

		manager.emit("create_node", w.id, inst);
		return inst;
	}

	manager.setGlobalTZ = setGlobalTZ;
	manager.create = constructor;
	manager.init = init;

	return manager;
});
define('mediator',["core/config", "core/token", "login", "core/uk", "header", "./toolbar", "./wizard/wizard", "./confirm", "./process", "./widget/widget"], function (conf, token, login, uk, header, toolbar, wizard, confirm, process, widget) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='content']";
	var MSG = ["Processing your request...", "Fetching your widgets..."];
	var widgets = {};
	var _WIDGETS_ = {};
	var els = void 0,
	    processNote = void 0;

	/* function viewport() {
 	const w = window.innerWidth;
 	return w > 0     && w < 640   ? 0 :
 		   w >= 640  && w <= 960  ? 0 :
 		   w >= 960  && w <= 1200 ? 1 :
 		   w >= 1200 && w <= 1600 ? 2 :
 		   w >= 1600 ? 3 : false;
 } */

	var ori = ["", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];
	var WAIT_TIME = 400;
	var counter = 1;
	var timer = void 0,
	    timeout = 0;

	function refreshAll() {
		Object.keys(widgets).forEach(function (k) {
			var widget = widgets[k];
			setTimeout(widget.refresh, timeout += WAIT_TIME);
		});
	}
	function autoRefresh(interval) {
		timer = setTimeout(function () {
			refreshAll();
			autoRefresh(interval);
		}, interval);
	}
	function cancelTimeout() {
		clearTimeout(timer);
	}
	function isStatWrong(n) {
		return n && (n === 403 || n === 404) ? true : false;
	}
	function fetchAllFail() {
		if (counter > 1) {
			process.doing(" (" + counter + ori[counter] + " attempt)", true);
		}
		counter += 1;
		process.log("Fetching widget list failed.", "danger");
		if (counter > 3) {
			process.log("Aborted.", "danger");
			return;
		}
		setTimeout(fetchAll, 1000);
	}
	function fetchAll() {
		var timer = void 0;
		if (counter === 1) {
			process.open();
			process.inc(u.randInt(5, 15));
		}
		process.doing("Fetching widget list.");
		$.ajax({
			url: conf.ALT + conf.LOAD + token(),
			method: "GET",
			dataType: "json",
			cache: false
		}).done(function (data) {
			if (u.isEmptyObj(data)) {
				process.finish();
				process.log("No widgets to fetch", "primary");
				return;
			}
			_WIDGETS_ = data;
			var len = u.objLength(data);
			process.log("Found " + len + " widgets.", "success");
			process.doing("Creating widgets.");

			var step = 100 - process.get() / len;
			var sorted = [];
			Object.keys(data).forEach(function (k) {
				process.inc(2);
				sorted.push([data[k].order, k]);
			});
			sorted.sort();
			sorted.forEach(function (i) {
				var w = data[i[1]];
				process.inc(step);
				widgets[w.id] = widget.create(els.widgets, w);
			});
			process.log("Finished.", "success");
			process.close();
		}).fail(function (x) {
			if (isStatWrong(x.status)) {
				login.start(function () {
					process.resume();
					fetchAllFail();
				});
			} else {
				fetchAllFail();
			}
		}).always();
	}
	function save(done, fail, always) {
		$.ajax({
			url: conf.ALT + "dashboard/save" + token(), // "widget/add",
			method: "POST",
			contentType: "application/json",
			data: JSON.stringify(_WIDGETS_)
		}).done(done).fail(function (x) {
			return isStatWrong(x.status) ? login.start(fail) : fail();
		}).always(always);
	}
	function onLoginErr(cb) {
		login.start(cb);
	}
	function css(el, prop) {
		el = u.isStr(el) ? $(el) : el;
		return parseInt(el.css(prop).slice(0, -2), 10);
	}
	function adjustHeight() {
		var el = els.root;
		// let h = css(el, "min-height");
		var avail = window.innerHeight - (css("#heading", "height") + css("#footer", "height"));
		el.css("min-height", avail);
	}
	function doAll(action) {
		if (!u.isEmptyObj(widgets)) {
			Object.keys(widgets).forEach(function (k) {
				return widgets[k][action]();
			});
		}
	}

	function addCustomEvt() {
		wizard.on("submit:create", function (e, fn) {
			processNote = uk.note.process(MSG[0], 0, "top-center");
			_WIDGETS_[e.id] = e;
			save(function () {
				widgets[e.id] = widget.create(els.widgets, e);
				fn(true);
				processNote.close();
			}, function () {
				fn(false);
				processNote.close();
				uk.note.error("Could not create the widget. Try again.");
			});
		});
		wizard.on("submit:edit", function (e, fn) {
			processNote = uk.note.process(MSG[0], 0, "top-center");
			_WIDGETS_[e.id] = e;
			save(function () {
				widgets[e.id].update(e);
				fn(true);
				processNote.close();
			}, function () {
				fn(false);
				processNote.close();
				uk.note.error("Could not edit the widget. Try again.");
			});
		});
		confirm.on("submit", function (id, fn) {
			var cb = void 0;
			processNote = uk.note.process(MSG[0], 0, "top-center");

			if (id === "delete_all") {
				_WIDGETS_ = {};
				cb = function cb() {
					Object.keys(widgets).forEach(function (k) {
						return widgets[k].remove();
					});
					widgets = {};
				};
			} else if (id === "save_all") {

				els.widgets.find("> div").each(function (i, l) {
					var d = $(l).data();
					_WIDGETS_[d.id].order = i;
					_WIDGETS_[d.id].expand = parseInt(d.expand);
					_WIDGETS_[d.id].min = d.min;
				});
			} else {
				delete _WIDGETS_[id];
				cb = function cb() {
					widgets[id].remove();
					delete widgets[id];
				};
			}

			save(function () {
				if (cb) cb();
				processNote.close();
				fn();
			}, function () {
				fn();
				uk.note.error("Couldn't remove the widget.");
				processNote.close();
			});
		});
		wizard.on("login_error", onLoginErr);
		widget.on("login_error", onLoginErr);
		widget.on("save_signal", function (e) {
			var s = e.action;
			if (s === "create") {} else if (s === "edit") {

				_WIDGETS_[e.id][e.key] = e.val;
			} else if (s === "delete") {}

			save(e.done, e.fail);
		});
		widget.on("create_node", function (id, widget) {
			widgets[id] = widget;
			els.widgets.sortable("refresh");
		});
		widget.on("delete", function (id) {
			confirm.open(id);
		});
		widget.on("edit", function (e) {
			wizard.edit(e);
		});

		toolbar.on("add", function () {
			return wizard.start(els.widgets.children().length);
		}).on("save_all", function () {
			if (!u.isEmptyObj(widgets)) {
				confirm.open("save_all");
			}
		}).on("delete_all", function () {
			if (!u.isEmptyObj(widgets)) {
				confirm.open("delete_all");
			}
		}).on("min_all", doAll, "min").on("max_all", doAll, "max").on("shrink_all", doAll, "shrink").on("expand_all", doAll, "expand").on("start_auto_refresh", autoRefresh).on("end_auto_refresh", cancelTimeout);
		header.on("time", function (offset) {

			widget.setGlobalTZ(offset);
		});
	}

	inst.beforeReady = function () {
		if (token(true)) {
			wizard.fetchGroups();
		}
	};
	inst.onReady = function () {
		els = u.getEls(ROOT);
		adjustHeight();
		$(window).on("resize", adjustHeight);
		els.widgets.sortable({
			items: "> div",
			handle: ".uk-sortable-handle",
			delay: 50,
			opacity: 0.5,
			distance: 5,
			revert: 300, // true
			scroll: false,
			tolerance: "pointer"
			//	placeholder: "ui-state-highlight"
		});

		$(window).on("beforeunload", function (e) {
			if (false) {
				// changed then return
				return null;
			}
		});

		addCustomEvt();
		header.init();
		toolbar.init(els.toolbar);
		wizard.init();
		confirm.init();
		process.init();
		login.init();
		widget.init();

		if (!token(true)) {
			login.start(function () {
				header.adjust();
				fetchAll();
				wizard.fetchGroups();
			});
		} else {
			header.adjust();
			fetchAll();
		}
	};
	window.ws = function () {
		return widgets;
	};
	return inst;
});
require.config({
	baseUrl: "js/",
	paths: {
		lib: "../lib"
	}
});

require(["./mediator"], function (page) {
	page.beforeReady();

	$(function () {
		page.onReady();
	});
});
define("main", function(){});

