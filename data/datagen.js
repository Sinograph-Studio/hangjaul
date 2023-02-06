let fs = require('fs')

// src: https://raw.githubusercontent.com/libhangul/libhangul/main/data/hanja/hanja.txt
let hanja_txt = fs.readFileSync('hanja.txt', 'utf-8')

// src: https://raw.githubusercontent.com/libhangul/libhangul/main/data/hanja/freq-hanjaeo.txt
let freq_txt = fs.readFileSync('freq-hanjaeo.txt', 'utf-8')

let hanja_lines = hanja_txt.split('\n')
let freq_lines = freq_txt.split('\n')

let freq = {}
for (let line of freq_lines) {
    let t = line.split(':'); if (t.length >= 2) {
        let [hanja, value] = t
        freq[hanja] = value
    }
}

let m = {}
for (let line of hanja_lines) {
    if (line.startsWith('#')) { continue }
    let t = line.split(':'); if (t.length >= 2) {
        let [hangul, hanja] = t
        if (!(m[hangul])) {
            m[hangul] = {}
        }
        m[hangul][hanja] = freq[hanja] || 0
    }
}

let n = {}
for (let [hangul, hanja2freq] of Object.entries(m)) {
    n[hangul] = Object.entries(hanja2freq).sort(([_,value1],[__,value2]) => value2 - value1).map(([hanja,_]) => hanja)
}

fs.writeFileSync('data.ts', ('export const Hangul2Hanja: { [key:string]: string[] } = ' + JSON.stringify(n)))


