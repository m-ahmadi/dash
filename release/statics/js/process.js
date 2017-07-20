define(["core/uk"], function (uk) {
	var inst = u.extend(newPubSub());
	var ROOT = "[data-root='process']";
	var temp = u.getTemps("process");
	var els = void 0;
	var doingMsg = "";
	var timer = void 0;

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
		setTimeout(function () {
			return uk.closeModal(ROOT);
		}, 1000);
	}
	function clear() {
		els.logs.empty();
	}
	function reset() {
		set(0);
	}
	function log(msg, type) {
		var ctx = {};
		var str = type || "primary";
		ctx.message = msg;
		ctx.type = str;
		ctx[str] = true;
		els.logs.append(temp.alert(ctx));
	}
	function inc(steps) {
		var n = parseFloat(els.bar.val(), 10);
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
		els.bar.on("change", function (e) {
			els.percent.text($(e.target).val());
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
		timer = setTimeout(function () {
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
//# sourceMappingURL=process.js.map