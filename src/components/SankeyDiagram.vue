<template>
  <div id="app" style="display: flex; gap: 20px;">
    <!-- 左侧过滤器部分 -->
    <div
        style="margin-bottom: 20px; text-align: center; font-size: 18px; color: #333; font-weight: 600;"
    >
      <h3 style="margin-bottom: 20px; text-align: center;font-size: 24px;background-color: #162c83; color: #fafafa;">Filters</h3>
      <div
          v-for="(node, index) in filteredSelectedNodes"
          :key="index"
          style="margin-bottom: 20px;"
      >
        <label
            :for="'filter-' + index"
            style="font-weight: 600; color: #000000; margin-bottom: 5px; display: block;"
        >
          {{ getNodeName(node) }}
        </label>

        <div style="margin-top: 10px;" class="custom-dropdown">
          <button
              @click="toggleDropdown(node)"
              style="width: 100%; padding: 8px; border: 1px solid #000000; border-radius: 5px; background-color: #f9f9f9; font-size: 15px; color: #cccccc ;text-align: left; cursor: pointer;"
          >
            {{ getNodeName(node) }}
            <span
                style="float: right; transform: rotate(90deg); font-size: 12px;"
                v-if="dropdownVisible[node]"
            >&#9654;</span>
            <span
                style="float: right; font-size: 12px;"
                v-else
            >&#9660;</span>
          </button>
          <div
              v-show="dropdownVisible[node]"
              style="border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff; margin-top: 5px;"
          >
            <label
                v-for="option in filterOptions[node]"
                :key="option"
                style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;"
            >
              <input
                  type="checkbox"
                  :value="option"
                  v-model="selectedFilters[node]"
                  style="margin-right: 5px;"
              />
              {{ option }}
            </label>
          </div>
        </div>

      </div>
      <button
          @click="applyFilters"
          style="background-color: #006400; color: white;font-size: 15px; border: none; padding: 10px; width: 100%; border-radius: 3px; cursor: pointer; margin-bottom: 10px;"
      >
        Apply Filters
      </button>
      <button
          @click="resetToDefault"
          style="background-color: #B22222; color: white;font-size: 15px; border: none; padding: 10px; width: 100%; border-radius: 3px; cursor: pointer;"
      >
        Reset to Default
      </button>
    </div>

    <!-- 中间 Sankey 图 -->
    <div style="flex-grow: 1;">
      <div
          style="display: flex; margin-bottom: 20px; align-items: center; gap: 15px; justify-content: space-between;"
      >
        <!-- 节点选择部分 -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
          <div
              v-for="(node, index) in filteredSelectedNodes"
              :key="index"
              style="display: flex; align-items: center; background-color: #f8f9fa; border: 1px solid #ddd; padding: 8px 10px; border-radius: 5px; gap: 8px;"
          >
    <span style="font-size: 18px; color: #000000; font-weight: 600;">
      {{ getNodeName(node) }}
    </span>
            <button
                @click="removeNode(index)"
                style="background-color: #B22222; color: white; border: none; padding: 2px 3px; border-radius: 3px; cursor: pointer;"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- 新增节点 -->
        <div style="display: flex; align-items: center; gap: 10px;">
          <select
              v-model="newNode"
              style="border: 1px solid #ccc; padding: 10px; border-radius: 5px; font-size: 15px; color:#cccccc; min-width: 180px; background-color: #fff;"
          >
            <option value="" disabled>Please Select Attributes</option>
            <option
                v-for="nodeOption in filteredAvailableNodes()"
                :value="nodeOption"
                :key="nodeOption"
            >
              {{ getNodeName(nodeOption) }}
            </option>
          </select>
          <button
              @click="addNode"
              style="background-color: #162c83; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-weight: 600;"
          >
            Add Node
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
      dropdownVisible: {}, // 控制每个下拉框的显示/隐藏状态
      availableNodes: ["Pregnancies", "Glucose", "Blood_pressure", "Skin_thickness", "Insulin", "Body_mass_index", "Diabetes_pedigree_function", "Age", "Diabetes_Probability"], // 可选属性
      selectedNodes: ["Age", "Glucose", "Diabetes_Probability"], // 默认选择的节点
      newNode: "", // 下拉框的新增节点选择
      filterOptions: {}, // 每个属性的可选值
      selectedFilters: {}, // 用户选定的过滤条件
      nodeNames: {
        Pregnancies: "Pregnancies",
        Glucose: "Glucose",
        Blood_pressure: "Blood Pressure",
        Skin_thickness: "Skin Thickness",
        Insulin: "Insulin",
        Body_mass_index: "Weight",
        Diabetes_pedigree_function: "Diabetes Pedigree Function",
        Age: "Age",
        Diabetes_Probability: "Diabetes Probability",
      },
    };
  },
  computed: {
    filteredSelectedNodes() {
      // 过滤掉 C8 节点，只在必要的地方展示
      return this.selectedNodes.filter((node) => node !== "Diabetes_Probability");
    },
  },
  mounted() {
    this.fetchFilterOptions();
    this.fetchAndRenderSankey();
  },
  methods: {
      toggleDropdown(node) {
        // 如果 dropdownVisible 没有为该节点初始化，先初始化为 false
        if (!this.dropdownVisible[node]) {
          this.dropdownVisible[node] = false; // 直接设置属性
        }

        // 切换下拉框的显示状态
        this.dropdownVisible[node] = !this.dropdownVisible[node];
      },
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
      console.log("Data for Sankey Rendering:", data);
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
            color: data.links.color, //add link color
          },
        };

        const layout = {
          font: {
            size: 15,         // Change the font size
            family: "Arial",  // Change the font family
            color: "black",     // Change the font color
            weight: "bold"
         }


        };

        Plotly.newPlot("sankey", [sankeyData],layout);
      } else {
        console.error("Invalid data format for Sankey diagram.");
      }
    },
    applyFilters() {
      this.fetchAndRenderSankey();
    },
    resetToDefault() {
      // 清空所有已应用的过滤器
      this.selectedFilters = Object.fromEntries(
          Object.keys(this.filterOptions).map((key) => [key, []])
      );

      // 保留当前选定的节点
      this.fetchAndRenderSankey(); // 更新 Sankey 图
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
        alert("At least two nodes and diabetes risk must remain.");
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
/* 滚动条样式优化 */
div[style*="overflow-y: auto;"]::-webkit-scrollbar {
  width: 6px;
}

div[style*="overflow-y: auto;"]::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

div[style*="overflow-y: auto;"]::-webkit-scrollbar-track {
  background-color: #f0f0f0;
}

.custom-dropdown label {
  font-size: 16px; /* 这里设置你需要的字体大小 */
}



</style>
