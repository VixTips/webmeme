//import e from "express";
import { MyContext } from "src/types";
import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
//import { CannotAttachTreeChildrenEntityError } from "typeorm";
import { Post } from "../entities/Post";


@Resolver()
export class PostResolver
{
    @Query(() => [Post])
    GetPosts(@Ctx() { em }: MyContext): Promise<Post[]>
    {
        return em.find(Post, {});
    }

    @Query( () => Post, {nullable: true})
    GetPost(
        @Arg('id', () => Int ) id: number,
        @Ctx() { em }: MyContext
        ): Promise<Post | null>
    {
        return em.findOne(Post, {id});
    }

    @Mutation( () => Post)
    async CreatePost(
        @Arg('title', () => String ) title: string,
        @Ctx() { em }: MyContext
        ): Promise<Post>
    {
        const post = em.create(Post, {title});
        await em.persistAndFlush(post);
        return post;
    }

    @Mutation( () => Post, {nullable: true})
    async UpdatePost(
        @Arg('title', () => String ) title: string,
        @Arg('id', () => Int ) id: number,
        @Ctx() { em }: MyContext
        ): Promise<Post | null>
    {
        const post = await em.findOne(Post, {id});

        if (post)
        {
            if (typeof title !== 'undefined')
            {
                post.title = title;
                await em.persistAndFlush(post)
            }
        }

        return post;
    }

    @Mutation( () => Boolean)
    async DeletePost(
        @Arg('id', () => Int ) id: number,
        @Ctx() { em }: MyContext
        ): Promise<Boolean>
    {
        try
        {
            await em.nativeDelete(Post, {id});
        }
        catch
        {
            return false;
        }

        return true;
    }
}