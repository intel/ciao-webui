/* Logger: Use within all "page" script
   Note: logger requires datamanager to be loaded
   make sure to include within $("document").ready
   
   Fields:
   - id: unique to manage rows
   - title: a code or title for an error/warning/message
   - type: error, warning or message
   - description: description of the error
   - action: an executable function associated with 
 */

var container = "logger";

var logger = function (name) {
    this.cindex = 0; //initial index start at 0
    this.name = name;
    datamanager.onDataSourceSet(container,
				this.update);
    // Initialize as empty object
    datamanager.setDataSource(container, {data: []});
}

logger.prototype.push = function (title, message) {
    log = {title: title, message: message};
    log.id = this.cindex;
    log.type = 'message';
    this.cindex++;
    var data = datamanager.sources[container].data;
    data.push(log);
    datamanager.setDataSource({data: data});
    return log.id;
}

logger.prototype.error = function (title, message) {
    log = {title: title, message: message}; 
    log.id = this.cindex;
    log.type = 'error';
    this.cindex++;
    var data = datamanager.sources[container].data;
    data.push(log);
    datamanager.setDataSource({data: data});
    return log.id;
}

logger.prototype.remove = function (id) {
    var data = datamanager.sources[container].data
	.filter((d) => d.id != id )
    datamanager.setDataSource(container, {data: data});
}

logger.prototype.update = function (data) {
    console.log(data);
    // TODO: requires logger visual component
    // ReactDOM.render(    //         <Logger {...sourceData}/>,
    //     document.getElementById(container));
}

module.exports = logger;
