define(() => {
	return () => {
		
		// iCheck
		$(document).ready(function () {
			if ($("input.flat")[0]) {
				$(document).ready(function () {
					$('input.flat').iCheck({
						checkboxClass: 'icheckbox_flat-green',
						radioClass: 'iradio_flat-green'
					});
				});
			}
		});
		// /iCheck
		
	};
});