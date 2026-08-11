import DecodeForm from "@/components/DecodeForm";
import ToolPanel from "@/components/dashboard/ToolPanel";

export default function DecodePage() {
  return (
    <ToolPanel
      title="Word Decoder"
      description="Decode numeric indices back to plain text."
    >
      <DecodeForm />
    </ToolPanel>
  );
}
