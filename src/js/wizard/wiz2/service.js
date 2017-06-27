define(["core/config", "core/token"], (conf, token) => {
	const inst = u.extend( newPubSub() );
	let el;
	let deviceId;
	
	function initSelect2() {
		el.select2({
			width: "100%",
			placeholder: "Select a service",
			ajax: {
				method: "POST",
				url: () => conf.BASE + "device/service/search" + token(),
				dataType: "json",
				delay: 250,
				data: params => {
					let o = {};
					if (params.term) {
						o.search = params.term;
					}
					o.page = params.page || 1;
					o.device_ids = JSON.stringify([ deviceId ]);
					return o;
				},
				error: x => {
					if (x.status === 403) {
						el.select2("close");
						inst.emit("login_error");
					}
				},
				processResults: (data, params) => {
					let target = data.service;
					let res = [];
					params.page = params.page || 1;
					if (target) {
						target.forEach(i => {
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
		})
		.on("select2:select", e => {
			inst.emit("select", e.params.data.id);
		});
	}
	
	inst.getData = () => {
		return {
			id: parseInt(el.val(), 10),
			name: el.text()
		};
	};
	inst.setValue = service => {
		el
			.append( $("<option></option>").val(service.id).text(service.name) )
			.change();
		return inst;
	};
	inst.clear = () => {
		el.empty().val(null).change();
		return inst;
	};
	inst.setDeviceId = id => {
		deviceId = id;
		return inst;
	};
	inst.toggle = b => {
		el.attr({disabled: !b});
		return inst;
	};
	inst.init = el_ => {
		el = el_;
		initSelect2();
		
	};
	
	return inst;
});