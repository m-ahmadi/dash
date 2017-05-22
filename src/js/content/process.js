define(["uk"], (uk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='process']";
	const temp = Handlebars.templates;
	let els;
	
	
	function open() {
		clear();
		reset();
		uk.openModal(ROOT);
	}
	function close() {
		uk.closeModal(ROOT);
	}
	function clear() {
		els.logs.empty();
	}
	function reset() {
		els.bar.val(0);
	}
	function log(msg, type) {
		const ctx = {};
		const str = type || "primary";
		ctx.message = msg;
		ctx.type = str;
		ctx[str] = true;
		els.logs.append( temp.procAlert(ctx) );
	}
	function inc() {
		let n = parseInt(els.bar.val(), 10);
		set(n+=1);
	}
	function set(n) {
		els.bar.val(""+n).trigger("change");
	}
	function init() {
		els = u.getEls(ROOT);
		els.bar.on("change", e => {
			els.percent.text( $(e.target).val() );
		});
	}
	
	inst.open = open;
	inst.close = close;
	inst.log = log;
	inst.clear = clear;
	inst.reset = reset;
	inst.set = set;
	inst.inc = inc;
	inst.init = init;
	
	window.proc = inst;
	return inst;
});