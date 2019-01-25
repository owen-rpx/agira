Vue.component('dyn-line-chart', {
    props: ['labels', 'data'],
    extends: VueChartJs.Line,
    mounted() {
        this.renderChart({
            labels: this.labels,
            datasets: [{
                label: 'counts',
                backgroundColor: '#6666FF',
                data: this.data
            }]
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
                backgroundColor: '#f87979',
                data: [40, 39, 10, 40, 39, 80, 40]
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false
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
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: [65, 59, 80, 81, 56, 55, 40]
                },
                {
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [28, 48, 40, 19, 86, 27, 90]
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
            }]
        }, {
            responsive: true,
            maintainAspectRatio: false
        })
    }
});

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