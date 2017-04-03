/* Copyright (c) 2017 Intel Corporation

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var ciaoAdapter = require('../ciao_adapter.js');

process.on('message', function(m) {
    m = JSON.parse(m);
    var uri = m.uri;
    var token = m.token;
    var sessionWorkloads = m.workloads;
    global.CONFIG_FILE = m.globals.config_file;
    global.PROTOCOL = m.globals.protocol;
    global.CONTROLLER_ADDR = m.globals.controller_addr;
    global.CONTROLLER_PORT = m.globals.controller_port;
    var adapter = (new ciaoAdapter()).useNode('controller');
    if (uri && token && sessionWorkloads)
        var data = adapter.onSuccess(function () {
            var workloads;
            try {
                workloads = sessionWorkloads.map((w,index) => {
                    if (data.json.servers){
                        var filteredData = data.json.servers.filter(
                            function (server) {
                                return server.flavor.id == w.id;
                            });
                        // total instances and running instances
                        var ti = filteredData.length;
                        var tri = filteredData.filter((server) => {
                            return server.status == 'active';
                        }).length;
                        //w.totalInstances = ti;
                        //w.totalRunningInstances = tri;
                        w.quota = ti;
                        w.value = tri;
                    } else {
                        //w.totalInstances = 0;
                        //w.totalRunningInstances = 0;
                        w.quota = 0;
                        w.value = 0;
                    }
                    return w;
                });
            } catch(err) {
                workloads = sessionWorkloads;
            }
            finally {
                // send workloads back to parent
                process.send(JSON.stringify({workloads:workloads}));
                //res.send({flavors:req.session.workloads});
            }
        })
        .onError((data) => process.send({error:data.statusCode}))
        .get(uri, token);
});

process.on('disconnect', () => process.exit());

process.on('error', function (error) {
    process.send({error: error.message || error});
});
