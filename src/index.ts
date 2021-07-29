import { MikroORM } from "@mikro-orm/core";
import { __db_password__, __db_user__, __prod__ } from "./constants";
import { Post } from "./entities/post";


const main = async () => 
{    
        const orm = await MikroORM.init(
            {
                entities: [Post],
                dbName: "website",
                user: __db_user__,
                password: __db_password__,
                debug: !__prod__,
                type: 'postgresql'
            }
        );

        const post = orm.em.create(Post, {title: 'my first post'});
        await orm.em.persistAndFlush(post);

};

main().catch( err => {console.log(err);} );

console.log("Hello test")


