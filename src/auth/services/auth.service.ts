import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {from, map, Observable, of, switchMap} from "rxjs";
import {User} from "../models/user.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../models/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {

    constructor(@InjectRepository(UserEntity)
                private readonly userRepository: Repository<UserEntity>,
                private jwtService: JwtService) {
    }

    public hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    public registerAccount(user: User): Observable<User> {
        const {firstName, lastName, email, password, role} = user;

        return this.hashPassword(password).pipe(
            switchMap((hashPassword: string) => {
                return from(this.userRepository.save({
                    firstName,
                    lastName,
                    email,
                    role,
                    password: hashPassword
                })).pipe(
                    map((user: User) => {
                        delete user.password;
                        return user;
                    })
                )
            })
        )
    }

    comparePassword(password: string, passwordHash: string): Observable<any | boolean> {
        return of<any | boolean>(bcrypt.compare(password, passwordHash))
    }

    public validateUser(email: string, password: string): Observable<User> {
        return from(this.userRepository.findOneBy({email}

            //select: {id: true, firstName: true, lastName: true, email: true, password: true}}
        )
    ).pipe(
            switchMap((user: User) => {
                return this.comparePassword(password, user.password).pipe(
                    map((isValidPassword: boolean) => {
                        if (isValidPassword) {
                            const {password, ...result} = user;
                            return result;
                        } else {
                            throw Error;
                        }
                    })
                )
            })
        )
    }

    public login(user: User): Observable<string> {
        const {email, password} = user;
        return this.validateUser(email, password).pipe(
            switchMap((user) => {
                if(user) {
                    //create JWT - credentials
                    return from(this.jwtService.signAsync({user}));
                } else {
                    return "Wrong Credentials"
                }
            })
        )
    }
}
