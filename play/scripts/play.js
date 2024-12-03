import { ctx, camera, mouse, } from './page.js'
import {
    Engine,
    World,
    Bodies,
    Events,
    Collision,
    Constraint,
    engine,
    Body,
    world,
    config,
    Vertices,
    Runner,
    Composite,
    defaultcanvas
} from "./setup.js"
export const game = {
    font: 'Choco cooky',
    all: new Map,
    frame: 0,
    editormode: false,
    running: false,
    mousemode: 'placing',
    currentlyselected: null,


}
export class Entity {
    #body = null
    shape = null
    #color = color.choose()
    #darkColor = color.dhk(this.#color)
    #image = null
    width = null
    height = null
    opacity = 1
    screenpos = new Vector2(NaN, NaN)
    frozen = false
    #moving = false
    attributes = new Set(['width', 'height', 'radius', 'color', 'angle'])
    deleteAttributes(...attributes) {
        for (let { length } = attributes; length--;) this.attributes.delete(attributes[length])
    }
    get radius() {
        return this.#body.circleRadius
    }
    static {
        const map = new Map([
            ['circle', (o, base) => Bodies.circle(o.x, o.y, o.size, base)],
            ['square', (o, base) => Bodies.rectangle(o.x, o.y, o.width, o.height, base)]
        ])
        this.getShape = function (o) {
            let base = { ...this.default, circleRadius: o.size, ...o }
            if (map.has(o.shape))
                return map.get(o.shape)(o, base)
            else throw TypeError('Invalid shape: ' + o.shape)
        }
    }
    static default = {
        mass: 1,
        friction: .02,
        isStatic: false,
        restitution: 1,
        frictionAir: 0.007,
        inertia: 2000
    }
    sleepStart() { }
    sleepEnd() { }
    update(frame) {
        ctx.save()
        this.draw(frame)
        ctx.restore()
    }
    destroy() {
        World.remove(world, this.#body)
    }
    freeze() {
        Matter.Sleeping.set(this.#body, true)
    }
    unfreeze() {
        Matter.Sleeping.set(this.#body, false)
    }
    set color(val) {
        this.#color = val
        this.#darkColor = color.dhk(val)
    }
    get color() {
        return [this.#color, this.#darkColor]
    }
    draw(frame) {
        let [x, y] = this.position,
            { shape } = this
        if (this.screenpos.isValid) {
            [x, y] = this.screenpos
        }

        ctx.translate(x, y)

        ctx.rotate(utilMath.toRad(-this.#body.angle))
            ;[ctx.fillStyle, ctx.strokeStyle] = this.color
        ctx.globalAlpha = this.opacity
        ctx.beginPath()
        if (shape === 'circle') {
            ctx.arc(0, 0, this.#body.circleRadius, 0, Math.PI * 2)
        }
        else {
            ctx.moveTo(this.#body.vertices[0].x - this.#body.position.x, this.#body.vertices[0].y - this.#body.position.y)
            for (let i = 0, len = this.#body.vertices.length; i < len; i++) {
                ctx.lineTo(this.#body.vertices[i].x - this.#body.position.x, this.#body.vertices[i].y - this.#body.position.y)
            }
            ctx.closePath()
        }
        const clickinpath = ctx.isPointInPath(mouse.click.x, mouse.click.y)
        if (clickinpath && !this.selected && !game.currentlyselected && game.mousemode === 'moving') {
            this.onclick?.()
        }
        if (this.selected) {
            ctx.shadowBlur = 10 + Math.abs(Math.sin(frame / 100) * 10)
            ctx.shadowColor = color.black
            if (mouse.click.isValid && Vector2.distance(mouse.click, mouse.pos) > 20 && !this.#moving) {
                this.#moving = true
            } else if (!mouse.click.isValid && this.#moving) this.#moving = false
            else if (!this.#moving)this.moving = true
            if (this.#moving) {
                this.position = { ...mouse.pos }
            } else if (!this.#moving && mouse.click.isValid && Vector2.distance(mouse.click,{x,y})>30) {
                game.deselect()
            }
        }
        if (this.#image != null) {
            ctx.clip()
            try {
                let size = new Vector2(this.#body.circleRadius, this.#body.circleRadius)
                if (this.width != null && this.height != null) {
                    size.set(this.width / 2, this.height / 2)
                }
                ctx.drawImage(this.#image,
                    -size.x,
                    -size.y,
                    size.x * 2,
                    size.y * 2)
            } catch ({ message }) {
                Elem.error('Something went wrong when drawing image ' + this.#image)
                Elem.error(message)
                this.#image = null
            }
        } else {
            ctx.fill()
            ctx.stroke()
        }
    }
    constructor(options) {
        const { inertia = 1, density = 1,
            mass = 1, isSensor = false, isStatic = false, x = 0, y = 0, angle = 0, size = 30, shape = 'circle', width = 30, height = 30 } = options
        this.#body = Entity.getShape({ mass, isSensor, isStatic, x, y, angle, size, shape, width, height })
        this.shape = shape
        this.frozen = isStatic
        if (shape === 'square') {
            this.width = width
            this.height = height
            this.deleteAttributes('radius')
        }
        else if (shape === 'circle') {
            this.deleteAttributes('width', 'height')
        }
        if (options.color)
            this.color = options.color
        World.add(world, this.#body)
        game.all.set(this.id, this)
    }
    get id() { return this.#body.id }
    getBody() { return this.#body }
    get position() { return new Vector2(this.#body.position) }
    push(x, y) {
        return Body.applyForce(this.#body, this.position, { x, y })
    }
    set inertia(val) {
        Body.setInertia(this.#body, val)
    }
    get inertia() {
        this.#body.inertia
    }
    get velocity() {
        return new Vector2(Body.getVelocity(this.#body))
    }
    set velocity({ x, y }) {
        return Body.setVelocity(this.#body, { x: x ?? this.velocity.x, y: y ?? this.velocity.y })
    }
    set position({ x, y }) {
        Body.setPosition(this.#body, {
            x: x ?? this.#body.position.x,
            y: y ?? this.#body.position.y
        })
    }
}
export class Pedal extends Entity {
    constructor(o) {
        o.shape = 'square'
        super(o)
        let constraint = Constraint.create({
            bodyB: this.getBody(),
            pointA: this.position,
            pointB: new Vector2,
            stiffness: 1,
            collision: false,
            length: 0,
            angularStiffness: 1,  // Keep the angular motion rigid
        })
        World.add(world, constraint)
        this.inertia = 10000
    }
}
function Rect(opts) {
    opts.shape = 'square'
    return new Entity(opts)
}
function afterUpdate() {
    game.frame++
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    if (camera.moving.up) camera.pos.add(0, camera.speed / camera.zoom)
    else if (camera.moving.down) camera.pos.add(0, -camera.speed / camera.zoom)
    if (camera.moving.left) camera.pos.add(camera.speed / camera.zoom, 0)
    else if (camera.moving.right) camera.pos.add(-camera.speed / camera.zoom, 0)
    ctx.save()
    assign(ctx, defaultcanvas)
    ctx.scale(camera.zoom, camera.zoom)
    ctx.translate(camera.pos.x, camera.pos.y)
    for (let [, body] of game.all) body.update(game.frame)
    ctx.restore()
}
function beforeUpdate() {

}
Events.on(engine, 'afterUpdate', afterUpdate)
Events.on(engine, 'beforeUpdate', beforeUpdate)