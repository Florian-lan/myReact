export type Container = Element;  // Element属性是什么
export type Instance = Element;


// TODO 这一这里type的来源，type可以创建react-dom类型
export const createInstance = (type: string, props: any): Instance => {
    // TODO 处理props
    const element = document.createElement(type);
    return element;
}

export const appendInitialChild = (
    parent: Instance | Container,
    child: Instance 
) => {
    parent.appendChild(child);
}

export const createTextInstance = (content: string) => {
    return document.createTextNode(content);
}


export const appendChildToContainer = appendInitialChild;