import { Injectable } from '@nestjs/common';
import {from, map, Observable, switchMap} from "rxjs";
import {User} from "../models/user.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../models/user.entity";
import {Repository, UpdateResult} from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>) {

    }

    public findUserById(id: number): Observable<User> {
        return from(this.userRepository.findOne({
                where: {
                    id
                },
                relations: ['feedPosts']
            }
        )).pipe(
            map((user: User) => {
                delete user.password;
                return user
            })
        )
    }

    public updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
                const user = new UserEntity();
                console.log('Updating user image', user)
                user.id = id;
                user.imagePath = imagePath;
                return from(this.userRepository.update(id, user));
    }

    public findImagePathByUserId(id: number): Observable<string> {
        return from(this.userRepository.findOne({
            where: {
                id
            },
            relations: ['feedPosts']
        })
        ).pipe(
            map((user: User) => {
                delete user.password;
                return user.imagePath;
            }))
    }
}
