import EncodeForm from "@/components/EncodeForm";
import ToolPanel from "@/components/dashboard/ToolPanel";
import toolsConfig from "../../../core/json/tools.config.json";

const { tools } = toolsConfig.categories[0];
const { title, description } = tools[0];

export default function EncodePage() {
  return (
    <ToolPanel title={title} description={description}>
      <EncodeForm />
    </ToolPanel>
  );
}
