import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import CreateUserDto from '../user/user.dto';

class CreatePostDto {
  @ValidateNested()
  @IsObject()
  @Type(() => CreateUserDto)
  public author!: CreateUserDto;

  @IsString()
  public content!: string;

  @IsString()
  public title!: string;
}

export default CreatePostDto;