import EncodeForm from "@/components/EncodeForm";
import ToolPanel from "@/components/dashboard/ToolPanel";

export default function EncodePage() {
  return (
    <ToolPanel
      title="Word Encoder"
      description="Encode sensitive text into numeric indices separated by dots."
    >
      <EncodeForm />
    </ToolPanel>
  );
}
