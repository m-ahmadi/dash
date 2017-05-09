define([
	"content/mediator",
	"templates"
], (content) => {
	const inst = u.extend( newPubSub() );
	
	function customEvents() {
		
	}
	inst.beforeReady = () => {
		
	};
	inst.onReady = () => {
		content.init();
		customEvents();
	};
	
	return inst;
});