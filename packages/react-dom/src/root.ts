// ReactDOM.createRoot(root).render(<App/>)

import { createContainer, updateContainer } from "react-reconciler/src/fiberReconciler";
import { Container } from "./hostConfig";
import { ReactElementType } from "shared/ReactTypes";


export function createRoot(container: Container){

    // createContainer函数是不依赖宿主环境的
    // 创建FiberRootNode和hostRootFiber，并返回FiberRootNode
    const root = createContainer(container);
    return {
        render(element: ReactElementType){
            updateContainer(element, root);
        }
    }
}