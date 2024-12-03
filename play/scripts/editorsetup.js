export const leftstats = parent._('leftstats')
export const attrmap = new Map([
    ['width', value => $({title:'width', tag: 'input', text: 'width', class: 'write', placeholder: 'Width: ' + value, parent: leftstats })],
    ['height', value => $({title:'height', tag: 'input', text: 'height', class: 'write', placeholder: 'Height: ' + value, parent: leftstats })],
    ['radius', value => $({title:'radius', tag: 'input', text: 'width', class: 'write', placeholder: 'Radius: ' + value, parent: leftstats })],
    ['color', value => $({title:'color', tag: 'input', type: 'color', text: 'width', class: 'color', value: value[0], parent: leftstats })],
])