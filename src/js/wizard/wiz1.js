define(["core/uk", "./defaults"], (uk, d) => {
	const inst = u.extend( newPubSub() );
	const ROOT = "[data-root='wiz1']";
	let els;
	
	function checked() {
		let v = els.radios.filter(":checked").val();
		return parseInt(v, 10);
	}
	
	inst.get = () => {
		return checked();
	};
	inst.open = () => {
		uk.openModal(ROOT);
		return inst;
	};
	inst.set = (o) => {
		type = o ? o.type : d.TYPE;
		els.radios.eq(type).prop({checked: true});
		return inst;
	};
	inst.init = () => {
		els = u.getEls(ROOT);
		
		els.next.on("click", () => {
			inst.emit( "next", checked() );
		});
	};
	
	return inst;
});