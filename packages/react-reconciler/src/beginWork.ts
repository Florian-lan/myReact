import { ReactElementType } from "shared/ReactTypes";
import { FiberNode } from "./fiber";
import { UpdateQueue, processUpdateQueue } from "./updateQueue";
import { HostRoot, HostComponent, HostText } from "./workTags";
import { mountChildFibers, reconcileChildFibers } from "./childFibers";


// 深度优先递归中的“递”阶段
export const beginWork = (workInProgress: FiberNode) => {
    // 比较current和workInProgress，然后返回子节点进行递归
    switch (workInProgress.tag) {
        // 进行处理，然后返回workInProgress的子节点继续往下遍历
        // 处理方式：根据dom节点完成“创建、复用和更新Fiber对象”
        case HostRoot:
            return updateHostRoot(workInProgress);
        case HostComponent:
            return updateHostComponent(workInProgress);  // 
        case HostText:
            // 就是更新到了叶子节点，比如<div>123</div> 这个123是没有对应的FiberNode的
            return null;
        default:
            if (__DEV__) {
                console.warn('beginWork未实现的类型');
            }
            break;
    }
    return null;
}


function updateHostRoot(workInProgress: FiberNode) {
    const baseState = workInProgress.memoizedProps;
    const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
    const pending = updateQueue.shared.pending;  // 将pending的所有update拿出来计算
    updateQueue.shared.pending = null;  // 拿出来计算之后，这些update就不需要了

    // 基于baseState和update进行计算新的State
    const { memoizedState } = processUpdateQueue(baseState, pending);
    workInProgress.memoizedState = memoizedState;  // 计算完之后进行复制

    // 其实对于HostRoot来说，这里的memoizedState就是<App/>对应的FIberNode这个
    const nextChildren = workInProgress.memoizedState;
    reconcileChildren(workInProgress, nextChildren); // 该方法返回子FiberNode
    return workInProgress.child;
}



function updateHostComponent(workInProgress: FiberNode) {
    const nextProps = workInProgress.pendingProps;
    const nextChildren = nextProps.children;

    reconcileChildren(workInProgress, nextChildren) // TODO 这个函数是干啥的：根据reactElement生成fiber节点，并拼在fiber树上
    return workInProgress.child;

}


function reconcileChildren(workInProgress: FiberNode, children?: ReactElementType) {
    const current = workInProgress.alternate;

    if (current !== null) {
        // 对于HostRootFiber节点总会进入当前阶段
        // update phase
        workInProgress.child = reconcileChildFibers(workInProgress, current?.child, children);
    } else {
        // mount phase
        workInProgress.child = mountChildFibers(workInProgress, null, children)
    }
    // 第二三个参数是比较双方，比较当前节点的child，以及这个child对应的ReactElement
    
}