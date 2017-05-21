define(["uk"], (uk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='process']";
	let els;
	
	
	function reset() {
		els.bar.val(0);
		els.content.empty();
	}
	function init() {
		els = u.getEls(ROOT);
		
	}
	
	inst.open = () => {
		reset();
		uk.openModal(ROOT);
	};
	inst.close = () => {
		uk.closeModal(ROOT);
	};
	
	inst.init = init;
	window.pp = u.getEls(ROOT);
	return inst;
});