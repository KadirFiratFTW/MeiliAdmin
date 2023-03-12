import chalk from "chalk";

export default {
    Error(text) {
        console.log(chalk.black.bgRed(text));
    },

    Success(text) {
        console.log(chalk.black.bgGreen(text));
    }

}