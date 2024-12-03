Elem.loglevel=5
import {repeatmusic,audio} from "./audio.js"
export const { Engine,
    World,
    Bodies,
    Events,
    Body,
    Collision,
    Constraint,
    Vertices,
    Runner,
    Composite } = Matter
export const engine = Engine.create({
    enableSleeping: true
})
export const world = engine.world
export const config = {
    sleepThreshold: 2000,
    gamefont: 'Choco cooky'
}
export const defaultcanvas = {
    textAlign: 'center',
    textBaseline: 'middle',
    lineJoin: 'round',
    lineCap: 'round',
    imageSmoothingQuality: 'high',
    textRendering: 'optimizeLegibility',
    lineWidth: 1.24,
}
function importEditor(){
delete window.importEditor
import("./editmode.js")
}
window['import the editor']=importEditor
on(document, {'DOMContentLoaded:1'() {$({tag: 'button', class: 'center', id:'startbutton', parent: body, text: 'Start', events: {'click:1'(){
    audio.play('click.mp3')
    _('canvas').styleMe({'pointer-events':'all'})
    this.fadeOut(this.kill);repeatmusic();Runner.run(engine)}}})}})