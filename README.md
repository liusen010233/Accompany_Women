# Accompany Women

一个基于 React + TypeScript 开发的陪伴系统前端项目。

## 项目特点

- 现代化的 UI 设计，支持暗色主题
- 完整的对话系统，支持多种消息类型
- 语音系统，支持自动播放和手动控制
- 场景音乐系统，提供沉浸式体验
- 响应式设计，完美支持移动端

## 技术栈

- React 18
- TypeScript
- Material-UI (MUI)
- React Router
- Node.js

## 开发环境要求

- Node.js >= 14.0.0
- npm >= 6.14.0

## 安装说明

1. 克隆项目
```bash
git clone git@github.com:liusen010233/Accompany_Women.git
```

2. 安装依赖
```bash
cd Accompany_women/frontend
npm install
```

3. 启动开发服务器
```bash
npm start
```

## 项目结构

```
frontend/
├── src/
│   ├── pages/          # 页面组件
│   ├── components/     # 共用组件
│   ├── utils/         # 工具函数
│   ├── config/        # 配置文件
│   └── types/         # TypeScript 类型定义
├── public/            # 静态资源
└── package.json       # 项目配置
```

## 主要功能

- 用户系统
  * 支持游客体验
  * 用户注册/登录
  * 个人信息管理

- 对话系统
  * 实时对话
  * 语音播放
  * 场景音乐
  * 历史记录

- 角色系统
  * 多场景分类
  * 角色卡片展示
  * 使用统计

## 开发进度

- [x] 基础界面搭建
- [x] 对话功能实现
- [x] 语音系统集成
- [x] 历史记录功能
- [ ] 用户系统
- [ ] 后端接口
- [ ] 数据库集成
- [ ] 管理后台

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

[MIT](https://opensource.org/licenses/MIT) 