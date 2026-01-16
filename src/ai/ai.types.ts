import { TaskState } from '../tasks/task-state.enum';

export type CreateTaskAction = {
  action: 'CREATE_TASK';
  title: string;
};

export type UpdateTaskStateAction = {
  action: 'UPDATE_TASK_STATE';
  title: string;
  state: TaskState;
};

export type ShowTasksAction = {
  action: 'SHOW_TASKS';
  state?: TaskState;
};

export type AiAction =
  | CreateTaskAction
  | UpdateTaskStateAction
  | ShowTasksAction;
