import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './dto/task.entity';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  getTaskById(id: string): Promise<Task> {
    return this.tasksRepository.getPostById(id);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  deleteTaskById(id: string): Promise<void> {
    return this.tasksRepository.deleteTaskById(id);
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    return this.tasksRepository.updateTaskStatus(id, status);
  }

  getTasks(filterDto: GetTasksFilterDto) {
    return this.tasksRepository.getTasks(filterDto);
  }
}
