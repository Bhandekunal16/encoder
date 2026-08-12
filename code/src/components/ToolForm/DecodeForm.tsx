import { revertWord } from "@/app/actions";
import ToolForm from "./ToolForm";

export default function DecodeForm() {
  return (
    <ToolForm
      action={revertWord}
      label="Encoded text"
      placeholder="e.g. 7.4.11.11.14"
      submitLabel="Decode"
      pendingLabel="Decoding…"
      resultLabel="Decoded result"
      encodedInput
    />
  );
}
