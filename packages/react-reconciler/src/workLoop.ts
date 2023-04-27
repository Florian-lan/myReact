import { beginWork } from "./beginWork";
import { commitMutationEffects } from "./commitWork";
import { completeWork } from "./completeWork";
import { FiberNode, createWorkInProgress, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags } from "./fiberFlags";
import { HostRoot } from "./workTags";

let workInProgress: FiberNode | null = null;


export function scheduleUpdateOnFiber(fiber: FiberNode) {
    // TODO 调度功能
    const root = markUpdateFromFiberToRoot(fiber);
    renderRoot(root);

}
function markUpdateFromFiberToRoot(fiber: FiberNode) {
    let node = fiber;
    let parent = node.return;
    while (parent !== null) {
        node = parent;
        parent = node.return;
    }
    // 跳出循环了，说明找到了根节点
    if (node.tag === HostRoot) {
        return node.stateNode;  // hostRootFiber.stateNode 保存的是FiberRootNode，
    }
    return null;
}

// 这里传入的fiber其实是hostRootFiber
function prepareFreshStack(root: FiberRootNode) {
    workInProgress = createWorkInProgress(root.current, {});
}

function renderRoot(root: FiberRootNode) {
    // 初始化，如初始化workInProgress指针
    prepareFreshStack(root);

    const temp = true;
    // 开始递归流程
    do {
        try {
            workLoop();
            break;
        } catch (e) {
            if (__DEV__) {
                console.warn("workLoop Wrong", e);
            }

            workInProgress = null;
        }
    } while (temp);
    // root就是传入的FiberRootNode节点
    // root.current 是指向hostRootFiber节点
    // root.current.alternate 是我们在workLoop创建好的workInProgress指向的fiber树
    const finishedWork = root.current.alternate;
    root.finishedWork = finishedWork;


    commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
    const finishedWork = root.finishedWork;
    if (finishedWork === null) {
        return;
    }
    if (__DEV__) {
        console.warn('commit阶段开始', finishedWork);

    }

    // 重置
    root.finishedWork = null;

    // 判断是否存在三个子阶段需要执行的操作
    // MutationMask就是Placement update等三个的合集， 下列语句用来判断子树副作用是否包含在mutation需要执行的这三个副作用
    const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask) !== NoFlags;
    const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags;

    if (subtreeHasEffect || rootHasEffect) {
        // 1. beforeMutation
        // 2. mutation(主要是Placement)
        commitMutationEffects(finishedWork);
        root.current = finishedWork;
        // 3. layout

    }else{
        // 不需要执行这些操作
        root.current = finishedWork;
    }

}
function workLoop() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }

}
function performUnitOfWork(fiber: FiberNode) {
    const next = beginWork(fiber);
    fiber.memoizedProps = fiber.pendingProps;
    if (next === null) {
        completeUnitOfWork(fiber);
    } else {
        workInProgress = next;
    }
}

// 遍历到底部了，判断该节点有没有兄弟节点

function completeUnitOfWork(fiber: FiberNode) {
    let node: FiberNode | null = fiber;
    do {
        completeWork(node);
        const sibling = node.sibling;
        if (sibling !== null) {
            workInProgress = sibling;
            return;
        }
        // 如果没有兄弟节点，向上回溯（归）
        node = node.return;
        workInProgress = node;

    } while (node !== null)
}
