---
name: "我萌俱乐部"
description: "蓝白耳机角色、可丢出的收藏卡与手绘纸券"
colors:
  ink: "#363c75"
  muted: "#68729b"
  paper: "#fffdf8"
  canvas: "#eff2fa"
  skin-ink: "#454e87"
  skin-voice: "#eaf0fc"
  skin-accent: "#f5d5e5"
  skin-accent-ink: "#78496f"
  voice-ink: "#5b6c97"
  bookmark: "#dce6f5"
  bookmark-ink: "#536487"
  bookmark-saved: "#f0cee1"
  bookmark-saved-ink: "#8b5279"
  female: "#f8e4ee"
  female-ink: "#a35e8a"
  male: "#e6eefb"
  male-ink: "#5578aa"
  tag-blue: "#eaf0fc"
  tag-blue-ink: "#536995"
  tag-pink: "#f5eaf2"
  tag-pink-ink: "#8a6080"
  notice-paper: "#fffdf9"
  notice-ink: "#54638c"
  dispatch-ink: "#405588"
  choose-ink: "#815678"
  newcomer-paper: "#fffefa"
  newcomer-detail: "#657493"
  nav-active: "#e9eef9"
  nav-active-ink: "#4c60ad"
  focus: "#6d81cb"
  confirm: "#687fd0"
  white: "#fff"
typography:
  brand:
    fontFamily: "Brand,sans-serif"
    fontSize: "38px"
    lineHeight: 1
    letterSpacing: "2px"
  display:
    fontFamily: "KuaiLe,WenKai,sans-serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "1px"
  title:
    fontFamily: "KuaiLe,WenKai,sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "1px"
  body:
    fontFamily: "WenKai,'PingFang SC','Microsoft YaHei',sans-serif"
    fontSize: "15px"
    lineHeight: 1.7
  label:
    fontFamily: "WenKai,'PingFang SC','Microsoft YaHei',sans-serif"
    fontSize: "12px"
    lineHeight: 1.25
rounded:
  tag: "5px"
  portrait-tile: "7px"
  ticket-button: "9px"
  newcomer: "11px"
  control: "12px"
  nav-item: "15px"
  card: "18px"
  voice: "22px"
  sheet: "26px"
  shell: "28px"
  circle: "50%"
spacing:
  tag-gap: "5px"
  entry-gap: "8px"
  newcomer-gap: "11px"
  narrow-gutter: "16px"
  avatar-gap: "17px"
  page-gutter: "20px"
  card-gutter: "22px"
  section-gap: "24px"
components:
  featured-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.skin-ink}"
    rounded: "{rounded.card}"
    height: "228px"
  button-voice:
    backgroundColor: "{colors.skin-voice}"
    textColor: "{colors.voice-ink}"
    rounded: "{rounded.voice}"
    height: "43px"
  button-specify:
    backgroundColor: "{colors.skin-accent}"
    textColor: "{colors.skin-accent-ink}"
    rounded: "{rounded.ticket-button}"
    height: "46px"
  bookmark:
    backgroundColor: "{colors.bookmark}"
    textColor: "{colors.bookmark-ink}"
    width: "43px"
    height: "65px"
  newcomer-card:
    backgroundColor: "{colors.newcomer-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.newcomer}"
    padding: "7px 7px 10px"
  announcement:
    backgroundColor: "{colors.notice-paper}"
    textColor: "{colors.notice-ink}"
    height: "46px"
  personal-center:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    walletPriority: "customer-first"
    sections: "identity, wallet, orders, favorites, tools"
---

# Design System: 我萌俱乐部

## Overview

蓝白耳机角色与奶白收藏卡延伸为统一的手绘纸品主题。头牌使用完整装饰卡面、书签和小票券；新人使用简洁小照片卡，保留曝光层级。页面只显示行动需要的信息，开发解释保留在文档中。

## Colors

蓝紫为主文字与语音基调，粉色用于指定行为和收藏选中态。奶白纸面与淡蓝固定背景分开承担内容和氛围。人物性别同时用SVG形状与辅助名称表示，不只依靠颜色。

## Typography

正文使用本地「霞鹜文楷屏幕阅读版」，标题、昵称和纸券名称使用本地「站酷快乐体」。品牌保留原字标。无需外部字体请求；两个字体子集约88KB，SIL OFL许可证随素材保存。

人物昵称30px，窄屏27px；栏目标题21px，窄屏20px；入口名称23px，窄屏20px，桌面25px。普通文案15px，公告和导航13px，卡片标签12px，窄屏部分标签11px。正文不使用合成粗体，主题靠字形与层级形成。

## Layout

移动优先，容器宽100%、最大460px。正文左右留白20px，370px以下16px；底部为固定导航保留110px。桌面保留窄屏形态，上下留白24px。

顶部主视觉是粘性固定层，停留在视口顶部，不跟随正文离开。页面滚动距离从0到约首图高度的78%时，整个首图层由完整降至0不透明度，连同白色边界一起消失；中间过程叠加浅色纸面洗白层，回到顶部时按相同过程恢复。正文内容拥有更高层级，会自然从首图前方滑过。

从顶部向下滚动经过约36px后，页面滚动吸附到公告栏顶部；较长手势越过吸附点时也返回公告栏。公告到达顶部后禁止继续向下滚动，向上可回到页面顶部。公告、卡片、点单纸券、新人报道处于同一页面滚动流中，作为完整内容组一起移动，不单独固定公告，也不设置内部滚动容器。正文层级高于固定首图，首图与公告重叠时不能遮挡公告。页面禁用横向滚动；头牌卡片仍保留卡组内任意方向甩卡。

公告46px高，下方24px间距；卡组252px高，所有完整卡面均为228px。卡面上方为104px头像和右侧昵称、性别、语音条，下方项目标签与指定按钮；右上角悬挂收藏书签。窄屏头像88px，桌面110px。

点单入口两列，8px间距，高123px，窄屏108px，桌面139px。新人区上方24px留白，三列小卡、11px间距，头像强制正方形；窄屏间距8px。页面内容正常滚动，底部 Tab 直接挂在 `body` 根层并固定在移动视口底部。

## Elevation & Depth

四张真实人物卡完整预渲染并预解码头像，全部使用同一套皮肤。底卡每层向下7px，轻微交替旋转并缩小。拖拽只改变前卡位置和层次；丢出后下方原节点升起，离场卡回到最底层，不替换文字或头像。

全页装饰只来自 `body::before` 一层固定背景，不重复平铺；正文与外壳透明。背景透明度约.42，卡面保持完整不透明纸面。顶部主视觉是另一层粘性内容层，使用 `--hero-art-opacity` 和 `--hero-wash-opacity` 控制滚动浅隐；标题口号已从首页移除；弹层使用干净浅底。

## Shapes

人物头像为圆形，语音条为带圆形播放按钮的胶囊，指定按钮为圆角小票券与虚线内框。收藏为右上方燕尾书签，选中由蓝转粉。新人小卡只有圆角纸面与照片，避免复制头牌装饰。

## Components

- **公告**：三条示例公告按4.8秒自动轮播，340ms垂直滚动；不显示计数和暂停控件，点击文字查看完整公告。公告与下方内容处于同一页面滚动流，不单独固定；正文层级高于固定首图。焦点、悬停、隐藏页面、离开视口、弹层开启时暂停。减少动效时默认暂停。
- **顶部主视觉**：粘性定位固定在视口顶部，正文上滑时首图层从不透明逐渐降至0，页面回到顶部时恢复；滚动监听使用 `requestAnimationFrame` 合帧，首次滚动在公告栏位置吸附并将其设为向下滚动边界。
- **人物卡**：无人物口号，保留昵称、性别、项目、试听、收藏与指定入口。固定结构与皮肤变量分离，详见SKINS.md。
- **丢卡**：任意二维方向跟手。拖动64px，或超过15px且速度超过.55px/ms时飞出；否则300ms回弹。飞离300–440ms，底卡升起300ms。Escape可取消，键盘方向键/空格/Enter可丢出。减弱动效时90ms淡出、80ms回弹。
- **语音条**：静态波形是按钮装饰，未提供音频时明确提示尚未上传，不能表现为正在播放。
- **收藏**：书签显示收藏文字、心形与aria-pressed，保存在当前浏览器。底卡不可聚焦或点击。
- **点单纸券**：只写系统派单或我要点单；详细计费方式保留在进入后的流程，始终按项目收费。
- **系统派单二级页**：使用固定表单，服务、性别、时长、开始方式和接单范围从打开时就全部呈现；选择项使用与控件同宽、圆角分离、带柔和阴影的奶白下拉菜单，选项尺寸贴近表单控件，选中态为浅粉蓝调，支持键盘方向键、回车与Esc关闭，服务选择改变时更新对应的时长 SKU。性别默认不限，开始方式默认现在开始，接单范围默认允许接过该客户订单的陪玩再次接单，也可限定为只安排没接过该客户订单的陪玩；时长为一局、半小时、一小时、4小时、包天（8小时）。根据服务与时长显示全价的8折，具体金额以待配置的项目价目表为准。表单使用首页背景、低对比度卡纸纹样、对应服务的小插画和统一线稿图标；底部固定下单区先汇总当前选择，再直接展示「系统派单一律享8折优惠，不支持指定个人。请确认服务、性别、时长和开始时间。」最后放置全宽纸券式下单按钮。预约控件禁止选择过去时间。
- **新人报道**：三位独立示例新人，显示头像、昵称、性别和主项目；点击指定该人物，更多入口显示新人列表。
- **陪玩个人主页**：首页头牌卡片主体、指定列表、新人报道和收藏列表统一进入 `companion-profile-preview.html?person=昵称`。详情页按个人主页概念图采用全屏主题背景、横向电子闪卡、悬浮收藏、头像与身份信息、个人语音介绍、四格礼物橱窗、双列游戏时刻和底部收藏/立即点单/聊一聊操作栏；双击闪卡浮起并轻微旋转；无参数时默认展示晚风。返回按钮优先回到来源页，没有可用历史时回到首页。
- **导航和弹层**：五项导航，原生dialog、可见焦点、关闭后归还焦点。没有真实支付或订单提交。
- **个人中心**：进入「我的」后使用整页账号表面。未登录先展示账号入口；客户角色按「钱包 → 订单 → 收藏 → 常用功能」排序，陪玩角色可复用相同结构并把收入摘要置于钱包位置。钱包、充值、礼物记录、设置和帮助目前只提供原型反馈，不伪造真实余额或支付结果。

## Do's and Don'ts

- 保持人物数据、交互与皮肤独立；换皮肤只改变材质和配色，不把文字或按钮烘焙进图片。
- 保持整叠皮肤卡与节点连续性，不使用纯色背卡，不在递补时更新人物内容。
- 背景只保留一层固定装饰，不再叠加容器背景或重复图案。
- 新人小卡简洁；首页纸券不添加解释文案，不给人物单独标价。
- 新增文案或昵称时更新字体子集，保持系统后备字体；增加资产时同步provenance.json。
