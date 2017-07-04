define(["core/uk"], (uk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='process']";
	const temp = u.getTemps("process");
	let els;
	let doingMsg = "";
	let timer;
	
	
	function resume() {
		uk.openModal(ROOT);
	}
	function open() {
		$("#overlay").remove();
		clear();
		reset();
		uk.openModal(ROOT);
	}
	function close() {
		setTimeout(() => uk.closeModal(ROOT), 1000);
	}
	function clear() {
		els.logs.empty();
	}
	function reset() {
		set(0);
	}
	function log(msg, type) {
		const ctx = {};
		const str = type || "primary";
		ctx.message = msg;
		ctx.type = str;
		ctx[str] = true;
		els.logs.append( temp.alert(ctx) );
	}
	function inc(steps) {
		let n = parseFloat(els.bar.val(), 10);
		set(n += steps || 1);
	}
	function set(n) {
		els.bar.val(n).trigger("change");
	}
	function get(n) {
		return parseInt(els.bar.val(), 10);
	}
	function init() {
		els = u.getEls(ROOT);
		els.bar.on("change", e => {
			els.percent.text( $(e.target).val() );
		});
	}
	function doing(msg, append) {
		if (append) {
			els.currently.text(doingMsg + msg);
		} else {
			doingMsg = msg;
			els.currently.text(doingMsg);
		}
	}
	function start(steps) {
		timer = setTimeout(() => {
			inc(1);
			start();
		}, 800);
	}
	function stop() {
		clearTimeout(timer);
	}
	function finish() {
		set(100);
		close();
	}
	
	inst.resume = resume;
	inst.open = open;
	inst.close = close;
	inst.log = log;
	inst.clear = clear;
	inst.reset = reset;
	inst.set = set;
	inst.get = get;
	inst.inc = inc;
	inst.doing = doing;
	inst.start = start;
	inst.stop = stop;
	inst.finish = finish;
	inst.init = init;
	
	window.proc = inst;
	return inst;
});