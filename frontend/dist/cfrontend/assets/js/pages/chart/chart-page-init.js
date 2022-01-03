const barrasChart = () => {

    $(function() {
        // we use an inline data source in the example, usually data would
        // be fetched from a server
        // ==============================================================
        // Real Time Visits
        // ==============================================================
        var data = [5, 10, 15, 20, 15, 30, 40],
            totalPoints = 100;

        function getRandomData() {
            if (data.length > 0) data = data.slice(1);
            // Do a random walk
            while (data.length < totalPoints) {
                var prev = data.length > 0 ? data[data.length - 1] : 10,
                    y = prev + Math.random() * 10 - 5;
                if (y < 0) {
                    y = 0;
                } else if (y > 100) {
                    y = 100;
                }
                data.push(y);
            }
            // Zip the generated y values with the x values
            var res = [];
            for (var i = 0; i < data.length; ++i) {
                res.push([i, data[i]])
            }
            return res;
        }
        // Set up the control widget
        var updateInterval = 1000;
        $("#updateInterval").val(updateInterval).change(function() {
            var v = $(this).val();
            if (v && !isNaN(+v)) {
                updateInterval = +v;
                if (updateInterval < 1) {
                    updateInterval = 1;
                } else if (updateInterval > 1000) {
                    updateInterval = 1000;
                }
                $(this).val("" + updateInterval);
            }
        });
        var plot = $.plot("#real-time", [getRandomData()], {
            series: {
                shadowSize: 1, // Drawing is faster without shadows
                lines: { fill: true, fillColor: 'transparent' },
            },
            yaxis: {
                min: 0,
                max: 100,
                show: true
            },
            xaxis: {
                show: false
            },
            colors: ["#488c13"],
            grid: {
                color: "#AFAFAF",
                hoverable: true,
                borderWidth: 0,
                backgroundColor: 'transparent'
            },
            tooltip: true,
            tooltipOpts: {
                content: "Visits: %x",
                defaultTheme: false
            }
        });
        window.onresize = function(event) {
            $.plot($("#real-time"), [getRandomData()]);
        }

        function update() {
            plot.setData([getRandomData()]);
            // Since the axes don't change, we don't need to call plot.setupGrid()
            plot.draw();
            setTimeout(update, updateInterval);
        }
        update();

        console.log("document ready");
        var offset = 0;
        plot1();

        function plot1() {
            var usus = [],
                clien = [];

            //AQUI HAY DARLE LOS VALORES A FISIOTERAPEUTAS Y USUARIOS
            //ESTOS VALORES DEBEN LLEGAR DE LA BASE DE DATOS

            for (var i = 0; i < 12; i += 0.2) {
                usus.push([i, Math.sin(i + offset)]);
                clien.push([i, Math.cos(i + offset)]);
                // usus.push([i, i + 0.1]);
                // clien.push([i, i - 0.1]);
            }
            var options = {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                grid: {
                    hoverable: true //IMPORTANT! this is needed for tooltip to work
                },
                yaxis: {
                    min: -1.2,
                    max: 1.2
                },
                colors: ["#ee7951", "#4fb9f0"],
                grid: {
                    color: "#AFAFAF",
                    hoverable: true,
                    borderWidth: 0,
                    backgroundColor: '#FFF'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "'%s' of %x.1 is %y.4",
                    shifts: {
                        x: -60,
                        y: 25
                    }
                }
            };
            var plotObj = $.plot($("#flot-line-chart"), [{
                data: usus,
                label: "Fisioterapeutas",
            }, {
                data: clien,
                label: "Clientes"
            }], options);
        }

    });
};

const linesChart = () => {
    $(function() {
        // === Prepare the chart data ===/
        var sin = [],
            cos = [];
        for (var i = 0; i < 14; i += 0.5) {
            sin.push([i, Math.sin(i)]);
            cos.push([i, Math.cos(i)]);
        }
        // === Prepare the chart data ===/
        var sin = [],
            cos = [];
        for (var i = 0; i < 14; i += 0.5) {
            sin.push([i, Math.sin(i)]);
            cos.push([i, Math.cos(i)]);
        }

        // === Make chart === //
        var plot = $.plot(
            $(".chart"), [
                { data: sin, label: "sin(x)", color: "#ee7951" },
                { data: cos, label: "cos(x)", color: "#4fb9f0" },
            ], {
                series: {
                    lines: { show: true },
                    points: { show: true },
                },
                grid: { hoverable: true, clickable: true },
                yaxis: { min: -1.6, max: 1.6 },
            }
        );

        // === Point hover in chart === //
        var previousPoint = null;
        $(".chart").bind("plothover", function(event, pos, item) {
            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").fadeOut(200, function() {
                        $(this).remove();
                    });
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    maruti.flot_tooltip(
                        item.pageX,
                        item.pageY,
                        item.series.label + " of " + x + " = " + y
                    );
                }
            } else {
                $("#tooltip").fadeOut(200, function() {
                    $(this).remove();
                });
                previousPoint = null;
            }
        });

        var data = [];
        var series = Math.floor(Math.random() * 10) + 1;
        for (var i = 0; i < series; i++) {
            data[i] = {
                label: "Series" + (i + 1),
                data: Math.floor(Math.random() * 100) + 1,
            };
        }

        var pie = $.plot($(".pie"), data, {
            series: {
                pie: {
                    show: true,
                    radius: 3 / 4,
                    label: {
                        show: true,
                        radius: 3 / 4,
                        formatter: function(label, series) {
                            return (
                                '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">' +
                                label +
                                "<br/>" +
                                Math.round(series.percent) +
                                "%</div>"
                            );
                        },
                        background: {
                            opacity: 0.5,
                            color: "#000",
                        },
                    },
                    innerRadius: 0.2,
                },
                legend: {
                    show: false,
                },
            },
        });
        var d1 = [];

        //Este for da valores random a la gráfica
        for (var i = 0; i <= 8; i += 1) d1.push([i, parseInt(Math.random() * 30)]);

        var data = new Array();
        data.push({
            data: d1,
            bars: {
                show: true, //Esto a false quita las barras y se convierte en una linea continua
                barWidth: 0.4, //Grosor de las barras
                order: 1, //Esto no se que hace la verdad
            },
        });

        //Display graph
        var bar = $.plot($(".bars"), data, {
            legend: true,
            color: "#2b2b2b",
        });
    });
};

maruti = {
    // === Tooltip for flot charts === //
    flot_tooltip: function(x, y, contents) {
        $('<div id="tooltip">' + contents + "</div>")
            .css({
                top: y + 5,
                left: x + 5,
            })
            .appendTo("body")
            .fadeIn(200);
    },
};
