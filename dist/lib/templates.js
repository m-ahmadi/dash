!function(){var t=Handlebars.template,a=Handlebars.templates=Handlebars.templates||{};a["header/danger"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<i class="fa fa-exclamation-circle fa-fw red-text fa-lg" title="Could not fetch the date and time."></i>\r\n<a class="uk-margin-small-right" data-retry title="Try again manually."><i class="fa fa-refresh fa-lg"></i></a>'},useData:!0}),a["header/smallSpinner"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<i class="fa fa-refresh fa-fw fa-spin"></i>'},useData:!0}),a["login/alert"]=t({1:function(t,a,n,e,l){return'\t<a class="uk-alert-close" uk-close></a>\r\n'},3:function(t,a,n,e,l){return"fa-refresh fa-fw fa-spin"},5:function(t,a,n,e,l){return"fa-check-circle"},7:function(t,a,n,e,l){return"fa-exclamation-triangle"},compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){var i,r=t.lambda,s=t.escapeExpression,u=null!=a?a:t.nullContext||{};return'<div class="uk-alert-'+s(r(null!=a?a.type:a,a))+'" uk-alert>\r\n'+(null!=(i=n.unless.call(u,null!=a?a.noClose:a,{name:"unless",hash:{},fn:t.program(1,l,0),inverse:t.noop,data:l}))?i:"")+'\t<p>\r\n\t\t<i class="\r\n\t\t\tfa\r\n\t\t\t'+(null!=(i=n.if.call(u,null!=a?a.process:a,{name:"if",hash:{},fn:t.program(3,l,0),inverse:t.noop,data:l}))?i:"")+"\r\n\t\t\t"+(null!=(i=n.if.call(u,null!=a?a.success:a,{name:"if",hash:{},fn:t.program(5,l,0),inverse:t.noop,data:l}))?i:"")+"\r\n\t\t\t"+(null!=(i=n.if.call(u,null!=a?a.danger:a,{name:"if",hash:{},fn:t.program(7,l,0),inverse:t.noop,data:l}))?i:"")+'\r\n\t\t\tfa-lg\r\n\t\t" aria-hidden="true">\r\n\t\t</i> '+s(r(null!=a?a.message:a,a))+"</p>\r\n</div>"},useData:!0}),a["process/alert"]=t({1:function(t,a,n,e,l){return"fa-info-circle"},3:function(t,a,n,e,l){return"fa-check-circle"},5:function(t,a,n,e,l){return"fa-exclamation-circle"},7:function(t,a,n,e,l){return"fa-exclamation-triangle"},compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){var i,r=t.lambda,s=t.escapeExpression,u=null!=a?a:t.nullContext||{};return'<div class="uk-alert-'+s(r(null!=a?a.type:a,a))+'" uk-alert>\r\n    <a class="uk-alert-close" uk-close></a>\r\n    <p class="uk-text-bold">\r\n\t\t\t<i class="\r\n\t\t\t\tfa\r\n\t\t\t\t'+(null!=(i=n.if.call(u,null!=a?a.primary:a,{name:"if",hash:{},fn:t.program(1,l,0),inverse:t.noop,data:l}))?i:"")+"\r\n\t\t\t\t"+(null!=(i=n.if.call(u,null!=a?a.success:a,{name:"if",hash:{},fn:t.program(3,l,0),inverse:t.noop,data:l}))?i:"")+"\r\n\t\t\t\t"+(null!=(i=n.if.call(u,null!=a?a.warning:a,{name:"if",hash:{},fn:t.program(5,l,0),inverse:t.noop,data:l}))?i:"")+"\r\n\t\t\t\t"+(null!=(i=n.if.call(u,null!=a?a.danger:a,{name:"if",hash:{},fn:t.program(7,l,0),inverse:t.noop,data:l}))?i:"")+'\r\n\t\t\t\tfa-lg\r\n\t\t\t\t" aria-hidden="true">\r\n\t\t\t</i> '+s(r(null!=a?a.message:a,a))+"</p>\r\n</div>"},useData:!0}),a["widget/alert"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<div class="uk-alert-danger" uk-alert>\r\n    <a class="uk-alert-close" uk-close></a>\r\n    <p class="uk-text-bold"><i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i> '+t.escapeExpression(t.lambda(null!=a?a.message:a,a))+"</p>\r\n</div>"},useData:!0}),a["widget/btnMax"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<a class="uk-button uk-button-text uk-text-small uk-text-meta" data-menu data-action="0"><i uk-icon="icon: arrow-down; ratio: 0.8;"></i> Max</a>'},useData:!0}),a["widget/btnMin"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<a class="uk-button uk-button-text uk-text-small uk-text-meta" data-menu data-action="1"><i uk-icon="icon: arrow-up; ratio: 0.8;"></i> Min</a>'},useData:!0}),a["widget/mapPopup"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<div id="popup" class="ol-popup">\r\n\t<a href="" id="popup-closer" class="ol-popup-closer"></a>\r\n\t<div id="popup-content"></div>\r\n</div>'},useData:!0}),a["widget/markFail"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<svg class="marks" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.2 135.2">\r\n  <circle class="path circle" fill="none" stroke="#ff3939" stroke-width="12" stroke-miterlimit="10" cx="66.1" cy="66.1" r="60.1"/>\r\n  <line class="path line" fill="none" stroke="#ff3939" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>\r\n  <line class="path line" fill="none" stroke="#ff3939" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>\r\n</svg>'},useData:!0}),a["widget/markSuccess"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<svg class="marks" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.2 135.2">\r\n  <circle class="path circle" fill="none" stroke="#2de800" stroke-width="12" stroke-miterlimit="10" cx="66.1" cy="66.1" r="60.1"/>\r\n  <polyline class="path check" fill="none" stroke="#2de800" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>\r\n</svg>'},useData:!0}),a["widget/panel"]=t({1:function(t,a,n,e,l){return'\t\tclass="uk-width-1-1@s uk-width-1-1@m uk-width-1-2@l uk-width-1-2@xl"\r\n\t\tdata-expand="1"\r\n'},3:function(t,a,n,e,l){var i;return null!=(i=n.if.call(null!=a?a:t.nullContext||{},null!=a?a.xTwo:a,{name:"if",hash:{},fn:t.program(4,l,0),inverse:t.program(6,l,0),data:l}))?i:""},4:function(t,a,n,e,l){return'\t\tclass="uk-width-1-1@s uk-width-1-1@m uk-width-2-3@l uk-width-3-4@xl"\r\n\t\tdata-expand="2"\r\n'},6:function(t,a,n,e,l){var i;return null!=(i=n.if.call(null!=a?a:t.nullContext||{},null!=a?a.xThree:a,{name:"if",hash:{},fn:t.program(7,l,0),inverse:t.program(9,l,0),data:l}))?i:""},7:function(t,a,n,e,l){return'\t\tclass="uk-width-1-1"\r\n\t\tdata-expand="3"\r\n'},9:function(t,a,n,e,l){return'\t\tdata-expand="0"\r\n\t'},11:function(t,a,n,e,l){return'\t\tdata-min="true"\r\n'},13:function(t,a,n,e,l){return'\t\tdata-min="false"\r\n'},15:function(t,a,n,e,l){return'\t\t\t\t\t\t\t\t<li data-resize><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-menu data-action="0"><i uk-icon="icon: arrow-down; ratio: 0.8;"></i> Max</button></li>\r\n'},17:function(t,a,n,e,l){return'\t\t\t\t\t\t\t\t<li data-resize><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-menu data-action="1"><i uk-icon="icon: arrow-up; ratio: 0.8;"></i> Min</button></li>\r\n'},19:function(t,a,n,e,l){return"map-panel"},21:function(t,a,n,e,l){return'style="display:none;"'},compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){var i,r=t.lambda,s=t.escapeExpression,u=null!=a?a:t.nullContext||{};return'<div\r\n\tdata-id="'+s(r(null!=a?a.id:a,a))+'"\r\n'+(null!=(i=n.if.call(u,null!=a?a.xOne:a,{name:"if",hash:{},fn:t.program(1,l,0),inverse:t.program(3,l,0),data:l}))?i:"")+"\t\r\n"+(null!=(i=n.if.call(u,null!=a?a.min:a,{name:"if",hash:{},fn:t.program(11,l,0),inverse:t.program(13,l,0),data:l}))?i:"")+'\t>\r\n\t\r\n\t<div class="panel uk-card uk-card-default" data-el="panel">\r\n\t\t<div class="uk-card-header">\r\n\t\t\t<div class="uk-float-left">\r\n\t\t\t\t<span class="uk-card-title uk-text-muted uk-text-small uk-text-bold">\r\n\t\t\t\t\t<i class="uk-sortable-handle" uk-icon="icon: move; ratio: 1"></i> <span data-el="title">'+s(r(null!=a?a.title:a,a))+'</span>\r\n\t\t\t\t\t<span class="uk-margin-small-left" data-el="spinnerParent">&nbsp;</span>\r\n\t\t\t\t</span>\r\n\t\t\t</div>\r\n\t\t\t<span class="uk-text-small uk-text-meta" data-el="rangeTitle">'+s(r(null!=a?a.rangeTitle:a,a))+'</span>\r\n\t\t\t<div class="uk-float-right">\r\n\t\t\t\t\x3c!-- <ul class="uk-iconnav">\r\n\t\t\t\t\t\t<li><a uk-icon="icon: plus-circle" title="Maximize" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: minus-circle" title="Minimize" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: shrink" title="Shrink" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: expand" title="Expand" uk-tooltip></a></li>\r\n\t\t\t\t</ul> --\x3e\r\n\t\t\t\t\r\n\t\t\t\t<div class="uk-inline">\r\n\t\t\t\t\t<button class="dropdown uk-button uk-button-default uk-button-small" type="button" data-el="menuBtn">\r\n\t\t\t\t\t\t<span uk-icon="icon: menu; ratio: 1"></span>\r\n\t\t\t\t\t</button>\r\n\t\t\t\t\t<div uk-dropdown="delay-hide: 10;">\r\n\t\t\t\t\t\t<ul class="uk-list uk-text-left" data-el="menus">\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="expand"><i uk-icon="icon: expand; ratio: 0.8;"></i> Expand</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="shrink"><i uk-icon="icon: shrink; ratio: 0.8;"></i> Shrink</button></li>\r\n'+(null!=(i=n.if.call(u,null!=a?a.min:a,{name:"if",hash:{},fn:t.program(15,l,0),inverse:t.program(17,l,0),data:l}))?i:"")+'\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="edit"><i uk-icon="icon: file-edit; ratio: 0.8;"></i> Edit</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="refresh"><i uk-icon="icon: refresh; ratio: 0.8;"></i> Refresh</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="remove"><i uk-icon="icon: close; ratio: 0.8;"></i> Delete</button></li>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class="uk-card-body '+(null!=(i=n.if.call(u,null!=a?a.map:a,{name:"if",hash:{},fn:t.program(19,l,0),inverse:t.noop,data:l}))?i:"")+'" data-el="body" '+(null!=(i=n.if.call(u,null!=a?a.min:a,{name:"if",hash:{},fn:t.program(21,l,0),inverse:t.noop,data:l}))?i:"")+'>\r\n\t\t\t<div data-el="container"></div>\r\n\t\t</div>\r\n\t</div>\r\n</div>'},useData:!0}),a["widget/spinner"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<i class="fa fa-refresh fa-lg fa-fw fa-spin"></i>'},useData:!0}),a["widget/statTable"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){var i=t.lambda,r=t.escapeExpression;return'<div class="uk-overflow-auto uk-padding-small stat-table">\r\n\t<table class="uk-table uk-table-divider uk-table-hover uk-table-small uk-table-striped">\r\n\t\t<caption class="uk-text-center uk-margin-small-bottom">'+r(i(null!=a?a.title:a,a))+'</caption>\x3c!-- uk-text-bold --\x3e\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Logical Links</td>\r\n\t\t\t<td><img src="'+r(i(null!=a?a.root:a,a))+'images/links.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_link_count"></td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Links with SLA Violation</th>\r\n\t\t\t<td><img src="'+r(i(null!=a?a.root:a,a))+'images/sla_violation.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_violation"></td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Links with <i class="uk-text-primary">packet_loss_ne</i> Violation</th>\r\n\t\t\t<td><img src="'+r(i(null!=a?a.root:a,a))+'images/packet_loss.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_packet_losss_ne_violation"></td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Links with <i class="uk-text-primary">two_way_delay_max</i> Violation</th>\r\n\t\t\t<td><img src="'+r(i(null!=a?a.root:a,a))+'images/two_way_delay.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_two_way_delay_max_violation"></td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Links with <i class="uk-text-primary">two_way_dv_max</i> Violation</th>\r\n\t\t\t<td><img src="'+r(i(null!=a?a.root:a,a))+'images/two_way_dv.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_two_way_dv_max_violation"></td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n\x3c!-- <td><img src="images/viol.png" width="40" height="40" /></td> --\x3e\r\n\x3c!--\r\n\t<tr>\r\n\t\t<th class="uk-text-capitalize">Logical Links</th>\r\n\t\t<th class="uk-text-capitalize">Links with SLA Violation</th>\r\n\t\t<th class="uk-text-capitalize">Links with packet_loss_ne Violation</th>\r\n\t\t<th class="uk-text-capitalize">Links with two_way_delay_max Violation</th>\r\n\t\t<th class="uk-text-capitalize">Links with two_way_dv_max Violation</th>\r\n\t</tr>\r\n\t<tr>\r\n\t\t<td>'+r(i(null!=a?a.total_link_count:a,a))+"</td>\r\n\t\t<td>"+r(i(null!=a?a.total_violation:a,a))+"</td>\r\n\t\t<td>"+r(i(null!=a?a.total_packet_losss_ne_violation:a,a))+"</td>\r\n\t\t<td>"+r(i(null!=a?a.total_two_way_delay_max_violation:a,a))+"</td>\r\n\t\t<td>"+r(i(null!=a?a.total_two_way_dv_max_violation:a,a))+"</td>\r\n\t</tr>\r\n--\x3e"},useData:!0}),a["wizard/wiz2/sensorLoadBtn"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<a class="uk-margin-small-right" data-retry><i class="fa fa-refresh"></i></a>'},useData:!0}),a["wizard/wiz2/sensorLoadDanger"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<i class="fa fa-exclamation-circle fa-fw red-text" title="Could not fetch sensor list, Try again manually."></i>'},useData:!0}),a["wizard/wiz2/sensorRow"]=t({1:function(t,a,n,e,l){var i=t.lambda,r=t.escapeExpression;return'\t\t\t\t<option value="'+r(i(null!=a?a.name:a,a))+'">'+r(i(null!=a?a.name:a,a))+"</option>\r\n"},compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){var i,r=t.lambda,s=t.escapeExpression;return'<tr data-id="'+s(r(null!=a?a.id:a,a))+'">\r\n\t<td title="'+s(r(null!=a?a.name:a,a))+'">'+s(r(null!=a?a.name:a,a))+'</td>\r\n\t<td>\r\n\t\t<select class="uk-select uk-form-small" data-el="select" data-els="toDisable">\r\n'+(null!=(i=n.each.call(null!=a?a:t.nullContext||{},null!=a?a.units:a,{name:"each",hash:{},fn:t.program(1,l,0),inverse:t.noop,data:l}))?i:"")+'\t\t</select>\r\n\t</td>\r\n\t<td>\r\n\t\t<input type="text" data-el="colorpick" />\r\n\t</td>\r\n\t<td>\r\n\t\t<button type="button" class="uk-button uk-button-danger uk-button-small small-btn" data-el="remove" data-els="toDisable">\r\n\t\t\t<span uk-icon="icon: close; ratio: 0.7" class="uk-icon"></span>\r\n\t\t</button>\r\n\t</td>\r\n</tr>'},useData:!0}),a["wizard/wiz2/smallSpinner"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<i class="fa fa-refresh fa-fw fa-spin"></i>'},useData:!0}),a["wizard/wiz3/groupOpt"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){var i=t.lambda,r=t.escapeExpression;return'<option value="'+r(i(null!=a?a.value:a,a))+'">'+r(i(null!=a?a.name:a,a))+"</option>"},useData:!0}),a["wizard/wiz3/groupOptBtn"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<a class="uk-margin-small-right" data-retry><i class="fa fa-refresh"></i></a>'},useData:!0}),a["wizard/wiz3/groupOptDanger"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<i class="fa fa-exclamation-circle fa-fw red-text" title="Could not fetch the groups, Try again manually."></i>'},useData:!0}),a["wizard/wiz3/smallSpinner"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<i class="fa fa-refresh fa-fw fa-spin"></i>'},useData:!0}),a["wizard/wiz4/danger"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<div class="uk-alert-danger" uk-alert>\r\n\t<p>\r\n\t\t<i class="fa fa-exclamation-circle fa-fw red-text"></i>\r\n\t\tCould not fetch the groups. Try again manually:\r\n\t\t<a class="uk-margin-small-left retry-btn" data-retry><i class="fa fa-refresh"></i></a>\r\n\t</p>\r\n</div>'},useData:!0}),a["wizard/wiz4/deviceRow"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){var i=t.lambda,r=t.escapeExpression;return'<tr data-id="'+r(i(null!=a?a.id:a,a))+'">\r\n\t<td title="'+r(i(null!=a?a.name:a,a))+'">'+r(i(null!=a?a.name:a,a))+'</td>\r\n\t<td>\r\n\t\t<button type="button" class="uk-button uk-button-danger uk-button-small small-btn" data-el="remove" data-els="toDisable">\r\n\t\t\t<span uk-icon="icon: close; ratio: 0.7" class="uk-icon"></span>\r\n\t\t</button>\r\n\t</td>\r\n</tr>'},useData:!0}),a["wizard/wiz4/formRow"]=t({1:function(t,a,n,e,l){var i=t.lambda,r=t.escapeExpression;return'<div class="uk-margin-small">\r\n\t<label><input class="uk-checkbox" type="checkbox" name="'+r(i(null!=a?a.name:a,a))+'" value="'+r(i(null!=a?a.id:a,a))+'" /> '+r(i(null!=a?a.name:a,a))+"</label>\r\n</div>\r\n"},compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){var i;return null!=(i=n.each.call(null!=a?a:t.nullContext||{},null!=a?a.groups:a,{name:"each",hash:{},fn:t.program(1,l,0),inverse:t.noop,data:l}))?i:""},useData:!0}),a["wizard/wiz4/loading"]=t({compiler:[7,">= 4.0.0"],main:function(t,a,n,e,l){return'<div class="uk-alert-primary" uk-alert>\r\n\t<p><i class="fa fa-refresh fa-fw fa-spin"></i> Fetching Group List...</p>\r\n</div>'},useData:!0})}();