import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";

//hashing
import argon2 from 'argon2';

@InputType()
class UserPassInput {
    @Field( () => String )
    username: string

    @Field( () => String )
    password: string
}


@ObjectType()
class FieldError 
{
    @Field()
    field: string;

    @Field()
    message: string;

}


@ObjectType()
class UserResponse{

    @Field( () => [FieldError], {nullable: true})
    errors?: FieldError[];

    @Field( () => User, {nullable: true})
    user?: User;
}

@Resolver()
export class UserResolver
{
    @Mutation(() => UserResponse)
    async Register(
       @Arg( 'options', ()=> UserPassInput) options: UserPassInput,
       @Ctx() { em }: MyContext
    ): Promise<UserResponse>
    {
        const hashedPwd = await argon2.hash(options.password);

        const user = await em.create(
            User, 
            {
                username: options.username,
                password: hashedPwd
            }
        );

        try
        {
            await em.persistAndFlush(user);
        }
        catch
        {
            return {errors: [{field:"generic", message:"registration error"}]};
        }

        return {user: user};
    };


    @Mutation(() => UserResponse)
    async Login(
       @Arg( 'options', ()=> UserPassInput) options: UserPassInput,
       @Ctx() { em }: MyContext
    ): Promise<UserResponse>
    {

        const user = await em.findOne(User, {username: options.username});

        if (!user)
        {
            return {
                errors: 
                    [{field: "username", message: "user not found"}]
            }
        }

        const verify = await argon2.verify(user.password, options.password);

        if (!verify)
        {
            return {
                errors: 
                    [{field: "password", message: "password is incorrect"}]
            }
        }

        return { user: user};
    };



    @Query( () => User, {nullable: true})
    FindUser(
        @Arg('username', ()=> String) username: string,
        @Ctx() { em }: MyContext
    ): Promise<User | null>
    {
        return em.findOne(User, {username: username});
    };
}