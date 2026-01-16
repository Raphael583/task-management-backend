import { Injectable, BadRequestException } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';
import { AiAction } from './ai.types';
import { TaskState } from '../tasks/task-state.enum';

@Injectable()
export class AiService {
  constructor(private readonly tasksService: TasksService) {}

  async handleCommand(command: string) {
    const action = this.interpretCommand(command);
    return this.executeAction(action);
  }

  private interpretCommand(command: string): AiAction {
    const lower = command.toLowerCase();

    if (lower.includes('show')) {
      if (lower.includes('completed')) {
        return {
          action: 'SHOW_TASKS',
          state: TaskState.COMPLETED,
        };
      }

      if (lower.includes('in progress')) {
        return {
          action: 'SHOW_TASKS',
          state: TaskState.IN_PROGRESS,
        };
      }

      if (lower.includes('not started')) {
        return {
          action: 'SHOW_TASKS',
          state: TaskState.NOT_STARTED,
        };
      }

      return { action: 'SHOW_TASKS' };
    }


    if (lower.startsWith('add')) {
      return {
        action: 'CREATE_TASK',
        title: command.replace(/add( a)? task( to)?/i, '').trim(),
      };
    }


    if (lower.includes('start')) {
      return {
        action: 'UPDATE_TASK_STATE',
        title: command.replace(/start working on/i, '').trim(),
        state: TaskState.IN_PROGRESS,
      };
    }


    if (
      lower.includes('complete') &&
      !lower.includes('completed tasks')
    ) {
      return {
        action: 'UPDATE_TASK_STATE',
        title: command
          .replace(/mark/i, '')
          .replace(/as completed/i, '')
          .trim(),
        state: TaskState.COMPLETED,
      };
    }

    throw new BadRequestException('AI could not understand the command');
  }

  private async executeAction(action: AiAction) {
    switch (action.action) {
      case 'CREATE_TASK': {
        const task = await this.tasksService.create({
          title: action.title,
        });
        return {
          message: `Task "${task.title}" created`,
          data: task,
        };
      }

      case 'UPDATE_TASK_STATE': {
        const tasks = await this.tasksService.findAll();

        const match = tasks.find((t) =>
          t.title.toLowerCase().includes(action.title.toLowerCase()),
        );

        if (!match) {
          throw new BadRequestException('Task not found');
        }

        const updated = await this.tasksService.updateState(
          match.id,
          action.state,
        );

        return {
          message: `Task "${updated.title}" updated to ${updated.state}`,
          data: updated,
        };
      }

      case 'SHOW_TASKS': {
        const tasks = await this.tasksService.findAll(action.state);

        return {
          message: action.state
            ? `Showing ${action.state.toLowerCase()} tasks`
            : 'Showing all tasks',
          data: tasks,
        };
      }

      default:
        throw new BadRequestException('Unsupported AI action');
    }
  }
}
