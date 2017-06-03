define([
	"header",
	"content/mediator",
	"templates"
], (header, content) => {
	const inst = u.extend( newPubSub() );
	
	function customEvents() {
		
	}
	inst.beforeReady = () => {
		
	};
	inst.onReady = () => {
		header.init();
		content.init();
		
		customEvents();
	};
	
	return inst;
});