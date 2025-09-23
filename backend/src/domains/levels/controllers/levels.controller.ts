import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { LevelsService } from "../services/levels.service";
import { NiveisFormCreate, NiveisFormUpdate, NiveisIndexQuery } from "../form-validations/levels.form-validations"
import { NiveisDataDto, NiveisIndexPaginatedDto } from "../dtos/level.dto"

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) { }

  @Get('/index')
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() query: NiveisIndexQuery
  ): Promise<NiveisIndexPaginatedDto> {
    return await this.levelsService.index(query);
  };

  @Get('/get-all')
  @HttpCode(HttpStatus.OK)
  async getAllLevels() {
    return await this.levelsService.getAllLevels();
  };

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async store(
    @Body() body: NiveisFormCreate,
  ): Promise<NiveisDataDto> {
    return await this.levelsService.saveLevel(body);
  };

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: NiveisFormUpdate,
  ): Promise<NiveisDataDto> {
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