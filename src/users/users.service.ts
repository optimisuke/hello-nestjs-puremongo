import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Collection, Db, ObjectId } from 'mongodb';

@Injectable()
export class UsersService {
  collectionUser: Collection<User>;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {
    this.collectionUser = db.collection<User>('users');
  }

  async find(): Promise<User[]> {
    return await this.collectionUser.find().toArray();
  }

  async findOne(id: string): Promise<User> {
    const response = await this.collectionUser.findOne({
      _id: new ObjectId(id),
    });

    if (!response) {
      throw new NotFoundException();
    }

    return response;
  }

  async create(body: CreateUserDto): Promise<void> {
    await this.collectionUser.insertOne(body);
  }

  async update(id: string, body: UpdateUserDto): Promise<User> {
    const response = await this.collectionUser.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          ...body,
        },
      },
      {
        returnDocument: 'after',
      },
    );
    if (!response.ok) {
      throw new NotFoundException();
    }

    return response.value;
  }

  async delete(id: string): Promise<void> {
    const response = await this.collectionUser.deleteOne({
      _id: new ObjectId(id),
    });

    if (response.deletedCount === 0) {
      throw new NotFoundException();
    }
  }
}
