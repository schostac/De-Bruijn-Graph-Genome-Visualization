function readsToKmers(k, reads) {
    var kmers = [];
    for (i = 0; i < reads.length; i++) {
        for (j = 0; j < reads[i].length - k + 1; ++j) {
            kmers.push(reads[i].substring(j, j + k));
        }
    }
    return kmers;
}

function validateReadsString(readsString) {
    var validChars = "ACGT\n";
    for (i = 0; i < readsString.length; i++) {
        if (!validChars.includes(readsString[i])) {
            return false;
        }
    }
    return true;
}

function makeGraph(k, reads) {
    var kmers = readsToKmers(k, reads);
    var graph = {};

    for (let i = 0; i < kmers.length; i++) {
        let left = kmers[i].substring(0, kmers[i].length - 1);
        let right = kmers[i].substring(1, kmers[i].length);

        if (left in graph) graph[left].push(right);
        else graph[left] = [right];

        if (!(right in graph)) graph[right] = [];
    }

    return graph;
}

function toNetworkData(graph) {
    var nodesData = [];
    var edgesData = [];

    var keys = Object.keys(graph);
    var edges = {};

    for (let key in graph) {
        nodesData.push({
            id: nodesData.length,
            label: key,
            shape: 'box',
            color: '#000000',
            font: {
                color: 'white'
            }
        });
        graph[key].forEach(function(item, index) {
            let e = key[0] + item;
            if (e in edges) edges[e].count++;
            else edges[e] = {
                from: keys.indexOf(key),
                to: keys.indexOf(item),
                count: 1
            };
        });
    }

    for (let key in edges) {
        edgesData.push({
            from: edges[key].from,
            to: edges[key].to,
            arrows: 'to',
            label: key + "(" + String(edges[key].count) + ")",
            font: {
                align: 'top'
            }
        });
    }

    return {
        nodes: nodesData,
        edges: edgesData
    };
}

function visualizeNetwork(networkData) {
    // create a network
    var container = document.getElementById('mynetwork');

    // provide the data in the vis format
    var data = {
        nodes: new vis.DataSet(networkData.nodes),
        edges: new vis.DataSet(networkData.edges),
    };

    var options = {};
    // initialize your network!
    var network = new vis.Network(container, data, options);
}

function readsMin(reads) {
    return reads.reduce(function (p, v) {
      return ( p.length < v.length ? p : v );
    });
}
