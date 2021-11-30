// modify the hex values to change the colors
const [red, blue, yellow] = ["#d63031", "#2980b9", "#fdcb6e"];
const [nodes, edges] = [new vis.DataSet(), new vis.DataSet()];

// read from data.csv and create the nodes/edges
$.ajax({
    url: 'data.csv',
    success: (data) => {
        const objects = csv.toObjects(data);
        objects.forEach((entry, i) => {
            let { "Name": label, "Ate Row": ate_id, "Kuya Row": kuya_id } = entry;
            const id = i + 2; // add 2 to account for header and 0 index start of iterator i

            nodes.add({ id: id, label: label });
            if (ate_id !== "") {
                ate_id = Number(ate_id)
                edges.add(
                    {
                        from: id,
                        to: ate_id,
                        color: { color: red, highlight: red },
                        relation: "ate",
                    }
                );
                edges.add(
                    {
                        from: ate_id,
                        to: id,
                        color: { color: yellow, highlight: yellow },
                        relation: "ading",
                    }
                )
            }
            if (kuya_id !== "") {
                kuya_id = Number(kuya_id)
                edges.add(
                    {
                        from: id,
                        to: kuya_id,
                        color: { color: blue, highlight: blue },
                        relation: "kuya",
                    }
                );
                edges.add(
                    {
                        from: kuya_id,
                        to: id,
                        color: { color: yellow, highlight: yellow },
                        relation: "ading",
                    }
                )
            }
        });
    }
});

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
    layout: {
        improvedLayout: false,
    },
    physics: {
        enabled: true,
        solver: 'forceAtlas2Based'
    }
}

var network = new vis.Network(container, data, options);

network.on("stabilizationProgress", function (params) {
    var maxWidth = container.clientWidth;
    var minWidth = 20;
    var widthFactor = params.iterations / params.total;
    var width = Math.max(minWidth, maxWidth * widthFactor);
    document.getElementById('bar').style.width = width + 'px';
    document.getElementById('text').innerHTML = Math.round(widthFactor * 100) + '%';
});

network.once("stabilizationIterationsDone", function () {
    document.getElementById('text').innerHTML = '100%';
    document.getElementById('loadingBar').style.opacity = 0;
    document.getElementById('bar').style.width = container.clientWidth;
    setTimeout(function () {
        document.getElementById('loadingBar').style.display = 'none';
    }, 500);
});

function find_individual(name) {
    nodes.getDataSet().get().some(function (node) {
        if (name.toLowerCase() == node.label.toLowerCase()) {
            network.focus(node.id, { scale: 2 });
            return true;
        }
    })
}

$('#web-search').click(function () {
    var name = $('#web-text-input').val();
    find_individual(name);
});