import Chart from "@/components/dashchart";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Chart symbol="EURUSD" timeframe="D1" numBars={50} />
    </div>
  );
}
