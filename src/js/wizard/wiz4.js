define(["uk"], (uk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz4']";
	const temp = Handlebars.templates;
	let els;
	
	function start() {
		uk.openModal(ROOT);
	}
	function init() {
		els = u.getEls(ROOT);
		
		els.prev.on( "click", () => inst.emit("prev") );
		
		els.submit.on("click", () => {
			inst.emit(data.type);
		});
	}
	
	inst.start = start;
	inst.init = init;
	
	return inst;
});