define(["uk"], function (uk) {
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
//# sourceMappingURL=confirm.js.map