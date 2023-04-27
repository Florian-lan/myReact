import reactDomConfig from "./react-dom.config";
import reactConfig from  './react.config';


// 把reactDomConfig和reactConfig的配置合并到一块
export default () =>{
    return [...reactConfig, ...reactDomConfig]
}