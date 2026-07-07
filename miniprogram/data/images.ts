/**
 * 图片资源层（开发期占位）。
 * 使用 Unsplash 自然摄影直链还原设计稿的照片质感；
 * 每张图下方仍保留渐变底色（cover class），图片加载失败时自动露出渐变，界面不破。
 * 上线前：把图片下载到云存储 / 自有 CDN，替换此处 URL，并在 mp 后台配置 downloadFile 域名。
 */

const P = 'https://images.unsplash.com/photo-'
const Q = '?auto=format&fit=crop&w=900&q=70'

export const img = {
  heroForest: `${P}1447752875215-b2761acb3c5d${Q}`,      // 幽暗森林光束（首页 Hero）
  sunLeaves: `${P}1518495973542-4542c06a5843${Q}`,       // 阳光穿过绿叶
  foggyHills: `${P}1470071459604-3b5ec3a7fe05${Q}`,      // 雾中山丘
  lake: `${P}1506744038136-46273834b3fb${Q}`,            // 暮色湖泊
  aerialGreen: `${P}1501854140801-50d01698950b${Q}`,     // 航拍绿岭
  sunbeam: `${P}1469474968028-56623f02e42e${Q}`,         // 晨光山谷
  forestRoad: `${P}1441974231531-c6227db76b6e${Q}`,      // 林间小路
  sunsetField: `${P}1472214103451-9374bd1c798e${Q}`,     // 落日原野
  waterfall: `${P}1433086966358-54859d0ed716${Q}`,       // 溪流瀑布
  flowers: `${P}1465146344425-f00d5f5c8f07${Q}`,         // 花田
  meditation: `${P}1506126613408-eca07ce68773${Q}`,      // 冥想剪影
  pines: `${P}1509316975850-ff9c5deb0cd9${Q}`,           // 松林
  treesUp: `${P}1513836279014-a89f7a76ae86${Q}`,         // 仰望树冠
  tea: `${P}1544787219-7f47ccb76574${Q}`                 // 一盏茶（饮食冥想）
}
