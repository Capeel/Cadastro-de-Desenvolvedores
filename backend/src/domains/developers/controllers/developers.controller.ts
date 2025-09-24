import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { DevelopersService } from "../services/developers.service";
import { DesenvolvedoresFormCreate, DesenvolvedoresFormUpdate, DesenvolvedoresIndexQuery } from "../form-validations/developers.form-validation";
import { DesenvolvedoresCreateDto, DesenvolvedoresDataDto, DesenvolvedoresIndexPaginatedDto, DesenvolvedoresUpdateDto, TotalDesenvolvedoresPorNivelDto } from "../dtos/developers.dto";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) { }

  @Get('/index')
  @ApiOperation({ summary: 'Listar todos os desenvolvedores e filtrar' })
  @ApiResponse({
    status: 200,
    description: 'Lista de desenvolvedores retornada com filtro e paginação',
    type: DesenvolvedoresIndexPaginatedDto,
  })
  @HttpCode(HttpStatus.OK)
  async getAllByQuey(
    @Query() data: DesenvolvedoresIndexQuery,
  ): Promise<DesenvolvedoresIndexPaginatedDto> {
    return this.developersService.getAllByQuery(data);
  }

  @Get('/get-all')
  @ApiOperation({ summary: 'Listar todos os desenvolvedores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de desenvolvedores',
    type: [DesenvolvedoresDataDto],
  })
  @HttpCode(HttpStatus.OK)
  async getAll() {
    return this.developersService.getAll();
  }

  @Get('/levels-per-dev')
  @ApiOperation({ summary: 'Trás a quantidade de desenvolvedores de acordo com o nível cadastrado' })
  @ApiResponse({
    status: 200,
    description: 'Se tenho 3 Devs Junior na lista de Nível o Junior vai mostrar 3',
    type: [TotalDesenvolvedoresPorNivelDto],
  })
  @HttpCode(HttpStatus.OK)
  async getAllDevAndLevels() {
    return this.developersService.getLevelsPerDev();
  }

  @Post('/create')
  @ApiOperation({ summary: 'Cria um Desenvolvedor' })
  @ApiResponse({
    status: 201,
    description: 'Cadastrar um novo Desenvolvedor',
    type: DesenvolvedoresCreateDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async store(
    @Body() data: DesenvolvedoresFormCreate,
  ): Promise<DesenvolvedoresDataDto> {
    return this.developersService.saveDevelopers(data);
  }

  @Patch('/update/:id')
  @ApiOperation({ summary: 'Atualiza alguma informação do Desenvolvedor' })
  @ApiResponse({
    status: 200,
    description: 'Atualiza qualquer informação do Desenvolvedor',
    type: DesenvolvedoresUpdateDto,
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DesenvolvedoresFormUpdate,
  ): Promise<DesenvolvedoresDataDto> {
    return this.developersService.editDevelopers(id, data);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deleta um Desenvolvedor' })
  @ApiResponse({
    status: 200,
    description: 'Deleta um Desenvolvedor',
    example: 1,
  })
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.developersService.deleteDeveloper(id);
  }


}