import { Controller, Post, Get, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStateDto } from './dto/update-task-state.dto';
import { TaskState } from './task-state.enum';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  findAll(@Query('state') state?: TaskState) {
    return this.tasksService.findAll(state);
  }

  @Patch(':id/state')
  updateState(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStateDto,
  ) {
    return this.tasksService.updateState(id, dto.state);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
