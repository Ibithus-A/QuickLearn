export type NodeKind = "page" | "folder";

export interface FlowNode {
  id: string;
  kind: NodeKind;
  title: string;
  parentId: string | null;
  childrenIds: string[];
  content: string;
  isLocked: boolean;
  isUnlockedOverride: boolean;
  isExpanded: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface FlowState {
  nodes: Record<string, FlowNode>;
  rootIds: string[];
  selectedId: string | null;
}
