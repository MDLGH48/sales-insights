import React, { useState, useEffect } from "react";
import { ResponsiveBar } from "@nivo/bar";

function NivoBarCorr(props) {
  const cData = props.chartData.response.correlations.map((x) => {
    const vizData = {};
    // vizData["biserial_correlation"] = (x["biserial_correlation"] * 100).toFixed(
    //   1
    // );
    vizData["importance"] = (x["importance"] * 100).toFixed(1);
    vizData["metric"] = x["metric"].replace(/_/g, " ");
    vizData["p_value"] = x["p_value"].toFixed(1);
    vizData["phi_correlation"] = (x["phi_correlation"] * 100).toFixed(1);
    vizData["target"] = x["target"];
    return vizData;
  });

  return (
    <div style={{ height: "90vh", width: "90vw" }}>
      <ResponsiveBar
        data={cData}
        keys={[
          "biserial_correlation",
          "importance",
          "p_value",
          "phi_correlation",
        ]}
        indexBy="metric"
        margin={{ top: 10, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "phi_correlation",
            },
            id: "dots",
          },
          {
            match: {
              id: "importance",
            },
            id: "lines",
          },
        ]}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 3,
          tickPadding: 0,
          tickRotation: -10,
          legend: "metric",
          legendPosition: "middle",
          legendOffset: 10,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "correlations measurements",
          legendPosition: "middle",
          legendOffset: 0,
        }}
        labelSkipWidth={20}
        labelSkipHeight={12}
        //   labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 10,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
}
export default NivoBarCorr;
