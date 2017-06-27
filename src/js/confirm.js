define(["core/uk"], (uk) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='confirm']";
	let els, confirmId;
	
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
		els.submit.on("click", () => {
			els.toDisable.attr({disabled: true});
			inst.emit("submit", confirmId, () => {
				els.toDisable.attr({disabled: false}); 
				close();
			});
		});
	}
	
	inst.open = open;
	inst.init = init;
	
	return inst;
});