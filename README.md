# Journey Builder

A React app for configuring **prefill mappings** across a DAG of forms. It fetches an
action blueprint graph, renders the forms, and lets you map each field of a form to a
value from another form or from global data so a downstream form can be prefilled
from the forms it depends on.

The headline design goal is **extensible prefill data sources**: form fields, global
data, and any future source are all plugged in through one registry, so adding a new
source needs no changes to the UI or the value resolver. See
[Extending with a new data source](#extending-with-a-new-data-source).

---

## Background

Node-based **flows and workflows** are the domain I worked in at **Ikigai Labs**. DAGs
of steps where each node's output feeds downstream nodes. That experience shaped several
decisions here:

- **A registry of prefill data sources** rather than hard-coded branches, because in a
  real workflow product the set of mappable data sources grows constantly (form fields,
  global data, computed values, external APIs). New sources should be additive, not edits
  to the UI.
- **Explicit direct vs. transitive dependency traversal** of the DAG, since prefill in a
  workflow needs to surface values from the whole upstream subgraph, not just immediate
  parents.
- **Separating the stored mapping (`PrefillSource`) from value resolution**, so the same
  configuration can be re-resolved as upstream data changes — the pattern a workflow
  engine needs at execution time.

---

## Features

- Fetches the `action-blueprint-graph-get` endpoint and renders the form DAG on a canvas.
- Click a form node to view and edit its prefill mapping.
- Per field you can:
  - pick a source from a picker grouped by **direct dependencies**, **transitive
    dependencies**, and **global data**;
  - clear a mapping with the **×** button.
- Submitting a form commits its values (manual or prefilled) to global state, where they
  become available to downstream forms.

---

## Tech stack

| Concern               | Choice                                               |
| --------------------- | ---------------------------------------------------- |
| UI                    | React 19, [Ant Design](https://ant.design/)          |
| Graph canvas          | [@xyflow/react](https://reactflow.dev/) (React Flow) |
| State & data fetching | Redux Toolkit + RTK Query                            |
| Build tooling         | Vite 8, TypeScript                                   |
| Tests                 | Vitest, React Testing Library                        |

---

## Getting started

### Prerequisites

- **Node.js 20.19+ or 22.12+** (Vite 8 requirement)
- A running **mock server** that serves the blueprint graph (see below)

### 1. Install

```bash
npm install
```

### 2. Run the mock server

The app fetches the blueprint graph over HTTP; it does not bundle a server. Run the mock
server provided with the challenge so it listens on **`http://localhost:3000`** and serves:

```
GET /api/v1/:tenantId/actions/blueprints/:blueprintId/graph
```

### 3. Configure the endpoint (optional)

The endpoint is configurable through environment variables. Defaults are sensible for the
local mock server, so a `.env` is optional. Create one only to override them:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000
VITE_TENANT_ID=1
VITE_BLUEPRINT_ID=bp_01jk766tckfwx84xjcxazggzyc
```

| Variable            | Default                         | Purpose                             |
| ------------------- | ------------------------------- | ----------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:3000`         | Base URL of the mock server         |
| `VITE_TENANT_ID`    | `1`                             | Tenant segment of the endpoint path |
| `VITE_BLUEPRINT_ID` | `bp_01jk766tckfwx84xjcxazggzyc` | Blueprint to load                   |

### 4. Run the app

```bash
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

---

## Project structure

```
src/
├── api/blueprint-graph/      # RTK Query endpoint + response types
├── app/                      # Redux store (makeStore factory) + typed hooks
├── components/
│   ├── blueprint-flow/       # React Flow canvas (fetch, loading/error, nodes/edges)
│   ├── blueprint-nodes/      # Node renderers
│   └── form-modal/           # Form view + prefill UI (modal, field rows, picker)
├── data-sources/             # ⭐ Pluggable prefill data sources (the extension point)
│   ├── types.ts              #   PrefillDataSource interface + option types
│   ├── form-field-source.ts  #   Source: fields of upstream forms (direct/transitive)
│   ├── global-data.ts        #   Source: global data (Action / Org properties)
│   └── registry.ts           #   PREFILL_DATA_SOURCES — register sources here
├── features/                 # Redux slices: form, prefill, modal
├── utils/                    # DAG traversal, value resolution, scope/label helpers
└── test/                     # Shared graph fixture for tests
```

---

## How prefill works

1. **Discover sources.** When you open a field's picker, every registered data source is
   asked for the options it can offer for the current node
   (`PrefillDataSource.getOptionGroups`). The form-field source walks the DAG via
   [`getUpstreamNodes`](src/utils/get-upstream-nodes.ts) to find direct and transitive
   dependencies; the global-data source returns its static namespaces.
2. **Store the mapping.** Choosing an option saves a `PrefillSource` (a discriminated
   union tagged by `type`) into the `prefill` slice, keyed by node and field.
3. **Resolve the value.** On submit, [`resolvePrefillValue`](src/utils/resolve-prefill-value.ts)
   delegates to the data source that owns the mapping's `type` to produce the concrete
   value, which is committed to the `form` slice.

The picker UI and the resolver never branch on a specific source. They iterate the
registry, which is what makes new sources drop-in.

---

## Extending with a new data source

Adding a data source takes **three steps and touches no existing UI or resolver code**.
Use [`global-data.ts`](src/data-sources/global-data.ts) as a reference implementation.

Say you want to add a "Constants" source:

**1. Add a variant to the `PrefillSource` union** in
[`src/features/prefill/prefill-slice.ts`](src/features/prefill/prefill-slice.ts):

```ts
export type PrefillSource =
  | {
      type: 'form-field';
      label: string;
      sourceNodeId: string;
      sourceFieldKey: string;
    }
  | { type: 'global-data'; label: string; sourceKey: string }
  | { type: 'constant'; label: string; value: string }; // 👈 new
```

**2. Implement `PrefillDataSource`** in a new file under `src/data-sources/`:

```ts
// src/data-sources/constant-source.ts
import type { PrefillDataSource } from './types';

const CONSTANTS = [
  { key: 'today', label: "Today's date", value: new Date().toISOString() },
  { key: 'app-name', label: 'App name', value: 'Journey Builder' },
];

export const constantSource: PrefillDataSource = {
  type: 'constant',

  // What the picker shows. `ctx` has { graph, node } if you need the DAG.
  getOptionGroups() {
    return [
      {
        id: 'constants',
        title: 'Constants',
        badge: 'constant',
        options: CONSTANTS.map((c) => ({
          id: c.key,
          label: c.label,
          source: { type: 'constant', label: c.label, value: c.value },
        })),
      },
    ];
  },

  // How a chosen option becomes a value at submit time.
  resolve(source) {
    if (source.type !== 'constant') return undefined;
    return source.value;
  },
};
```

**3. Register it** in [`src/data-sources/registry.ts`](src/data-sources/registry.ts):

```ts
import { constantSource } from './constant-source';

export const PREFILL_DATA_SOURCES: PrefillDataSource[] = [
  formFieldSource,
  globalDataSource,
  constantSource, // 👈 now appears in the picker and resolves automatically
];
```

That's it. The picker ([`PrefillModal`](src/components/form-modal/PrefillModal.tsx)) and
the resolver ([`resolvePrefillValue`](src/utils/resolve-prefill-value.ts)) consume the
registry directly, so neither needs to change.

> Optional: give your badge a color in the `BADGE_COLORS` map in `PrefillModal.tsx`
> (unknown badges fall back to a neutral color).

---

## Testing

```bash
npm test
```

The suite covers three layers:

- **Unit** — DAG traversal, value resolution, scope/label helpers, and the form/prefill
  reducers (`src/utils/*.test.ts`, `src/features/**/*.test.ts`).
- **Data sources** — the registry and each source's options/resolution, including that a
  source rejects mappings it doesn't own (`src/data-sources/data-sources.test.ts`).
- **Integration** — the prefill flows through the real components and store with React
  Testing Library: submit commits to global state, the toggle swaps inputs for prefill
  rows, and selecting a source maps the field and reflects it in the modal
  (`src/components/form-modal/FormModal.test.tsx`).
