import {Controller, Post, UploadedFile, UseInterceptors, Request, UseGuards, Get, Res, Param} from '@nestjs/common';
import {UserService} from "../services/user.service";
import {FileInterceptor} from "@nestjs/platform-express";
import {saveImageToStorage} from "../helpers/image-storage";
import {JwtGuard} from "../guards/jwt.guard";
import {Observable, of, switchMap} from "rxjs";
import path = require('path');

@Controller('user')
export class UserController {
   constructor(private userService: UserService) {
   }

   @UseGuards(JwtGuard)
   @Post('upload')
   @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): any {
      const userId = req.user.id;
      const fileName = file?.filename;
      return this.userService.updateUserImageById(userId, fileName);
   }

   @UseGuards(JwtGuard)
   @Get('image')
   getImage(@Request() req, @Res() res ): Observable<Object> {
       const userId = req.user.id;
      return this.userService.findImagePathByUserId(userId).pipe(
           switchMap((imagePath: string) => {
               return of(res.sendFile(imagePath, {root: './images'}))
           })
       )
   }

    @UseGuards(JwtGuard)
    @Get('image-path')
    getImagePath(@Request() req): Observable<{imageName: string}> {
        const userId = req.user.id;
        return this.userService.findImagePathByUserId(userId).pipe(
            switchMap((imageName) => {
                return of({imageName})
            })
        )
    }

    @Get('image-path/:imagename')
    findProfileImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
        return of(res.sendFile(path.join(process.cwd(), 'images/' + imagename)))
    }

}
