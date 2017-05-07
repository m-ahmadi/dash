define([
	"core/util",
	"core/pubsub",
	"./smartresize",
	"./globals/main",
	"./sidebar",
	"./daterangepicker",
	"./smartwizard",
	"./templates"
], (u, newPubSub, smartresize, globals, sidebar, daterangepicker, smartwizard) => {
	
	const inst = u.extend( newPubSub() );
	
	
	function addCustomEvts() {
		
	}
	function beforeReady() {
		smartresize();
	}
	function onReady() {
		sidebar.init();
		globals();
		daterangepicker.right();
		smartwizard();
		
		addCustomEvts();
	}
	
	inst.beforeReady = beforeReady;
	inst.onReady = onReady;
	
	return inst;
});