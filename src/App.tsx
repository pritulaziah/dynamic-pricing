import { useState } from "react";
import "./App.css";
import DynamicPricing, {
  DynamicPricingTypes,
  DynamicPricingEntity,
} from "./components/DynamicPricing";

const types = [
  {
    typeName: DynamicPricingTypes.District,
    visualName: "By district",
    color: "rgb(254, 171, 76)",
  },
  {
    typeName: DynamicPricingTypes.City,
    visualName: "In the city",
    color: "rgb(41, 143, 202)",
  },
  {
    typeName: DynamicPricingTypes.Object,
    visualName: "This object",
    color: "rgb(97, 189, 79)",
  },
];

// pseudo generator
const generateRandomData = () => {
  const randomInteger = (min: number, max: number) => {
    const rand = min - 0.5 + Math.random() * (max - min + 1);

    return Math.round(rand);
  };
  const randomDirection = (min: number, max: number) => {
    let result = 0;

    while (result === 0) {
      result = randomInteger(min, max);
    }

    return result;
  };

  let directions = {
    [DynamicPricingTypes.District]: randomDirection(-1, 1),
    [DynamicPricingTypes.City]: randomDirection(-1, 1),
    [DynamicPricingTypes.Object]: randomDirection(-1, 1),
  };

  const getDiff = (i: number, currentType: DynamicPricingTypes) => {
    if (i % 5 === 0) {
      directions[currentType] = randomDirection(-1, 1);
    }

    return randomInteger(1, 3) * 1000 * directions[currentType];
  };

  const minDate = 1607126400000;
  let prevDate = minDate;
  const result = [];
  let prevCity = randomInteger(5000, 10000);
  let prevDistrict = randomInteger(5000, 10000);
  let prevObject = randomInteger(5000, 10000);
  const arrayLength = randomInteger(30, 100);
  const skipCount = randomInteger(5, Math.round(Math.sqrt(arrayLength)));

  for (let i = 0; i < arrayLength; i++) {
    const date = prevDate + randomInteger(1, i) * 86400000;
    prevDate = date;
    const city = prevCity + getDiff(i, DynamicPricingTypes.City);
    const district = prevDistrict + getDiff(i, DynamicPricingTypes.District);
    const entity: DynamicPricingEntity = { date, city, district };

    if (i > skipCount) {
      const object = prevObject + getDiff(i, DynamicPricingTypes.Object);
      entity.object = object;
    }

    result.push(entity);
  }

  return result;
};

function App() {
  const [data, setData] = useState(() => generateRandomData());

  const onClick = () => setData(generateRandomData());

  return (
    <div className="App">
      <div>
        <button onClick={onClick}>Regenerate random data</button>
      </div>
      <DynamicPricing types={types} data={data} />
    </div>
  );
}

export default App;
