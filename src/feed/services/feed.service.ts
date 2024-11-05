import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {from, Observable} from "rxjs";
import {FeedPost} from "../models/post.interface";
import {FeedPostEntity} from "../models/post.entity";
import {User} from "../../auth/models/user.interface";

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(FeedPostEntity)
        private readonly feedPostRepository: Repository<FeedPostEntity>
    ) { }

    public createPost(feedPost: FeedPost, user: User): Observable<FeedPost> {
        feedPost.author = user;
        return from(this.feedPostRepository.save(feedPost));
    }

    public findAllPosts(): Observable<FeedPost[]> {
        return from(this.feedPostRepository.find());
    }

    public updatePost(id: number, feedPost: FeedPost): Observable<UpdateResult> {
        return from(this.feedPostRepository.update(id, feedPost))
    }

    public deleteOnePost(id: number): Observable<DeleteResult> {
        return from(this.feedPostRepository.delete(id));
    }

    public findPosts(take: number = 10, skip: number = 1): Observable<FeedPost[]> {
        /*return from(
            this.feedPostRepository.findAndCount({take, skip}).then(([posts]) => {
            return <FeedPost[]> posts;
        }));*/
        return from(
            this.feedPostRepository
                .createQueryBuilder('post')
                .innerJoinAndSelect('post.author', 'author')
                .orderBy('post.createdAt', 'DESC')
                .take(take)
                .skip(skip)
                .getMany()
        )
    }

    public findPostById(id: number): Observable<FeedPost> {
        return from(this.feedPostRepository.findOne({
            where: {
                id
            },

            relations: ['author']
        }))
    }
}
