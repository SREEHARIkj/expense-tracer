import { curveBasis } from "@visx/curve";
import { LinePath } from "@visx/shape";
import { scaleTime, scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { timeFormat } from "@visx/vendor/d3-time-format";

type DateValue = {
  date: Date;
  value: number;
};
export type GlyphProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  data: DateValue[] | undefined;
};

const defaultMargin = { top: 10, right: 10, bottom: 50, left: 10 };

export const purple3 = "#a44afe";
export const background = "#eaedff";

const CurveChart = ({
  width,
  height,
  margin = defaultMargin,
  data,
}: GlyphProps) => {
  if (!data) return <div>No data available</div>;

  // accessors
  const date = (d: DateValue) => d.date.valueOf();
  const value = (d: DateValue) => d.value;

  // scales
  const xScale = scaleTime<number>({
    domain: [Math.min(...data?.map(date)), Math.max(...data?.map(date))],
  });
  const yScale = scaleLinear<number>({
    domain: [0, Math.max(...data?.map(value))],
  });

  // positions
  const getX = (d: DateValue) => xScale(date(d)) ?? 0;
  const getY = (d: DateValue) => yScale(value(d)) ?? 0;

  // bounds

  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale range to match bounds
  xScale.range([margin.left, xMax - margin.right]);
  yScale.range([yMax - margin.bottom, margin.top]);

  // format date
  const format = timeFormat("%B %d");

  return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill={"#ffffff"}
        />
        <Group left={margin.left} top={margin.top}>
          <LinePath
            curve={curveBasis}
            data={data}
            x={getX}
            y={getY}
            stroke="#000"
            strokeWidth={3}
            strokeOpacity={1}
          />
        </Group>
        <Group left={margin.left} top={height - margin.bottom}>
          <AxisBottom
            scale={xScale}
            tickFormat={(value) => format(new Date(value as number))}
            label="Date"
            stroke={purple3}
            tickStroke={purple3}
            numTicks={7}
            tickLabelProps={{
              fill: purple3,
              fontSize: 11,
              textAnchor: "middle",
            }}
          />
        </Group>
      </svg>
    </div>
  );
};

export default CurveChart;
