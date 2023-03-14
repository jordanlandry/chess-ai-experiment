import React from "react";
import { depthTimes, functionTimes, maxTime } from "../game/ai/minimax";

export default function FunctionTimeTable() {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Function</th>
            <th>Time (ms)</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(functionTimes).map((key, i) => {
            return (
              <tr key={i}>
                <td key={i}>{key}</td>
                <td>{functionTimes[key]}ms</td>
                <td>{((functionTimes[key] / maxTime) * 100).toLocaleString()}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table style={{ marginTop: "24px" }}>
        <thead>
          <tr>
            <th>Depth</th>
            <th>Time (ms)</th>
            <th>Percent</th>
          </tr>
        </thead>
        <tbody>
          {depthTimes.map((time, i) => {
            return (
              <tr key={i}>
                <td>Depth {i + 1}</td>
                <td>{time}ms</td>
                <td>{((time / maxTime) * 100).toLocaleString()}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
