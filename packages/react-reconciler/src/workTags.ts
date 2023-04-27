// 记录FiberNode的tag属性，记录fiber节点的类型，如是不是根节点，是不是函数fiber等


export type WorkTag =
    | typeof FunctionComponent
    | typeof HostRoot
    | typeof HostComponent
    | typeof HostText;

export const FunctionComponent = 0;
export const HostRoot = 3; // 就是如React.render()挂载的根节点 hostRootFiber类型
export const HostComponent = 5 // 如 div
export const HostText = 6; // 如<div> 123</div> 中的123

