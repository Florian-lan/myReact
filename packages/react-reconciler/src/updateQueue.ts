import { Action } from "shared/ReactTypes";

export interface Update<State> {
    action: Action<State>;
}


export interface UpdateQueue<State> {
    shared: {
        pending: Update<State> | null;
    }
}
export const createUpdate = <State>(action: Action<State>): Update<State> => {
    return {
        action
    };
}

// 注意在UpdateQueue中为什么pending的update是存放在shared中的，
// 这样的话，在current和workInProgress的updateQueue属性，指向的就都是同一个shared(公用updateQueue)
export const createUpdateQueue = <State>() => {
    return {
        shared: {
            pending: null
        }
    } as UpdateQueue<State>;
}

export const enqueueUpdate = <State>(
    updateQueue: UpdateQueue<State>,
    update: Update<State>
) => {
    updateQueue.shared.pending = update;
}

export const processUpdateQueue = <State>(
    baseState: State,
    pendingUpdate: Update<State> | null
): { memoizedState: State } => {
    const result: ReturnType<typeof processUpdateQueue<State>> = {
        memoizedState: baseState
    }
    if (pendingUpdate !== null) {
        const action = pendingUpdate.action;
        if (action instanceof Function) {
            // baseState 1 update(x)=> 4x  => memoizedState 4
            result.memoizedState = action(baseState);
        } else {
            // baseState 1 update 2 => memoizedState 2
            result.memoizedState = action;
        }


    }
    return result;

}
