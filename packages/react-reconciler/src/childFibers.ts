import { ReactElementType } from "shared/ReactTypes";
import { FiberNode, createFiberFromElement } from "./fiber";
import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { HostText } from "./workTags";
import { Placement } from "./fiberFlags";

//shouldTrackEffects用于判断是否需要确认副作用
function ChildReconciler(shoudlTrackEffects: boolean) {
    function reconcileSingleElement(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        element: ReactElementType
    ) {
        // 根据Element创建FiberNode并返回
        const fiber = createFiberFromElement(element);
        fiber.return = returnFiber;
        return fiber;

    }
    function reconcileSingleTextNode(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        content: string | number
    ) {
        const fiber = new FiberNode(HostText, { content }, null);
        fiber.return = returnFiber;
        return fiber;

    }

    // 传进来的fiber就是刚创建的fiber，肯定是workInProgress的fiber
    function placeSingleChild(fiber: FiberNode) {
        // 在应该追踪副作用+首屏渲染的情况下，才加入标记Placement
        if (shoudlTrackEffects && fiber.alternate === null) {
            fiber.flags |= Placement;
        }
        return fiber;
    }
    // 根据不同的shoudlTrackEffects返回不同的处理函数(beginWork函数中处理不同case会调用的函数)
    return function reconcileChildFibers(
        returnFiber: FiberNode,
        currentFiber: FiberNode | null,
        newChild?: ReactElementType
    ) {
        // 判断的那个前fiber的类型
        if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(
                        // 把新创建的fiber传给placeSingleChild
                        reconcileSingleElement(returnFiber, currentFiber, newChild)
                    );
                default:
                    if (__DEV__) {
                        console.warn("未实现的reconcile类型", newChild)

                    }
                    break;
            }

        }
        // 多节点的情况 TODO
        //  HostText
        if (typeof newChild === 'string' || typeof newChild === 'number') {
            return placeSingleChild(
                reconcileSingleTextNode(returnFiber, currentFiber, newChild)
            );
        }
        if (__DEV__) {
            console.warn("未实现的reconcil类型", newChild)

        }
        // return FiberNode
        return null;

    };
}



export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);