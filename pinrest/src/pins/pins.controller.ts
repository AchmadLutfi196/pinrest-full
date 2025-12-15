import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PinsService } from './pins.service';
import { CreatePinDto, UpdatePinDto, SavePinDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Pins')
@Controller('pins')
export class PinsController {
  constructor(private pinsService: PinsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new pin' })
  @ApiResponse({ status: 201, description: 'Pin created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @CurrentUser() user: { id: number },
    @Body() createPinDto: CreatePinDto,
  ) {
    return this.pinsService.create(user.id, createPinDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pins (paginated)' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 20)' })
  @ApiResponse({ status: 200, description: 'Returns paginated pins' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pinsService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get('search')
  @ApiOperation({ summary: 'Search pins by title or description' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Returns search results' })
  async search(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.pinsService.search(
      query || '',
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pin by ID' })
  @ApiParam({ name: 'id', description: 'Pin ID' })
  @ApiResponse({ status: 200, description: 'Returns pin details' })
  @ApiResponse({ status: 404, description: 'Pin not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pinsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a pin' })
  @ApiParam({ name: 'id', description: 'Pin ID' })
  @ApiResponse({ status: 200, description: 'Pin updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not the pin owner' })
  @ApiResponse({ status: 404, description: 'Pin not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() updatePinDto: UpdatePinDto,
  ) {
    return this.pinsService.update(id, user.id, updatePinDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a pin' })
  @ApiParam({ name: 'id', description: 'Pin ID' })
  @ApiResponse({ status: 200, description: 'Pin deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not the pin owner' })
  @ApiResponse({ status: 404, description: 'Pin not found' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.pinsService.remove(id, user.id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Toggle like on a pin' })
  @ApiParam({ name: 'id', description: 'Pin ID' })
  @ApiResponse({ status: 200, description: 'Like toggled successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Pin not found' })
  async toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
  ) {
    return this.pinsService.toggleLike(id, user.id);
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Save pin to a board' })
  @ApiParam({ name: 'id', description: 'Pin ID' })
  @ApiResponse({ status: 200, description: 'Pin saved to board' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Not your board' })
  @ApiResponse({ status: 404, description: 'Pin not found' })
  async savePin(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: { id: number },
    @Body() savePinDto: SavePinDto,
  ) {
    return this.pinsService.savePin(id, user.id, savePinDto);
  }
}
