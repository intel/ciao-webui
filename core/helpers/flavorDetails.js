var ciaoAdapter = require('../ciao_adapter.js');

var adapter = new ciaoAdapter();

process.on('message', function(m) {

    m = JSON.parse(m);
    var uri = m.uri;
    var token = m.token;
    var sessionWorkloads = m.workloads;

    if (uri && token && sessionWorkloads)
        var data = adapter.get(
            uri,
            token,
            function () {
                var workloads = sessionWorkloads.map((w,index) => {
                    if (data.json.servers){
                        var filteredData = data.json.servers.filter(
                            function (server) {
                                return server.image.id == w.disk;
                            });
                        // total instances and running instances
                        var ti = filteredData.length;
                        var tri = filteredData.filter((server) => {
                            return server.status == 'running';
                        }).length;
                        w.totalInstances = ti;
                        w.totalRunningInstances = tri;
                    }
                    return w;
                });
                // send workloads back to parent
                process.send(
                    JSON.stringify({workloads:workloads}));
                //res.send({flavors:req.session.workloads});
            });
});

process.on('error', function (error) {
    process.send({error: error.message || error});
});
