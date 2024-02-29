import AddOffer from "@/components/AddOffer";

const backendPort = 3030;

export default function AddData() {
  return (
    <main className="p-10">
      <AddOffer port={backendPort} />
    </main>
  );
}
