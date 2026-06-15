import { useGetBlueprintGraphQuery } from '@/api/blueprint-graph/blueprint-graph-api';

import './App.css';

function App() {
  const { data: graph } = useGetBlueprintGraphQuery();

  return <></>;
}

export default App;
