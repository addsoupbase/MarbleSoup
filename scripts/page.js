const canvas = $({
    class: 'slide-in-blurred-top',
    tag: 'canvas', parent: body, id: 'canvas',
    events: { mousemove({ x, y }) { assign(mouse.pos, { x, y }) }, mouseleave() { mouse.pos.set(NaN, NaN) }, mousedown({ x, y }) { mouse.click.set(x, y) }, mouseup() { mouse.click.set(NaN, NaN) } }
}), ctx = canvas.content.getContext('2d');
const mouse = {
    pos: new Vector2(NaN, NaN),
    click: new Vector2(NaN, NaN)
}
const camera = {
    pos:new Vector2
}
window.a = mouse
on(window, { resize })
resize()
assign(ctx, {
    textAlign: 'center',
    textBaseline: 'middle',
    lineJoin: 'round',
    lineCap: 'round',
    imageSmoothingQuality: 'high',
    lineWidth: 1.2,
})
export { ctx, mouse, camera }
function resize() {
    canvas.width = innerWidth
    canvas.height = innerHeight
}
