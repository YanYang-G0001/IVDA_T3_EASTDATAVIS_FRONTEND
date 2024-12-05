<template>
    <div>
      <h2>Diabetes Attributes Distribution</h2>
      <!-- 紧凑的 CSS Grid 容器 -->
      <div class="grid-container">
        <div
          v-for="(attribute, index) in attributes"
          :key="index"
          class="chart-container"
          @click="openModal(attribute)"
        >
          <h3>{{ attribute }}</h3>
          <div :id="'chart-' + attribute"></div>
        </div>
      </div>
  
      <!-- 放大的弹出层 -->
      <div v-if="modalVisible" class="modal">
        <div class="modal-content">
          <h3>{{ currentAttribute }}</h3>
          <div :id="'modal-chart-' + currentAttribute"></div>
          <button class="close-button" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import * as d3 from "d3";
  
  export default {
    name: "DiabetesAttributesChart",
    data() {
      return {
        attributes: [
          "Pregnancies",
          "Glucose",
          "Blood_pressure",
          "Skin_thickness",
          "Insulin",
          "BMI",
          "Diabetes_pedigree",
          "Age",
        ],
        modalVisible: false,
        currentAttribute: null,
      };
    },
    mounted() {
      this.attributes.forEach((attribute) => {
        this.createChart(attribute, `chart-${attribute}`, 200, 150); // 创建小图表
      });
    },
    methods: {

        async createChart(attribute, containerId, width, height, isModal = false) {
            const margin = { top: 10, right: 20, bottom: 30, left: 40 };
            const svgWidth = isModal ? width - 200 : width - margin.left - margin.right; // 放大时提供更宽的空间
            const svgHeight = height - margin.top - margin.bottom;


            // 清空之前的内容
            d3.select(`#${containerId}`).html("");

            const svg = d3
                .select(`#${containerId}`)
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // 数据加载和处理
            const data = await d3.csv("Filled_Dataset.csv", (d) => ({
                Pregnancies: +d.Pregnancies,
                Glucose: +d.Glucose,
                Blood_pressure: +d["Blood pressure"],
                Skin_thickness: +d["Skin thickness"],
                Insulin: +d.Insulin,
                BMI: +d["Body mass index"],
                Diabetes_pedigree: +d["Diabetes pedigree function"],
                Age: +d.Age,
                Outcome: +d.Outcome,
            }));

            const filteredData0 = data.filter((d) => d.Outcome === 0);
            const filteredData1 = data.filter((d) => d.Outcome === 1);

            const x = d3
                .scaleLinear()
                .domain(d3.extent(data, (d) => d[attribute]))
                .range([0, svgWidth]);

            svg
                .append("g")
                .attr("transform", `translate(0,${svgHeight})`)
                .call(d3.axisBottom(x).ticks(8))
                .selectAll("text")
                .style("font-size", isModal ? "20px" : "8px"); // 根据模式调整字体大小

            const histogram = d3
                .histogram()
                .value((d) => d[attribute])
                .domain(x.domain())
                .thresholds(x.ticks(50));

            const bins0 = histogram(filteredData0);
            const bins1 = histogram(filteredData1);

            const y = d3
                .scaleLinear()
                .domain([0, d3.max([...bins0, ...bins1], (d) => d.length)])
                .range([svgHeight, 0]);

            svg.append("g")
                .call(d3.axisLeft(y).ticks(5))
                .selectAll("text")
                .style("font-size", isModal ? "20px" : "8px"); // 根据模式调整字体大小

            svg
                .selectAll(".bar0")
                .data(bins0)
                .enter()
                .append("rect")
                .attr("x", (d) => x(d.x0) + 1)
                .attr("y", (d) => y(d.length))
                .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
                .attr("height", (d) => svgHeight - y(d.length))
                .style("fill", "#006400")
                .style("opacity", 0.6);

            svg
                .selectAll(".bar1")
                .data(bins1)
                .enter()
                .append("rect")
                .attr("x", (d) => x(d.x0) + 1)
                .attr("y", (d) => y(d.length))
                .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
                .attr("height", (d) => svgHeight - y(d.length))
                .style("fill", "#B22222")
                .style("opacity", 0.6);

 

            // 如果是放大模式，新建一个 boxplot 容器
            if (isModal) {
                // 添加图例
                const legend = svg.append("g")
                    .attr("transform", `translate(${svgWidth - 150}, 20)`); // 图例位置

                // 图例 - No Diabetes
                legend.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", "#006400");

                legend.append("text")
                    .attr("x", 30)
                    .attr("y", 15)
                    .text("No Diabetes")
                    .style("font-size", isModal ? "16px" : "10px")
                    .attr("alignment-baseline", "middle");

                // 图例 - Diabetes
                legend.append("rect")
                    .attr("x", 0)
                    .attr("y", 30)
                    .attr("width", 20)
                    .attr("height", 20)
                    .style("fill", "#B22222");

                legend.append("text")
                    .attr("x", 30)
                    .attr("y", 45)
                    .text("Diabetes")
                    .style("font-size", isModal ? "16px" : "10px")
                    .attr("alignment-baseline", "middle");   

                const boxPlotContainerId = `${containerId}-boxplot`;

                // 创建新的容器
                d3.select(`#${boxPlotContainerId}`).remove(); // 避免重复
                const container = d3.select(`#${containerId}`);
                container.style("display", "flex"); // 设置容器为 flex 布局

                // 创建盒型图容器
                const boxPlotContainer = container
                    .append("div")
                    .attr("id", boxPlotContainerId)
                    .style("display", "inline-block")
                    .style("width", "300px")
                    .style("margin-left", "-50px"); // 设置盒型图与直方图的间距

                const boxPlotSvg = boxPlotContainer
                    .append("svg")
                    .attr("width", 300)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", `translate(60,10)`);

                const boxPlotScale = d3
                    .scaleLinear()
                    .domain(d3.extent(data, (d) => d[attribute]))
                    .range([svgHeight, 0]);

                const outcomeScale = d3
                    .scaleBand()
                    .domain(["0", "1"])
                    .range([0, 200])
                    .padding(0.5);

                const boxPlotData = [
                    { outcome: "0", values: filteredData0.map((d) => d[attribute]) },
                    { outcome: "1", values: filteredData1.map((d) => d[attribute]) },
                ];

                // 绘制 Boxplot 主体
                // 添加 X 轴
                boxPlotSvg
                    .append("g")
                    .attr("transform", `translate(0, ${svgHeight})`) // X 轴位于底部
                    .call(
                        d3.axisBottom(outcomeScale).tickFormat((d) =>
                            d === "0" ? "" : ""
                        ) // 修改 X 轴标签
                    )
                    .selectAll("text")
                    .style("text-anchor", "middle") // 设置文本样式
                    .style("font-size", "20px" ) // 根据模式调整字体大小
                    .attr("dy", "-2px") // 调整垂直偏移
                    .attr("transform", "rotate(-45)"); // 文本旋转 45 度
                    // .attr("text-anchor", "start"); // 调整旋转后文本的起点对齐

                // 添加 Y 轴
                boxPlotSvg
                    .append("g")
                    .call(d3.axisLeft(boxPlotScale)) // 使用 BoxPlot 的数值比例尺
                    .selectAll("text")
                    .style("font-size", "20px" ); // 根据模式调整字体大小


                boxPlotSvg
                    .selectAll("line")
                    .data(boxPlotData)
                    .enter()
                    .append("line")
                    .attr("x1", (d) => outcomeScale(d.outcome) + outcomeScale.bandwidth() / 2)
                    .attr("x2", (d) => outcomeScale(d.outcome) + outcomeScale.bandwidth() / 2)
                    .attr("y1", (d) => boxPlotScale(d3.min(d.values)))
                    .attr("y2", (d) => boxPlotScale(d3.max(d.values)))
                    .style("stroke", "#000");

                boxPlotSvg
                    .selectAll("rect")
                    .data(boxPlotData)
                    .enter()
                    .append("rect")
                    .attr("x", (d) => outcomeScale(d.outcome))
                    .attr("y", (d) => boxPlotScale(d3.quantile(d.values, 0.75)))
                    .attr("width", outcomeScale.bandwidth())
                    .attr("height", (d) =>
                        boxPlotScale(d3.quantile(d.values, 0.25)) -
                        boxPlotScale(d3.quantile(d.values, 0.75))
                    )
                    .style("fill", (d) => (d.outcome === "0" ? "#006400" : "#B22222")) // 根据 Outcome 设置颜色
                    .style("opacity", 0.6);

                boxPlotSvg
                    .selectAll("medianLine")
                    .data(boxPlotData)
                    .enter()
                    .append("line")
                    .attr("x1", (d) => outcomeScale(d.outcome))
                    .attr("x2", (d) => outcomeScale(d.outcome) + outcomeScale.bandwidth())
                    .attr("y1", (d) => boxPlotScale(d3.median(d.values)))
                    .attr("y2", (d) => boxPlotScale(d3.median(d.values)))
                    .style("stroke", "#000");

                // 添加带抖动的散点
                const jitterWidth = 30;
                boxPlotSvg
                    .selectAll("indPoints")
                    .data(data.filter((d) => d[attribute] !== null)) // 过滤无效数据
                    .enter()
                    .append("circle")
                    .attr("cx", (d) =>
                        outcomeScale(d.Outcome.toString()) +
                        outcomeScale.bandwidth() / 2 +
                        (Math.random() - 0.5) * jitterWidth
                    )
                    .attr("cy", (d) => boxPlotScale(d[attribute]))
                    .attr("r", 3)
                    .style("fill", "rgba(128, 128, 128, 0.3)") // 设置透明灰色
                    .style("opacity", 0.8)
                    // .attr("stroke", "black");
            }

        },

      openModal(attribute) {
        this.currentAttribute = attribute;
        this.modalVisible = true;
        setTimeout(() => {
            this.createChart(attribute, `modal-chart-${attribute}`, 1200, 600, true);
        }, 0);
      },
      closeModal() {
        this.modalVisible = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* 动态调整列数 */
    gap: 10px; /* 图表之间的间距 */
    justify-items: center;
    padding: 10px;
  }
  
  .chart-container {
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    padding: 5px;
    border-radius: 5px;
    background-color: #f9f9f9;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
  
  .grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* 动态调整列数 */
  gap: 10px; /* 图表之间的间距 */
  justify-items: center;
  padding: 10px;
}

.chart-container {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6); /* 半透明黑色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden; /* 防止滚动条出现 */
}

.modal-content {
  position: relative; /* 让关闭按钮位置相对弹窗定位 */
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 80%;
  max-width: 1400px;
  height: 80%;
  max-height: 900px;
  overflow: auto;
  z-index: 1001;
  padding: 20px; /* 给内容增加内边距 */
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

  </style>
  