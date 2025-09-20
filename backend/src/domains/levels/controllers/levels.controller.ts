import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { LevelsService } from "../services/levels.service";
import { LevelFormCreate, LevelFormUpdate, LevelIndexQuery } from "../form-validations/levels.form-validations"
import { LevelDataDto, LevelIndexPaginatedDto } from "../dtos/level.dto"

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) { }

  @Get('/index')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() query: LevelIndexQuery
  ): Promise<LevelIndexPaginatedDto> {
    return await this.levelsService.index(query);
  };

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async store(
    @Body() body: LevelFormCreate,
  ): Promise<LevelDataDto> {
    return await this.levelsService.saveLevel(body);
  };

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: LevelFormUpdate,
  ): Promise<LevelDataDto> {
    return await this.levelsService.editLevel(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.levelsService.deleteLevel(id);
  }

}