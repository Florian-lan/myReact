import { Container, appendInitialChild, createInstance, createTextInstance } from "hostConfig";
import { HostComponent, HostRoot, HostText } from "./workTags";
import { FiberNode } from "./fiber";
import { NoFlags } from "./fiberFlags";

// 深度优先递归中的“归”： 构建离屏的DOM树 + 将flag冒泡到上级  TODO为啥
// 因为completeWork是向上回溯的过程，所以此时遍历到的每一个节点都是当前最靠上的一个节点
// 基于此，理解completWork的插入操作和 flags 的 bubble操作
export const completeWork = (workInProgress: FiberNode) => {
    const newProps = workInProgress.pendingProps;
    const current = workInProgress.alternate;

    switch (workInProgress.tag) {
        case HostComponent:

            if (current !== null && workInProgress.stateNode) {
                // update阶段，此时stateNode存的就是对应的dom
            } else {
                // mount阶段（首屏渲染）
                // 1. 构建dom （在宿主包中完）
                const instance = createInstance(workInProgress.type, newProps);
                // 2. 将dom插入到dom树中: 将剩下的workInProgress中的dom挂载到新创建的instance下
                appendAllChild(instance, workInProgress);
                workInProgress.stateNode = instance;
            }
            bubbleProperties(workInProgress);
            return null;
        case HostText:

            if (current !== null && workInProgress.stateNode) {
                // update阶段，此时stateNode存的就是对应的dom
            } else {
                // mount阶段（首屏渲染）
                // 1. 构建dom （在宿主包中完成）
                const instance = createTextInstance(newProps.content);
                // 2. 将dom插入到dom树中:  因为对于HostText是没有Child，不需要执行以下方法；
                // appendAllChild(instance, workInProgress);
                workInProgress.stateNode = instance;
            }
            bubbleProperties(workInProgress);
            return null;
        case HostRoot:
            bubbleProperties(workInProgress);
            return null;
        default:
            if (__DEV__) {
                console.warn("未处理的complete边界情况", workInProgress);


            }
            break;
    }

}


// 如workInprogress Fiber是一个函数 function A(){return <div></div>}
// 我们要插入的是A的子节点的div这个dom元素
function appendAllChild(parent: Container, workInProgress: FiberNode) {
    let node = workInProgress.child;

    while (node !== null) {


        if (node.tag === HostComponent || node.tag === HostText) {
            // 插入
            appendInitialChild(parent, node?.stateNode);

        } else if (node.child !== null) { // 有孩子继续往下
            node.child.return = node;
            node = node.child;
            continue;
        }
        // 在递归的过程中，最终会往上归，归到头就结束
        if (node === workInProgress) {
            return;
        }

        // 往下没找到，找兄弟也没找到 -> 该往上归了
        if (node.sibling === null) {
            if (node.return === null || node.return === workInProgress) {
                return;
            }
            node = node?.return; // 往上归
        } else {
            node.sibling.return = node.return;
            node = node.sibling;

        }


    }
}

function bubbleProperties(workInProgress: FiberNode) {
    let subtreeFlags = NoFlags;
    let child = workInProgress.child;

    // 将孩子（兄弟姐妹的）的副作用都冒泡到当前节点来
    while (child !== null) {
        subtreeFlags |= child.subtreeFlags;
        subtreeFlags |= child.flags;

        child.return = workInProgress;
        child = child.sibling;
    }
    workInProgress.subtreeFlags |= subtreeFlags;


}