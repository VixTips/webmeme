import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import { __redis_secret__, __db_password__, __db_user__, __prod__ } from "./constants";
import config from "./mikro-orm.config";
import express   from "express";
import { ApolloServer } from "apollo-server-express";
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

//god help me wtf is this
const corsOptions =
{
    origin: ['https://studio.apollographql.com',
     'localhost:4000',
     'http://localhost:4000/graphql',
     'https://localhost:4000',
     'test',
     'https://$studio.apollographql.com'
    ],
    credentials: true
}

const cookieOptions: session.CookieOptions =
{
    maxAge: 1000*60*60*24*265*10, //10 years
    httpOnly: false,
    secure: true,    //@victor enable in prod
    sameSite: "none"
}


const main = async () =>
{
    const orm = await MikroORM.init(config);
    orm.getMigrator().up();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: 'RSesh',
            store: new RedisStore({
                client: redisClient,
                 disableTouch: true
                }),
            cookie: cookieOptions,
            saveUninitialized: false,
            secret: "testest",
            resave: false
            }
        )
    );

    const apolloServer = new ApolloServer(
        {
            schema: await buildSchema(
                {
                    resolvers: [PostResolver, HelloResolver, UserResolver],
                    validate: false,
                },
            ),
            context: ( {req, res}): MyContext => ({em: orm.em, req, res })
        }
    );

    await apolloServer.start();
    //cors must be applies to middleware, NOT express...
    apolloServer.applyMiddleware( { app, cors: corsOptions } );

    app.listen(4000, () =>
        {
            console.log("[SERVER] Started listening on port 4000");
        }
    );

    //await apolloServer.stop();

    // _ is to ignore the variable
    //Example rest endpoint
    // app.get('/', (req, res) =>
    //     {
    //         console.log("[SERVER] Recieved get request at /");
    //         res.send("Hello");
    //     }
    // );

    // const post = orm.em.create(Post, {title: 'sneedly chuck'});
    // await orm.em.persistAndFlush(post);
    // const posts = await orm.em.find(Post, {});
    // console.log(posts);

};

main().catch( err => {console.log(err);} );

