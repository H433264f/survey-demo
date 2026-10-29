# 问卷演示站 · 逐步部署手册

项目路径：`Desktop/BI/survey-demo`  
这是纯静态网站（HTML/CSS/JS），**不需要数据库**，适合第一次练 Vercel。

---

## 总览（你会做完这些）

1. 本机先打开看看效果  
2. 安装 Git（以及可选的 Node）  
3. 推到 GitHub  
4. 在 Vercel 一键部署  
5. 把链接发给别人

预计：**第一次 40～90 分钟**（含装软件）；以后再部署大约几分钟。

---

## 第 1 步：先看效果（不用部署）

1. 打开文件夹：`C:\Users\BF-PC211\Desktop\BI\survey-demo`
2. 双击 `index.html`，用浏览器打开
3. 点「开始填写」→ 答完提交 → 再点「结果汇总」

能走通，就说明项目本身没问题。

> 若样式丢失：请用「打开文件夹里的 index.html」，不要只复制单个文件到别处。

---

## 第 2 步：安装必备软件

### 2.1 安装 Git（必装，用来上传代码）

1. 打开：https://git-scm.com/download/win  
2. 下载并安装，一路 Next 即可  
3. **关掉并重新打开** Cursor 终端 / PowerShell  
4. 输入：

```bash
git --version
```

出现版本号即成功。

### 2.2 安装 Node.js（建议装，方便以后用命令预览）

1. 打开：https://nodejs.org  
2. 下载 **LTS** 并安装  
3. 重开终端，输入：

```bash
node -v
npm -v
```

两个都有版本号即可。

装好后可在 `survey-demo` 目录运行：

```bash
cd C:\Users\BF-PC211\Desktop\BI\survey-demo
npm run dev
```

浏览器打开终端提示的地址（一般是 `http://localhost:3000`）。

---

## 第 3 步：注册 GitHub + 建仓库

1. 打开 https://github.com 注册/登录  
2. 右上角 **+** → **New repository**  
3. Repository name 填：`survey-demo`  
4. 选 Public 或 Private 均可  
5. **不要**勾选 Add a README  
6. 点 **Create repository**  
7. 复制仓库地址，类似：

`https://github.com/你的用户名/survey-demo.git`

---

## 第 4 步：把本地项目推到 GitHub

在 Cursor 打开终端，执行（把网址换成你的）：

```bash
cd C:\Users\BF-PC211\Desktop\BI\survey-demo
git init -b main
git add .
git commit -m "Initial survey demo"
git remote add origin https://github.com/你的用户名/survey-demo.git
git push -u origin main
```

- 第一次 push 会要求登录 GitHub，按浏览器提示完成授权  
- 成功后刷新 GitHub 网页，应能看到 `index.html`、`app.js` 等文件

---

## 第 5 步：用 Vercel 部署

1. 打开 https://vercel.com → 用 **GitHub 账号登录**  
2. 点 **Add New…** → **Project**  
3. 找到 `survey-demo` → **Import**  
4. 配置保持默认：
   - Framework Preset：Other / 自动即可  
   - 不需要填环境变量  
5. 点 **Deploy**  
6. 等 1～3 分钟，出现成功页  
7. 点 **Visit**，复制链接，例如：`https://survey-demo-xxx.vercel.app`

用手机或另一台电脑打开这个链接，确认别人也能访问。

---

## 第 6 步：以后改了怎么更新

1. 改本地文件（例如改问卷题目）  
2. 浏览器本地再点一遍确认  
3. 执行：

```bash
cd C:\Users\BF-PC211\Desktop\BI\survey-demo
git add .
git commit -m "Update survey questions"
git push
```

4. 回到 Vercel → Deployments，等最新一次变绿  
5. **同一个链接**刷新就是新版本

---

## 常见问题

| 现象 | 处理 |
|------|------|
| `git` 不是内部命令 | Git 没装好，或终端没重开 |
| push 要登录 | 浏览器完成 GitHub 授权 |
| Vercel 构建失败 | Deployments 点进去看日志，把日志发给 Cursor 帮你看 |
| 汇总数据每人不同 | 正常：答卷在各自浏览器本地，不是共享数据库 |

---

## 你现在卡在哪一步？

按顺序做，做到哪步不会了，把：

- 你做到第几步  
- 终端完整报错（如果有）  

发给我，我按你的进度继续带你。
