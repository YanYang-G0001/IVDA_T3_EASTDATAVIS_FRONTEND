<template>
  <div id="app" style="display: flex; gap: 20px;">
    <!-- 左侧过滤器部分 -->
    <div style="width: 300px; border: 1px solid #ccc; border-radius: 5px; padding: 20px; background-color: #f8f9fa;">
      <h3 style="margin-bottom: 20px; text-align: center;">Filters</h3>
      <details
          v-for="(node, index) in filteredSelectedNodes"
          :key="index"
          style="margin-bottom: 10px;"
      >
        <summary>{{ getNodeName(node) }}</summary>
        <div style="margin-top: 10px;">
          <select
              v-model="selectedFilters[node]"
              multiple
              style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px; font-size: 14px;"
          >
            <option v-for="option in filterOptions[node]" :value="option" :key="option">
              {{ option }}
            </option>
          </select>
        </div>
      </details>
      <button
          @click="applyFilters"
          style="background-color: #28a745; color: white; border: none; padding: 10px; width: 100%; border-radius: 3px; cursor: pointer; margin-bottom: 10px;"
      >
        Apply Filters
      </button>
      <button
          @click="resetToDefault"
          style="background-color: #ff4d4f; color: white; border: none; padding: 10px; width: 100%; border-radius: 3px; cursor: pointer;"
      >
        Reset to Default
      </button>
    </div>

    <!-- 中间 Sankey 图 -->
    <div style="flex-grow: 1;">
      <div style="display: flex; margin-bottom: 0px; align-items: center; gap: 15px;">
        <div
            v-for="(node, index) in filteredSelectedNodes"
            :key="index"
            style="display: flex; align-items: center; gap: 10px;"
        >
          <div style="border: 1px solid #ccc; padding: 10px; border-radius: 5px; background-color: #f9f9f9; min-width: 150px;">
            {{ getNodeName(node) }}
          </div>
          <button
              v-if="index !== filteredSelectedNodes.length - 1"
              @click="removeNode(index)"
              style="border: none; background-color: #ff4d4f; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;"
          >
            ✕
          </button>
        </div>

        <div style="display: flex; align-items: center; gap: 10px;">
          <select
              v-model="newNode"
              style="border: 1px solid #ccc; padding: 10px; border-radius: 5px; font-size: 14px; min-width: 150px; background-color: #f9f9f9;"
          >
            <option value="" disabled>Select Node...</option>
            <option v-for="nodeOption in filteredAvailableNodes()" :value="nodeOption" :key="nodeOption">
              {{ getNodeName(nodeOption) }}
            </option>
          </select>
          <button
              @click="addNode"
              style="background-color: #1890ff; color: white; border: none; padding: 8px 12px; border-radius: 3px; cursor: pointer;"
          >
            + Node
          </button>
        </div>
      </div>
      <div id="sankey" style="width: 100%; height: 600px; border: 1px solid #ccc; border-radius: 5px;"></div>
    </div>
  </div>
</template>

<script>
import Plotly from 'plotly.js/dist/plotly';

export default {
  name: "SankeyDiagram",
  data() {
    return {
      availableNodes: ["C1", "C2", "C3", "C4", "C5", "C6", "C7"], // 可选属性
      selectedNodes: ["C1", "C2", "C8"], // 默认选择的节点
      newNode: "", // 下拉框的新增节点选择
      filterOptions: {}, // 每个属性的可选值
      selectedFilters: {}, // 用户选定的过滤条件
      nodeNames: {
        C1: "Smoking",
        C2: "Cholesterol",
        C3: "Blood Pressure",
        C4: "Age",
        C5: "BMI",
        C6: "Physical Activity",
        C7: "Family History",
        C8: "Diabetes Risk",
      },
    };
  },
  computed: {
    filteredSelectedNodes() {
      // 过滤掉 C8 节点，只在必要的地方展示
      return this.selectedNodes.filter((node) => node !== "C8");
    },
  },
  mounted() {
    this.fetchFilterOptions();
    this.fetchAndRenderSankey();
  },
  methods: {
    fetchFilterOptions() {
      // 获取过滤器选项
      fetch("http://127.0.0.1:5000/api/filter-options")
          .then((response) => response.json())
          .then((data) => {
            this.filterOptions = data;
            this.selectedFilters = Object.fromEntries(
                Object.keys(data).map((key) => [key, []])
            );
          })
          .catch((error) => console.error("Error fetching filter options:", error));
    },
    fetchAndRenderSankey() {
      const params = {
        nodes: this.selectedNodes,
        filters: this.selectedFilters,
      };



      fetch("http://127.0.0.1:5000/api/sankey-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })
          .then((response) => response.json())
          .then((data) => {
            console.log("fetchandrender " + JSON.stringify(params));
            if (data.error) {

              console.error("Error fetching Sankey data:", data.error);
            } else {
              this.renderSankey(data);
            }
          })
          .catch((error) => console.error("Error fetching Sankey data:", error));

      },
    renderSankey(data) {
      if (data && data.nodes && data.nodes.label && data.links) {
        const sankeyData = {
          type: "sankey",
          orientation: "h",
          node: {
            label: data.nodes.label,
            color: data.nodes.color,
            pad: 15,
            thickness: 20,
            line: { color: "black", width: 0.5 },
          },
          link: {
            source: data.links.source,
            target: data.links.target,
            value: data.links.value,
          },
        };

      //  const layout = {
        //  title: "Sankey Diagrams for What-If Analysis",
          //font: {
            //size: 16,         // Change the font size
            //family: "Arial",  // Change the font family
            //color: "black"     // Change the font color
         // }


        //};

        Plotly.newPlot("sankey", [sankeyData]);
      } else {
        console.error("Invalid data format for Sankey diagram.");
      }
    },
    applyFilters() {
      this.fetchAndRenderSankey();
    },
    resetToDefault() {
      this.selectedNodes = ["C1", "C2", "C8"];
      this.selectedFilters = Object.fromEntries(
          Object.keys(this.filterOptions).map((key) => [key, []])
      );

      this.fetchAndRenderSankey();
    },
    addNode() {
      if (this.selectedNodes.length >= 6) {
        alert("Cannot add more than 6 nodes.");
        return;
      }

      if (!this.selectedNodes.includes(this.newNode) && this.newNode !== "") {
        this.selectedNodes.splice(this.selectedNodes.length - 1, 0, this.newNode);
        this.newNode = ""; // 清空选择框
        this.fetchAndRenderSankey();
      } else {
        alert("Node already added or invalid.");
      }
    },
    removeNode(index) {
      if (this.selectedNodes.length > 3) {
        this.selectedNodes.splice(index, 1);
        this.fetchAndRenderSankey();
      } else {
        alert("At least two nodes and diabetes risk (C8) must remain.");
      }
    },
    getNodeName(nodeKey) {
      return this.nodeNames[nodeKey] || nodeKey;
    },
    filteredAvailableNodes(index = -1) {
      return this.availableNodes.filter(
          (node) => !this.selectedNodes.includes(node) || this.selectedNodes[index] === node
      );
    },
  },
};
</script>

<style>
#sankey {
  margin: 0 auto;
  max-width: 1200px;
  height: 600px;
}
details {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
  background-color: #f9f9f9;
}
summary {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}
summary:hover {
  color: #007bff;
}
details[open] {
  border-color: #007bff;
}
details > div {
  margin-top: 10px;
}
button {
  cursor: pointer;
}
button:hover {
  opacity: 0.9;
}
</style>
