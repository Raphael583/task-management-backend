import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { TaskState } from './task-state.enum';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async create(dto: CreateTaskDto) {
    return this.taskModel.create(dto);
  }

  async findAll(state?: TaskState) {
    if(state){
      return this.taskModel.find({state}).exec();
    }
    return this.taskModel.find().exec();
  }

  async updateState(taskId: string, newState: TaskState) {
    const task = await this.taskModel.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (!this.isValidTransition(task.state, newState)) {
      throw new BadRequestException(
        `Invalid state transition from ${task.state} to ${newState}`,
      );
    }

    task.state = newState;
    return task.save();
  }

  async delete(taskId: string) {
    const result = await this.taskModel.findByIdAndDelete(taskId);
    if (!result) {
      throw new NotFoundException('Task not found');
    }
    return { message: 'Task deleted successfully' };
  }
  private isValidTransition(
    current: TaskState,
    next: TaskState,
  ): boolean {
    if (
      current === TaskState.NOT_STARTED &&
      next === TaskState.IN_PROGRESS
    ) {
      return true;
    }

    if (
      current === TaskState.IN_PROGRESS &&
      next === TaskState.COMPLETED
    ) {
      return true;
    }

    return false;
  }
}
