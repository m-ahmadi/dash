define(["config", "token"], (conf, token) => {
	const inst = u.extend( newPubSub() );
	
	let el;
	
	function initSelect2() {
		el.select2({
			width: "100%",
			placeholder: "Select a node",
			ajax: {
				method: "GET",
				url: () => conf.BASE + "device/search" + token(),
				dataType: "json",
				delay: 250,
				data: params => {
					let o = {};
					if (params.term) {
						o.search = params.term;
					}
					o.page = params.page || 1;
					return o;
				},
				error: x => {
					if (x.status === 403) {
						el.select2("close");
						inst.emit("login_error");
					}
				},
				processResults: (data, params) => {
					let target = data.devices;
					let res = [];
					params.page = params.page || 1;
					if (target) {
						target.forEach(i => {
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
		})
		.on("select2:select", e => {
			inst.emit("select", e.params.data.id);
		});
	}
	function init(el_) {
		el = el_;
		
		initSelect2();
	}
	
	inst.toggle = b => {
		el.attr({disabled: !b});
		return inst;
	};
	inst.clear = () => {
		el.empty().val(null).change();
		return inst;
	};
	
	inst.init = init;
	
	return inst;
});