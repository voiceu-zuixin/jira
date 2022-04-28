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

### 配置 Commitizen

`npm install commitizen -D`

`npx commitizen init cz-conventional-changelog --save-dev --save-exact`

### 完善脚本

package.json 里面添加脚本 "commit":"cz"
以后不用运行 npx cz，也不是运行 `git commit`，而是直接运行 你 `npm run commit`或者`yarn commit`

package.json 里面添加脚本 "push":"git push"

### 上传 github

新建仓库，但是什么都不要在里面生成，比如证件之类的，不然主分支就会是 main，就又得改，
然后直接添加远程主机名

`git remote add origin git@github.com:voiceu-zuixin/jira.git`

`git push -u origin master`就行了，第一次用了 `-u`的话，以后拉取代码`pull`或者`push`就可以简写，`-u` 是 `upstream` 的意思

就是你第一次使用 `git push -u origin master` 之后，
第二次【下次，以后】可以直接使用 `git pull` 拉取代码，就不需要输入完整的命令 `git pull origin master` 来拉取代码了。
即 第二次 使用 `git pull` 等同于执行 `git pull origin master`。
然后第二次也可以用 `git push`推送代码而不用`git push origin master`。
即第二次 使用 `git push` 等同于执行 `git push origin master`。

`git push` 的一般形式为 `git push <远程主机名> <本地分支名> : <远程分支名>`
