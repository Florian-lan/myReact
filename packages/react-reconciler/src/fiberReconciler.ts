import { Container } from "hostConfig";
import { FiberNode } from "./fiber";
import { FiberRootNode } from "./fiber";
import { HostRoot } from "./workTags";
import { createUpdateQueue, enqueueUpdate, createUpdate, UpdateQueue } from "./updateQueue";
import { ReactElementType } from "shared/ReactTypes";
import { scheduleUpdateOnFiber } from "./workLoop";

// 在ReactDOMRoot.createRoot时，调用用于创建hostRootFiber和FiberRootNode
export function createContainer(container: Container): FiberRootNode {
    const hostRootFiber = new FiberNode(HostRoot, {}, null); // tag为HostRoot
    const root = new FiberRootNode(container, hostRootFiber);
    hostRootFiber.updateQueue = createUpdateQueue();
    return root;
}

// 将ReactElementType类型的<App/> 传入到 上一步创还能好的container中（root: FiberRootNode）
export function updateContainer(element: ReactElementType | null, root: FiberRootNode) {
    // 第一次执行，调用render时就会第一次调用updateContainer
    const hostRootFiber = root.current;
    // 将element传入创建update的函数，表示此次更新与element相关的
    const update = createUpdate<ReactElementType | null>(element)
    enqueueUpdate(
        hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>,
        update
    );
    scheduleUpdateOnFiber(hostRootFiber);
    return element;
}
