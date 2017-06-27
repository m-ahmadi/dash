define(["core/uk"], (uk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz4']";
	const temp = Handlebars.templates;
	let els;
	
	inst.open = () => {
		uk.openModal(ROOT);
	};
	inst.init = () => {
		els = u.getEls(ROOT);
		
		els.prev.on( "click", () => inst.emit("prev") );
		
		els.submit.on("click", () => {
			inst.emit(data.type);
		});
	};
	
	return inst;
});