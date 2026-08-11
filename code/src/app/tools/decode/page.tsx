import DecodeForm from "@/components/DecodeForm";
import ToolPanel from "@/components/dashboard/ToolPanel";
import toolsConfig from "../../../core/json/tools.config.json";

const { tools } = toolsConfig.categories[0];
const { title, description } = tools[1];

export default function DecodePage() {
  return (
    <ToolPanel title={title} description={description}>
      <DecodeForm />
    </ToolPanel>
  );
}
