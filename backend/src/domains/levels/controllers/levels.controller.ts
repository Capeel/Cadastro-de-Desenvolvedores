import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { LevelsService } from "../services/levels.service";
import { NiveisFormCreate, NiveisFormUpdate, NiveisIndexQuery } from "../form-validations/levels.form-validations"
import { NiveisDataDto, NiveisIndexPaginatedDto, NivelCreateDto, NivelUpdateDto } from "../dtos/level.dto"
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('levels')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) { }

  @Get('/index')
  @ApiOperation({ summary: 'Listar todos os Níveis e filtrar' })
  @ApiResponse({
    status: 200,
    description: 'Lista de níveis retornada com filtro e paginação',
    type: NiveisIndexPaginatedDto,
  })
  @HttpCode(HttpStatus.OK)
  async getAll(
    @Query() query: NiveisIndexQuery
  ): Promise<NiveisIndexPaginatedDto> {
    return await this.levelsService.index(query);
  };

  @Get('/get-all')
  @ApiOperation({ summary: 'Listar todos os Níveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de níveis',
    type: [NiveisDataDto],
  })
  @HttpCode(HttpStatus.OK)
  async getAllLevels() {
    return await this.levelsService.getAllLevels();
  };

  @Post('/create')
  @ApiOperation({ summary: 'Criar um Nível' })
  @ApiResponse({
    status: 201,
    description: 'Criar um Nível',
    type: NivelCreateDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async store(
    @Body() body: NiveisFormCreate,
  ): Promise<NiveisDataDto> {
    return await this.levelsService.saveLevel(body);
  };

  @Patch('/update/:id')
  @ApiOperation({ summary: 'Atualizar um Nível' })
  @ApiResponse({
    status: 200,
    description: 'Atualizar um Nível',
    type: NivelUpdateDto,
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: NiveisFormUpdate,
  ): Promise<NiveisDataDto> {
    return await this.levelsService.editLevel(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar um Nível' })
  @ApiResponse({
    status: 200,
    description: 'Deletar um Nível caso não esteja vinculado há um Desenvolvedor',
    example: 1,
  })
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.levelsService.deleteLevel(id);
  }

}