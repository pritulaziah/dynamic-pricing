import classNames from "classnames";
import { PreparedDynamicPricingType } from './DynamicPricing'
import styles from "./DynamicPricing.module.scss";

interface IProps {
  types: PreparedDynamicPricingType[];
  handleMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
  handleMouseLeave: () => void;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const CustomizedLegend = ({
  types,
  handleMouseEnter,
  handleMouseLeave,
  handleClick,
}: IProps) => (
  <div className={styles.legend}>
    <p className={styles.legendTitle}>
      Cost per m<sup>2</sup>
    </p>
    <ul className={styles.legendList}>
      {types
        .filter(({ visualName }) => visualName)
        .map(({ typeName, visualName, color, opacity, active }) => (
          <li
            key={typeName}
            className={styles.legendListItem}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            data-type={typeName}
          >
            <div
              className={classNames(styles.legendType, {
                [styles.legendTypeHover]: opacity !== 1,
                [styles.legendTypeDisable]: !active
              })}
              style={{
                backgroundColor: active
                  ? `rgba(${(color.match(/[\d, ]+/) as RegExpMatchArray)[0]}, 0.1)`
                  : "#F8F9F9"
              }}
            >
              <div className={styles.legendTypeInfo}>
                <svg height="2" width="14" className={styles.legendTypeInfoSurface}>
                  <path d="M 0, 1 L 14, 1" style={{ stroke: color }} />
                </svg>
                <span className={styles.legendTypeInfoText}>{visualName}</span>
              </div>
            </div>
          </li>
        ))}
    </ul>
  </div>
);

export default CustomizedLegend;
