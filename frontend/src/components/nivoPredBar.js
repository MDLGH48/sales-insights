import React from "react";

import { ResponsiveBar } from "@nivo/bar";

function NivoPredBar(props) {
  const predData = props.predData;
  const metricLabel = props.target;
  const nivoFormatData = predData.map((obj) => {
    const formatted = {};
    formatted[`probably ${metricLabel.replace(/_/g, " ")}`] =
      obj[`prob_yes_${metricLabel}`] * 100;
    formatted[`probably not ${metricLabel.replace(/_/g, " ")}`] =
      obj[`prob_no_${metricLabel}`] * 100;
    formatted["action_group"] = obj.action_group
      .replace(/_/g, " ")
      .replace("[", "")
      .replace("]", "")
      .replace(/'/g, "")
      .replace(/'/g, "");
    return formatted;
  });

  const slicedData = nivoFormatData
    .slice(0, nivoFormatData.length / 3)
    .concat(nivoFormatData.slice(1 - nivoFormatData.length / 3, -1));

  return (
    <div style={{ height: "90vh", width: "90vw" }}>
      <ResponsiveBar
        data={slicedData}
        keys={[
          `probably ${metricLabel.replace(/_/g, " ")}`,
          `probably not ${metricLabel.replace(/_/g, " ")}`,
        ]}
        indexBy="action_group"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        minValue={0}
        maxValue={100}
        colors={["#20b620", "#ef1e06"]}
        borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={null}
        tooltipFormat={(v) => `${v}%`}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate={true}
        motionStiffness={2}
        motionDamping={15}
      />
    </div>
  );
}
export default NivoPredBar;
