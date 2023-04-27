import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
// const __dirname = path.resolve();
// console.log(__dirname) 
// __dirname是当前文件所在目录的绝对路径
const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules')  // 打包产物的路径


// 传入包名，解析得到包的路径
// isDist用于判断是否是打包之后的路径
export function resolvePkgPath(pkgName, isDist) {
    if (isDist) {
        return `${distPath}/${pkgName}`;
    }
    return `${pkgPath}/${pkgName}`;

}
// 传入一个包名，返回对应的包的JSON配置
export function getPackageJSON(pkgName) {

    // 根据包名获取对应的package.json文件
    const path = `${resolvePkgPath(pkgName)}/package.json`;
    const str = fs.readFileSync(path, { encoding: 'utf-8' });

    return JSON.parse(str);
}

// 用于获取基础的公用的plugins
export function getBaseRollupPlugins(
    {
        alias = {
            __DEV__: true,
            preventAssignment: true
        },
        typescript = {}
    } = {}
) {
    return [replace(alias), cjs(), ts(typescript),]


}