import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RepoService } from './repo.service';

@Controller('data/:type')
export class RepoController<T extends { id: number }> {
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
  findOne(@Param('type') type: string, @Param('id', ParseIntPipe) id: number) {
    return this.RepositoryService.findOne(type, id);
  }

  @Patch(':id')
  upsert(
    @Param('type') type: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: T,
  ) {
    this.RepositoryService.upsert(type, id, data);
  }

  @Delete(':id')
  delete(@Param('type') type: string, @Param('id', ParseIntPipe) id: number) {
    this.RepositoryService.delete(type, id);
  }
}
