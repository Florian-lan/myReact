// 自定义类型
export type Type = any;
export type Key = any;
export type Ref = any;
export type Props = any;
export type ElementType = any;

export interface ReactElement {
    $$typeof: symbol | number;
    type: ElementType;
    key: Key;
    props: Props;
    ref: Ref;
    __mark: string;
}
