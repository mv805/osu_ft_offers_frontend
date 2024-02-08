import AddOffer from "@/components/page";
import { Metric, Subtitle, Card} from "@tremor/react";

const backendPort = 3030;

export default function Home() {
  return (
    <main className="p-10">
      <Metric>OSU Fulltime Offer Database</Metric>
      <Subtitle>A public service project to help OSU and other students understand the current job hunting landscape</Subtitle>
      <AddOffer port={backendPort}/>
      <Card>Another component...</Card>
    </main>
  );
}
