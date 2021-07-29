import { MikroORM } from "@mikro-orm/core";
import { __db_password__, __db_user__, __prod__ } from "./constants";
import { Post } from "./entities/post";
import config from "./mikro-orm.config";


const main = async () => 
{    
        const orm = await MikroORM.init(config);
        orm.getMigrator().up();

        const post = orm.em.create(Post, {title: 'sneedly chuck'});
        await orm.em.persistAndFlush(post);

};

main().catch( err => {console.log(err);} );

console.log("Hello test")


