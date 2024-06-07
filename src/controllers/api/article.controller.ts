import { Controller, Get, Param, Request, NotFoundException, Post, Body, UseInterceptors, UploadedFile, Req, Delete, Patch } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud, CrudController, Override} from "@nestjsx/crud";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticleService } from "src/services/article/article.service";
import { diskStorage } from "multer";
import { storageConfig } from "config/storage.config";
import { PhotoService } from "src/services/photo/photo.service";
import { Photo } from "src/entities/photo.entity";
import { ApiResponse } from "src/misc/api.response.class";
//import * as magicBytes from 'magic-bytes.js';
import filetype from 'magic-bytes.js'
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { EditArticleDto } from "src/dtos/article/edit.article.dto";

@Controller('api/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService,
              private readonly photoService: PhotoService
  ) {}

@Get()
async getArticles(): Promise<Article[]> {
  return this.articleService.findAll();
}

@Get(':id')
async getArticleById(@Param('id') id: number): Promise<Article> {
  const article = await this.articleService.findOneById(id);

  if (!article) {
    throw new NotFoundException(`Article with id ${id} not found`);
  }

  return article;
}

  @Patch(':id')     // http://localhost:3000/api/article/4/
  editFullArticle(@Param('id') id:number, @Body() data:EditArticleDto){
      return this.articleService.editFullArticle(id,data);
  }


  @Post('createFull')     // http://localhost:3000/api/article/createFull
  createFullArticle(@Body() data:AddArticleDto){
      return this.articleService.createFullArticle(data);
  }


  @Post(':id/uploadPhoto/')               // http://localhost:3000/api/article/:id/uploadPhoto/
  @UseInterceptors(
    FileInterceptor('photo', {
      storage:diskStorage({
        destination: storageConfig.photo.destination,
        filename:(req, file, callback) => {
          let orginal:string= file.originalname;

          // 'Neka slika.jpg'
          // '20242805-9726328429-Neka-slika.jpg'
          let normalized=orginal.replace(/\s+/g,'-');
          normalized=normalized.replace(/[^A-z0-9\.\-]/g,'');
          let sada=new Date();
          let datePart='';
          datePart+=sada.getFullYear().toString();
          datePart+=(sada.getMonth()+1).toString();
          datePart+=sada.getDate();

          let randomPart:string= new Array(10)
          .fill(0)
          .map(e=> (Math.random()*9).toFixed(0).toString())
          .join('');

          let fileName=datePart+'-'+randomPart+'-'+normalized;

          fileName=fileName.toLocaleLowerCase();


          callback(null, fileName);
        }
      }),
      fileFilter:(req, file, callback) => {
        if (!file.originalname.toLocaleLowerCase().match(/\.(jpg|png)$/)) {
              req.fileFilterError='Bad file extension!';
              callback(null, false);
              return;
        }

        if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
              req.fileFilterError='Bad file content type!';
              callback(null, false);
              return;
        }

        callback(null, true);
      },
      limits:{
        files:1,
        fileSize:storageConfig.photo.maxSize,
      }
    })
  )
  async uploadPhoto(@Param('id') articleId: number, 
  @UploadedFile() photo,
  @Req() req  
  ): Promise<ApiResponse| Photo>{
    if (req.fileFilterError) {
      return new ApiResponse("error", -4002, req.fileFilterError); 
    }

    if (!photo) {
      return new ApiResponse("error", -4002, "File not uploaded!"); 
    }
    // Čitanje prvih 100 bajtova iz datoteke
    const fileBuffer = fs.readFileSync(photo.path).slice(0, 100);
    const type = filetype(fileBuffer)[0]?.typename;

    // Provera da li je tip datoteke JPG ili PNG
    if (!type || (type !== 'jpg' && type !== 'png')) {
      fs.unlinkSync(photo.path);
      return new ApiResponse(
        'error',
        -4002,
        `Bad file content type! Only JPG or PNG allowed. Detected type: ${type || 'unknown'}`,
      );
    }

    await this.createResizedImage(photo,storageConfig.photo.resize.thumb);
    await this.createResizedImage(photo,storageConfig.photo.resize.small);

    const newPhoto:Photo=new Photo();
    newPhoto.articleId=articleId;
    newPhoto.imagePath=photo.filename;

    const savedPhoto = await this.photoService.add(newPhoto);

    if (!savedPhoto) {
      return new ApiResponse('error',-4001)
    }
    return savedPhoto;
  }

  async createResizedImage(photo, resizeSettings){
    const orginalFilePath=photo.path;
    const fileName=photo.filename;

    const destinationFilePath=storageConfig.photo.destination+resizeSettings.directory+fileName;

    await sharp(orginalFilePath)
          .resize({
              fit:'cover',
              width:resizeSettings.width,
              height:resizeSettings.height,
          })
          .toFile(destinationFilePath);
  }

  // http://localhost:3000/api/article/1/deletePhoto/45/
  @Delete(':articleId/deletePhoto/:photoId')
   public async deletePhoto(
    @Param('articleId') articleId:number,
    @Param('photoId') photoId:number
  ){
    const photo = await this.photoService.findOne({
      where: {
        articleId: articleId,
        photoId: photoId
      }
    });

    if (!photo) return new ApiResponse('error', -4004, 'Photo not found!');
    try {
    fs.unlinkSync(storageConfig.photo.destination + photo.imagePath);
    fs.unlinkSync(storageConfig.photo.destination + storageConfig.photo.resize.thumb.directory+ photo.imagePath);
    fs.unlinkSync(storageConfig.photo.destination + storageConfig.photo.resize.small.directory+ photo.imagePath);
    } catch (e) {}
    const deleteResult= await this.photoService.deleteById(photo.photoId);
    
    if (deleteResult.affected===0) {
      return new ApiResponse('error', -4004, 'Photo not found!');
    }

    return new ApiResponse('ok', 0, 'One photo deleted!');
  }
}