var GraphStoreClient = require('graph-store-client'); // works with promises (for managing the order of execution of asynchronous calls)

function execQuery(q, endpoint) {
    var client = new GraphStoreClient(endpoint, null);

    return client.query(q);
}

exports.execQuery = execQuery;