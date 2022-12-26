import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Db } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async find(): Promise<User[]> {
    return await this.db.collection<User>('users').find().toArray();
  }

  async findOne(id: string): Promise<User> {
    const response = await this.db
      .collection<User>('users')
      .findOne({ _id: id });

    if (!response) {
      throw new NotFoundException();
    }

    return response;
  }

  async create(body: CreateUserDto): Promise<void> {
    await this.db.collection('users').insertOne(body);
  }

  async update(id: string, body: UpdateUserDto): Promise<void> {
    await this.db.collection('users').updateOne(
      {
        _id: id,
      },
      {
        $set: {
          ...body,
        },
      },
    );
  }

  async delete(id: string): Promise<void> {
    const response = await this.db.collection('users').deleteOne({
      _id: id,
    });

    if (response.deletedCount === 0) {
      throw new NotFoundException();
    }
  }
}
