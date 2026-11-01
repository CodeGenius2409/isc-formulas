export default function ToolsView({ toolId }: { toolId: string | null }) {
  return <div className="page-pad"><h1 className="text-step-3">Tools</h1><p>{toolId}</p></div>;
}
