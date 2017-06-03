define([], () => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='header']";
	const FORMAT = "MMMM Do YYYY, h:mm:ss a";
	
	let els, now;
	
	function timer() {
		now.text( moment().format(FORMAT) );
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