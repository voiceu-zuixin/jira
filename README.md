# React+Ts 项目练习

## Getting Started with Create React App

我先升级一下全局的 create-react-app

`npm i create-react-app -g`

然后`create-react-app jira --template typescript`

也可以不用全局的进行创建项目`npx create-react-app jira --template typescript`

public 下的 manifest.json 用于做 pwa

## 配置代码规范

eslint 在脚手架搭建项目的时候就自动配置了初步的，所以不需要再去手动生成

### 配置 prettier

官网 docs https://prettier.io/docs/en/install.html

跟着教程走就行:

`npm install --save-dev --save-exact prettier`

这个 `echo` 命令可以新建一个 `.prettierrc` 的文件 `echo {}> .prettierrc`

再建一个`prettierignore`文件，自己手动或者上面的`echo`命令都行`echo > .prettierignore`

暂时写官网上的 ignore 例子

执行`npx mrm@2 lint-staged` 在提交代码的时候自动进行调整格式

eslint 会和 prettier 冲突，所以安装`npm i eslint-config-prettier - D`

然后在 package.json 里面的 eslint 配置项中添加"prettier"

### 配置 commitlint

官网 https://typicode.github.io/husky/#/

`npm i @commitlint/config-conventional @commitlint/cli -D`

`echo "module.exports = { extends: ['@commitlint/config-conventional'] }"> commitlint.config.js`

`npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`
