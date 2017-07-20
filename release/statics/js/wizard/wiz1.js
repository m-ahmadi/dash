define(["core/uk", "./defaults"], function (uk, d) {
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
//# sourceMappingURL=wiz1.js.map