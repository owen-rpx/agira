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
    router
});
app.$mount('#app');