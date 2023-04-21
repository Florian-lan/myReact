// Symbol的作用：创建一个独一无二的属性名，避免命名冲突

// 通过判断Symbol的类型和Symbol是否存在 判断当前宿主环境是否支持Symbol
const supportSymbol = typeof Symbol === 'function' && Symbol.for;

// 该常量用于唯一标识这是一个React组件，赋值给$$typeof
export const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('react.element'):0xeac7;
// 如果symbol不支持，设置为自定义的一个数字(React源码使用的就是0xeac7)