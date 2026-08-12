import { convertWord } from "@/app/actions";
import ToolForm from "./ToolForm";

export default function EncodeForm() {
  return (
    <ToolForm
      action={convertWord}
      label="Text to encode"
      placeholder="e.g. hello"
      submitLabel="Encode"
      pendingLabel="Encoding…"
      resultLabel="Encoded result"
    />
  );
}
