import { User } from "../entities/User";
import { MyContext } from "src/types";
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from "type-graphql";

//hashing
import argon2 from 'argon2';


declare module 'express-session' {
    export interface Session {
      userId: number;
    }
  }

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
       @Ctx() { em, req }: MyContext
    ): Promise<UserResponse>
    {

        if (options.username.length <= 2 || options.password.length <=2 )
        {
            return {errors: [{field:"password", message:"Username or Password too short"}]};

        }
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
            return {errors: [{field:"password", message:"user already exists"}]};
        }

        req.session.userId = user.id;
        return {user: user};
    };

    @Mutation(() => UserResponse)
    async Login(
       @Arg( 'options', ()=> UserPassInput) options: UserPassInput,
       @Ctx() { em, req }: MyContext
    ): Promise<UserResponse>
    {

        const user = await em.findOne(User, {username: options.username});

        if (!user)
        {
            return {
                errors: 
                    [{field: "username", message: "User not found"}]
            }
        }

        const verify = await argon2.verify(user.password, options.password);

        if (!verify)
        {
            return {
                errors: 
                    [{field: "password", message: "Password is incorrect"}]
            }
        }

        req.session.userId = user.id;
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

    @Query( () => User, {nullable: true})
    async Me(
        @Ctx() {em, req}: MyContext
    ) : Promise<User | null>
    {

        console.log("[SERVER] Me() call")
        if (!req.session.userId) {
            return null;
        }
        else {
            return await em.findOne(User, {id: req.session.userId})
        }
    }
}