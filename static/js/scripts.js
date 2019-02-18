 function checkin() {
     var view = {
         //  props: ['isLoad', 'labels_line', 'data_line'],
         template: '#view_tmp',
         data: function () {
             return {
                 formInline: {
                     projects: ['ALLI', 'ALLE', 'ALWP'],
                     daterange: [new Date('2018-01-01'), new Date('2018-12-31')]
                 },
                 pickerOptions: {
                     shortcuts: [{
                         text: 'Last week',
                         onClick(picker) {
                             const end = new Date();
                             const start = new Date();
                             start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                             picker.$emit('pick', [start, end]);
                         }
                     }, {
                         text: 'Last month',
                         onClick(picker) {
                             const end = new Date();
                             const start = new Date();
                             start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                             picker.$emit('pick', [start, end]);
                         }
                     }, {
                         text: 'Last three months',
                         onClick(picker) {
                             const end = new Date();
                             const start = new Date();
                             start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                             picker.$emit('pick', [start, end]);
                         }
                     }, {
                         text: 'Last year',
                         onClick(picker) {
                             const end = new Date();
                             const start = new Date();
                             start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                             picker.$emit('pick', [start, end]);
                         }
                     }, {
                         text: 'Last three years',
                         onClick(picker) {
                             const end = new Date();
                             const start = new Date();
                             start.setTime(start.getTime() - 3600 * 1000 * 24 * 1095);
                             picker.$emit('pick', [start, end]);
                         }
                     }]
                 },
                 filters: Object.create(null),
                 chart_sapn: 22,
                 BKG: ['#60acfc', '#5bc49f', '#feb64d'],
                 isLoad: false,
                 isCustomerTicketLoad: false,
                 isClicked: false,

                 labels_status: [],
                 datasets_status: [],
                 //  labels_h_status: [],
                 //  datasets_h_status: [],
                 //  labels_status_line: [],
                 //  datasets_status_line: [],
                 labels_issue: [],
                 datasets_issue: [],
                 labels_priority: [],
                 datasets_priority: [],
                 labels_customer: [],
                 datasets_customer: [],
                 labels_component: [],
                 datasets_component: [],
                 labels_discover: [],
                 datasets_discover: [],
                 labels_version: [],
                 datasets_version: [],
                 tickets_ref: Object.create(null)
             }
         },
         created: function () {
             this.$nextTick(function () {
                 this.filters.projects = ['ALLI', 'ALLE', 'ALWP'].join(',');
                 this.filters.daterange = ['2018-01-01', '2018-12-31'].join(',');
                 this.drawCharts();
             });
         },
         methods: {
             onSubmit() {
                 var daterange = this.formInline.daterange;
                 var projects = this.formInline.projects;
                 var filters = null;
                 if (daterange.length == 2 && projects.length >= 1) {
                     filters = Object.create(null);
                     filters.projects = projects.join(',');
                     var dr = daterange.map(function (v) {
                         var fmt = (s) => ('' + s).length == 1 ? ('0' + s) : ('' + s);
                         var y = v.getFullYear();
                         var m = fmt(v.getMonth() * 1 + 1);
                         var d = fmt(v.getDate());
                         return y + '-' + m + '-' + d;
                     });
                     filters.daterange = dr.join(',');
                 } else {
                     filters.projects = ['ALLI', 'ALLE', 'ALWP'].join(',');
                     filters.daterange = ['2018-01-01', '2018-12-31'].join(',');
                 }
                 this.clean_var();
                 this.isLoad = false;
                 this.filters = filters;
                 this.drawCharts(filters);
             },
             clean_var() {
                 this.isCustomerTicketLoad = false;
                 this.isClicked = false;
                 this.tickets_ref = Object.create(null);
             },
             drawCharts(filters) {
                 var url = '/api/data';
                 if (filters) {
                     url += '/' + filters.projects;
                     url += '/' + filters.daterange;
                 }
                 this.$http.get(url).then(function (res) {
                     this.isLoad = true;
                     var chart_data_set = res.body;
                     this.drawBar(chart_data_set['status'], 'status_fs', (_axis, _data) => {
                         this.labels_status = _axis;
                         this.datasets_status = _data;
                     });
                     this.drawBar(chart_data_set['issue'], 'issue_fs', (_axis, _data) => {
                         this.labels_issue = _axis;
                         this.datasets_issue = _data;
                     });
                     this.drawBar(chart_data_set['priority'], 'priority_fs', (_axis, _data) => {
                         this.labels_priority = _axis;
                         this.datasets_priority = _data;
                     });

                     //  this.drawLine(chart_data_set['status'], 'status_line_fs', (_axis, _data) => {
                     //      this.labels_status_line = _axis;
                     //      this.datasets_status_line = _data;
                     //  });

                     //  this.drawHorizontalBar(chart_data_set['status'], 'status_h_fs', (_axis, _data) => {
                     //      this.labels_h_status = _axis;
                     //      this.datasets_h_status = _data;
                     //  });
                     this.drawHorizontalBar(chart_data_set['version'], 'version_fs', (_axis, _data) => {
                         this.labels_version = _axis;
                         this.datasets_version = _data;
                     });
                     this.drawHorizontalBar(chart_data_set['customer'], 'customer_fs', (_axis, _data) => {
                         this.labels_customer = _axis;
                         this.datasets_customer = _data;
                     });
                     this.drawHorizontalBar(chart_data_set['component'], 'component_fs', (_axis, _data) => {
                         this.labels_component = _axis;
                         this.datasets_component = _data;
                     });
                     this.drawHorizontalBar(chart_data_set['discover'], 'discover_fs', (_axis, _data) => {
                         this.labels_discover = _axis;
                         this.datasets_discover = _data;
                     });

                 }, function () {
                     console.log('Request failed.');
                 });
             },
             drawHorizontalBar(chart_data_set, id, callback) {
                 var chart_data = JSON.parse(JSON.stringify(chart_data_set));
                 var data = chart_data.data;
                 var labels = chart_data.x_axis;
                 var label = chart_data.label;
                 var data_set = [];
                 for (var i = 0, len = data.length; i < len; i++) {
                     var item = data[i];
                     var _d = [];
                     for (var k = 0, k_len = labels.length; k < k_len; k++) {
                         _d.push(item[labels[k]]);
                     }
                     var ds = {};
                     ds.label = label[i];
                     ds.backgroundColor = this.BKG[i];
                     ds.data = _d;
                     data_set.push(ds);
                 }

                 callback(labels, data_set)
                 setTimeout(() => this.generate_image(id), 10);
             },
             drawBar(chart_data_set, id, callback) {
                 var chart_data = JSON.parse(JSON.stringify(chart_data_set));
                 var data = chart_data.data;
                 var labels = chart_data.label;
                 var x_axis = chart_data.x_axis;
                 var data_set = [];
                 for (var i = 0, len = labels.length; i < len; i++) {
                     var item = data[i];
                     var _d = [];
                     for (var k = 0, k_len = x_axis.length; k < k_len; k++) {
                         _d.push(item[x_axis[k]]);
                     }
                     var ds = {};
                     ds.label = labels[i];
                     ds.backgroundColor = this.BKG[i];
                     ds.data = _d;
                     data_set.push(ds);
                 }

                 callback(x_axis, data_set);
                 setTimeout(() => this.generate_image(id), 10);
             },
             drawLine(chart_data_set, id, callback) {
                 var chart_data = JSON.parse(JSON.stringify(chart_data_set));
                 var data = chart_data.data;
                 var labels = chart_data.label;
                 var x_axis = chart_data.x_axis;
                 var data_set = [];
                 for (var i = 0, len = labels.length; i < len; i++) {
                     var item = data[i];
                     var _d = [];
                     for (var k = 0, k_len = x_axis.length; k < k_len; k++) {
                         _d.push(item[x_axis[k]]);
                     }
                     var ds = {};
                     ds.label = labels[i];
                     ds.borderColor = this.BKG[i]; //路径颜色
                     ds.pointBackgroundColor = this.BKG[i]; //数据点颜色
                     ds.pointBorderColor = '#fff';
                     ds.data = _d;
                     data_set.push(ds);
                 }
                 callback(x_axis, data_set);
                 setTimeout(() => this.generate_image(id), 10);
             },
             generate_image(chart_key) {
                 var fd = document.getElementById(chart_key);
                 var canvas = fd.getElementsByTagName('canvas')[0];
                 var image = canvas.toDataURL({
                     type: "png",
                     backgroundColor: '#fff', //不设置此项，导出图片的底色是黑色
                 });
                 var a_lk = fd.getElementsByTagName('a')[0];
                 a_lk.href = image;
             },
             fetch_keys() {
                 this.clean_var();
                 var url = '/api/tickets';
                 if (this.filters) {
                     url += '/' + this.filters.projects;
                     url += '/' + this.filters.daterange;
                     url += '/' + this.labels_customer.join(',');
                 }
                 this.isClicked = true;
                 this.$http.get(url).then(function (res) {
                     this.isCustomerTicketLoad = true;
                     var tickets_obj = res.body;
                     var projects_arr = this.filters.projects.split(',');
                     projects_arr.forEach(p => {
                         var grid_dict = Object.create(null);
                         var project_item = tickets_obj[p];
                         for (var customer_name in project_item) {
                             var tickets_arr = project_item[customer_name];
                             var len = tickets_arr.length;
                             if (len >= 1) {
                                 grid_dict[customer_name] = tickets_arr;
                             }
                         }
                         if (Object.values(grid_dict).length >= 1) {
                             this.tickets_ref[p] = grid_dict;
                         }
                     });
                     this.isClicked = false;
                 });
             }
         }
     };

     var view_date = {
         //  props: ['isLoad', 'labels_line', 'data_line'],
         template: '#view_tmp_date',
         data: function () {
             return {
                 formInline: {
                     project: 'ALLE',
                     year: 2018,
                     periods: ['Q2', 'Q3', 'Q4']
                 },
                 filters: Object.create(null),
                 chart_sapn: 22,
                 BKG: ['#60acfc', '#5bc49f', '#feb64d'],
                 isLoad: false,
                 filters: Object.create(null),
                 labels_customer: [],
                 datasets_customer: []
             }
         },
         created: function () {
             this.$nextTick(function () {
                 this.filters.project = 'ALLE';
                 this.filters.year = 2018;
                 this.filters.periods = ['Q2', 'Q3', 'Q4'].join(',');
                 this.drawCharts();
                 this.drawHeatMap();
             });
         },
         methods: {
             onSubmit() {
                 this.isLoad = false;
                 console.log(this.formInline);
                 this.filters.project = this.formInline.project;
                 this.filters.year = this.formInline.year;
                 this.filters.periods = this.formInline.periods.join(',');
                 this.drawCharts(this.filters);
                 this.drawHeatMap();
             },
             drawHeatMap() {
                //draw heat map demo

                // map center
        var myLatlng = new google.maps.LatLng(25.6586, -80.3568);
        // map options,
        var myOptions = {
          zoom: 3,
          center: myLatlng
        };
        // standard map
        map = new google.maps.Map(document.getElementById("heatmap_div"), myOptions);
        // heatmap layer
        heatmap = new HeatmapOverlay(map, 
          {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 2,
            "maxOpacity": 1, 
            // scales the radius based on map zoom
            "scaleRadius": true, 
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries 
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": true,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'count'
          }
        );

        var testData = {
          max: 8,
          data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1},{lat: 52.6333, lng:1.75, count: 1},{lat: 48.15, lng:9.4667, count: 1},{lat: 52.35, lng:4.9167, count: 2},{lat: 60.8, lng:11.1, count: 1},{lat: 43.561, lng:-116.214, count: 1},{lat: 47.5036, lng:-94.685, count: 1},{lat: 42.1818, lng:-71.1962, count: 1},{lat: 42.0477, lng:-74.1227, count: 1},{lat: 40.0326, lng:-75.719, count: 1},{lat: 40.7128, lng:-73.2962, count: 2},{lat: 27.9003, lng:-82.3024, count: 1},{lat: 38.2085, lng:-85.6918, count: 1},{lat: 46.8159, lng:-100.706, count: 1},{lat: 30.5449, lng:-90.8083, count: 1},{lat: 44.735, lng:-89.61, count: 1},{lat: 41.4201, lng:-75.6485, count: 2},{lat: 39.4209, lng:-74.4977, count: 1},{lat: 39.7437, lng:-104.979, count: 1},{lat: 39.5593, lng:-105.006, count: 1},{lat: 45.2673, lng:-93.0196, count: 1},{lat: 41.1215, lng:-89.4635, count: 1},{lat: 43.4314, lng:-83.9784, count: 1},{lat: 43.7279, lng:-86.284, count: 1},{lat: 40.7168, lng:-73.9861, count: 1},{lat: 47.7294, lng:-116.757, count: 1},{lat: 47.7294, lng:-116.757, count: 2},{lat: 35.5498, lng:-118.917, count: 1},{lat: 34.1568, lng:-118.523, count: 1},{lat: 39.501, lng:-87.3919, count: 3},{lat: 33.5586, lng:-112.095, count: 1},{lat: 38.757, lng:-77.1487, count: 1},{lat: 33.223, lng:-117.107, count: 1},{lat: 30.2316, lng:-85.502, count: 1},{lat: 39.1703, lng:-75.5456, count: 8},{lat: 30.0041, lng:-95.2984, count: 2},{lat: 29.7755, lng:-95.4152, count: 1},{lat: 41.8014, lng:-87.6005, count: 1},{lat: 37.8754, lng:-121.687, count: 7},{lat: 38.4493, lng:-122.709, count: 1},{lat: 40.5494, lng:-89.6252, count: 1},{lat: 42.6105, lng:-71.2306, count: 1},{lat: 40.0973, lng:-85.671, count: 1},{lat: 40.3987, lng:-86.8642, count: 1},{lat: 40.4224, lng:-86.8031, count: 4},{lat: 47.2166, lng:-122.451, count: 1},{lat: 32.2369, lng:-110.956, count: 1},{lat: 41.3969, lng:-87.3274, count: 2},{lat: 41.7364, lng:-89.7043, count: 2},{lat: 42.3425, lng:-71.0677, count: 1},{lat: 33.8042, lng:-83.8893, count: 1},{lat: 36.6859, lng:-121.629, count: 2},{lat: 41.0957, lng:-80.5052, count: 1},{lat: 46.8841, lng:-123.995, count: 1},{lat: 40.2851, lng:-75.9523, count: 2},{lat: 42.4235, lng:-85.3992, count: 1},{lat: 39.7437, lng:-104.979, count: 2},{lat: 25.6586, lng:-80.3568, count: 7},{lat: 33.0975, lng:-80.1753, count: 1},{lat: 25.7615, lng:-80.2939, count: 1},{lat: 26.3739, lng:-80.1468, count: 1},{lat: 37.6454, lng:-84.8171, count: 1},{lat: 34.2321, lng:-77.8835, count: 1},{lat: 34.6774, lng:-82.928, count: 1},{lat: 39.9744, lng:-86.0779, count: 1},{lat: 35.6784, lng:-97.4944, count: 2},{lat: 33.5547, lng:-84.1872, count: 1},{lat: 27.2498, lng:-80.3797, count: 1},{lat: 41.4789, lng:-81.6473, count: 1},{lat: 41.813, lng:-87.7134, count: 1},{lat: 41.8917, lng:-87.9359, count: 1},{lat: 35.0911, lng:-89.651, count: 1},{lat: 32.6102, lng:-117.03, count: 1},{lat: 41.758, lng:-72.7444, count: 1},{lat: 39.8062, lng:-86.1407, count: 1},{lat: 41.872, lng:-88.1662, count: 1},{lat: 34.1404, lng:-81.3369, count: 1},{lat: 46.15, lng:-60.1667, count: 1},{lat: 36.0679, lng:-86.7194, count: 1},{lat: 43.45, lng:-80.5, count: 1},{lat: 44.3833, lng:-79.7, count: 1},{lat: 45.4167, lng:-75.7, count: 2},{lat: 43.75, lng:-79.2, count: 2},{lat: 45.2667, lng:-66.0667, count: 3},{lat: 42.9833, lng:-81.25, count: 2},{lat: 44.25, lng:-79.4667, count: 3},{lat: 45.2667, lng:-66.0667, count: 2},{lat: 34.3667, lng:-118.478, count: 3},{lat: 42.734, lng:-87.8211, count: 1},{lat: 39.9738, lng:-86.1765, count: 1},{lat: 33.7438, lng:-117.866, count: 1},{lat: 37.5741, lng:-122.321, count: 1},{lat: 42.2843, lng:-85.2293, count: 1},{lat: 34.6574, lng:-92.5295, count: 1},{lat: 41.4881, lng:-87.4424, count: 1},{lat: 25.72, lng:-80.2707, count: 1},{lat: 34.5873, lng:-118.245, count: 1},{lat: 35.8278, lng:-78.6421, count: 1}]
        };

        heatmap.setData(testData);
          
                // id="heatmap_div
             },
             drawCharts(filters) {
                 var url = '/api/data/period';
                 var _f = filters || this.filters;
                 if (_f) {
                     url += '/' + _f.project;
                     url += '/' + _f.year;
                     url += '/' + _f.periods;
                 }
                 this.$http.get(url).then(function (res) {
                     this.isLoad = true;
                     //  var test_data = {
                     //      customer: {
                     //         "data": [
                     //             {
                     //                 "CVS Pharmacy Inc": 2,
                     //                 "Cabela's Inc": 1,
                     //                 "Centre d'Information RX Ltee": 14,
                     //                 "PT Multipolar Technology Tbk": 8,
                     //                 "United Overseas Bank Limited": 15
                     //             },
                     //             {
                     //                 "CVS Pharmacy Inc": 1,
                     //                 "Cabela's Inc": 2,
                     //                 "Centre d'Information RX Ltee": 4,
                     //                 "PT Multipolar Technology Tbk": 5,
                     //                 "United Overseas Bank Limited": 2
                     //             },
                     //         ],
                     //         "label": [
                     //             "Q2",
                     //             "Q3"
                     //         ],
                     //         "x_axis": [
                     //             "CVS Pharmacy Inc",
                     //             "Cabela's Inc",
                     //             "Centre d'Information RX Ltee",
                     //             "PT Multipolar Technology Tbk",
                     //             "United Overseas Bank Limited"
                     //         ]
                     //     },
                     //  };
                     var chart_data_set = res.body;
                     this.drawBar(chart_data_set['customer'], 'customer_fs', (_axis, _data) => {
                         this.labels_customer = _axis;
                         this.datasets_customer = _data;
                     });

                 }, function () {
                     console.log('Request failed.');
                 });
             },
             drawHorizontalBar(chart_data_set, id, callback) {
                 var chart_data = JSON.parse(JSON.stringify(chart_data_set));
                 var data = chart_data.data;
                 var labels = chart_data.x_axis;
                 var label = chart_data.label;
                 var data_set = [];
                 for (var i = 0, len = data.length; i < len; i++) {
                     var item = data[i];
                     var _d = [];
                     for (var k = 0, k_len = labels.length; k < k_len; k++) {
                         _d.push(item[labels[k]]);
                     }
                     var ds = {};
                     ds.label = label[i];
                     ds.backgroundColor = this.BKG[i];
                     ds.data = _d;
                     data_set.push(ds);
                 }

                 callback(labels, data_set)
                 setTimeout(() => this.generate_image(id), 10);
             },
             drawBar(chart_data_set, id, callback) {
                 var chart_data = JSON.parse(JSON.stringify(chart_data_set));
                 var data = chart_data.data;
                 var labels = chart_data.label;
                 var x_axis = chart_data.x_axis;
                 var data_set = [];
                 for (var i = 0, len = labels.length; i < len; i++) {
                     var item = data[i];
                     var _d = [];
                     for (var k = 0, k_len = x_axis.length; k < k_len; k++) {
                         _d.push(item[x_axis[k]]);
                     }
                     var ds = {};
                     ds.label = labels[i];
                     ds.backgroundColor = this.BKG[i];
                     ds.data = _d;
                     data_set.push(ds);
                 }

                 callback(x_axis, data_set);
                 setTimeout(() => this.generate_image(id), 10);
             },

             generate_image(chart_key) {
                 var fd = document.getElementById(chart_key);
                 var canvas = fd.getElementsByTagName('canvas')[0];
                 var image = canvas.toDataURL({
                     type: "png",
                     backgroundColor: '#fff', //不设置此项，导出图片的底色是黑色
                 });
                 var a_lk = fd.getElementsByTagName('a')[0];
                 a_lk.href = image;
             }
         }
     };
     var setting = {
         template: '#setting_tmp',
         data: function () {
             return {
                 ctl: {
                     steps: ['isProject', 'isChart', 'isDone'],
                     isProject: true,
                     isChart: false,
                     isDone: false
                 },
                 basic_chart: [{
                         name: 'TicketChart',
                         desc: 'Show the different counts of tickets.',
                         type: 'bar',
                     },
                     {
                         name: 'CustomersChart',
                         desc: 'Show the different counts of customers.',
                         type: 'bar',
                     },
                     {
                         name: 'PriorityChart',
                         desc: 'Show the different counts of priority.',
                         type: 'bar',
                     },
                     {
                         name: 'StatusChart',
                         desc: 'Show the different counts of status.',
                         type: 'bar',
                     }
                 ],
                 chart_types: ['bar', 'line', 'pie'],
                 default_counts: 5,
                 colors: [
                     ['#5bc49'],
                     ['#5bc49', '#feb64d'],
                     ['#60acfc', '#5bc49f', '#feb64d'],
                     ['#60acfc', '#5bc49f', '#feb64d', '#ff7c7c'],
                     ['#60acfc', '#5bc49f', '#b3d52b', '#feb64d', '#ff7c7c']
                 ],
                 active: 0,
                 project_info: {
                     name: '',
                     key: '',
                     desc: ''
                 },
                 project_set: [],
                 p_idx: 0,
                 chart_info: {
                     name: '',
                     type: '',
                     desc: ''
                 },
                 chart_set: [],
                 c_idx: 0,
                 btn_disabled: false,
             }
         },
         methods: {
             next() {
                 if (this.active++ > 2) this.active = 0;
                 for (var i = 0, len = this.ctl.steps.length; i < len; i++) {
                     if (this.active == i) {
                         this.ctl[this.ctl.steps[i]] = true;
                     } else {
                         this.ctl[this.ctl.steps[i]] = false;
                     }
                 }
             },
             reset() {
                 this.active = 0;
                 this.ctl.isProject = true;
                 this.ctl.isChart = false;
                 this.ctl.isDone = false;
                 this.project_info = {};
                 this.project_set = [];
                 this.p_idx = 0;
                 this.chart_info = {};
                 this.chart_set = [];
                 this.c_idx = 0;
                 this.btn_disabled = false;
             },
             save_project() {
                 this.add_project();
                 this.next();
             },
             add_project() {
                 if (this.project_info.name && this.project_info.key) {
                     this.project_set.push(this.project_info);
                     this.project_info = {};
                     this.p_idx++;
                 }
             },

             save_chart() {
                 this.add_chart();
                 this.next();
             },
             add_chart() {
                 if (this.chart_info.name && this.chart_info.type) {
                     this.chart_set.push(this.chart_info);
                     this.chart_info = {};
                     this.c_idx++;
                 }
             },

             onSubmit() {
                 // console.log(this.project_set);
                 // console.log(this.chart_set);
                 this.active++;
                 this.btn_disabled = true;
                 // console.log(this.active)
             },
         }
     };
     var no_found = {
         template: '<div>404 page</div>'
     };

     var routesCfg = [{
             path: '/',
             redirect: '/view',
             component: view
         },
         {
             path: '/view',
             component: view
         },
         {
             path: '/view_date',
             component: view_date
         },
         {
             path: '/settings',
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