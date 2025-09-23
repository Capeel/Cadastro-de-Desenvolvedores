import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { DevelopersService } from "../services/developers.service";
import { DesenvolvedoresFormCreate, DesenvolvedoresFormUpdate, DesenvolvedoresIndexQuery } from "../form-validations/developers.form-validation";
import { DesenvolvedoresDataDto, DesenvolvedoresIndexPaginatedDto } from "../dtos/developers.dto";

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) { }

  @Get('/index')
  @HttpCode(HttpStatus.OK)
  async getAllByQuey(
    @Query() data: DesenvolvedoresIndexQuery,
  ): Promise<DesenvolvedoresIndexPaginatedDto> {
    return this.developersService.getAllByQuery(data);
  }

  @Get('/get-all')
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.developersService.getAll();
  }

  @Get('/levels-per-dev')
  @HttpCode(HttpStatus.OK)
  async getAllDevAndLevels() {
    return this.developersService.getLevelsPerDev();
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async store(
    @Body() data: DesenvolvedoresFormCreate,
  ): Promise<DesenvolvedoresDataDto> {
    return this.developersService.saveDevelopers(data);
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DesenvolvedoresFormUpdate,
  ): Promise<DesenvolvedoresDataDto> {
    return this.developersService.editDevelopers(id, data);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.developersService.deleteDeveloper(id);
  }


}