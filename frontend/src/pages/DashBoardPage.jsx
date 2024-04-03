import React from "react";
import Statistics from "../components/Statistics";
import Temperature from "../components/Temperature";
import MixedChart from "../components/MixedChart";
import LineChart from "../components/LineChart";
import Gauge from "../components/Gauge";

function DashBoardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 ">
      <div className="col-span-1">
        <Temperature />
      </div>
      <div className="col-span-1">
        <Gauge value={25} />
      </div>
      <div className="col-span-1">
        <Statistics
          stats={{
            mean: 7.25,
            std: 0.57,
            min: 560,
            max: 9.0,
          }}
        />
      </div>
      <div className="md:col-span-3">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1">
            <LineChart />
          </div>
          <div className="col-span-2 md:col-span-1">
            <MixedChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
