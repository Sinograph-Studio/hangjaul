import { Hangul2Hanja } from './data/data'

function isHangul(codepoint: number): boolean {
    return (0xAC00 <= codepoint && codepoint <= 0xD7AF)
}

type Segment = { kind: SegmentKind, content: string, match?: Match }
enum SegmentKind { Null, Hangul, Whitespace, Others }
function getSegments(text: string): Segment[] {
    let segments: Segment[] = []
    let current: Segment = { kind: SegmentKind.Null, content: '' }
    let add = (kind: SegmentKind, char: string) => {
        if (current.kind == SegmentKind.Null) { current.kind = kind }
        if (current.kind == kind) { current.content += char }
        else { segments.push(current); current = { kind, content: char } }
    }
    for (let char of text) {
        let codepoint = char.codePointAt(0)!
        if (isHangul(codepoint)) { add(SegmentKind.Hangul, char) }
        else if (char == ' ') { add(SegmentKind.Whitespace, char) }
        else { add(SegmentKind.Others, char) }
    }
    if (current.kind != SegmentKind.Null) {
        segments.push(current)
    }
    matchHanja(segments)
    return segments
}
type Match = { length: number, options: string[] }
function matchHanja(segments: Segment[]) {
    for (let segment of segments) {
    if (segment.kind == SegmentKind.Hangul) {
        let content = segment.content
        for (let length = content.length; length >= 2; length -= 1) {
            let part = content.slice(0, length)
            let options = Hangul2Hanja[part]; if (options) {
                segment.match = { length, options }
                break
            }
        }
    }}
}

function stringifySegments(segments: Segment[]): string {
    return segments.map(segment => {
        let match = segment.match; if (match) {
            let content = segment.content
            let word = content.slice(0, match.length)
            let suffix = content.slice(match.length, content.length)
            return `${word}(${match.options.join('/')})${suffix}`
        } else {
            return segment.content
        }
    }).join('')
}

let text = globalThis['process'].argv[2]; if (text) {
    let segments = getSegments(text)
    console.log(stringifySegments(segments))
}


