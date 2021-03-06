define(["core/uk", "core/config", "core/token", "./defaults", "./share"], (uk, conf, token, d, share) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz3']";
	const temp = u.getTemps("wizard/wiz3");
	
	let els;
	let firstGroupFetch = true;
	let c = { add: {}, edit: {} }; // event callbacks
	let toggle = {
		submit(b) {
			els.submit.attr({disabled: !b});
		},
		prev(b) {
			els.prev.attr({disabled: !b});
		},
		toDisable(b) {
			els.toDisable.attr({disabled: !b});
		},
		modal(b) {
			uk[b ? "openModal" : "closeModal"](ROOT);
		}
	};
	
	function groupSucc(arr) {
		if (!els) { setTimeout(groupSucc, 1000); return; }
		els.stat.empty();
		arr.forEach(i => {
			els.groups.append( temp.groupOpt({name: i.name, value: i.id}) );
		});
	}
	function groupFail() {
		if (!els) { setTimeout(groupFail, 1000); return; }
		els.btnParent.empty().append( temp.groupOptBtn() );
		els.stat.empty().append( temp.groupOptDanger() );
	}
	function fetchGroups() {
		if (!firstGroupFetch) {
			els.btnParent.empty();
			els.stat.empty().append( temp.smallSpinner() );
		}
		$.ajax({
			url: conf.BASE + "device/grouptree" + token(),
			method: "GET",
			data: "parent_only=true"
		})
		.done(d => {
			let arr = [];
			d.groups[0].Groups.forEach( i => arr.push({name: i.Name, id: i.ID}) );
			groupSucc(arr);
			inst.emit("group_fetch_succ", arr);
		})
		.fail(x => {
			if (x.status === 403) {
				inst.emit("login_error");
			} else {
				inst.emit("group_fetch_fail");
			}
			groupFail();
		});
		firstGroupFetch = false;
	}
	
	c.groupChange = e => {
		let curr = e.data;
		let v = e.target.value;
		if (curr) {
			els.submit.attr({disabled: !v || parseInt(v, 10) === curr.groupId});
		} else {
			els.submit.attr({disabled: v ? false : true});
		}
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
		toggle.submit( v !== curr.type || count !== curr.count );
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
			toggle.submit(num !== curr.count || type !== curr.type);
		} else {
			el.val( d.RANGE_COUNT_DEF[type] );
		}
	};
	function setForAdd() {
		inst.shallow = true;
		toggle.prev(true);
		els.rangeType
			.off("change")
			.on("change", c.add.typeChange)
			.val(d.RANGE_TYPE)
			.change();
		els.rangeCount
			.off("change")
			.on("change", c.add.countChange);
		els.groups
			.off("change")
			.on("change", c.groupChange)
			.val("")
			.change();
			
		els.submit
			.text("Save")
			.off()
			.on("click", e => {
				if (e.target.disabled) return;
				let toDis = els.toDisable; 
				toDis.attr({disabled: true});
				inst.emit("submit", get(), success => {
					toDis.attr({disabled: false});
					if (success) close();
				});
			});
	}
	function setForEdit(o) {
		toggle.prev(false);
		let type = o.rangeType;
		let count = o.rangeCount;
		let groupId = o.group.id;
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
			.change();
			
		els.groups
			.off("change")
			.on("change", {groupId: groupId}, c.groupChange)
			.val(groupId)
			.change();
		
		els.submit
			.text("Apply")
			.off()
			.on("click", e => {
				if (e.target.disabled) return;
				let toDis = els.toDisable; 
				toDis.attr({disabled: true});
				inst.emit("submit", get(o), success => {
					toDis.attr({disabled: false});
					if (success) close();
				});
			});
	}
	function get(o) {
		let rangeTypeVal = els.rangeType.val();
		let rangeCountVal = els.rangeCount.val();
		let groups = els.groups;
		
		let data = {
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal),
			group: {
				id: parseInt(groups.val(), 10),
				name: groups.find(":selected").text()
			},
			statKpis: conf.STAT_KPIS
		};
		
		if (o) {
			Object.keys(data).forEach( k => o[k] = data[k] );
			return o;
		}
		
		return data;
	}
	function close() {
		inst.shallow = false;
		toggle.modal(false);
	}
	
	inst.open = () => {
		toggle.modal(true);
		return inst;
	};
	inst.set = (o) => {
		o ? setForEdit(o) : setForAdd();
		return inst;
	};
	inst.fetchGroups = fetchGroups;
	inst.init = () => {
		els = u.getEls(ROOT);
		
		els.prev.on( "click", e => {
			if (e.target.disabled) return;
			inst.emit("prev")
		});
		
		els.btnParent.on("click", "[data-retry]", fetchGroups);
	};
	
	return inst;
});