interface AssStyle {
  Name: string;
  Fontname: string;
  Fontsize: number;
  PrimaryColour: string;
  SecondaryColour: string;
  OutlineColour: string;
  BackColour: string;
  Bold: number;
  Italic: number;
  Underline: number;
  StrikeOut: number;
  ScaleX: number;
  ScaleY: number;
  Spacing: number;
  Angle: number;
  BorderStyle: number;
  Outline: number;
  Shadow: number;
  Alignment: number;
  MarginL: number;
  MarginR: number;
  MarginV: number;
  Encoding: number;
}

interface AssDialogue {
  Layer: number;
  Start: number;
  End: number;
  Style: string;
  Name: string;
  MarginL: number;
  MarginR: number;
  MarginV: number;
  Effect: string;
  Text: string;
}

export default class Ass {
  // header, styles and dialogues are properties of the class
  public header: string = '';
  public styles: AssStyle[] = [];
  public dialogues: AssDialogue[] = [];

  constructor(content: string) {
    const lines = content.split(/\r?\n/);

    let section = "";
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // check if the line is a section header
      if (line.startsWith("[")) {
        section = line;
      } else if (section === '[Script Info]') {
        // if the section is Script Info, add the line to the header
        this.header += `\n${line}`
      } else if (section === "[V4+ Styles]") {
        // if the section is Styles, parse the style and add it to the styles array
        const style = this.parseStyle(line);
        if (style) {
          this.styles.push(style);
        }
      } else if (section === "[Events]") {
        // if the section is Events, parse the dialogue and add it to the dialogues array
        const dialogue = this.parseDialogue(line);
        if (dialogue) {
          this.dialogues.push(dialogue);
        }
      }
    }
  }

  private parseStyle(line: string): AssStyle | null {
    const fields = line.split(",").map((field) => field.trim());

    // check if the line is a valid style line
    if (fields.length < 2 || fields[0].split(':')?.[0] !== 'Style') {
      return null;
    }

    // create a new style object and populate it with the fields
    const style: AssStyle = {
      Name: fields[0].split(':')?.[1].trim() ?? 'N/A',
      Fontname: fields[1],
      Fontsize: parseFloat(fields[2]),
      PrimaryColour: fields[3],
      SecondaryColour: fields[4],
      OutlineColour: fields[5],
      BackColour: fields[6],
      Bold: parseInt(fields[7]),
      Italic: parseInt(fields[8]),
      Underline: parseInt(fields[9]),
      StrikeOut: parseInt(fields[10]),
      ScaleX: parseFloat(fields[11]),
      ScaleY: parseFloat(fields[12]),
      Spacing: parseFloat(fields[13]),
      Angle: parseFloat(fields[14]),
      BorderStyle: parseInt(fields[15]),
      Outline: parseFloat(fields[16]),
      Shadow: parseFloat(fields[17]),
      Alignment: parseInt(fields[18]),
      MarginL: parseInt(fields[19]),
      MarginR: parseInt(fields[20]),
      MarginV: parseInt(fields[21]),
      Encoding: parseInt(fields[22]),
    };

    return style;
  }

  private parseDialogue(line: string): AssDialogue | null {
    const fields = line.split(",").map((field) => field.trim());

    // check if the line is a valid dialogue line
    if (fields.length < 9 || fields[0]?.split(':')?.[0] !== 'Dialogue') {
      return null;
    }

    // create a new dialogue object and populate it with the fields
    const dialogue: AssDialogue = {
      Layer: parseInt(fields[0]?.split(':')?.[1] ?? '0'),
      Start: this.parseTime(fields[1]),
      End: this.parseTime(fields[2]),
      Style: fields[3],
      Name: fields[4],
      MarginL: parseInt(fields[5]),
      MarginR: parseInt(fields[6]),
      MarginV: parseInt(fields[7]),
      Effect: fields[8],
      Text: fields.slice(9).join(","),
    };

    return dialogue;
  }

  private parseTime(time: string): number {
    const parts = time.split(":").map((part) => parseFloat(part));
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  // set the text of the dialogues at the specified indices
  setDialogueTexts(data: { index: number, text: string }[]) {
    data = data.filter(
      ({ text, index }) => !(
        typeof index !== 'number' || typeof text !== 'string' ||
        text.length <= 0 || index < 0 ||
        index >= this.dialogues.length
      )
    )

    for (const { index, text } of data) {
      this.dialogues[index].Text = text;
    }
  }

  // convert seconds to the ASS time format
  convertTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const milliseconds = Math.floor((remainingSeconds - Math.floor(remainingSeconds)) * 100);
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toFixed(2).padStart(5, '0')}`;
    return timeString;
  }
  // convert the ASS object to a string
  convertToAss(): string {
    let content = this.header + "\n";

    content += "[V4+ Styles]\n";

    content += "Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\n";

    for (const style of this.styles) {
      content += `Style: ${style.Name},${style.Fontname},${style.Fontsize},${style.PrimaryColour},${style.SecondaryColour},${style.OutlineColour},${style.BackColour},${style.Bold},${style.Italic},${style.Underline},${style.StrikeOut},${style.ScaleX},${style.ScaleY},${style.Spacing},${style.Angle},${style.BorderStyle},${style.Outline},${style.Shadow},${style.Alignment},${style.MarginL},${style.MarginR},${style.MarginV},${style.Encoding}\n`;
    }

    content += "\n[Events]\n";

    content += "Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n";

    for (const dialogue of this.dialogues) {
      content += `Dialogue: ${dialogue.Layer},${this.convertTime(dialogue.Start)},${this.convertTime(dialogue.End)},${dialogue.Style},${dialogue.Name},${dialogue.MarginL},${dialogue.MarginR},${dialogue.MarginV},${dialogue.Effect},${dialogue.Text}\n`;
    }

    return content;
  }
}