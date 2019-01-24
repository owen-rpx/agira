function checkin() {
    var view = {
        template: '<div>View Layer</div>'
    };
    var message = {
        template: '<div>Message Layer</div>'
    };

    var routesCfg = [{
            path: '/view',
            component: view
        },
        {
            path: '/message',
            component: message
        }
    ];
    var router = new VueRouter({
        routes: routesCfg
    });

    var app = new Vue({
        delimiters: ['${', '}'],
        router: router,
        data: {
            test: 'this is data test.',
            debug: false,
            labels_line: ['WP', 'LMi', 'LMe'],
            datasets_line: [{
                label: 'Data One',
                backgroundColor: '#f87979',
                data: [40, 39, 89]
            }]
        },
        methods: {
            get: function () {
                //发送get请求
                this.$http.get('/api/data').then(function (res) {
                    // document.write(res.body);
                    console.log(res.body);
                }, function () {
                    console.log('请求失败处理');
                });
            }
        }
    });
    app.$mount('#app');
    app.get();
}
window.onload = checkin;