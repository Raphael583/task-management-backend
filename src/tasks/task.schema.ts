import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TaskState } from './task-state.enum';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({
    type: String,
    enum: TaskState,
    default: TaskState.NOT_STARTED,
  })
  state: TaskState;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
