import React from "react";
import Statistics from "../components/Statistics";
import Temperature from "../components/Temperature";
import MixedChart from "../components/MixedChart";
import LineChart from "../components/LineChart";
import Gauge2 from "../components/Gauge2";

function DashBoardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2 ">
      <div className="col-span-1 mt-2">
        <Temperature />
      </div>
      <div className="col-span-1 mt-2">
        <Gauge2 />
        {/* <Gauge title="Overall Progress" value={75} /> */}
      </div>
      <div className="col-span-1 mt-2 mr-8">
        <Statistics />
      </div>
      <div className="md:col-span-3">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2 md:col-span-1 ml-8">
            <LineChart />
          </div>
          <div className="col-span-2 md:col-span-1 mr-8">
            <MixedChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoardPage;
