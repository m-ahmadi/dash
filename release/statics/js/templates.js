var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function () {
  var t = Handlebars.template,
      a = Handlebars.templates = Handlebars.templates || {};a["login/alert"] = t({ 1: function _(t, a, n, l, e) {
      return '\t<a class="uk-alert-close" uk-close></a>\r\n';
    }, 3: function _(t, a, n, l, e) {
      return "fa-refresh fa-fw fa-spin";
    }, 5: function _(t, a, n, l, e) {
      return "fa-check-circle";
    }, 7: function _(t, a, n, l, e) {
      return "fa-exclamation-triangle";
    }, compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i,
          r,
          o = null != a ? a : t.nullContext || {},
          s = n.helperMissing,
          u = t.escapeExpression;return '<div class="uk-alert-' + u((r = null != (r = n.type || (null != a ? a.type : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "type", hash: {}, data: e }) : r)) + '" uk-alert>\r\n' + (null != (i = n.unless.call(o, null != a ? a.noClose : a, { name: "unless", hash: {}, fn: t.program(1, e, 0), inverse: t.noop, data: e })) ? i : "") + '\t<p>\r\n\t\t<i class="\r\n\t\t\tfa\r\n\t\t\t' + (null != (i = n.if.call(o, null != a ? a.process : a, { name: "if", hash: {}, fn: t.program(3, e, 0), inverse: t.noop, data: e })) ? i : "") + "\r\n\t\t\t" + (null != (i = n.if.call(o, null != a ? a.success : a, { name: "if", hash: {}, fn: t.program(5, e, 0), inverse: t.noop, data: e })) ? i : "") + "\r\n\t\t\t" + (null != (i = n.if.call(o, null != a ? a.danger : a, { name: "if", hash: {}, fn: t.program(7, e, 0), inverse: t.noop, data: e })) ? i : "") + '\r\n\t\t\tfa-lg\r\n\t\t" aria-hidden="true">\r\n\t\t</i> ' + u((r = null != (r = n.message || (null != a ? a.message : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "message", hash: {}, data: e }) : r)) + "</p>\r\n</div>";
    }, useData: !0 }), a["process/alert"] = t({ 1: function _(t, a, n, l, e) {
      return "fa-info-circle";
    }, 3: function _(t, a, n, l, e) {
      return "fa-check-circle";
    }, 5: function _(t, a, n, l, e) {
      return "fa-exclamation-circle";
    }, 7: function _(t, a, n, l, e) {
      return "fa-exclamation-triangle";
    }, compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i,
          r,
          o = null != a ? a : t.nullContext || {},
          s = n.helperMissing,
          u = t.escapeExpression;return '<div class="uk-alert-' + u((r = null != (r = n.type || (null != a ? a.type : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "type", hash: {}, data: e }) : r)) + '" uk-alert>\r\n    <a class="uk-alert-close" uk-close></a>\r\n    <p class="uk-text-bold">\r\n\t\t\t<i class="\r\n\t\t\t\tfa\r\n\t\t\t\t' + (null != (i = n.if.call(o, null != a ? a.primary : a, { name: "if", hash: {}, fn: t.program(1, e, 0), inverse: t.noop, data: e })) ? i : "") + "\r\n\t\t\t\t" + (null != (i = n.if.call(o, null != a ? a.success : a, { name: "if", hash: {}, fn: t.program(3, e, 0), inverse: t.noop, data: e })) ? i : "") + "\r\n\t\t\t\t" + (null != (i = n.if.call(o, null != a ? a.warning : a, { name: "if", hash: {}, fn: t.program(5, e, 0), inverse: t.noop, data: e })) ? i : "") + "\r\n\t\t\t\t" + (null != (i = n.if.call(o, null != a ? a.danger : a, { name: "if", hash: {}, fn: t.program(7, e, 0), inverse: t.noop, data: e })) ? i : "") + '\r\n\t\t\t\tfa-lg\r\n\t\t\t\t" aria-hidden="true">\r\n\t\t\t</i> ' + u((r = null != (r = n.message || (null != a ? a.message : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "message", hash: {}, data: e }) : r)) + "</p>\r\n</div>";
    }, useData: !0 }), a["widget/alert"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i;return '<div class="uk-alert-danger" uk-alert>\r\n    <a class="uk-alert-close" uk-close></a>\r\n    <p class="uk-text-bold"><i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i> ' + t.escapeExpression((i = null != (i = n.message || (null != a ? a.message : a)) ? i : n.helperMissing, "function" == typeof i ? i.call(null != a ? a : t.nullContext || {}, { name: "message", hash: {}, data: e }) : i)) + "</p>\r\n</div>";
    }, useData: !0 }), a["widget/btnMax"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<a class="uk-button uk-button-text uk-text-small uk-text-meta" data-menu data-action="0"><i uk-icon="icon: arrow-down; ratio: 0.8;"></i> Max</a>';
    }, useData: !0 }), a["widget/btnMin"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<a class="uk-button uk-button-text uk-text-small uk-text-meta" data-menu data-action="1"><i uk-icon="icon: arrow-up; ratio: 0.8;"></i> Min</a>';
    }, useData: !0 }), a["widget/mapPopup"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<div id="popup" class="ol-popup">\r\n\t<a href="" id="popup-closer" class="ol-popup-closer"></a>\r\n\t<div id="popup-content"></div>\r\n</div>';
    }, useData: !0 }), a["widget/markFail"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<svg class="marks" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.2 135.2">\r\n  <circle class="path circle" fill="none" stroke="#ff3939" stroke-width="12" stroke-miterlimit="10" cx="66.1" cy="66.1" r="60.1"/>\r\n  <line class="path line" fill="none" stroke="#ff3939" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>\r\n  <line class="path line" fill="none" stroke="#ff3939" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>\r\n</svg>';
    }, useData: !0 }), a["widget/markSuccess"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<svg class="marks" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.2 135.2">\r\n  <circle class="path circle" fill="none" stroke="#2de800" stroke-width="12" stroke-miterlimit="10" cx="66.1" cy="66.1" r="60.1"/>\r\n  <polyline class="path check" fill="none" stroke="#2de800" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>\r\n</svg>';
    }, useData: !0 }), a["widget/panel"] = t({ 1: function _(t, a, n, l, e) {
      return '\t\tclass="uk-width-1-1@s uk-width-1-1@m uk-width-1-2@l uk-width-1-2@xl"\r\n\t\tdata-expand="1"\r\n';
    }, 3: function _(t, a, n, l, e) {
      var i;return null != (i = n.if.call(null != a ? a : t.nullContext || {}, null != a ? a.xTwo : a, { name: "if", hash: {}, fn: t.program(4, e, 0), inverse: t.program(6, e, 0), data: e })) ? i : "";
    }, 4: function _(t, a, n, l, e) {
      return '\t\tclass="uk-width-1-1@s uk-width-1-1@m uk-width-2-3@l uk-width-3-4@xl"\r\n\t\tdata-expand="2"\r\n';
    }, 6: function _(t, a, n, l, e) {
      var i;return null != (i = n.if.call(null != a ? a : t.nullContext || {}, null != a ? a.xThree : a, { name: "if", hash: {}, fn: t.program(7, e, 0), inverse: t.program(9, e, 0), data: e })) ? i : "";
    }, 7: function _(t, a, n, l, e) {
      return '\t\tclass="uk-width-1-1"\r\n\t\tdata-expand="3"\r\n';
    }, 9: function _(t, a, n, l, e) {
      return '\t\tdata-expand="0"\r\n\t';
    }, 11: function _(t, a, n, l, e) {
      return '\t\tdata-min="true"\r\n';
    }, 13: function _(t, a, n, l, e) {
      return '\t\tdata-min="false"\r\n';
    }, 15: function _(t, a, n, l, e) {
      return '\t\t\t\t\t\t\t\t<li data-resize><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-menu data-action="0"><i uk-icon="icon: arrow-down; ratio: 0.8;"></i> Max</button></li>\r\n';
    }, 17: function _(t, a, n, l, e) {
      return '\t\t\t\t\t\t\t\t<li data-resize><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-menu data-action="1"><i uk-icon="icon: arrow-up; ratio: 0.8;"></i> Min</button></li>\r\n';
    }, 19: function _(t, a, n, l, e) {
      return "map-panel";
    }, 21: function _(t, a, n, l, e) {
      return 'style="display:none;"';
    }, compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i,
          r,
          o = null != a ? a : t.nullContext || {},
          s = n.helperMissing,
          u = t.escapeExpression;return '<div\r\n\tdata-id="' + u((r = null != (r = n.id || (null != a ? a.id : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "id", hash: {}, data: e }) : r)) + '"\r\n' + (null != (i = n.if.call(o, null != a ? a.xOne : a, { name: "if", hash: {}, fn: t.program(1, e, 0), inverse: t.program(3, e, 0), data: e })) ? i : "") + "\t\r\n" + (null != (i = n.if.call(o, null != a ? a.min : a, { name: "if", hash: {}, fn: t.program(11, e, 0), inverse: t.program(13, e, 0), data: e })) ? i : "") + '\t>\r\n\t\r\n\t<div class="panel uk-card uk-card-default" data-el="panel">\r\n\t\t<div class="uk-card-header">\r\n\t\t\t<div class="uk-float-left">\r\n\t\t\t\t<span class="uk-card-title uk-text-muted uk-text-small uk-text-bold">\r\n\t\t\t\t\t<i class="uk-sortable-handle" uk-icon="icon: move; ratio: 1"></i> <span data-el="title">' + u((r = null != (r = n.title || (null != a ? a.title : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "title", hash: {}, data: e }) : r)) + '</span>\r\n\t\t\t\t\t<span class="uk-margin-small-left" data-el="spinnerParent">&nbsp;</span>\r\n\t\t\t\t</span>\r\n\t\t\t</div>\r\n\t\t\t<span class="uk-text-small uk-text-meta" data-el="rangeTitle">' + u((r = null != (r = n.rangeTitle || (null != a ? a.rangeTitle : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "rangeTitle", hash: {}, data: e }) : r)) + '</span>\r\n\t\t\t<div class="uk-float-right">\r\n\t\t\t\t\x3c!-- <ul class="uk-iconnav">\r\n\t\t\t\t\t\t<li><a uk-icon="icon: plus-circle" title="Maximize" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: minus-circle" title="Minimize" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: shrink" title="Shrink" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: expand" title="Expand" uk-tooltip></a></li>\r\n\t\t\t\t</ul> --\x3e\r\n\t\t\t\t\r\n\t\t\t\t<div class="uk-inline">\r\n\t\t\t\t\t<button class="dropdown uk-button uk-button-default uk-button-small" type="button" data-el="menuBtn">\r\n\t\t\t\t\t\t<span uk-icon="icon: menu; ratio: 1"></span>\r\n\t\t\t\t\t</button>\r\n\t\t\t\t\t<div uk-dropdown="delay-hide: 10;">\r\n\t\t\t\t\t\t<ul class="uk-list uk-text-left" data-el="menus">\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="expand"><i uk-icon="icon: expand; ratio: 0.8;"></i> Expand</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="shrink"><i uk-icon="icon: shrink; ratio: 0.8;"></i> Shrink</button></li>\r\n' + (null != (i = n.if.call(o, null != a ? a.min : a, { name: "if", hash: {}, fn: t.program(15, e, 0), inverse: t.program(17, e, 0), data: e })) ? i : "") + '\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="edit"><i uk-icon="icon: file-edit; ratio: 0.8;"></i> Edit</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="refresh"><i uk-icon="icon: refresh; ratio: 0.8;"></i> Refresh</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="remove"><i uk-icon="icon: close; ratio: 0.8;"></i> Delete</button></li>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class="uk-card-body ' + (null != (i = n.if.call(o, null != a ? a.map : a, { name: "if", hash: {}, fn: t.program(19, e, 0), inverse: t.noop, data: e })) ? i : "") + '" data-el="body" ' + (null != (i = n.if.call(o, null != a ? a.min : a, { name: "if", hash: {}, fn: t.program(21, e, 0), inverse: t.noop, data: e })) ? i : "") + '>\r\n\t\t\t<div data-el="container"></div>\r\n\t\t</div>\r\n\t</div>\r\n</div>';
    }, useData: !0 }), a["widget/spinner"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<i class="fa fa-refresh fa-lg fa-fw fa-spin"></i>';
    }, useData: !0 }), a["widget/statTable"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i,
          r = null != a ? a : t.nullContext || {},
          o = n.helperMissing,
          s = "function",
          u = t.escapeExpression;return '<div class="uk-overflow-auto uk-padding-small stat-table">\r\n\t<table class="uk-table uk-table-divider uk-table-hover uk-table-small uk-table-striped">\r\n\t\t<caption class="uk-text-center uk-margin-small-bottom">' + u((i = null != (i = n.title || (null != a ? a.title : a)) ? i : o, (typeof i === "undefined" ? "undefined" : _typeof(i)) === s ? i.call(r, { name: "title", hash: {}, data: e }) : i)) + '</caption>\x3c!-- uk-text-bold --\x3e\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Logical Links</td>\r\n\t\t\t<td><img src="images/links.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_link_count"></td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Links with SLA Violation</th>\r\n\t\t\t<td><img src="images/sla_violation.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_violation"></td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Links with <i class="uk-text-primary">packet_loss_ne</i> Violation</th>\r\n\t\t\t<td><img src="images/packet_loss.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_packet_losss_ne_violation"></td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Links with <i class="uk-text-primary">two_way_delay_max</i> Violation</th>\r\n\t\t\t<td><img src="images/two_way_delay.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_two_way_delay_max_violation"></td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<th class="uk-text-middle">Links with <i class="uk-text-primary">two_way_dv_max</i> Violation</th>\r\n\t\t\t<td><img src="images/two_way_dv.png" width="40" height="40" /></td>\r\n\t\t\t<td class="uk-text-middle uk-text-bold" data-el="total_two_way_dv_max_violation"></td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>\r\n\x3c!-- <td><img src="images/viol.png" width="40" height="40" /></td> --\x3e\r\n\x3c!--\r\n\t<tr>\r\n\t\t<th class="uk-text-capitalize">Logical Links</th>\r\n\t\t<th class="uk-text-capitalize">Links with SLA Violation</th>\r\n\t\t<th class="uk-text-capitalize">Links with packet_loss_ne Violation</th>\r\n\t\t<th class="uk-text-capitalize">Links with two_way_delay_max Violation</th>\r\n\t\t<th class="uk-text-capitalize">Links with two_way_dv_max Violation</th>\r\n\t</tr>\r\n\t<tr>\r\n\t\t<td>' + u((i = null != (i = n.total_link_count || (null != a ? a.total_link_count : a)) ? i : o, (typeof i === "undefined" ? "undefined" : _typeof(i)) === s ? i.call(r, { name: "total_link_count", hash: {}, data: e }) : i)) + "</td>\r\n\t\t<td>" + u((i = null != (i = n.total_violation || (null != a ? a.total_violation : a)) ? i : o, (typeof i === "undefined" ? "undefined" : _typeof(i)) === s ? i.call(r, { name: "total_violation", hash: {}, data: e }) : i)) + "</td>\r\n\t\t<td>" + u((i = null != (i = n.total_packet_losss_ne_violation || (null != a ? a.total_packet_losss_ne_violation : a)) ? i : o, (typeof i === "undefined" ? "undefined" : _typeof(i)) === s ? i.call(r, { name: "total_packet_losss_ne_violation", hash: {}, data: e }) : i)) + "</td>\r\n\t\t<td>" + u((i = null != (i = n.total_two_way_delay_max_violation || (null != a ? a.total_two_way_delay_max_violation : a)) ? i : o, (typeof i === "undefined" ? "undefined" : _typeof(i)) === s ? i.call(r, { name: "total_two_way_delay_max_violation", hash: {}, data: e }) : i)) + "</td>\r\n\t\t<td>" + u((i = null != (i = n.total_two_way_dv_max_violation || (null != a ? a.total_two_way_dv_max_violation : a)) ? i : o, (typeof i === "undefined" ? "undefined" : _typeof(i)) === s ? i.call(r, { name: "total_two_way_dv_max_violation", hash: {}, data: e }) : i)) + "</td>\r\n\t</tr>\r\n--\x3e";
    }, useData: !0 }), a["wizard/wiz2/sensorLoadBtn"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<a class="uk-margin-small-right" data-retry><i class="fa fa-refresh"></i></a>';
    }, useData: !0 }), a["wizard/wiz2/sensorLoadDanger"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<i class="fa fa-exclamation-circle fa-fw red-text" title="Could not fetch sensor list, Try again manually."></i>';
    }, useData: !0 }), a["wizard/wiz2/sensorRow"] = t({ 1: function _(t, a, n, l, e) {
      var i = t.lambda,
          r = t.escapeExpression;return '\t\t\t\t<option value="' + r(i(null != a ? a.name : a, a)) + '">' + r(i(null != a ? a.name : a, a)) + "</option>\r\n";
    }, compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i,
          r,
          o = null != a ? a : t.nullContext || {},
          s = n.helperMissing,
          u = t.escapeExpression;return '<tr data-id="' + u((r = null != (r = n.id || (null != a ? a.id : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "id", hash: {}, data: e }) : r)) + '">\r\n\t<td title="' + u((r = null != (r = n.name || (null != a ? a.name : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "name", hash: {}, data: e }) : r)) + '">' + u((r = null != (r = n.name || (null != a ? a.name : a)) ? r : s, "function" == typeof r ? r.call(o, { name: "name", hash: {}, data: e }) : r)) + '</td>\r\n\t<td>\r\n\t\t<select class="uk-select uk-form-small" data-el="select" data-els="toDisable">\r\n' + (null != (i = n.each.call(o, null != a ? a.units : a, { name: "each", hash: {}, fn: t.program(1, e, 0), inverse: t.noop, data: e })) ? i : "") + '\t\t</select>\r\n\t</td>\r\n\t<td>\r\n\t\t<input type="text" data-el="colorpick" />\r\n\t</td>\r\n\t<td>\r\n\t\t<button type="button" class="uk-button uk-button-danger uk-button-small small-btn" data-el="remove" data-els="toDisable">\r\n\t\t\t<span uk-icon="icon: close; ratio: 0.7" class="uk-icon"></span>\r\n\t\t</button>\r\n\t</td>\r\n</tr>';
    }, useData: !0 }), a["wizard/wiz2/smallSpinner"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<i class="fa fa-refresh fa-fw fa-spin"></i>';
    }, useData: !0 }), a["wizard/wiz3/groupOpt"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i,
          r = null != a ? a : t.nullContext || {},
          o = n.helperMissing,
          s = t.escapeExpression;return '<option value="' + s((i = null != (i = n.value || (null != a ? a.value : a)) ? i : o, "function" == typeof i ? i.call(r, { name: "value", hash: {}, data: e }) : i)) + '">' + s((i = null != (i = n.name || (null != a ? a.name : a)) ? i : o, "function" == typeof i ? i.call(r, { name: "name", hash: {}, data: e }) : i)) + "</option>";
    }, useData: !0 }), a["wizard/wiz3/groupOptBtn"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<a class="uk-margin-small-right" data-retry><i class="fa fa-refresh"></i></a>';
    }, useData: !0 }), a["wizard/wiz3/groupOptDanger"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<i class="fa fa-exclamation-circle fa-fw red-text" title="Could not fetch the groups, Try again manually."></i>';
    }, useData: !0 }), a["wizard/wiz3/smallSpinner"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<i class="fa fa-refresh fa-fw fa-spin"></i>';
    }, useData: !0 }), a["wizard/wiz4/danger"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<div class="uk-alert-danger" uk-alert>\r\n\t<p>\r\n\t\t<i class="fa fa-exclamation-circle fa-fw red-text"></i>\r\n\t\tCould not fetch the groups. Try again manually:\r\n\t\t<a class="uk-margin-small-left retry-btn" data-retry><i class="fa fa-refresh"></i></a>\r\n\t</p>\r\n</div>';
    }, useData: !0 }), a["wizard/wiz4/deviceRow"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i,
          r = null != a ? a : t.nullContext || {},
          o = n.helperMissing,
          s = t.escapeExpression;return '<tr data-id="' + s((i = null != (i = n.id || (null != a ? a.id : a)) ? i : o, "function" == typeof i ? i.call(r, { name: "id", hash: {}, data: e }) : i)) + '">\r\n\t<td title="' + s((i = null != (i = n.name || (null != a ? a.name : a)) ? i : o, "function" == typeof i ? i.call(r, { name: "name", hash: {}, data: e }) : i)) + '">' + s((i = null != (i = n.name || (null != a ? a.name : a)) ? i : o, "function" == typeof i ? i.call(r, { name: "name", hash: {}, data: e }) : i)) + '</td>\r\n\t<td>\r\n\t\t<button type="button" class="uk-button uk-button-danger uk-button-small small-btn" data-el="remove" data-els="toDisable">\r\n\t\t\t<span uk-icon="icon: close; ratio: 0.7" class="uk-icon"></span>\r\n\t\t</button>\r\n\t</td>\r\n</tr>';
    }, useData: !0 }), a["wizard/wiz4/formRow"] = t({ 1: function _(t, a, n, l, e) {
      var i = t.lambda,
          r = t.escapeExpression;return '<div class="uk-margin-small">\r\n\t<label><input class="uk-checkbox" type="checkbox" name="' + r(i(null != a ? a.name : a, a)) + '" value="' + r(i(null != a ? a.id : a, a)) + '" /> ' + r(i(null != a ? a.name : a, a)) + "</label>\r\n</div>\r\n";
    }, compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      var i;return null != (i = n.each.call(null != a ? a : t.nullContext || {}, null != a ? a.groups : a, { name: "each", hash: {}, fn: t.program(1, e, 0), inverse: t.noop, data: e })) ? i : "";
    }, useData: !0 }), a["wizard/wiz4/loading"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, a, n, l, e) {
      return '<div class="uk-alert-primary" uk-alert>\r\n\t<p><i class="fa fa-refresh fa-fw fa-spin"></i> Fetching Group List...</p>\r\n</div>';
    }, useData: !0 });
}();
//# sourceMappingURL=templates.js.map