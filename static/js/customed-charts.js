Vue.component('alm-line-chart', {
    props: ['labels', 'datasets'],
    extends: VueChartJs.Line,
    mixins: [VueChartJs.mixins.reactiveProp],
    mounted() {
        this.renderChart({
            labels: this.labels,
            datasets: this.datasets
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});

Vue.component('alm-bar-chart', {
    props: ['labels', 'datasets'],
    extends: VueChartJs.Bar,
    mixins: [VueChartJs.mixins.reactiveProp],
    mounted() {
        this.renderChart({
            labels: this.labels,
            datasets: this.datasets
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});

Vue.component('alm-horizontal-bar-chart', {
    props: ['labels', 'datasets'],
    extends: VueChartJs.HorizontalBar,
    mixins: [VueChartJs.mixins.reactiveProp],
    mounted() {
        this.renderChart({
            labels: this.labels,
            datasets: this.datasets
        }, {
            responsive: true,
            maintainAspectRatio: false,
            // scales: {
            //     xAxes: [{
            //         stacked: true
            //     }],
            //     yAxes: [{
            //         stacked: false
            //     }]
            // }
        })
    }
});

Vue.component('dyn-bar-chart2', {
    extends: VueChartJs.Bar,
    props: ['labels', 'data'],
    mounted() {
        this.renderChart({
            labels: this.labels,
            datasets: [{
                    label: "My First dataset",
                    backgroundColor: '#60acfc',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    backgroundColor: "#5bc49f",
                    data: [28, 48, 40, 19, 86, 27, 90]
                },
                {
                    label: "My Three dataset",
                    backgroundColor: "#feb64d",
                    data: [8, 41, 42, 0, 86, 7, 100]
                }
            ]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});

Vue.component('line-chart', {
    extends: VueChartJs.Line,
    mounted() {
        this.renderChart({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                    label: 'Data One',
                    // backgroundColor: "#E9EEF3", //背景填充色
                    // backgroundColor: "#60acfc", //背景填充色
                    borderColor: "#60acfc", //路径颜色
                    pointBackgroundColor: "#60acfc", //数据点颜色
                    pointBorderColor: "#fff", //数据点边框颜色
                    data: [40, 39, 10, 40, 39, 80, 40]
                },
                {
                    label: 'Data Two',
                    // backgroundColor: "#E9EEF3", //背景填充色
                    // backgroundColor: "#5bc49f", //背景填充色
                    borderColor: "#5bc49f", //路径颜色
                    pointBackgroundColor: "#5bc49f", //数据点颜色
                    pointBorderColor: "#fff", //数据点边框颜色
                    data: [10, 20, 40, 60, 9, 19, 30]
                }
            ]
        }, {
            responsive: true,
            maintainAspectRatio: false,
            // scales: {
            //     xAxes: [{
            //         gridLines: {
            //             display: false
            //         }
            //     }],
            //     yAxes: [{
            //         gridLines: {
            //             display: false
            //         }
            //     }]
            // }
        })
    }
});


Vue.component('bar-chart', {
    extends: VueChartJs.Bar,
    mounted() {
        this.renderChart({
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                    label: "My First dataset",
                    backgroundColor: '#60acfc',
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    backgroundColor: "#5bc49f",
                    data: [28, 48, 40, 19, 86, 27, 90]
                },
                {
                    label: "My Three dataset",
                    backgroundColor: "#feb64d",
                    data: [8, 41, 42, 0, 86, 7, 100]
                }
            ]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});

Vue.component('pie-chart', {
    extends: VueChartJs.Pie,
    mounted() {
        this.renderChart({
            labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
            datasets: [{
                    backgroundColor: [
                        '#41B883',
                        '#E46651',
                        '#00D8FF',
                        '#DD1B16'
                    ],
                    data: [40, 20, 80, 10]
                },
                {
                    backgroundColor: [
                        '#41B883',
                        '#E46651',
                        '#00D8FF',
                        '#DD1B16'
                    ],
                    data: [10, 80, 30, 90]
                },
                {
                    backgroundColor: [
                        '#41B883',
                        '#E46651',
                        '#00D8FF',
                        '#DD1B16'
                    ],
                    data: [90, 20, 60, 10]
                }
            ]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});


/*
Vue.component('polar-area-chart', {
    extends: VueChartJs.PolarArea,
    mounted() {
        this.renderChart({
            labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
            datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgba(179,181,198,0.2)',
                    pointBackgroundColor: 'rgba(179,181,198,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(179,181,198,1)',
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});

Vue.component('bubble-chart', {
    extends: VueChartJs.Bubble,
    mounted() {
        this.renderChart({
            datasets: [{
                    label: 'Data One',
                    backgroundColor: '#f87979',
                    data: [{
                            x: 20,
                            y: 25,
                            r: 5
                        },
                        {
                            x: 40,
                            y: 10,
                            r: 10
                        },
                        {
                            x: 30,
                            y: 22,
                            r: 30
                        }
                    ]
                },
                {
                    label: 'Data Two',
                    backgroundColor: '#7C8CF8',
                    data: [{
                            x: 10,
                            y: 30,
                            r: 15
                        },
                        {
                            x: 20,
                            y: 20,
                            r: 10
                        },
                        {
                            x: 15,
                            y: 8,
                            r: 30
                        }
                    ]
                }
            ]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});
Vue.component('radar-chart', {
    extends: VueChartJs.Radar,
    mounted() {
        this.renderChart({
            labels: ["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],
            datasets: [{
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 90, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 96, 27, 100]
                }
            ]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});
Vue.component('horizontal-bar-chart', {
    extends: VueChartJs.HorizontalBar,
    mounted() {
        this.renderChart({
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: 'Data One',
                backgroundColor: '#f87979',
                data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});
*/