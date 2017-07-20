define(["core/config", "core/token"], function (conf, token) {
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
//# sourceMappingURL=device.js.map