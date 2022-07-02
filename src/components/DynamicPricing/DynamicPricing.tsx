import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import dayjs, { ConfigType } from "dayjs";
import toNumericStringWithDivider from "../../utils/toNumericStringWithDivider";
import styles from "./DynamicPricing.module.scss";

type ModuleType = typeof import("recharts");

export enum DynamicPricingTypes {
  District = "district",
  City = "city",
  Object = "object_id",
  AddCity = "add_city",
  AddDistrict = "add_district",
  AddObject = "add_object_id",
}

interface DynamicPricingType {
  typeName: DynamicPricingTypes;
  visualName?: string;
  color: string;
  stroke?: boolean;
  dashed?: boolean;
}

interface DynamicPricingEntity {
  date: number;
  city?: number;
  district?: number;
  object_id?: number;
  add_city?: number;
  add_district?: number;
  add_object_id?: number;
}

interface IDynamicPricing {
  types: DynamicPricingType[];
  data: DynamicPricingEntity[];
}

const getPreparedTypes = (types: DynamicPricingType[]) =>
  types.map((type) => ({ ...type, opacity: 1, active: true }));

const getDateFormated = (date: ConfigType) => dayjs(date).format("DD MMM");

const priceFormater = (price: number) =>
  toNumericStringWithDivider(Math.round(price));

const DynamicPricing = (props: IDynamicPricing) => {
  const canvasRef = useRef(null);
  const [rechartsModule, setRechartsModule] = useState<ModuleType | null>(null);
  const [types, setTypes] = useState(() => getPreparedTypes(props.types));

  useLayoutEffect(() => {
    const loadRecharts = async () => {
      const module = await import(
        /* webpackChunkName: "recharts" */ "recharts"
      );

      setRechartsModule(module);
    };

    loadRecharts();
  }, []);

  useEffect(() => {
    setTypes(getPreparedTypes(props.types));
  }, [props.types]);

  const renderDynamicPricing = () => {
    if (rechartsModule != null) {
      const {
        ResponsiveContainer,
        LineChart,
        CartesianGrid,
        XAxis,
        YAxis,
        Line,
      } = rechartsModule;

      return (
        <ResponsiveContainer width="100%" debounce={100}>
          <LineChart
            data={props.data}
            margin={{ top: 40, left: -25 }}
            defaultShowTooltip
          >
            <CartesianGrid
              horizontal
              vertical={false}
              horizontalFill={["#F8F9F9", "#FFFFFF"]}
              verticalFill={["#F8F9F9", "#FFFFFF"]}
            />
            <XAxis
              dataKey="date"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={getDateFormated}
              tick={{ fontSize: "14px", color: "#333" }}
              interval="preserveStartEnd"
              tickCount={8}
            />
            {types
              .filter((type) => type.active)
              .map(({ typeName, color, opacity, dashed }) => (
                <Line
                  key={typeName}
                  connectNulls
                  dataKey={typeName}
                  stroke={color}
                  strokeWidth="3"
                  dot={false}
                  strokeOpacity={opacity}
                  activeDot={dashed ? false : { r: 8 }}
                  strokeDasharray={dashed ? "4 4" : ""}
                  animationBegin={dashed ? 1000 : 0}
                />
              ))}
            <YAxis
              type="number"
              allowDataOverflow={false}
              domain={["auto", "auto"]}
              tickFormatter={priceFormater}
              width={100}
              tickSize={6}
              tickMargin={6}
              mirror={false}
              tickLine={true}
              axisLine={true}
              minTickGap={5}
              interval="preserveStartEnd"
              tickCount={5}
              tick={{ fontSize: "14px", color: "#333" }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return <div className={styles.loader}>Loading...</div>;
  };

  return (
    <div ref={canvasRef}>
      <div className={styles.root} style={{ height: "450px" }}>
        {renderDynamicPricing()}
      </div>
    </div>
  );
};

export default DynamicPricing;
