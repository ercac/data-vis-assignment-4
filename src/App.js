import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wordFrequency: [],
    };
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from",
      "that", "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", 
      "we", "our", "ours", "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "us", "is", 
      "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "doing"
    ]);
    
    const words = text.toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=_`~()]/g, "")
      .replace(/\s{2,}/g, " ")
      .split(" ");
    
    const filteredWords = words.filter(word => !stopWords.has(word));
    
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  };

  renderChart() {
    const data = this.state.wordFrequency.sort((a, b) => b[1] - a[1]).slice(0, 5);
    const svg = d3.select(".svg_parent");

    const width = 1000;
    const height = 200;
    
    svg.attr("width", width).attr("height", height);

    const fontScale = d3.scaleLinear()
      .domain([0, data[0] ? data[0][1] : 0])
      .range([5, 50]);

    const xOffsets = data.map((_, index) => index * (100 + 50));

    const words = svg.selectAll("text")
      .data(data, d => d[0]);

    words.enter()
      .append("text")
      .text(d => d[0])
      .attr("x", (d, i) => xOffsets[i])
      .attr("y", height / 2)
      .style("font-size", "10px")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("font-size", d => fontScale(d[1]) + "px")
      .style("opacity", 1);

    words.transition()
      .duration(1000)
      .attr("x", (d, i) => xOffsets[i])
      .style("font-size", d => fontScale(d[1]) + "px");

    words.exit()
      .transition()
      .duration(500)
      .attr("opacity", 0)
      .remove();
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea type="text" id="input_field" style={{ height: 150, width: 1000 }} />
          <button
            type="submit"
            value="Generate WordCloud"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              const input_data = document.getElementById("input_field").value;
              this.setState({ wordFrequency: this.getWordFrequency(input_data) });
            }}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
