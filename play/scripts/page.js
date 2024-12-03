import {game} from './play.js'
export const canvas = $({
    tag: 'canvas', parent: body, id: 'canvas',
    events: {
        wheel({ deltaY }) {
            deltaY = -Math.sign(deltaY) / 70
            const oldZoom = camera.zoom
            camera.zoom += deltaY
            camera.zoom = util.clamp(camera.zoom,0.1,10)
            const x = (canvas.content.width /2) / canvas.content.width * canvas.content.width + camera.pos.x;
            const y = (canvas.content.height /2) / canvas.content.height * canvas.content.height + camera.pos.y;
        
            // Recalculate the camera position to keep the focus at (x, y)
            const newX = (camera.pos.x - x) * (camera.zoom / oldZoom) + x;
            const newY = (camera.pos.y - y) * (camera.zoom / oldZoom) + y;
        
            camera.pos.set(newX,newY)
        },
        mousemove({ x, y }) { assign(mouse.pos, { x, y }) }, 
        mousedown({ x, y }) { mouse.click.set(x, y) }, mouseup() { mouse.click.set(NaN, NaN) }
    }
})
export const ctx = canvas.content.getContext('2d');
export const mouse = {
    pos: new Vector2(NaN, NaN),
    click: new Vector2(NaN, NaN)
}
export const camera = {
    pos: new Vector2,
    moving: {
        up: false,
        down: false,
        left: false,
        right: false,
        frozen: false,
    },
    following: null,
    speed: 8,
    zoom: 1,
    freeze() {
        assign(this.moving, { up: false, down: false, left: false, right: false, frozen: true })
    },
    thaw() {
        this.frozen = false
    }
}
on(window, {
    resize,
    keydown({ key }) {
        if (camera.frozen) return
        key = key.toLowerCase?.()
        if (key.match(/^(w|arrowup)$/)) {
            camera.moving.up = true
            camera.moving.down = false
        }
        else if (key.match(/^(s|arrowdown)$/)) {
            camera.moving.down = true
            camera.moving.up = false
        }
        else if (key.match(/^(a|arrowleft)$/)) {
            camera.moving.left = true
            camera.moving.right = false
        }
        else if (key.match(/^(d|arrowright)$/)) {
            camera.moving.right = true
            camera.moving.left = false
        }
    },
    keyup({ key }) {
        key = key.toLowerCase?.()
        if (key.match(/^(w|arrowup)$/))
            camera.moving.up = false
        else if (key.match(/^(s|arrowdown)$/))
            camera.moving.down = false
        else if (key.match(/^(a|arrowleft)$/))
            camera.moving.left = false
        else if (key.match(/^(d|arrowright)$/))
            camera.moving.right = false
    }
})
resize()
function resize() {
    assign(canvas,{
        width:innerWidth,
        height: innerHeight
    })
}