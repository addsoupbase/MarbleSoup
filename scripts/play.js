import { ctx } from './page.js'
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
    Composite
} from "./setup.js"
const game = {
    font: 'Choco cooky',
    all: new Map,
    frame: 0,
}
class Entity {
    #body = null
    shape = null
    #color = '#666666'
    #darkColor = color.dhk(this.#color)
    #image = null
    #width = null
    #height = null
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
        restitution: 2.3,
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
        ctx.translate(x, y)
        ctx.rotate(utilMath.toRad(-this.#body.angle))
            ;[ctx.strokeStyle, ctx.fillStyle] = this.color
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
        if (this.#image != null) {
            ctx.clip()
            try {
                let width = this.#body.circleRadius, height = width
                if (this.#width != null && this.#height != null) {
                    width = this.#width / 2
                    height = this.#height / 2
                }
                ctx.drawImage(this.#image,
                    (-width),
                    (-height),
                    width * 2,
                    height * 2)
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
        const { isStatic = false, x = 0, y = 0, angle = 0, size = 30, shape = 'circle', width = 30, height = 30 } = options
        this.#body = Entity.getShape({ isStatic, x, y, angle, size, shape, width, height })
        this.shape = shape
        if (shape === 'square') {
            this.#width = width
            this.#height = height
        }
        this.color = options.color ?? this.color
        World.add(world, this.#body)
        game.all.set(this.id, this)
    }
    get id() { return this.#body.id }
    get position() { return new Vector2(this.#body.position) }
    push(x, y) {
        return Body.applyForce(this.#body, this.position, { x, y })
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
function Rect(opts) {
    opts.shape = 'square'
    return new Entity(opts)
}

function afterUpdate() {
    game.frame++
    ctx.clearRect(0, 0, innerWidth, innerHeight)
    for (let [, body] of game.all) body.update(game.frame)
}
function beforeUpdate() {

}
Events.on(engine, 'afterUpdate', afterUpdate)
Events.on(engine, 'beforeUpdate', beforeUpdate)
new Entity({ x: 1000, y: 100, size: 40 })
window.abc = Rect({ x: 1000, y: 300, width: 300, height: 300, isStatic: true, })