export default function tokenCount(text: string, output: boolean = false): number {
    const wordLength = text.split(' ').length;
    const characterLength = text.length;

    const wordToken = wordLength * 1.33;
    const characterToken = characterLength / 4;

    // Word Token: %60,
    // Character Token: 40%
    return (
        wordToken * 3 + characterToken * 2
    ) / 5 * (output ? 2.125 : 1)
}