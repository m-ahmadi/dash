define([
	"./paneltoolbox",
	"./tooltip",
	"./progressbar",
	"./table",
	"./icheck",
	"./nprogress"
], (
	paneltoolbox,
	tooltip,
	progressbar,
	table,
	icheck,
	nprogress
) => {
	return () => {
		paneltoolbox();
		tooltip();
		progressbar();
		table();
		icheck();
		// nprogress();
	};
});