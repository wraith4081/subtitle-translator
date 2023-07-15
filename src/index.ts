import fs from 'node:fs';
import path from 'node:path';
import ASS from './classes/ASS';
import ProgressBar from './classes/ProgressBar';
import { ChunkSize } from './config';
import translateChunk from './helpers/translateChunk';
import chalk from 'chalk';

import readline from 'node:readline';
import tokenCount from './helpers/tokenCount';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const progressBar = new ProgressBar(3, 20, [
    'Importing file',
    'Reading file',
    'Initing ASS Parser Class'
]);

const argumentPath = process.argv[2];

if (!argumentPath) {
    throw new Error(`You should add a file: ${chalk.blue.bold('ts-node src/index.ts my-file-path')}`);
}

const file = path.join((/^[A-Z]\:\//.test(argumentPath) || /^\//.test(argumentPath)) ? '' : __dirname, argumentPath);

if (!fs.existsSync(file)) {
    throw new Error(`The file doesnt exists: ${chalk.red.bold(argumentPath)}`)
}

const content = fs.readFileSync(file, 'utf-8');
const ass = new ASS(content);

const totalToken = Math.floor(ass.dialogues.reduce((acc, cur) => acc + tokenCount(cur.Text, true), 0) * 10) / 10;
console.log(`This process will spend approximately ${chalk.green.bold((totalToken * 2.5) + ' input tokens')}, ie ${chalk.green.bold((Math.floor(totalToken * 0.0000015 * 2500) / 1000) + '$')}, according to a quick preliminary calculation.`);

rl.question(`Do you want to continue? ${chalk.blue.bold('"yes/y" for yes, others for no')} => `, (answer) => {
    if (['yes', 'y'].includes(answer.toLowerCase())) {
        progressBar.clearLines(`Do you want to continue? \n${chalk.blue.bold('"yes/y" for yes, others for no')} => `, '')

        const totalChunks = Math.ceil(ass.dialogues.length / ChunkSize);

        progressBar.updateTotal(
            progressBar.total + totalChunks
        );
        progressBar.progressList = [
            ...progressBar.progressList,
            ...(Array.from({ length: totalChunks }).map((_, i) => `Translating chunk - ${i + 1}`))
        ];

        ; (async () => {
            for (let chunk = 0; chunk < totalChunks; chunk++) {
                progressBar.updateCurrent(progressBar.current + 1);
                const input = ass.dialogues.slice(chunk * ChunkSize, (chunk + 1) * ChunkSize).map(({ Text }) => Text);

                let translateResult = await translateChunk(input);

                if (translateResult.success !== true) {
                    // Re-run this and still getting error give error
                    translateResult = await translateChunk(input);
                }

                ass.setDialogueTexts(
                    translateResult.content.map((content, i) => ({ index: chunk * ChunkSize + i, text: content }))
                );

                if (chunk === totalChunks - 1) {
                    const endContent = ass.convertToAss();

                    fs.writeFileSync(path.join(__dirname, `files/${new Date().getTime()}.ass`), endContent);

                    progressBar.end();
                }

            }
        })();


    } else {
        console.log('Exiting program...');
        process.exit(0);
    }
    rl.close();
});
