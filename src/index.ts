import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import { __db_password__, __db_user__, __prod__ } from "./constants";
import config from "./mikro-orm.config";
import express   from "express";
import { ApolloServer } from "apollo-server-express";
import {buildSchema} from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

import { test } from './test/test';

const main = async () => 
{    
        const orm = await MikroORM.init(config);
        orm.getMigrator().up();

        console.log(test);

        const app = express();
        const apolloServer = new ApolloServer(
            {
                schema: await buildSchema(
                    {
                        resolvers: [PostResolver, HelloResolver],
                        validate: false,
                    }
                ),
                context: () => ({em: orm.em })
            }
        );

        await apolloServer.start();
        apolloServer.applyMiddleware( { app } );
        
        app.listen(4000, () =>
        {
            console.log("[SERVER] Found a connection on port 4000");
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

