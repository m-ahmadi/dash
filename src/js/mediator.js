define([
	"core/util",
	"core/pubsub",
	"./globals/smartresize",
	"./globals/main",
	"./sidebar",
	"wizard/mediator",
	"./templates"
], (u, newPubSub, smartresize, globals, sidebar, wizard) => {
	
	const inst = u.extend( newPubSub() );
	
	
	function addCustomEvts() {
		
	}
	function beforeReady() {
		smartresize();
	}
	function onReady() {
		sidebar.init();
		globals();
		wizard.init();
		
		addCustomEvts();
	}
	
	inst.beforeReady = beforeReady;
	inst.onReady = onReady;
	
	return inst;
});