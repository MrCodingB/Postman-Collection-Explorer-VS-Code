# Contributing

Thank you for contributing!

Please read the following guidlines before making your contribution.

## Code of Conduct

This project and all of it's participants are governed by the [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [bastiwoess@gmail.com](mailto:bastiwoess@gmail.com).

## Raising an Issue

Always check the [open issues](https://github.com/MrCodingB/Postman-Collection-Explorer-VS-Code/issues?q=is%3Aopen+is%3Aissue) and the [project board](https://github.com/mrcodingb/postman-collection-explorer-vs-code/projects/1), to see if your contribution has already been made.

If your contribution hasn't previously been reported/suggested, raise an issue using an appropriate template.

## Contributing to development

If you're interested in helping contribute, either find an open issue or raise a new issue according to the guidlines above. As soon as the issue has been assigned to you, you can start working on it.

1. To set up your development environment, please follow these steps:

    1. Install [Node.js](https://nodejs.org/en/)
    2. Clone the [postman-collection-explorer-vs-code](https://github.com/mrcodingb/postman-collection-explorer-vs-code) repo on GitHub.
    3. Open the repo in Visual Studio Code.
    4. Run `npm install` or `npm i` to install the required dependencies.
    5. Install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension.
    6. Create and checkout a branch for your issue with the following template `/private/<yourname>/<issue>`.

2. Compilation:

    - `npm run prebuild`: Like `npm run build` but deletes previous build outputs
    - `npm run build`: Compiles, lints and packages the project
    - `npm run compile`: Only runs the typescript compiler (not recommended)

3. Manual testing:

    Pressing F5 in Visual Studio Code starts the Extension Development Host in a seperate window. Here you can manually test and debug your extension.

4. Unit testing:

    Selecting the `Test Extension` launch configuration and starting the extension runs all unit tests and outputs the results to the debug console.

5. Production test:

    1. Run `npm run vsce "package"` in the terminal. This will compile and package the extension into a `vsix` file which you can install using `code install-extension <path-to-the-vsix-file>`.
    2. Restart Visual Studio Code, and check the version number of your extension.
    3. Test the extension, it will behave just like a published release.

6. Raise a pull request.

NOTE: Your files should be formatted with the default formatter in Visual Studio Code. Do not use extensions like prettier to format your code.
