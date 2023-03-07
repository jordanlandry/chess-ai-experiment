import React from "react";
import { depthTimes, functionTimes } from "../game/ai/minimax";

type Props = {};

export default function FunctionTimeTable({}: Props) {
  return (
    <div style={{ position: "absolute" }}>
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
                <td>{((functionTimes[key] / 2500) * 100).toLocaleString()}%</td>
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
                <td>{((time / 2500) * 100).toLocaleString()}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
