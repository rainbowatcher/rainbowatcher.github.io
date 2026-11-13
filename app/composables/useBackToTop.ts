/**
 * 做什么：回顶入口的显隐状态：滚动超过视口高度的 80%（下限 240px）后为 true。
 * 状态与生命周期：使用方在 setup 中调用，内部读窗口滚动与尺寸，组件卸载即停止监听。
 * 取舍与不变量：阈值按视口比例取，短屏不早现、长屏不晚现；只提供显隐，滚动动作交给
 * `<a href="#view">`，平滑滚动与减弱动效由浏览器与 base.css 统一裁决。
 * 边界：不渲染按钮、不执行滚动，也不采集页内锚点位置。
 */
export function useBackToTop() {
    const { y } = useWindowScroll()
    const { height } = useWindowSize()
    const visible = computed(() => y.value > Math.max(240, height.value * 0.8))

    return { visible }
}
