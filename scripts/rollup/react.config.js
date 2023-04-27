import { getPackageJSON, resolvePkgPath, getBaseRollupPlugins } from './utils.js'
import generatePackageJson from 'rollup-plugin-generate-package-json';

// 通过传入react，调用该函数，我们就能获取react包中的package.json内容
// 然后从获取的json格式获取数据(具体数据在package.json中)
const { name, module } = getPackageJSON('react')

const pkgPath = resolvePkgPath(name); // react包的路径
const pkgDistPath = resolvePkgPath(name, true)  // react包的打包产物存放的路径

export default [
    // 对应react包
    {
        // module字段放置的就是入口文件
        input: `${pkgPath}/${module}`,
        output: {
            file: `${pkgDistPath}/index.js`,
            name: 'index.js',
            format: 'umd',  // 兼容commonjs和es module的格式
        },
        plugins: [...getBaseRollupPlugins(), generatePackageJson({
            inputFolder: pkgPath,
            outputFolder: pkgDistPath,
            // 不需要所有的package.json中的内容，只需要下列指定的内容
            baseContents: ({ name, description, version }) => ({
                name, description, version, main: 'index.js'
            })
        })]
    },
    // jsx_runtime
    {
        input: `${pkgPath}/src/jsx.ts`,
        output: [
            // jsx_runtime
            {
                file: `${pkgDistPath}/jsx-runtime.js`,
                name: 'jsx-runtime.js',
                format: 'umd'
            },
            // jsx_dev_runtime
            {
                file: `${pkgDistPath}/jsx-dev-runtime.js`,
                name: 'jsx-dev-runtime.js',
                format: 'umd'
            }
        ],
        plugins: getBaseRollupPlugins()
    }


]