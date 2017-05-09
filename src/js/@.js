define([], () => {
	const inst = u.extend( newPubSub() );
	
	function init() {
		
	}
	
	inst.init = init;
	
	return inst;
});