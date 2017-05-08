define([
	"core/util",
	"core/pubsub",
	"./smartwizard"
], (u, newPubSub, daterangepicker, smartwizard) => {
	const inst = u.extend( newPubSub() );

	const ROOT = "#wizard";
	let els;
	
	
	function initDaterangepicker() {
		var cb = function (start, end, label) {
			console.log(start.toISOString(), end.toISOString(), label);
			$('#reportrange_right span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
		};

		var optionSet1 = {
			startDate: moment().subtract(29, 'days'),
			endDate: moment(),
			minDate: '01/01/2012',
			maxDate: '12/31/2020',
			dateLimit: {
				days: 60
			},
			showDropdowns: true,
			showWeekNumbers: true,
			timePicker: true,
			timePickerIncrement: 1,
			timePicker12Hour: true,
			ranges: {
				'Last Quarter-Hour': [moment(), moment()],
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
			},
			showCustomRangeLabel: false,
			opens: 'right',
			buttonClasses: ['btn btn-default'],
			applyClass: 'btn-small btn-primary',
			cancelClass: 'btn-small',
			format: 'MM/DD/YYYY',
			separator: ' to ',
			locale: {
				applyLabel: 'Submit',
				cancelLabel: 'Clear',
				fromLabel: 'From',
				toLabel: 'To',
				customRangeLabel: 'Custom',
				daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
				monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
				firstDay: 1
			}
		};

		$('#reportrange_right span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));

		$('#reportrange_right').daterangepicker(optionSet1, cb);

		$('#reportrange_right').on('show.daterangepicker', function () {
			console.log("show event fired");
		});
		$('#reportrange_right').on('hide.daterangepicker', function () {
			console.log("hide event fired");
		});
		$('#reportrange_right').on('apply.daterangepicker', function (ev, picker) {
			console.log("apply event fired, start/end dates are " + picker.startDate.format('MMMM D, YYYY') + " to " + picker.endDate.format('MMMM D, YYYY'));
		});
		$('#reportrange_right').on('cancel.daterangepicker', function (ev, picker) {
			console.log("cancel event fired");
		});

		$('#options1').click(function () {
			alert();
			$('#reportrange_right').data('daterangepicker').setOptions(optionSet1, cb);
		});

		$('#options2').click(function () {
			$('#reportrange_right').data('daterangepicker').setOptions(optionSet2, cb);
		});

		$('#destroy').click(function () {
			$('#reportrange_right').data('daterangepicker').remove();
		});
	}
	function initSmartWizard() {
		
		els.root.smartWizard({
			noForwardJumping: true,
			onLeaveStep: function () {
				
				return true
			},
			onShowStep: function () {
				return true
			},
			onFinish: function () {
				
			}
		});
		
		$('.buttonNext').addClass('btn btn-success');
		$('.buttonPrevious').addClass('btn btn-primary');
		$('.buttonFinish').addClass('btn btn-default');
	}
	function init() {
		els = u.getEls(ROOT);
		
		initDaterangepicker();
		initSmartWizard();
	}
	
	inst.init = init;
	
	return inst;
});