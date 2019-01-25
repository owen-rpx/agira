function checkin() {
    var view = {
        props: ['isLoad', 'labels_line', 'data_line'],
        template: '#view_tmp',
        data: {
            isLoad: false,
            labels_line: [],
            data_line: []
        },
        created: function () {
            this.$http.get('/api/data').then(function (res) {
                var chart_data = res.body;
                this.labels_line = Object.keys(chart_data);
                this.data_line = Object.values(chart_data);
                this.isLoad = true;
            }, function () {
                console.log('请求失败处理');
            });
        }
    };
    var setting = {
        template: '#setting_tmp'
    };
    var no_found = {
        template: '<div>404 page</div>'
    };

    var routesCfg = [{
            path: '/view',
            component: view
        },
        {
            path: '/setting',
            component: setting
        },
        {
            path: '/no_found',
            component: no_found
        },
        {
            path: '*',
            redirect: '/no_found'
        }
    ];
    var router = new VueRouter({
        routes: routesCfg
    });

    var app = new Vue({
        delimiters: ['${', '}'],
        router: router,
        data: {
            debug: false
        }
    });
    app.$mount('#app');
}
window.onload = checkin;