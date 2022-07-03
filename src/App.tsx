import './App.css';
import DynamicPricing, { DynamicPricingTypes } from './components/DynamicPricing'
import dynamicPricingData from "./fakeDynamicPricingData.json";

function App() {
  // TODO: random data
  const types = [
    {
      typeName: DynamicPricingTypes.District,
      visualName: "By district",
      color: "rgb(254, 171, 76)"
    },
    { typeName: DynamicPricingTypes.City, visualName: "In the city", color: "rgb(41, 143, 202)" },
    {
      typeName: DynamicPricingTypes.Object,
      visualName: "This object",
      color: "rgb(97, 189, 79)"
    },
  ]

  return (
    <div className="App">
      <DynamicPricing types={types} data={dynamicPricingData} />
    </div>
  );
}

export default App;
