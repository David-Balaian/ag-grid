"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ag_charts_community_1 = require("ag-charts-community");
var cartesianChartProxy_1 = require("./cartesianChartProxy");
var LineChartProxy = /** @class */ (function (_super) {
    __extends(LineChartProxy, _super);
    function LineChartProxy(params) {
        var _this = _super.call(this, params) || this;
        _this.initChartOptions();
        _this.recreateChart();
        return _this;
    }
    LineChartProxy.prototype.createChart = function (options) {
        var _a = this.chartProxyParams, grouping = _a.grouping, parentElement = _a.parentElement;
        options = options || this.chartOptions;
        var agChartOptions = options;
        agChartOptions.autoSize = true;
        var xAxisType = options.xAxis.type ? options.xAxis.type : 'category';
        if (grouping) {
            agChartOptions.type = 'groupedCategory';
        }
        agChartOptions.axes = [__assign({ type: grouping ? 'groupedCategory' : xAxisType, position: 'bottom' }, this.getXAxisDefaults(xAxisType, options)), __assign({ type: 'number', position: 'left' }, options.yAxis)];
        return ag_charts_community_1.AgChart.create(agChartOptions, parentElement);
    };
    LineChartProxy.prototype.update = function (params) {
        var _this = this;
        this.chartProxyParams.grouping = params.grouping;
        if (params.fields.length === 0) {
            this.chart.removeAllSeries();
            return;
        }
        var axisType = this.isTimeAxis(params) ? 'time' : 'category';
        this.updateAxes(axisType);
        var chart = this.chart;
        var fieldIds = params.fields.map(function (f) { return f.colId; });
        var _a = this.getPalette(), fills = _a.fills, strokes = _a.strokes;
        var data = this.transformData(params.data, params.category.id);
        var existingSeriesById = chart.series.reduceRight(function (map, series, i) {
            var id = series.yKey;
            if (fieldIds.indexOf(id) === i) {
                map.set(id, series);
            }
            else {
                chart.removeSeries(series);
            }
            return map;
        }, new Map());
        var previousSeries = undefined;
        params.fields.forEach(function (f, index) {
            var lineSeries = existingSeriesById.get(f.colId);
            var fill = fills[index % fills.length];
            var stroke = strokes[index % strokes.length];
            if (lineSeries) {
                lineSeries.title = f.displayName;
                lineSeries.data = data;
                lineSeries.xKey = params.category.id;
                lineSeries.xName = params.category.name;
                lineSeries.yKey = f.colId;
                lineSeries.yName = f.displayName;
                lineSeries.marker.fill = fill;
                lineSeries.marker.stroke = stroke;
                lineSeries.stroke = fill; // this is deliberate, so that the line colours match the fills of other series
            }
            else {
                var seriesDefaults = _this.chartOptions.seriesDefaults;
                var marker = __assign(__assign({}, seriesDefaults.marker), { fill: fill,
                    stroke: stroke });
                if (marker.type) { // deprecated
                    marker.shape = marker.type;
                    delete marker.type;
                }
                var options = __assign(__assign({}, seriesDefaults), { type: 'line', title: f.displayName, data: data, xKey: params.category.id, xName: params.category.name, yKey: f.colId, yName: f.displayName, fill: fill, stroke: fill, fillOpacity: seriesDefaults.fill.opacity, strokeOpacity: seriesDefaults.stroke.opacity, strokeWidth: seriesDefaults.stroke.width, tooltipRenderer: seriesDefaults.tooltip && seriesDefaults.tooltip.enabled && seriesDefaults.tooltip.renderer, marker: marker });
                lineSeries = ag_charts_community_1.AgChart.createComponent(options, 'line.series');
                chart.addSeriesAfter(lineSeries, previousSeries);
            }
            previousSeries = lineSeries;
        });
        this.updateLabelRotation(params.category.id, false, axisType);
    };
    LineChartProxy.prototype.getDefaultOptionsFromTheme = function (theme) {
        var options = _super.prototype.getDefaultOptionsFromTheme.call(this, theme);
        var seriesDefaults = theme.getConfig('line.series.line');
        options.seriesDefaults = {
            tooltip: {
                enabled: seriesDefaults.tooltipEnabled,
                renderer: seriesDefaults.tooltipRenderer
            },
            fill: {
                colors: [],
                opacity: 1
            },
            stroke: {
                colors: theme.palette.strokes,
                opacity: seriesDefaults.strokeOpacity,
                width: seriesDefaults.strokeWidth
            },
            marker: {
                enabled: seriesDefaults.marker.enabled,
                shape: seriesDefaults.marker.shape,
                size: seriesDefaults.marker.size,
                strokeWidth: seriesDefaults.marker.strokeWidth
            },
            highlightStyle: seriesDefaults.highlightStyle
        };
        return options;
    };
    LineChartProxy.prototype.getDefaultOptions = function () {
        var options = this.getDefaultCartesianChartOptions();
        options.xAxis.label.rotation = 335;
        options.seriesDefaults = __assign(__assign({}, options.seriesDefaults), { stroke: __assign(__assign({}, options.seriesDefaults.stroke), { width: 3 }), marker: {
                enabled: true,
                shape: 'circle',
                size: 6,
                strokeWidth: 1,
            }, tooltip: {
                enabled: true,
            } });
        return options;
    };
    return LineChartProxy;
}(cartesianChartProxy_1.CartesianChartProxy));
exports.LineChartProxy = LineChartProxy;
//# sourceMappingURL=lineChartProxy.js.map