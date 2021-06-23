import {Arguments, Argv, CommandModule} from "yargs";
import {ConnectionOptions} from "typeorm";
import {buildConnectionOptions} from "../../../connection";
import {dropDatabase} from "../../../database";

export interface DatabaseDropArguments extends Arguments {
    connection: 'default' | string,
    config: 'ormconfig' | string,
}

export class DatabaseDropCommand implements CommandModule {
    command = "db:drop";
    describe = "Drop database.";

    builder(args: Argv) {
        return args
            .option("connection", {
                alias: "c",
                default: "default",
                describe: "Name of the connection on which run a query."
            })
            .option("config", {
                alias: "f",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            })
    }

    async handler(args: DatabaseDropArguments, exitProcess: boolean = true) {
        const connectionOptions: ConnectionOptions = await buildConnectionOptions({
            name: args.connection,
            configName: args.config,
            buildForCommand: true
        });

        await dropDatabase({
            ifExist: true
        }, connectionOptions);

        if(exitProcess) {
            process.exit(0);
        }
    }
}