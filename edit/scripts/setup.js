const iframe = $({ class: 'center', tag: 'iframe', src: '../play', parent: body, events: { load() { game['import the editor']() } } }),
    game = iframe.content.contentWindow
const leftmenustate = utilMath.cycle('-90%', '0%'),
    leftmenubuttonstate = utilMath.cycle('180deg', '0deg'),
    placingstate = utilMath.cycle('moving','placing')
let leftopacitystate = 1
$({
    tag: 'div', parent: body, id: 'leftmenu', children: [
        $({
            tag: 'button', id: 'leftmenubutton',class:'green', events: {
                async click() {
                    if (leftopacitystate === 1) leftopacitystate = 0.2
                    else leftopacitystate = 1
                    _('leftmenubuttonicon').transition({ timing: { duration: 400, easing: 'ease' }, frames: { transform: `rotate(${leftmenubuttonstate.next}) scale(1.6,1.6)` } })
                    _('leftmenu').transition({ timing: { easing: 'ease' }, frames: { opacity: leftopacitystate, transform: `translateX(${leftmenustate.next})` } })
                }
            }, children: [
                $({ tag: 'div', id: 'leftmenubuttonicon', class: 'ui arrow' }),
            ]
        }),
        $({ tag: 'div', id: 'leftstats' })
    ]
})
let placingtext = null
$({tag:'div',parent:body,class:'green topsettings',
    events:{
        click(){
            let {next}=placingstate
            game.setPlacing(next)
            placingtext.textContent=next.toUpperCase()
        }
    },
    children:[
  placingtext= $({tag:'p',text:'PLACING'})
]})

export default game