// create an array with nodes
var nodes = new vis.DataSet([
    { id: 1, label: 'Node 1' },
    { id: 2, label: 'Node 2' },
    { id: 3, label: 'Node 3' },
    { id: 4, label: 'Node 4' },
    { id: 5, label: 'Node 5' }
]);

// create an array with edges
var edges = new vis.DataSet([
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 }
]);

// create a network
var container = document.getElementById('mynetwork');

// provide the data in the vis format
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    autoResize: true,
    height: '100%',
    width: '100%',
    locale: 'en',
    edges: {
        arrows: {
            to: { enabled: true, scaleFactor: 1, type: 'arrow' }
        },
        color: 'red',
        font: '12px arial #ff0000',
        scaling: {
            label: true,
        },
        shadow: true,
        smooth: true,
    },
    // clickToUse: false,
    // configure: { ...},    // defined in the configure module.
    // edges: { ...},        // defined in the edges module.
    // nodes: { ...},        // defined in the nodes module.
    // groups: { ...},       // defined in the groups module.
    // layout: { ...},       // defined in the layout module.
    // interaction: { ...},  // defined in the interaction module.
    // manipulation: { ...}, // defined in the manipulation module.
    // physics: { ...},      // defined in the physics module.
}

// initialize your network!
var network = new vis.Network(container, data, options);