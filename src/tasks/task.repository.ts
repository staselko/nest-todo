import { NotFoundException } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './dto/task.entity';
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getPostById(id: string, user: User): Promise<Task> {
    const found: Task = await this.findOne({ where: { id, user } });

    if (!found) {
      throw new NotFoundException('No such task');
    }

    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    await this.delete(id).then(({ affected }) => {
      if (!affected) {
        throw new NotFoundException('You cant delete non-existent task');
      }
    });
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findOne(id);

    task.status = status;

    await this.save(task);

    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    query.where({ user });

    if (status) {
      query.andWhere('task.status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) or LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }
}
