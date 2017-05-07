define(() => {
	return () => {
		
		if (typeof($.fn.smartWizard) === 'undefined') {
			return;
		}
		console.log('init_SmartWizard');

		$('#wizard').smartWizard();

		$('#wizard_verticle').smartWizard({
			transitionEffect: 'slide'
		});

		$('.buttonNext').addClass('btn btn-success');
		$('.buttonPrevious').addClass('btn btn-primary');
		$('.buttonFinish').addClass('btn btn-default');
		
	};
});