import { IsEnum } from 'class-validator';
import { TaskState } from '../task-state.enum';

export class UpdateTaskStateDto {
  @IsEnum(TaskState)
  state: TaskState;
}
