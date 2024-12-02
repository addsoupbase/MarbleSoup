local.volume ??= 0.5 //Default value
const sfx = new Map, music = new Set
const sources = {
    sfx: new Set('click.mp3 confirm.mp3 pop.mp3'.split(' ').map(
        src => '../media/sfx/' + src
    )),
    music: new Set('beach.mp3 flowers.mp3 freshair.mp3 garden.mp3 leaves.mp3 love.mp3 peach.mp3 rainbow.mp3 spring.mp3'.split(' ').map(
        src => '../media/music/' + src
    ))
}
const audio = {
    play(filename) {
        const file = '../media/sfx/' + filename
        if (sfx.has(file)) {
            const toplay = sfx.get(file)
            return toplay.play()
        } else Elem.error('Unknown audio source: ' + new URL(file, location))
    },
    get currentMusic() {
        return currentMusic
    },
    set volume(val) {
        //Volume will automatically sync with sound
        local.volume = '' + utilMath.clamp(+val, 0, 1)
        for (const [, sound] of sfx) sound.volume = local.volume
        for (const sound of music) sound.volume = local.volume
    }
}
for (const src of sources.music) {
    //Load music
    const audio = new Audio(src),
        url = new URL(src, location)
    music.add(audio)
    on(audio, {
        ended: repeatmusic,
        error() { 
            music.delete(audio)
            Elem.error(url + ' could not be loaded') 
        },
        canplaythrough() { audio.volume = local.volume },
    })
}
//const backgroundMusicCycle = utilMath.cycle(...music)
for (const src of sources.sfx) {
    //Load sound effects
    const audio = new Audio(src),
        url = new URL(src, location)
    sfx.set(src, audio)
    on(audio, {
        error() {
            sfx.delete(src)
            Elem.error(url + ' could not be loaded') },
        canplaythrough() { audio.volume = local.volume }
    })
}
let currentMusic=null
export { sfx, music, audio,repeatmusic }
Elem.success('Audio loaded')
console.log('All music credit goes to %c@SakuraGirl%c on youtube: ', 'color:pink;font-size:16px;font-family:arial;', 'color:white;')
console.log('https://www.youtube.com/@SakuraGirl/')
function repeatmusic() {
    let pick, max = 100
    do {
        --max
        pick = ran.choose(...music)
    }
    while (pick === this && max)
    if (this) {
        this.currentTime = 0
        this.pause()
    }
    console.log('📻 Currently playing: ' + pick.src)
    return timeout(() => {
        pick.play()
        currentMusic = pick
    }, 2000 + ran.range(0, 1000))
}
/*on(window, {
    'click:1'() { repeatmusic() }
})*/
assign(window, { music, audio })