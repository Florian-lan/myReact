// 自定义类型
export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElementType {
    $$typeof: symbol | number;
    type: ElementType;
    key: Key;
    props: Props;
    ref: Ref;
    __mark: string;
}


// action就是setState和useState接受的东西，可能是一个新的状态，也可能是一个函数
export type Action<State> = State | ((preState: State)=> State);
