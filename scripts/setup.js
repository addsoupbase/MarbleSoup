import "./audio.js"
const { Engine,
    World,
    Bodies,
    Events,
    Body,
    Collision,
    Constraint,
    Vertices,
    Runner,
    Composite } = Matter
    , engine = Engine.create({
        enableSleeping: true
    })
    , world = engine.world
    , config = {
        sleepThreshold: 2000
    }
on(window, {
    'load:1'() {
        Runner.run(engine)
    }
})
export { Engine, World, Runner, Bodies, Events, Composite, Collision, Constraint, engine, Body, world, config, Vertices }