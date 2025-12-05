import { IsString, IsInt, IsOptional, IsUUID, Min } from 'class-validator';

// Manually define the update DTO with optional fields to avoid a dependency on
// @nestjs/mapped-types in environments where it's not available.
export class UpdateProductDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsInt()
	@Min(0)
	priceCents?: number;

	@IsOptional()
	@IsUUID()
	categoryId?: string;

	@IsOptional()
	@IsString()
	barcode?: string;

	@IsOptional()
	@IsString()
	imageUrl?: string;
}

