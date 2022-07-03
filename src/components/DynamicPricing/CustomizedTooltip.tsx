import dayjs from "dayjs";
import { TooltipProps } from "recharts";
import { PreparedDynamicPricingType } from "./DynamicPricing";
import toNumericStringWithDivider from "../../utils/toNumericStringWithDivider";
import styles from "./DynamicPricing.module.scss";

interface IProps extends TooltipProps<number, number> {
  types: PreparedDynamicPricingType[];
}

const CustomizedTooltip = ({ label, payload, types }: IProps) => {
  if (payload && payload.length > 0) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>
          {dayjs(label).format("DD MMMM YYYY")}
        </p>
        <ul className={styles.tooltipList}>
          {payload.map(({ dataKey, value, color }) => {
            const { visualName } =
              types.find(({ typeName }) => typeName === dataKey) || {};

            if (!value || !visualName) {
              return null;
            }

            return (
              <li
                key={dataKey}
                className={styles.tooltipListItem}
                style={{ color }}
              >
                <span>{visualName}</span>
                <span>: </span>
                <span>
                  {`${toNumericStringWithDivider(value)}/`}m<sup>2</sup>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return null;
};

export default CustomizedTooltip;
