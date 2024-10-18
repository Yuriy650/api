import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {map, Observable, switchMap} from 'rxjs';
import {FeedService} from "../services/feed.service";
import {AuthService} from "../../auth/services/auth.service";
import {User} from "../../auth/models/user.interface";
import {FeedPost} from "../models/post.interface";
import {Role} from "../../auth/models/role.enum";

@Injectable()
export class IsCreatorGuard implements CanActivate {

  constructor(private authService: AuthService, private feedService: FeedService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const {user, params} = req;
    if (!user || !params) return false;
    if (user.role === Role.ADMIN) return true;
    const feedId = params.id;
    const userId = user.id;
    return this.authService.findUserById(userId).pipe(
        switchMap((user: User) => {
          return this.feedService.findPostById(feedId).pipe(
              map((feedPost: FeedPost) => {
                console.log('author', feedPost.author)
                return user.id === feedPost.author.id;
              })
          )
        })
    )
  }
}
