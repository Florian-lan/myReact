import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes'
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';  // 在tsconfig.json中配置了，所以可以直接这样引入
// 为什么要在tsconfig.json中配置，因为hostConfig不仅仅在reconciler包中需要，其他包也需要

export class FiberNode {
    type: any;
    tag: WorkTag;
    pendingProps: Props;
    key: Key;
    stateNode: any;

    return: FiberNode | null;
    sibling: FiberNode | null;
    child: FiberNode | null;
    index: number;
    ref: Ref;

    memoizedProps: Props | null;
    memoizedState: any;
    alternate: FiberNode | null;
    flags: Flags;
    subtreeFlags: Flags;
    updateQueue: unknown;
    // pendingProps 就是当前Fiber节点将要变化的Props属性（新的Props属性)
    constructor(tag: WorkTag, pendingProps: Props, key: Key) {
        // 实例属性
        this.tag = tag;   // 比如FunctionComponent, HostComponent
        this.key = key;
        this.stateNode = null; // 对于一个为div的HostComponent节点来说，stateNode保存了div这个dom节点
        this.type = null; // 如对于一个FunctionComponent（tag）来说，type是function本身;对于div节点来说，type就是“div”

        // 构成树状结构的属性：用于表示节点之间的关系的属性
        this.return = null;  //记录父节点
        this.sibling = null;
        this.child = null;
        this.index = 0; // 同级的fiberNode有多个时，用index记录索引

        this.ref = null;

        // 作为工作单元
        this.pendingProps = pendingProps;
        this.memoizedProps = null;
        this.memoizedState = null;
        this.alternate = null;
        this.flags = NoFlags;   // flags：副作用，标记Fiber要执行的状态，如删除delete，palcement等
        this.subtreeFlags = NoFlags;
        this.updateQueue = null;
    }


}


export class FiberRootNode {
    container: Container;//保存fiber在宿主环境中挂载的节点信息，如在dom宿主环境中就是dom节点（root）
    current: FiberNode;
    finishedWork: FiberNode | null;
    constructor(container: Container, hostRootFiber: FiberNode) {
        this.container = container;
        this.current = hostRootFiber;
        hostRootFiber.stateNode = this;
        this.finishedWork = null;
    }

}

// 传入current节点，返回对应的workInProgress节点
// 双缓存机制
export const createWorkInProgress = (
    current: FiberNode,
    pendingProps: Props
): FiberNode => {
    let workInProgress = current.alternate;
    if (workInProgress === null) {
        // 首屏渲染时：mount
        workInProgress = new FiberNode(current.tag, pendingProps, current.key);

        workInProgress.stateNode = current.stateNode;

        workInProgress.alternate = current;
        current.alternate = workInProgress;
    } else {
        // 对应update
        workInProgress.pendingProps = pendingProps;
        workInProgress.flags = NoFlags;
        workInProgress.subtreeFlags = NoFlags;

    }
    workInProgress.type = current.type;
    workInProgress.updateQueue = current.updateQueue;
    workInProgress.child = current.child;
    workInProgress.memoizedProps = current.memoizedProps;
    workInProgress.memoizedState = current.memoizedState;

    return workInProgress;

}


export function createFiberFromElement(
    element: ReactElementType
): FiberNode {
    const { type, key, props } = element;
    let fiberTag: WorkTag = FunctionComponent;  // 设置默认为函数组件
    if (typeof type === 'string') {
        // <div> 的type: 'div'
        fiberTag = HostComponent;
    } else if (typeof type !== 'function' && __DEV__) {

        // 因为设置的默认是函数组件，所以这里判断是不是'function'
        // 考虑到边界情况
        console.warn("未定义的type类型", element)
    }

    const fiber = new FiberNode(fiberTag, props, key);
    fiber.type = type;
    return fiber;

}