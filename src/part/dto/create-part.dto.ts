import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsPositive, MaxLength } from "class-validator";

export class CreatePartDto{
    @ApiProperty()
    @IsNotEmpty({ message: 'Name can not be empty' })
    @MaxLength(50, {
        message:
        'Name is too long. Maximum length is $constraint1 characters.',
    })
    name: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'Description cannot be blank.' })
    @MaxLength(200, {
        message:
        'Description is too long. Maximum length is $constraint1 characters.',
    })
    description: string;

    @ApiProperty({ required: false, nullable: true })
    @IsOptional()
    @MaxLength(30, {
        message:
        'Part Number is too long. Maximum length is $constraint1 characters.',
    })
    partNumber?: string | null;
    
    @ApiProperty()
    @IsOptional()
    @IsInt()
    @IsPositive()
    modelId: number;

    @ApiProperty({ type: [Number], required: false })
    @IsInt({ each: true })
    @IsPositive({ each: true })
    @IsOptional()
    partTypeIds: number[];
}