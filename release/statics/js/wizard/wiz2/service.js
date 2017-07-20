define(["core/config", "core/token"], function (conf, token) {
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
//# sourceMappingURL=service.js.map