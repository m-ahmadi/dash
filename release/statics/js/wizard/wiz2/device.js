define(["core/config", "core/token"], function (conf, token) {
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
//# sourceMappingURL=device.js.map