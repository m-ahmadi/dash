define(["core/uk", "core/config", "core/token", "./defaults", "./share"], (uk, conf, token, d, share) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz4']";
	const temp = Handlebars.templates;
	let els;
	let c = { add: {}, edit: {} };
	let groups;
	
	function fetchGroups() {
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
			setTimeout(fetchGroups, 400);
		});
	}
	function setGroups(arr) {
		groups = arr;
		return inst;
	}
	function renderForm() {
		els.alerts.empty();
		els.submit.attr({disabled: false});
		els.groups.html( temp.groupChk({groups: groups}) );
		u.getEls(els.groups, els);
		return inst;
	}
	
	c.groupsChange = e => {
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
			.on("change", c.groupsChange)
			.val("")
			.change();
	}
	function setForEdit(o) {
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
			.on("change", {groupId: groupId}, c.groupsChange)
			.val(groupId)
			.change();
	}
	function get() {
		let rangeTypeVal = els.rangeType.val();
		let rangeCountVal = els.rangeCount.val();
		let res = {
			rangeType: rangeTypeVal,
			rangeCount: parseInt(rangeCountVal, 10),
			rangeTitle: share.getRangeTitle(rangeTypeVal, rangeCountVal),
			map: undefined
		};
		let groups = [];
		els.groups.find(":checkbox").each((x, l) => {
			groups.push({
				id: parseInt(l.value, 10),
				name: l.name,
				checked: l.checked ? true : false
			});
		});
		res.map = groups;
		return res;
	}
	
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
		
		els.prev.on( "click", () => inst.emit("prev") );
		
		els.submit.on("click", () => {
			inst.emit("submit", get(), success => {
				if (success) close();
			});
		});
	};
	
	return inst;
});