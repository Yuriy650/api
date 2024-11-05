import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {map, Observable, switchMap} from 'rxjs';
import {FeedService} from "../services/feed.service";
import {AuthService} from "../../auth/services/auth.service";
import {User} from "../../auth/models/user.interface";
import {FeedPost} from "../models/post.interface";
import {Role} from "../../auth/models/role.enum";
import {UserService} from "../../auth/services/user.service";

@Injectable()
export class IsCreatorGuard implements CanActivate {

  constructor(private authService: AuthService,
              private userService: UserService,
              private feedService: FeedService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const {user, params} = req;
    if (!user || !params) return false;
    if (user.role === Role.ADMIN) return true;
    const feedId = params.id;
    const userId = user.id;
    return this.userService.findUserById(userId).pipe(
        switchMap((user: User) => {
          return this.feedService.findPostById(feedId).pipe(
              map((feedPost: FeedPost) => {
                return user.id === feedPost.author.id;
              })
          )
        })
    )
  }
}
