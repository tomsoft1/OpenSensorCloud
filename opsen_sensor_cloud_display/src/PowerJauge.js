import React from "react";
import Gauge from "./Gauge";
/*
interface PowerProps {
  value: number;
}
*/
export function PowerJauge(props) {
  const { value } = props;

  return (
    <div className="p-4">
              <Gauge
                value={value}
                max={10000}
                width={200}
                height={160}
                label="Current usage"
                color={value>6000?"#fe0400":(value>2000?"#fef400":"#00f400")}
                valueFormatter={value => {
                  if (value > 6000) {
                    return '😣';
                  }

                  if (value > 2000) {
                    return '😒';
                  }

                  return '😁';
                }

              } />
      <div key='la'>Value:{value} </div>
    </div>
  );
}
