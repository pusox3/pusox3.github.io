// create an array with nodes
var nodes = new vis.DataSet([
    { id: 1, label: 'LMAO'},
    { id: 2, label: 'XD'},
    { id: 3, label: 'Dope'},
    { id: 4, label: 'Whack'},
    { id: 5, label: 'Bruh'},
    { id: 6, label: 'Yeet'},
    { id: 7, label: 'Yeet'},
    { id: 8, label: 'Yeet'},
    { id: 9, label: 'Yeet'},
    { id: 10, label: 'Yeet'},
    { id: 11, label: 'Yeet'},
    { id: 12, label: 'Yeet'},
    { id: 13, label: 'Yeet'}
]);

/* Blue: #2980b9 */
/* Red: #d63031 */
// create an array with edges
var edges = new vis.DataSet([
    { from: 1, to: 3, color: { color: '#2980b9', highlight: '#2980b9' } },
    { from: 1, to: 2, color: { color: '#d63031', highlight: '#d63031' } },
    { from: 2, to: 4, color: { color: '#2980b9', highlight: '#2980b9' } },
    { from: 2, to: 5, color: { color: '#d63031', highlight: '#d63031' } },
    { from: 6, to: 4, color: { color: '#2980b9', highlight: '#2980b9' } },
    { from: 4, to: 7, color: { color: '#d63031', highlight: '#d63031' } },
    { from: 5, to: 7, color: { color: '#d63031', highlight: '#d63031' } },
    { from: 8, to: 5, color: { color: '#d63031', highlight: '#d63031' } },
    { from: 9, to: 3, color: { color: '#2980b9', highlight: '#2980b9' } },
    { from: 9, to: 3, color: { color: '#2980b9', highlight: '#2980b9' } },
    { from: 10, to: 3, color: { color: '#2980b9', highlight: '#2980b9' } },
    { from: 11, to: 3, color: { color: '#2980b9', highlight: '#2980b9' } },
    { from: 12, to: 3, color: { color: '#2980b9', highlight: '#2980b9' } },
    { from: 13, to: 3, color: { color: '#2980b9', highlight: '#2980b9' } },
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
    nodes: {
        borderWidth: 2,
        borderWidthSelected: 3,
        color: {
            border: '#fdcb6e',
            background: '#ffeaa7',
            highlight: {
                border: '#fdcb6e',
                background: '#fdcb6e'
            }
        }
    },
    edges: {
        width: 3,
        arrows: {
            to: { enabled: true, type: 'arrow' }
        },
        scaling: {
            label: true,
        },
        shadow: true,
        smooth: {
            enabled: true,
            type: 'dynamic',
            roundness: 0.5
        }
    },
    physics: {
        enabled: true,
        timestep: 0.2,
        maxVelocity: 20,
        minVelocity: 0.2,
        hierarchicalRepulsion: {
            centralGravity: 0.0
        },
        solver: 'hierarchicalRepulsion'
    },
    layout: {
        hierarchical: {
            enabled: true,
            direction: 'DU',
            sortMethod: 'directed'
        }
    }
}

var network = new vis.Network(container, data, options);

// const network = new vis.Network(container, data, options);
// setTimeout(()=>{
//     network.setOptions({
//         layout:{
//             hierarchical: false
//         },
//     });
// },1000);