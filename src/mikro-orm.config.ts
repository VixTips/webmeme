import { Options } from "@mikro-orm/core";
import { __db_password__, __db_user__, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import path from 'path'



const config: Options = 
{
    entities: [Post],
    dbName: 'website',
    user: __db_user__,
    password: __db_password__,
    debug: false,
    type: 'postgresql',
    migrations: 
    {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    }
};

export default config;
