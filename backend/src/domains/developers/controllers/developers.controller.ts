import { Body, Controller, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post } from "@nestjs/common";
import { DevelopersService } from "../services/developers.service";
import { DevelopersFormCreate, DevelopersFormUpdate } from "../form-validations/developers.form-validation";
import { DevelopersDataDto } from "../dtos/developers.dto";

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) { }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async store(
    @Body() data: DevelopersFormCreate,
  ): Promise<DevelopersDataDto> {
    return this.developersService.saveDevelopers(data);
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DevelopersFormUpdate,
  ): Promise<DevelopersDataDto> {
    return this.developersService.editDevelopers(id, data);
  }


}