define([
	"core/util",
	"core/pubsub"
], (u, newPubSub) => {
	const inst = u.extend( newPubSub() );
	
	function init() {
		
	}
	
	inst.init = init;
	
	return inst;
});