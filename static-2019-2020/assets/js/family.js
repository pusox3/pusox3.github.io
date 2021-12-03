"use strict";

const [red, blue] = ["#d63031", "#2980b9"];

const options = {
  autoResize: true,
  height: "100%",
  width: "100%",
  locale: "en",
  nodes: {
    borderWidth: 2,
    borderWidthSelected: 3,
    color: {
      border: "#fdcb6e",
      background: "#ffeaa7",
      highlight: {
        border: "#fdcb6e",
        background: "#fdcb6e",
      },
    },
  },
  edges: {
    width: 3,
    arrows: {
      to: { enabled: true, type: "arrow" },
    },
    scaling: {
      label: true,
    },
    shadow: true,
    smooth: {
      enabled: true,
      type: "dynamic",
      roundness: 0.5,
    },
  },
  layout: {
    improvedLayout: false,
  },
  physics: {
    enabled: true,
    solver: "forceAtlas2Based",
    stabilization: {
      enabled: true,
      iterations: 250,
      updateInterval: 10,
    },
  },
};

const e = React.createElement;

class SettingsModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return e(
      "div",
      {
        class: "modal fade",
        id: this.props.modalId,
        tabindex: "-1",
        role: "dialog",
        "aria-labelledby": "exampleModalLabel",
        "aria-hidden": "true",
      },
      e(
        "div",
        {
          class: "modal-dialog modal-sm",
          role: "document",
        },
        e(
          "div",
          {
            class: "modal-content",
          },
          e(
            "div",
            {
              class: "modal-header",
            },
            e(
              "h5",
              {
                class: "modal-title",
              },
              "Settings"
            ),
            e(
              "button",
              {
                type: "button",
                class: "close",
                "data-dismiss": "modal",
                "aria-label": "Close",
              },
              e(
                "span",
                {
                  "aria-hidden": "true",
                },
                "\xD7"
              )
            )
          ),
          e(
            "div",
            {
              class: "modal-body",
            },
            e(
              "div",
              {
                class: "row",
              },
              e(
                "div",
                {
                  class: "col-sm-12 col-md-6",
                },
                e(
                  "div",
                  { class: "form-check my-1 form-group" },
                  e("input", {
                    class: "form-check-input",
                    type: "checkbox",
                    id: "all_predecessors_checkbox",
                    checked: this.props.predecessorCheckboxValue,
                    onClick: this.props.handlePredecessorsCheckbox,
                  }),
                  e(
                    "label",
                    {
                      class: "form-check-label",
                      for: "all_predecessors_checkbox",
                    },
                    "Show all predecessors"
                  )
                ),
                e(
                  "div",
                  {
                    class: "input-group",
                    hidden: this.props.predecessorCheckboxValue,
                  },
                  e(
                    "div",
                    { class: "input-group-prepend" },
                    e(
                      "span",
                      { class: "input-group-text" },
                      "Max predecessor levels"
                    )
                  ),
                  e("input", {
                    class: "form-control",
                    type: "number",
                    id: "num_predecessor_levels",
                    value: this.props.numPredecessorLevels,
                    onChange: this.props.handleNumPredecessorLevels,
                  })
                )
              ),
              e(
                "div",
                {
                  class: "col-sm-12 col-md-6",
                },
                e(
                  "div",
                  { class: "form-check my-1 form-group" },
                  e("input", {
                    class: "form-check-input",
                    type: "checkbox",
                    id: "all_successors_checkbox",
                    checked: this.props.successorCheckboxValue,
                    onClick: this.props.handleSuccessorsCheckbox,
                  }),
                  e(
                    "label",
                    {
                      class: "form-check-label",
                      for: "all_successors_checkbox",
                    },
                    "Show all successors"
                  )
                ),
                e(
                  "div",
                  {
                    class: "input-group",
                    hidden: this.props.successorCheckboxValue,
                  },
                  e(
                    "div",
                    { class: "input-group-prepend" },
                    e(
                      "span",
                      { class: "input-group-text" },
                      "Max successor levels"
                    )
                  ),
                  e("input", {
                    class: "form-control",
                    type: "number",
                    id: "num_successor_levels",
                    value: this.props.numSuccessorLevels,
                    onChange: this.props.handleNumSuccessorLevels,
                  })
                )
              )
            )
          )
        )
      )
    );
  }
}

class FamilyWebApp extends React.Component {
  constructor() {
    super();
    this.state = {
      searchValue: "",
      displayedNodes: new Set(),
      filterShown: false,
      loading: true,
      show_all_predecessors: true,
      show_all_successors: true,
      num_predecessor_levels: 2,
      num_successor_levels: 2,
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
      let { Name: label, Id: id, "Ate Id": ate_id, "Kuya Id": kuya_id } = entry;
      id = Number(id);

      this.nodes.add({ id: id, label: label });
      if (ate_id !== "") {
        ate_id = Number(ate_id);
        this.edges.add({
          from: id,
          to: ate_id,
          color: { color: red, highlight: red },
          relation: "ate",
        });
      }
      if (kuya_id !== "") {
        kuya_id = Number(kuya_id);
        this.edges.add({
          from: id,
          to: kuya_id,
          color: { color: blue, highlight: blue },
          relation: "kuya",
        });
      }
    });
  };

  componentDidMount() {
    // read from ate-kuya-data.csv and create the network
    $.ajax({
      type: "GET",
      url: "ate-kuya-data.csv",
      // url: "https://pusox3.github.io/static-2019-2020/ate-kuya-data.csv",
      datatype: "text",
      success: (data) => {
        this.initializeNetworkData(data);
        this.network = new vis.Network(
          this.appRef.current,
          {
            nodes: this.nodesView,
            edges: this.edges,
          },
          options
        );
        this.network.on("stabilizationProgress", this.stabilizationProgress);
        this.network.on("stabilizationIterationsDone", this.stabilizationDone);
      },
    });
  }

  stabilizationProgress = (params) => {
    let maxWidth = this.appRef.current.clientWidth;
    let minWidth = 20;
    let widthFactor = params.iterations / params.total;
    let width = Math.max(minWidth, maxWidth * widthFactor);
    document.getElementById("bar").style.width = width + "px";
    document.getElementById("text").innerHTML =
      Math.round(widthFactor * 100) + "%";
  };

  stabilizationDone = () => {
    this.setState({ loading: false });
    document.getElementById("text").innerHTML = "100%";
    document.getElementById("loadingBar").style.opacity = 0;
    document.getElementById("bar").style.width =
      this.appRef.current.clientWidth;
  };

  resetLoadingBar = () => {
    document.getElementById("loadingBar").style.display = "block";
    document.getElementById("loadingBar").style.opacity = 100;
    document.getElementById("text").innerHTML = "0%";
  };

  nodesFilter = (node) => {
    return !this.state.filterShown || this.state.displayedNodes.has(node.id);
  };

  getSearchedNode = () => {
    return this.nodes.get({
      filter: (node) =>
        node.label.toLowerCase() === this.state.searchValue.toLowerCase(),
    })[0];
  };

  showSuccessors = () => {
    this.reset(null, () => {
      const searchedNode = this.getSearchedNode();
      let nodesToDisplay;
      if (searchedNode !== undefined) {
        let max_levels = this.state.show_all_successors
          ? null
          : this.state.num_successor_levels;
        nodesToDisplay = this.getConnected(searchedNode.id, "from", max_levels);
      } else {
        nodesToDisplay = new Set();
      }
      this.setState(
        { displayedNodes: nodesToDisplay, filterShown: true },
        () => {
          this.nodesView.refresh();
        }
      );
    });
  };

  showPredecessors = () => {
    this.reset(null, () => {
      const searchedNode = this.getSearchedNode();
      let nodesToDisplay;
      if (searchedNode !== undefined) {
        let max_levels = this.state.show_all_predecessors
          ? null
          : this.state.num_predecessor_levels;
        nodesToDisplay = this.getConnected(searchedNode.id, "to", max_levels);
      } else {
        nodesToDisplay = new Set();
      }
      this.setState(
        { displayedNodes: nodesToDisplay, filterShown: true },
        () => {
          this.nodesView.refresh();
        }
      );
    });
  };

  getConnected = (node, direction = "any", max_levels = null) => {
    const successors = new Set();
    let queue = [];
    queue.push(node);

    let level = 0;
    while (queue.length !== 0) {
      if (max_levels !== null && level >= max_levels) {
        return successors;
      }
      level++;
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
  };

  reset = (e, callback = null) => {
    this.setState({ filterShown: false }, () => {
      this.nodesView.refresh();
      this.network.stabilize();
      this.resetLoadingBar();
      if (callback !== null) {
        callback();
      }
    });
  };

  handleSearchChange = (e) => {
    this.setState({ searchValue: e.target.value });
  };

  handlePredecessorsCheckbox = (e) => {
    this.setState({ show_all_predecessors: e.target.checked });
  };

  handleNumPredecessorLevels = (e) => {
    this.setState({ num_predecessor_levels: e.target.value });
  };

  handleSuccessorsCheckbox = (e) => {
    this.setState({ show_all_successors: e.target.checked });
  };

  handleNumSuccessorLevels = (e) => {
    this.setState({ num_successor_levels: e.target.value });
  };

  render() {
    return e(
      "div",
      null,
      e(
        "div",
        {
          class: "row justify-content-between",
        },
        e(
          "div",
          {
            class: "col-sm-12 col-md-6 d-flex justify-content-start",
          },
          e("input", {
            type: "text",
            placeholder: "Search Web",
            "aria-label": "Search Web",
            value: this.state.searchValue,
            onChange: this.handleSearchChange,
          }),
          e(
            "button",
            {
              type: "button",
              onClick: this.showPredecessors,
              disabled: this.state.loading,
            },
            "Show Predecessors"
          ),
          e(
            "button",
            {
              type: "button",
              onClick: this.showSuccessors,
              disabled: this.state.loading,
            },
            "Show Successors"
          )
        ),
        e(
          "div",
          {
            class: "col-sm-12 col-md-6 justify-content-end d-flex",
          },
          e(
            "button",
            {
              type: "button",
              onClick: this.reset,
              disabled: this.state.loading,
            },
            "Reset"
          ),
          e(
            "button",
            {
              type: "button",
              "data-toggle": "modal",
              "data-target": "#search_settings_modal",
              disabled: this.state.loading,
            },
            "Settings"
          )
        )
      ),
      e("div", {
        ref: this.appRef,
        id: "mynetwork",
      }),
      e(SettingsModal, {
        modalId: "search_settings_modal",
        predecessorCheckboxValue: this.state.show_all_predecessors,
        handlePredecessorsCheckbox: this.handlePredecessorsCheckbox,
        handleNumPredecessorLevels: this.handleNumPredecessorLevels,
        numPredecessorLevels: this.state.num_predecessor_levels,
        successorCheckboxValue: this.state.show_all_successors,
        handleSuccessorsCheckbox: this.handleSuccessorsCheckbox,
        handleNumSuccessorLevels: this.handleNumSuccessorLevels,
        numSuccessorLevels: this.state.num_successor_levels,
      })
    );
  }
}

const familyWebAppContainer = document.querySelector(
  "#family_web_app_container"
);
ReactDOM.render(e(FamilyWebApp), familyWebAppContainer);
