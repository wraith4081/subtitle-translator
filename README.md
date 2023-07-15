# Subtitle Translator

Subtitle Translator is a project aimed at providing a simple and efficient solution for translating large .ASS files quickly. This README will guide you through the process of downloading, configuring, and using the project.

## Download
To download the Subtitle Translator project, follow these steps:

1. Open your terminal or command prompt.
2. Run the following command to clone the repository:
   ```
   git clone https://github.com/wraith4081/subtitle-translator
   ```
3. Change into the project directory by running:
   ```
   cd subtitle-translator
   ```
4. Install the necessary dependencies by running:
   ```
   npm install
   ```

## Configuration
Before you can use Subtitle Translator, you need to configure it with your API key from the OpenAI Developer Panel. Follow these steps to configure the project:

1. Go to the [OpenAI Developer Panel](https://platform.openai.com/account/api-keys).
2. Sign in to your account (or create one if you don't have it already).
3. Navigate to the API Keys section and generate a new API key if you haven't done so already.
4. Open the `config.ts` file in the project.
5. Find the `OPENAI_KEY` variable and replace its value with your generated API key.

## Usage
Once you have downloaded and configured Subtitle Translator, you can start using it to translate your .ASS files. Follow these steps:

1. Open your terminal or command prompt.
2. Navigate to the project directory (if you're not already there) by running:
   ```
   cd subtitle-translator
   ```
3. Run the following command to start the translation process:
   ```sh
   ts-node src/index.ts <your-subtitle-path>
   ```
   Replace `<your-subtitle-path>` with the path to your .ASS file that you want to translate.

   Note: Make sure you have [ts-node](https://www.npmjs.com/package/ts-node) installed globally to run the TypeScript code.

4. Once the program starts, it will display an output similar to this:
   ![image](https://github.com/wraith4081/subtitle-translator/assets/54374743/5a64f8c4-b40b-4bc0-9791-ce24c0e63756)

5. You will be prompted to confirm whether you want to proceed with the translation. Type "yes" or "y" to continue. If you type anything else, the program will terminate.

   ![image](https://github.com/wraith4081/subtitle-translator/assets/54374743/4c2b1fad-35a9-47d9-8961-dd0361f8b85d)

6. If you choose to continue, the program will display a live interface where you can track the progress of the translation:

   ![image](https://github.com/wraith4081/subtitle-translator/assets/54374743/0de525fd-c0a5-400c-9ae7-c29476fcf5c9)

   The completion time will depend on the size of the subtitle file. Smaller files will have fewer chunks and will finish faster.

7. Once the translation process is complete, you will find the translated subtitle file in the `files` folder. It will have a name consisting of a 13-digit number sequence, such as `1689432472587.ass`.

Please note that Subtitle Translator currently only supports TypeScript. The project will be periodically updated to improve its functionality and provide additional features.

We hope you find Subtitle Translator helpful in translating your .ASS files quickly and easily. Please feel free to contribute to the project through pull requests and report any issues you encounter.
