import { Container, appendChildToContainer } from "hostConfig";
import { FiberNode, FiberRootNode } from "./fiber";
import { MutationMask, NoFlags, Placement } from "./fiberFlags";
import { HostComponent, HostRoot, HostText } from "./workTags";

let nextEffect: FiberNode | null = null;


export const commitMutationEffects = (finishedWork: FiberNode) => {

    nextEffect = finishedWork;
    while (nextEffect !== null) {
        // 向下遍历
        const child: FiberNode | null = nextEffect.child;

        if ((nextEffect.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
            // 向子节点遍历 直到找到第一个自身flags需要mutation的fiber
            nextEffect = child;

        } else {
            // 此时找到最底下的那个需要mutation的fiber节点
            // 向上回溯
            up: while (nextEffect !== null) {
                commitMutationEffectsOnFiber(nextEffect);
                const sibling: FiberNode | null = nextEffect.sibling;
                if (sibling !== null) {
                    nextEffect = sibling;
                    break up;
                }
                nextEffect = nextEffect.return;
            }
        }
    }

}


const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
    const flags = finishedWork.flags;
    // Placement
    if ((flags & Placement) !== NoFlags) {
        commitPlacement(finishedWork);
        finishedWork.flags &= ~Placement; // 移除Placement

    }
    // flags Update
    // flags ChildDeletion

}

const commitPlacement = (finishedWork: FiberNode) => {
    // 1. 插入到parent DOM

    if (__DEV__) {
        console.warn('commit阶段的commitPlacement', finishedWork);
    }
    // 获取parent DOM
    const hostParent = getHostParent(finishedWork) as Container;
    // 2. 根据finishedWork这个fiber找到对应的DOM节点
    appendPlacementNodeIntoContainer(finishedWork, hostParent);

}

function getHostParent(fiber: FiberNode) {
    let parent = fiber.return;
    while (parent) {
        const parentTag = parent.tag;
        //两种情况说明是宿主节点 HostComponent HostRoot   
        if (parentTag === HostComponent) {
            return parent.stateNode as Container;
        }
        if (parentTag === HostRoot) {  // 参考HostRoot结构
            return (parent.stateNode as FiberRootNode).container;
        }
        parent = parent.return;  // 往上找直到找到Host节点
    }
    if (__DEV__) {
        console.warn('未找到HostRoot')
    }
    return null;
}

// 此函数用于将传入的finishedWork节点对应的dom插入到hostParent中
function appendPlacementNodeIntoContainer(
    finishedWork: FiberNode,
    hostParent: Container
) {
    // 当前的finishedWork对应的不一定是host(dom)节点，所以是一个递归的过程
    //（对于插入的节点肯定不可能是HostRoot）
    if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
        appendChildToContainer(hostParent, finishedWork.stateNode);
        return;
    }
    // 如果当前finishedWork对应的不是host节点，对孩子递归操作（包括sibling）
    // 递归调用本函数，找到对应的 dom 然后插入
    const child = finishedWork.child;
    if (child !== null) {
        appendPlacementNodeIntoContainer(child, hostParent);
        let sibling = child.sibling;
        while (sibling !== null) {
            appendPlacementNodeIntoContainer(sibling, hostParent)
            sibling = sibling.sibling;
        }
    }


}