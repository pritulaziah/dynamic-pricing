import { useEffect, useLayoutEffect, useState } from "react";
import dayjs, { ConfigType } from "dayjs";
import toNumericStringWithDivider from "../../utils/toNumericStringWithDivider";
import styles from "./DynamicPricing.module.scss";
import CustomizedLegend from "./CustomizedLegend";
import CustomizedTooltip from "./CustomizedTooltip";

type ModuleType = typeof import("recharts");

export enum DynamicPricingTypes {
  District = "district",
  City = "city",
  Object = "object",
}

interface DynamicPricingType {
  typeName: DynamicPricingTypes;
  visualName?: string;
  color: string;
}

export interface PreparedDynamicPricingType extends DynamicPricingType {
  opacity: number;
  active: boolean;
}

export interface DynamicPricingEntity {
  date: number;
  city?: number;
  district?: number;
  object?: number;
}

interface IProps {
  types: DynamicPricingType[];
  data: DynamicPricingEntity[];
}

const CANVAS_FILL = ["#F8F9F9", "#FFFFFF"];

const getPreparedTypes = (types: DynamicPricingType[]) =>
  types.map((type) => ({ ...type, opacity: 1, active: true }));

const getDateFormated = (date: ConfigType) => dayjs(date).format("DD MMM");

const priceFormater = (price: number) =>
  toNumericStringWithDivider(Math.round(price));

const DynamicPricing = (props: IProps) => {
  const [rechartsModule, setRechartsModule] = useState<ModuleType | null>(null);
  const [types, setTypes] = useState<PreparedDynamicPricingType[]>(
    getPreparedTypes(props.types)
  );

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

  const handleMouseEnterLegend = (event: React.MouseEvent<HTMLElement>) => {
    const { currentTarget } = event;
    const {
      dataset: { type: currentTypeName },
    } = currentTarget;
    const activeType = types.find((type) => type.typeName === currentTypeName);

    if (activeType?.active) {
      setTypes((prevTypes) =>
        prevTypes.map((type) =>
          type.typeName !== currentTypeName && type.active
            ? { ...type, opacity: 0.5 }
            : type
        )
      );
    }
  };

  const handleMouseLeaveLegend = () => {
    setTypes((prevTypes) => prevTypes.map((type) => ({ ...type, opacity: 1 })));
  };

  const handleClickLegend = (event: React.MouseEvent<HTMLElement>) => {
    const { currentTarget } = event;
    const {
      dataset: { type: currentTypeName },
    } = currentTarget;

    currentTypeName &&
      setTypes((prevTypes) =>
        prevTypes.map((type) =>
          type.typeName === currentTypeName
            ? { ...type, active: !type.active }
            : type
        )
      );
  };

  const renderDynamicPricing = () => {
    if (rechartsModule != null) {
      const {
        ResponsiveContainer,
        LineChart,
        CartesianGrid,
        XAxis,
        YAxis,
        Line,
        Legend,
        Tooltip,
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
              horizontalFill={CANVAS_FILL}
              verticalFill={CANVAS_FILL}
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
            <Tooltip content={<CustomizedTooltip types={types} />} />
            <Legend
              verticalAlign="top"
              wrapperStyle={{ top: 20, left: 0, width: "100%" }}
              content={
                <CustomizedLegend
                  types={types}
                  handleMouseEnter={handleMouseEnterLegend}
                  handleMouseLeave={handleMouseLeaveLegend}
                  handleClick={handleClickLegend}
                />
              }
            />
            {types
              .filter((type) => type.active)
              .map(({ typeName, color, opacity }) => (
                <Line
                  key={typeName}
                  connectNulls
                  dataKey={typeName}
                  stroke={color}
                  strokeWidth="3"
                  dot={false}
                  strokeOpacity={opacity}
                  activeDot={{ r: 8 }}
                  animationBegin={100}
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
    <div className={styles.root} style={{ height: "450px" }}>
      {renderDynamicPricing()}
    </div>
  );
};

export default DynamicPricing;
