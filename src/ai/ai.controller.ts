import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('command')
  async handleCommand(@Body('command') command: string) {
    if (!command || typeof command !== 'string') {
      throw new BadRequestException('Command is required');
    }

    return this.aiService.handleCommand(command);
  }
}
