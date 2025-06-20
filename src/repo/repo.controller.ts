import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { RepoService } from './repo.service';

@Controller('data/:type')
export class RepoController<T> {
  constructor(private readonly RepositoryService: RepoService<T>) {}

  @Post()
  create(@Param('type') type: string, @Body() data: T) {
    return this.RepositoryService.create(type, data);
  }

  @Get()
  findAll(@Param('type') type: string) {
    return this.RepositoryService.findAll(type);
  }

  @Get(':id')
  findOne(@Param('type') type: string, @Param('id') id: string) {
    return this.RepositoryService.findOne(type, +id);
  }

  @Delete(':id')
  delete(@Param('type') type: string, @Param('id') id: string) {
    return this.RepositoryService.delete(type, +id);
  }

  @Patch(':id')
  upsert(
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() data: T,
  ) {
    return this.RepositoryService.upsert(type, +id, data);
  }
}
