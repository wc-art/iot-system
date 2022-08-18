export function getTreeNodeIdsByNode(tree) {
  let result = [];
  result.push(tree.treeId);
  if (tree.children) {
    tree.children.forEach(child => {
      result = result.concat(getTreeNodeIdsByNode(child));
    });
  }
  return result;
}
