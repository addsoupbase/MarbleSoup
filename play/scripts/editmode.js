import { leftstats,attrmap } from './editorsetup.js'
import { Entity, game } from './play.js'
import { canvas, camera } from './page.js'
game.deselect = () =>{
    for (let [, obj] of game.all) obj.selected=false
    game.currentlyselected=null
    leftstats.killChildren()
}
game.editormode = true
window.setPlacing = function(mode){
    game.mousemode = mode
    game.deselect()
}
let viewing = null
Entity.prototype.onclick = function(){
    if (game.mousemode='moving') this.select()
}
Object.defineProperty(Entity.prototype, 'select', {
    value() {
        for (const [, obj] of game.all) obj.selected = false
        this.selected = true
        game.currentlyselected=this
        leftstats.killChildren()
        for (const attribute of this.attributes) {
            if (attrmap.has(attribute)) {
                attrmap.get(attribute)(this[attribute])
            } else {
                console.error('Unknown attribute: '+attribute)
            }
        }
        leftstats.transition({
            timing: {duration:300,            easing:'linear',
            },
            frames: {
                opacity:['0','1']
            }
        })
    }
})
Object.defineProperty(game, 'viewing', {
    set(target) {
        viewing = target
    }
})
canvas.addevent({
    click
})
const mousemode = new Map([
    ['placing', placeEntity],
    ['moving', moveEntity]
])
function moveEntity(x,y) {

}
function placeEntity(x, y) {
    const newobj = new Entity({ x, y })
    newobj.freeze()
    newobj.select()
}
function click({ x, y }) {
    let pos = new Vector2((x / camera.zoom), (y / camera.zoom))
    pos.subtract(camera.pos.x, camera.pos.y)
    if (mousemode.has(game.mousemode)) return mousemode.get(game.mousemode)(pos.x, pos.y)
    else throw TypeError('Unknown placement mode: ' + game.mousemode)
}
window.a = Entity