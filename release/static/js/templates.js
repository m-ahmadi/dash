!function () {
  var t = Handlebars.template,
      n = Handlebars.templates = Handlebars.templates || {};n["@"] = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return "//";
    }, useData: !0 }), n.alert = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      var i;return '<div class="uk-alert-danger" uk-alert>\r\n    <a class="uk-alert-close" uk-close></a>\r\n    <p class="uk-text-bold"><i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true"></i> ' + t.escapeExpression((i = null != (i = a.message || (null != n ? n.message : n)) ? i : a.helperMissing, "function" == typeof i ? i.call(null != n ? n : {}, { name: "message", hash: {}, data: l }) : i)) + "</p>\r\n</div>";
    }, useData: !0 }), n.barChart = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return '<canvas data-el="container"></canvas>';
    }, useData: !0 }), n.btnMax = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return '<a class="uk-button uk-button-text uk-text-small uk-text-meta" data-menu data-action="0"><i uk-icon="icon: arrow-down; ratio: 0.8;"></i> Max</a>';
    }, useData: !0 }), n.btnMin = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return '<a class="uk-button uk-button-text uk-text-small uk-text-meta" data-menu data-action="1"><i uk-icon="icon: arrow-up; ratio: 0.8;"></i> Min</a>';
    }, useData: !0 }), n.graphTitle = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      var i,
          r = null != n ? n : {},
          u = a.helperMissing,
          s = t.escapeExpression;return s((i = null != (i = a.device || (null != n ? n.device : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "device", hash: {}, data: l }) : i)) + "<br />" + s((i = null != (i = a.service || (null != n ? n.service : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "service", hash: {}, data: l }) : i));
    }, useData: !0 }), n.lineChart = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return '<div data-el="container"></div>';
    }, useData: !0 }), n.loginAlert = t({ 1: function _(t, n, a, e, l) {
      return '\t<a class="uk-alert-close" uk-close></a>\r\n';
    }, 3: function _(t, n, a, e, l) {
      return "fa-refresh fa-fw fa-spin";
    }, 5: function _(t, n, a, e, l) {
      return "fa-check-circle";
    }, 7: function _(t, n, a, e, l) {
      return "fa-exclamation-triangle";
    }, compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      var i,
          r,
          u = null != n ? n : {},
          s = a.helperMissing,
          o = t.escapeExpression;return '<div class="uk-alert-' + o((r = null != (r = a.type || (null != n ? n.type : n)) ? r : s, "function" == typeof r ? r.call(u, { name: "type", hash: {}, data: l }) : r)) + '" uk-alert>\r\n' + (null != (i = a.unless.call(u, null != n ? n.noClose : n, { name: "unless", hash: {}, fn: t.program(1, l, 0), inverse: t.noop, data: l })) ? i : "") + '\t<p>\r\n\t\t<i class="\r\n\t\t\tfa\r\n\t\t\t' + (null != (i = a.if.call(u, null != n ? n.process : n, { name: "if", hash: {}, fn: t.program(3, l, 0), inverse: t.noop, data: l })) ? i : "") + "\r\n\t\t\t" + (null != (i = a.if.call(u, null != n ? n.success : n, { name: "if", hash: {}, fn: t.program(5, l, 0), inverse: t.noop, data: l })) ? i : "") + "\r\n\t\t\t" + (null != (i = a.if.call(u, null != n ? n.danger : n, { name: "if", hash: {}, fn: t.program(7, l, 0), inverse: t.noop, data: l })) ? i : "") + '\r\n\t\t\tfa-lg\r\n\t\t" aria-hidden="true">\r\n\t\t</i> ' + o((r = null != (r = a.message || (null != n ? n.message : n)) ? r : s, "function" == typeof r ? r.call(u, { name: "message", hash: {}, data: l }) : r)) + "</p>\r\n</div>";
    }, useData: !0 }), n.map = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return '<div data-el="container"></div>';
    }, useData: !0 }), n.markFail = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return '<svg class="marks" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.2 135.2">\r\n  <circle class="path circle" fill="none" stroke="#ff3939" stroke-width="12" stroke-miterlimit="10" cx="66.1" cy="66.1" r="60.1"/>\r\n  <line class="path line" fill="none" stroke="#ff3939" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"/>\r\n  <line class="path line" fill="none" stroke="#ff3939" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"/>\r\n</svg>';
    }, useData: !0 }), n.markSuccess = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return '<svg class="marks" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135.2 135.2">\r\n  <circle class="path circle" fill="none" stroke="#2de800" stroke-width="12" stroke-miterlimit="10" cx="66.1" cy="66.1" r="60.1"/>\r\n  <polyline class="path check" fill="none" stroke="#2de800" stroke-width="12" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>\r\n</svg>';
    }, useData: !0 }), n.panel = t({ 1: function _(t, n, a, e, l) {
      return '\t\tclass="uk-width-1-1@s uk-width-1-1@m uk-width-1-2@l uk-width-1-2@xl"\r\n\t\tdata-expand="1"\r\n';
    }, 3: function _(t, n, a, e, l) {
      var i;return null != (i = a.if.call(null != n ? n : {}, null != n ? n.xTwo : n, { name: "if", hash: {}, fn: t.program(4, l, 0), inverse: t.program(6, l, 0), data: l })) ? i : "";
    }, 4: function _(t, n, a, e, l) {
      return '\t\tclass="uk-width-1-1@s uk-width-1-1@m uk-width-2-3@l uk-width-3-4@xl"\r\n\t\tdata-expand="2"\r\n';
    }, 6: function _(t, n, a, e, l) {
      var i;return null != (i = a.if.call(null != n ? n : {}, null != n ? n.xThree : n, { name: "if", hash: {}, fn: t.program(7, l, 0), inverse: t.program(9, l, 0), data: l })) ? i : "";
    }, 7: function _(t, n, a, e, l) {
      return '\t\tclass="uk-width-1-1"\r\n\t\tdata-expand="3"\r\n';
    }, 9: function _(t, n, a, e, l) {
      return '\t\tdata-expand="0"\r\n\t';
    }, 11: function _(t, n, a, e, l) {
      return '\t\tdata-min="true"\r\n';
    }, 13: function _(t, n, a, e, l) {
      return '\t\tdata-min="false"\r\n';
    }, 15: function _(t, n, a, e, l) {
      return '\t\t\t\t\t\t\t\t<li data-resize><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-menu data-action="0"><i uk-icon="icon: arrow-down; ratio: 0.8;"></i> Max</button></li>\r\n';
    }, 17: function _(t, n, a, e, l) {
      return '\t\t\t\t\t\t\t\t<li data-resize><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-menu data-action="1"><i uk-icon="icon: arrow-up; ratio: 0.8;"></i> Min</button></li>\r\n';
    }, 19: function _(t, n, a, e, l) {
      return 'style="display:none;"';
    }, compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      var i,
          r,
          u = null != n ? n : {},
          s = a.helperMissing,
          o = t.escapeExpression;return '<div\r\n\tdata-id="' + o((r = null != (r = a.id || (null != n ? n.id : n)) ? r : s, "function" == typeof r ? r.call(u, { name: "id", hash: {}, data: l }) : r)) + '"\r\n' + (null != (i = a.if.call(u, null != n ? n.xOne : n, { name: "if", hash: {}, fn: t.program(1, l, 0), inverse: t.program(3, l, 0), data: l })) ? i : "") + "\t\r\n" + (null != (i = a.if.call(u, null != n ? n.min : n, { name: "if", hash: {}, fn: t.program(11, l, 0), inverse: t.program(13, l, 0), data: l })) ? i : "") + '\t>\r\n\t\r\n\t<div class="\r\n\t\t\tpanel\r\n\t\t\tuk-card\r\n\t\t\tuk-card-default"\r\n\t\tdata-el="panel"\r\n\t\t>\r\n\t\t<div class="uk-card-header">\r\n\t\t\t<div class="uk-float-left">\r\n\t\t\t\t<span class="uk-card-title uk-text-muted uk-text-small uk-text-bold">\r\n\t\t\t\t\t<i class="uk-sortable-handle" uk-icon="icon: move; ratio: 1"></i> <span data-el="title">' + o((r = null != (r = a.title || (null != n ? n.title : n)) ? r : s, "function" == typeof r ? r.call(u, { name: "title", hash: {}, data: l }) : r)) + '</span>\r\n\t\t\t\t\t<span class="uk-margin-small-left" data-el="spinnerParent">&nbsp;</span>\r\n\t\t\t\t</span>\r\n\t\t\t</div>\r\n\t\t\t<span class="uk-text-small uk-text-meta" data-el="rangeTitle">' + o((r = null != (r = a.rangeTitle || (null != n ? n.rangeTitle : n)) ? r : s, "function" == typeof r ? r.call(u, { name: "rangeTitle", hash: {}, data: l }) : r)) + '</span>\r\n\t\t\t<div class="uk-float-right">\r\n\t\t\t\t\x3c!-- <ul class="uk-iconnav">\r\n\t\t\t\t\t\t<li><a uk-icon="icon: plus-circle" title="Maximize" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: minus-circle" title="Minimize" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: shrink" title="Shrink" uk-tooltip></a></li>\r\n\t\t\t\t\t\t<li><a uk-icon="icon: expand" title="Expand" uk-tooltip></a></li>\r\n\t\t\t\t</ul> --\x3e\r\n\t\t\t\t\r\n\t\t\t\t<div class="uk-inline">\r\n\t\t\t\t\t<button class="dropdown uk-button uk-button-default uk-button-small" type="button" data-el="menuBtn">\r\n\t\t\t\t\t\t<span uk-icon="icon: menu; ratio: 1"></span>\r\n\t\t\t\t\t</button>\r\n\t\t\t\t\t<div uk-dropdown="delay-hide: 10;">\r\n\t\t\t\t\t\t<ul class="uk-list uk-text-left" data-el="menus">\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="expand"><i uk-icon="icon: expand; ratio: 0.8;"></i> Expand</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="shrink"><i uk-icon="icon: shrink; ratio: 0.8;"></i> Shrink</button></li>\r\n' + (null != (i = a.if.call(u, null != n ? n.min : n, { name: "if", hash: {}, fn: t.program(15, l, 0), inverse: t.program(17, l, 0), data: l })) ? i : "") + '\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="edit"><i uk-icon="icon: file-edit; ratio: 0.8;"></i> Edit</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="refresh"><i uk-icon="icon: refresh; ratio: 0.8;"></i> Refresh</button></li>\r\n\t\t\t\t\t\t\t<li><button type="button" class="uk-button uk-button-text uk-text-small uk-text-meta uk-text-capitalize" data-el="remove"><i uk-icon="icon: close; ratio: 0.8;"></i> Delete</button></li>\r\n\t\t\t\t\t\t\t\r\n\t\t\t\t\t\t</ul>\r\n\t\t\t\t\t</div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div class="uk-card-body" data-el="body" ' + (null != (i = a.if.call(u, null != n ? n.min : n, { name: "if", hash: {}, fn: t.program(19, l, 0), inverse: t.noop, data: l })) ? i : "") + ">\r\n\t\t\t\r\n\t\t</div>\r\n\t</div>\r\n</div>";
    }, useData: !0 }), n.procAlert = t({ 1: function _(t, n, a, e, l) {
      return "fa-info-circle";
    }, 3: function _(t, n, a, e, l) {
      return "fa-check-circle";
    }, 5: function _(t, n, a, e, l) {
      return "fa-exclamation-circle";
    }, 7: function _(t, n, a, e, l) {
      return "fa-exclamation-triangle";
    }, compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      var i,
          r,
          u = null != n ? n : {},
          s = a.helperMissing,
          o = t.escapeExpression;return '<div class="uk-alert-' + o((r = null != (r = a.type || (null != n ? n.type : n)) ? r : s, "function" == typeof r ? r.call(u, { name: "type", hash: {}, data: l }) : r)) + '" uk-alert>\r\n    <a class="uk-alert-close" uk-close></a>\r\n    <p class="uk-text-bold">\r\n\t\t\t<i class="\r\n\t\t\t\tfa\r\n\t\t\t\t' + (null != (i = a.if.call(u, null != n ? n.primary : n, { name: "if", hash: {}, fn: t.program(1, l, 0), inverse: t.noop, data: l })) ? i : "") + "\r\n\t\t\t\t" + (null != (i = a.if.call(u, null != n ? n.success : n, { name: "if", hash: {}, fn: t.program(3, l, 0), inverse: t.noop, data: l })) ? i : "") + "\r\n\t\t\t\t" + (null != (i = a.if.call(u, null != n ? n.warning : n, { name: "if", hash: {}, fn: t.program(5, l, 0), inverse: t.noop, data: l })) ? i : "") + "\r\n\t\t\t\t" + (null != (i = a.if.call(u, null != n ? n.danger : n, { name: "if", hash: {}, fn: t.program(7, l, 0), inverse: t.noop, data: l })) ? i : "") + '\r\n\t\t\t\tfa-lg\r\n\t\t\t\t" aria-hidden="true">\r\n\t\t\t</i> ' + o((r = null != (r = a.message || (null != n ? n.message : n)) ? r : s, "function" == typeof r ? r.call(u, { name: "message", hash: {}, data: l }) : r)) + "</p>\r\n</div>";
    }, useData: !0 }), n.sensorUnit = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      var i,
          r = null != n ? n : {},
          u = a.helperMissing,
          s = t.escapeExpression;return '<tr data-sensor-id="' + s((i = null != (i = a.id || (null != n ? n.id : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "id", hash: {}, data: l }) : i)) + '" data-sensor-name="' + s((i = null != (i = a.name || (null != n ? n.name : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "name", hash: {}, data: l }) : i)) + '">\r\n\t<td title="' + s((i = null != (i = a.name || (null != n ? n.name : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "name", hash: {}, data: l }) : i)) + '">' + s((i = null != (i = a.name || (null != n ? n.name : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "name", hash: {}, data: l }) : i)) + '</td>\r\n\t<td>\r\n\t\t<select class="uk-select uk-form-small" data-select data-todisable>\r\n\t\t\t<option value="Microsecond">Microsecond</option>\r\n\t\t\t<option value="Millisecond">Millisecond</option>\r\n\t\t\t<option value="Second">Second</option>\r\n\t\t</select>\r\n\t</td>\r\n\t<td>\r\n\t\t<input type="text" data-colorpick />\r\n\t</td>\r\n\t<td>\r\n\t\t<button type="button" class="uk-button uk-button-danger uk-button-small small-btn" data-delete-sensor data-todisable>\r\n\t\t\t<span uk-icon="icon: close; ratio: 0.7" class="uk-icon"></span>\r\n\t\t</button>\r\n\t</td>\r\n</tr>';
    }, useData: !0 }), n.spinner = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      return '<i class="fa fa-refresh fa-lg fa-fw fa-spin"></i>';
    }, useData: !0 }), n.table = t({ compiler: [7, ">= 4.0.0"], main: function main(t, n, a, e, l) {
      var i,
          r = null != n ? n : {},
          u = a.helperMissing,
          s = t.escapeExpression;return '<div class="uk-overflow-auto">\r\n\t<table class="uk-table uk-table-divider uk-table-hover uk-table-small uk-table-striped">\r\n\t\t<tr>\r\n\t\t\t<th>SLA</th>\r\n\t\t\t<th>KPI Name</th>\r\n\t\t\t<th>Severity</th>\r\n\t\t\t<th>Value</th>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td>' + s((i = null != (i = a.sla || (null != n ? n.sla : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "sla", hash: {}, data: l }) : i)) + "</td>\r\n\t\t\t<td>" + s((i = null != (i = a.kpiName || (null != n ? n.kpiName : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "kpiName", hash: {}, data: l }) : i)) + "</td>\r\n\t\t\t<td>" + s((i = null != (i = a.severity || (null != n ? n.severity : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "severity", hash: {}, data: l }) : i)) + "</td>\r\n\t\t\t<td>" + s((i = null != (i = a.value || (null != n ? n.value : n)) ? i : u, "function" == typeof i ? i.call(r, { name: "value", hash: {}, data: l }) : i)) + "</td>\r\n\t\t</tr>\r\n\t</table>\r\n</div>";
    }, useData: !0 });
}();
//# sourceMappingURL=templates.js.map