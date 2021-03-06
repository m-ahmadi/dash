define([
	"core/uk",
	"core/config",
	"core/token",
	"../defaults",
	"../share",
	"./device",
	"./dataTable"
], (uk, conf, token, d, share, device, dataTable) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz4']";
	const temp = u.getTemps("wizard/wiz4");
	
	let els;
	let c = { add: {}, edit: {} };
	let groups;
	let checkboxes = newPubSub();
	let firstGroupFetch = true;
	let toggle = {
		submit(b) {
			els.submit.attr({disabled: !b});
		},
		prev(b) {
			els.prev.attr({disabled: !b});
		},
		toDisable(b) {
			els.toDisable.prop({disabled: !b});
		}
	};
	
	function fetchGroups() {
		if (!firstGroupFetch) {
			els.groups.html( temp.loading() );
		}
		$.ajax({
			url: conf.BASE + "device/grouptree" + token(),
			method: "GET",
			data: "parent_only=true"
		})
		.done(d => {
			let arr = [];
			d.groups[0].Groups.forEach( i => arr.push({name: i.Name, id: i.ID}) );
			setGroups(arr);
			renderForm();
		})
		.fail(x => {
			if (x.status === 403) inst.emit("login_error");
			firstGroupFetch = false;
			clearAlerts();
			els.groups.html( temp.danger() );
		});
	}
	function clearAlerts() {
		els.groups.empty();
	}
	function setGroups(arr) {
		arr.unshift({id: "all", name: "All"});
		groups = arr;
		
		return inst;
	}
	function renderForm() {
		if (!groups) throw new Error("renderForm(): groups must be set before calling."); 
		clearAlerts();
		let g = els.groups;
		g.html( temp.formRow({groups: groups}) );
		els.checkboxes = g.find(":checkbox");
		els.toDisable = els.toDisable.add( els.checkboxes );
		checkboxes.emit("ready", els.checkboxes);
		return inst;
	}
	
	c.retry = () => {
		clearAlerts();
		fetchGroups();
	};
	c.add.typeChange = e => {
		let val = e.target.value;
		let n1 = d.RANGE_COUNT_DEF[val];
		let n2 = d.RANGE_COUNT_MAX[val];
		els.rangeCount.val(n1);
		els.rangeCount.attr("max", n2);
	};
	c.add.countChange = e => {
		let el = $(e.target);
		let type = els.rangeType.val();
		let max = d.RANGE_COUNT_MAX[type];
		let min = parseInt(el.attr("min"), 10);
		let val = el.val();
		if (val) {
			let num = parseInt(val, 10);
			if (num > max) {
				el.val(max);
			} else if (num < min) {
				el.val(min);
			}
		} else {
			el.val( d.RANGE_COUNT_DEF[type] );
		}
	};
	c.edit.typeChange = e => {
		let curr = e.data;
		let v = e.target.value;
		let rc = els.rangeCount;
		let count = parseInt(rc.val(), 10);
		rc.attr("max", d.RANGE_COUNT_MAX[v]).change();
		// toggle.submit( v !== curr.type || count !== curr.count );
	};
	c.edit.countChange = e => {
		let curr = e.data;
		let el = $(e.target);
		let type = els.rangeType.val();
		let max = d.RANGE_COUNT_MAX[type];
		let min = parseInt(el.attr("min"), 10);
		let val = el.val();
		if (val) {
			let num = parseInt(val, 10);
			if (num > max) {
				el.val(max);
			} else if (num < min) {
				el.val(min);
			}
			// toggle.submit(num !== curr.count || type !== curr.type);
		} else {
			el.val( d.RANGE_COUNT_DEF[type] );
		}
	};
	
	function setChk(checkboxes, selected) {
		checkboxes
			.prop({checked: false})
			.each(function (x, l) {
				this.checked = selected.indexOf( parseInt(this.value, 10) ) !== -1;
			});
		if (selected.indexOf('all') !== -1) {
			checkboxes
				.filter("[value='all']")
				.prop({checked: true});
		}
	}
	function setForAdd() {
		inst.shallow = true;
		toggle.prev(true);
		if (els.checkboxes) {
			els.checkboxes.prop({checked: false});
		} else {
			checkboxes.on("ready", els => {
				els.prop({checked: false});
			});
		}
		
		dataTable.removeAll();
		device.off().on("select", device => {
			dataTable.addRow(device);
		});
		
		els.violated.prop({checked: false});
		els.live.prop({checked: false});
		els.violatedServices.prop({checked: false});
		
		/* els.rangeType
			.off("change")
			.on("change", c.add.typeChange)
			.val(d.RANGE_TYPE)
			.change();
		els.rangeCount
			.off("change")
			.on("change", c.add.countChange); */
		
		els.submit
			.text("Save")
			.off()
			.on("click", e => {
				if (e.target.disabled) return;
				toggle.toDisable(false);
				dataTable.toggleAll(false);
				inst.emit("submit", get(), success => {
					toggle.toDisable(true);
					dataTable.toggleAll(true);
					if (success) close();
				});
			});
	}
	function setForEdit(o) {
		let m = o.map;
		let devices = m.devices;
		toggle.prev(false);
		if (els.checkboxes) {
			setChk(els.checkboxes, m.groups);
		} else {
			checkboxes.on("ready", els => {
				setChk(els, m.groups);
			});
		}
		
		dataTable.removeAll();
		if (devices) {
			Object.keys(devices).forEach( k => dataTable.addRow(devices[k]) );
		}
		
		device.off().on("select", device => {
			dataTable.addRow(device);
		});
		
		
		els.violated.prop({checked: m.violated});
		els.live.prop({checked: m.live});
		els.violatedServices.prop({checked: m.violatedServices});
		
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
		
		els.submit
			.text("Apply")
			.off()
			.on("click", e => {
				if (e.target.disabled) return;
				toggle.toDisable(false);
				dataTable.toggleAll(false);
				inst.emit("submit", get(o), success => {
					toggle.toDisable(true);
					dataTable.toggleAll(true);
					if (success) close();
				});
			});
	}
	function get(o) {
		// let rangeTypeVal = els.rangeType.val();
		// let rangeCountVal = els.rangeCount.val();
		let data = {
			// rangeType: rangeTypeVal,
			// rangeCount: parseInt(rangeCountVal, 10),
			// rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal),
			map: {
				groups: null,
				devices: dataTable.getData() || null,
				violated: els.violated.prop("checked"),
				live: els.live.prop("checked"),
				violatedServices: els.violatedServices.prop("checked")
			}
		};
		let groups = [];
		els.groups.find(":checkbox:checked").each((x, l) => {
			let v = l.value;
			let id = v === "all" ? v : parseInt(v, 10);
			if (id) groups.push(id);
		});
		data.map.groups = groups;
		
		if (o) {
			Object.keys(data).forEach( k => o[k] = data[k] );
			return o;
		}
		
		return data;
	}
	function close() {
		inst.shallow = false;
		uk.closeModal(ROOT);
	}
	
	inst.shallow = false;
	inst.setGroups = setGroups;
	inst.renderForm = renderForm;
	inst.fetchGroups = fetchGroups;
	
	inst.set = (o) => {
		o ? setForEdit(o) : setForAdd();
		return inst;
	};
	inst.open = () => {
		uk.openModal(ROOT);
	};
	inst.init = () => {
		els = u.getEls(ROOT);
		device.init(els.device);
		dataTable.init(els.table);
		
		els.prev.on( "click", e => {
			if (e.target.disabled) return;
			inst.emit("prev");
		});
		els.groups
			.on("click", "[data-retry]", c.retry)
			.on("click", "input:checkbox", e => {
				let chks = els.checkboxes;
				let el = e.target;
				let v = el.value;
				if (v === "all") {
					chks.prop({checked: el.checked});
				} else {
					chks.filter("[value='all']").prop({checked: false});
				}
				
			});
	};
	
	window.w4 = () => els;
	return inst;
});