import { IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import CreateAddressDto from './address.dto';
import { Type } from 'class-transformer';
import CreatePostDto from '../post/post.dto';

class CreateUserDto {
  @IsString()
  public firstName!: string;

  @IsString()
  public lastName!: string;

  @IsString()
  @IsNotEmpty()
  public email!: string;

  @IsString()
  @IsNotEmpty()
  public password!: string;

  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => CreateAddressDto)
  public address!: CreateAddressDto;

  @ValidateNested()
  @IsOptional()
  @IsObject()
  @Type(() => CreatePostDto)
  public posts!: CreatePostDto;
}

export default CreateUserDto;