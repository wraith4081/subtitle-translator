import chalk from 'chalk';

export default class ProgressBar {
    total: number;
    current: number = 0;

    barLength = 20;

    progressList: string[] = [];

    previousText = '';

    constructor(total: number, barLength = 20, progressList: string[] = []) {
        this.total = total;

        this.barLength = barLength;

        this.progressList = progressList;
    }

    updateTotal(total: number) {
        this.total = total;
    }

    updateCurrent(current: number) {
        this.current = current;

        this.render();
    }

    render() {
        const active = Math.floor((this.current / this.total) * this.barLength);

        const bar =
            chalk.bgGreenBright(' '.repeat(active)) +
            chalk.bgWhiteBright(' '.repeat(this.barLength - active));
        const progress = `${this.current}/${this.total}`;
        const name = this.progressList[this.current - 1] ?? 'N/A';
        const percentage = Math.floor((this.current / this.total) * 100)
            .toString()
            .padStart(3, '0') + '%';

        const text = `${bar} ${progress} [${percentage}]\nProgress: ${name}`.padEnd(
            this.previousText.length,
            ' '
        );

        this.clearLines(this.previousText, text);
        this.previousText = text;

        process.stdout.write(text);
    }

    end() {
        const bar = chalk.bgGreenBright(' '.repeat(this.barLength));
        const progress = `${this.total}/${this.total}`;
        const percentage = '100%';

        const text = `${bar} ${progress} [${percentage}]\nProgress: Ended`
        this.clearLines(this.previousText, text);

        process.stdout.write(text.padEnd(this.previousText.length, ' '));
        this.previousText = text;
    }

    clearLines = (prevText: string, currText: string) => {
        const prevLines = prevText.split('\n').length;
        const currLines = currText.split('\n').length;
        const linesToClear = Math.max(prevLines - currLines + 1, 0);

        for (let i = 0; i < linesToClear; i++) {
            process.stdout.moveCursor(0, -1);
            process.stdout.clearLine(1);
        }
        process.stdout.cursorTo(0);
    };
}