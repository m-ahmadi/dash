define([], function () {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='header']";
	var FORMAT = "MMMM Do YYYY, h:mm:ss a";

	var els = void 0,
	    now = void 0;

	function timer() {
		now.text(moment().format(FORMAT));
		setTimeout(timer, 1000);
	}
	function init() {
		els = u.getEls(ROOT);
		now = els.now;
		timer();
	}

	inst.init = init;

	return inst;
});
//# sourceMappingURL=header.js.map