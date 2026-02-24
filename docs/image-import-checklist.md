# 图片资源导入核对清单（Cocos Creator 3.8.x）

> 目标：排查“图片明明放对了，但运行时不显示/只显示数字文本”的问题。

## 0. 放置与命名（先看这个）
- [ ] 目录在 `assets/resources/sprites/pets/`
- [ ] 文件名是 `pet_1.png`、`pet_2.png`...（与 `petType` 对应）
- [ ] 没有大小写混用（`Pet_1.png` 会导致路径不匹配）
- [ ] 没有中文空格或特殊符号

对应运行时加载路径：
- `sprites/pets/pet_1`
- 兼容回退：`sprites/pets/pet_1/spriteFrame`

---

## 1. Cocos 资源面板核对（单张图片）
选中任意 `pet_x.png`，检查 Inspector / Importer：

### 1.1 资源类型相关
- [ ] 能看到 SpriteFrame 子资源（通常在资源树中可展开）
- [ ] SpriteFrame 可被拖到任意 Sprite 组件并正常显示

### 1.2 纹理导入参数（常见）
- [ ] `Texture Type`：建议 2D 贴图（默认即可）
- [ ] `sRGB`：开启（UI 图一般建议开）
- [ ] `Mipmaps`：关闭（UI 图标通常不需要）
- [ ] `Wrap Mode`：Clamp（防止边缘采样污染）
- [ ] `Filter`：Linear（像素风可改 Point）

### 1.3 SpriteFrame 参数（若有）
- [ ] `Trim`：可开（会裁透明边）
- [ ] 若出现点击区域错位，先临时关闭 `Trim` 验证
- [ ] `Packable`：可开（后续图集优化用）

---

## 2. 代码路径核对（与本项目一致）
`SimpleBoardUI` 当前会按以下顺序加载：
1. `resources.load('sprites/pets/pet_{id}', SpriteFrame)`
2. 失败后尝试 `resources.load('sprites/pets/pet_{id}/spriteFrame', SpriteFrame)`

所以你必须满足：
- [ ] 资源在 `assets/resources/` 树下
- [ ] 路径前缀是 `sprites/pets/pet_`
- [ ] `petType` 与图片编号一致（例如 6 => `pet_6.png`）

---

## 3. 运行时快速自检（1 分钟）
- [ ] 先放 `pet_1.png`，进入第 1 关看是否不再显示数字 `1`
- [ ] 再放 `pet_2.png`，确认混合显示正常
- [ ] 若仍不显示：删除项目 `temp/`、`library/` 后重开

---

## 4. 常见错误对照表
- **症状：始终显示数字，不显示图片**
  - 可能原因：路径不在 `resources/` 下、命名不匹配、未生成可用 SpriteFrame。
- **症状：编辑器能看到图，运行 load 失败**
  - 可能原因：大小写不一致、导入缓存脏（需删 `temp/library`）、路径前缀写错。
- **症状：图显示但边缘有黑线/毛边**
  - 可能原因：Wrap/Filter 设置不合适，可用 Clamp + Linear 验证。

---

## 5. 团队统一规范（建议）
- 统一命名：`pet_{id}.png`
- 宽高统一：建议 256x256（或 128x128）
- 全部放 `assets/resources/sprites/pets/`
- 首次导入后执行一次“清缓存重开”验收
- 每次新增图标至少验证 `pet_1/pet_6/pet_12` 三张
