'use strict';

const [red, blue] = ["#d63031", "#2980b9"];

const options = {
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
        solver: 'forceAtlas2Based',
    }
}

const e = React.createElement;

class FamilyWebApp extends React.Component {
    constructor() {
        super();
        this.state = {
            searchValue: "",
            displayedNodes: new Set(),
            filterShown: false,
        };
        this.nodes = new vis.DataSet();
        this.edges = new vis.DataSet();
        this.nodesView = new vis.DataView(this.nodes, { filter: this.nodesFilter });
        this.network = {};
        this.appRef = React.createRef();
    }

    initializeNetworkData = (data) => {
        const objects = $.csv.toObjects(data);
        objects.forEach((entry, i) => {
            let { "Name": label, "Ate Row": ate_id, "Kuya Row": kuya_id } = entry;
            const id = i + 2; // add 2 to account for header and 0 index start of iterator i

            this.nodes.add({ id: id, label: label });
            if (ate_id !== "") {
                ate_id = Number(ate_id)
                this.edges.add(
                    {
                        from: id,
                        to: ate_id,
                        color: { color: red, highlight: red },
                        relation: "ate",
                    }
                );
            }
            if (kuya_id !== "") {
                kuya_id = Number(kuya_id)
                this.edges.add(
                    {
                        from: id,
                        to: kuya_id,
                        color: { color: blue, highlight: blue },
                        relation: "kuya",
                    }
                );
            }
        });
    }

    componentDidMount() {
        // read from ate-kuya-data.csv and create the network
        $.ajax({
            type: 'GET',
            url: 'ate-kuya-data.csv',
            // url: 'https://pusox3.github.io/static-2019-2020/ate-kuya-data.csv',
            datatype: 'text',
            success: (data) => {
                this.initializeNetworkData(data);
                this.network = new vis.Network(this.appRef.current, {
                    nodes: this.nodesView,
                    edges: this.edges,
                }, options);
                this.network.on("stabilizationProgress", this.stabilizationProgress);
                this.network.once("stabilizationIterationsDone", this.stabilizationDone);
            }
        });
    }

    stabilizationProgress = (params) => {
        let maxWidth = this.appRef.current.clientWidth;
        let minWidth = 20;
        let widthFactor = params.iterations / params.total;
        let width = Math.max(minWidth, maxWidth * widthFactor);
        document.getElementById('bar').style.width = width + 'px';
        document.getElementById('text').innerHTML = Math.round(widthFactor * 100) + '%';
    }

    stabilizationDone = () => {
        document.getElementById('text').innerHTML = '100%';
        document.getElementById('loadingBar').style.opacity = 0;
        document.getElementById('bar').style.width = this.appRef.current.clientWidth;
        setTimeout(function () {
            document.getElementById('loadingBar').style.display = 'none';
        }, 500);
    }

    nodesFilter = (node) => {
        return !this.state.filterShown || this.state.displayedNodes.has(node.id);
    }

    getSearchedNode = () => {
        return this.nodes.get({
            filter: (node) => node.label.toLowerCase() === this.state.searchValue.toLowerCase()
        })[0];
    }

    showSuccessors = () => {
        this.reset(null, () => {
            const searchedNode = this.getSearchedNode();
            let nodesToDisplay;
            if (searchedNode !== undefined) {
                nodesToDisplay = this.getConnected(searchedNode.id, "from");
            } else {
                nodesToDisplay = new Set();
            }
            this.setState({ displayedNodes: nodesToDisplay, filterShown: true }, () => {
                this.nodesView.refresh();
            });
        });
    }

    showPredecessors = () => {
        this.reset(null, () => {
            const searchedNode = this.getSearchedNode();
            let nodesToDisplay;
            if (searchedNode !== undefined) {
                nodesToDisplay = this.getConnected(searchedNode.id, "to");
            } else {
                nodesToDisplay = new Set();
            }
            this.setState({ displayedNodes: nodesToDisplay, filterShown: true }, () => {
                this.nodesView.refresh();
            });
        });
    }

    getConnected = (node, direction = "any") => {
        const successors = new Set();
        let queue = [];
        queue.push(node);

        while (queue.length !== 0) {
            let level_size = queue.length;
            for (let i = 0; i < level_size; i++) {
                let temp = queue.shift();
                successors.add(temp);
                this.network.getConnectedNodes(temp, direction).forEach((item) => {
                    if (!successors.has(item)) {
                        queue.push(item);
                    }
                });
            }
        }
        return successors;
    }

    reset = (e, callback = null) => {
        this.setState({ filterShown: false }, () => {
            this.nodesView.refresh();
            if (callback !== null) {
                callback();
            }
        })
    }

    handleSearchChange = (e) => {
        this.setState({ searchValue: e.target.value })
    }

    render() {
        return e("div", null, e("input", {
            type: "text",
            placeholder: "Search Web",
            "aria-label": "Search Web",
            value: this.state.searchValue,
            onChange: this.handleSearchChange
        }), e("button", {
            type: "button",
            onClick: this.reset
        }, "Reset"), e("button", {
            type: "button",
            onClick: this.showSuccessors
        }, "Show Successors"), e("button", {
            type: "button",
            onClick: this.showPredecessors
        }, "Show Predecessors"), e("div", {
            ref: this.appRef,
            id: "mynetwork",
        }));
    }
}

const familyWebAppContainer = document.querySelector('#family_web_app_container');
ReactDOM.render(e(FamilyWebApp), familyWebAppContainer);
