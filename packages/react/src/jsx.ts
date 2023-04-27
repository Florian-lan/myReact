// TODO: 配置了baseUrl但还是无法使用相对路径不知道为啥
import { REACT_ELEMENT_TYPE } from "../../shared/ReactSymbols";
import {
    Type,
    Key,
    Ref,
    Props,
    ReactElementType,
    ElementType
} from "../../shared/ReactTypes"


// 调用本函数，返回一个React组件的数据(数据结构由我们定义为React的组件的结构)
const ReactElement = function (
    type: Type,
    key: Key,
    ref: Ref,
    props: Props
): ReactElementType {
    const element = {
        $$typeof: REACT_ELEMENT_TYPE,  // 用于标识这是一个React的组件数据结构
        type,  // 标识React元素的类型，如div
        key,
        ref,
        props,
        __mark: "lan" // 自定义的一个字段，用于区分ReactElement和本项目创建的element
    }
    return element;
}


// 第一个参数表示创建的ReactElement元素的类型
// 第二个参数用于传递组件的属性（包括子元素，也可以剥离开来）
// 第三个参数用于传递子元素
// 从ReactElement的构造函数中，我们可以看到jsx函数的目的是：
// 从config中取出key和ref，并将其余属性赋值给props，包括children，最终得到 type, key, ref, props四个参数
export const jsx = (
    type: ElementType,
    config: any,
    ...maybeChildren: any
) => {
    // 因为对于一个ReactElement来说，key和ref是必须的，所以先声明这两个属性
    let key: Key = null;
    let ref: Ref = null;
    const props: Props = {};


    for (const prop in config) {
        const val = config[prop];
        if (prop === 'key') {
            if (val !== undefined) {
                key = '' + val;
            }
            continue;
        }
        if (prop === 'ref') {
            if (val !== undefined) {
                ref = val;
            }
            continue;
        }
        // 判断是否是原型上的
        // TODO 
        if ({}.hasOwnProperty.call(config, prop)) {
            props[prop] = val;
        }

        const maybeChildrenLength = maybeChildren.length;
        if (maybeChildrenLength) {
            if (maybeChildrenLength === 1) {
                props.children = maybeChildren[0];
            } else {
                props.children = maybeChildren;
            }
        }
    }
    return ReactElement(type, key, ref, props);
};

export const jsxDev = (
    type: ElementType,
    config: any,
) => {
    // 因为对于一个ReactElement来说，key和ref是必须的，所以先声明这两个属性
    let key: Key = null;
    let ref: Ref = null;
    const props: Props = {};


    for (const prop in config) {
        const val = config[prop];
        if (prop === 'key') {
            if (val !== undefined) {
                key = '' + val;
            }
            continue;
        }
        if (prop === 'ref') {
            if (val !== undefined) {
                ref = val;
            }
            continue;
        }
        // 判断是否是原型上的
        // TODO 
        if ({}.hasOwnProperty.call(config, prop)) {
            props[prop] = val;
        }
    }
    return ReactElement(type, key, ref, props);
};


// 在本项目中，定义jsx的生产环境和开发环境是一样，
// 源码中开发环境dev下能做一些额外的检查，在本项目中不考虑
// export const jsxDev = jsx;