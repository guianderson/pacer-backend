import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Team } from './../team/entities/team.entity';
import { User } from './../user/entities/user.entity';
import { UserTeam } from './entities/user-team.entity';
import { CreateUserTeamDto } from './dto/create-user-team.dto';
import { UpdateUserTeamDto } from './dto/update-user-team.dto';

@Injectable()
export class UserTeamService {

  constructor( 
    @InjectRepository(UserTeam) 
    private repository: Repository<UserTeam>,
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    @InjectRepository(Team) 
    private teamRepository: Repository<Team>,
  ) {}

  async create(createUserTeamDto: CreateUserTeamDto): Promise<UserTeam> {
    const user = await this.userRepository.findOne(createUserTeamDto.idUser);

    if(!user || user === null) {
      throw new NotFoundException(`Could not find User with id '${createUserTeamDto.idUser}'.`)
    }

    const team = await this.teamRepository.findOne(createUserTeamDto.idTeam);

    if(!team || team === null) {
      throw new NotFoundException(`Could not find Team with id '${createUserTeamDto.idTeam}'.`)
    }

    const created = this.repository.create(
      createUserTeamDto
    ); 
    const saved = this.repository.save(created);
    return saved;
  }

  async findAll(): Promise<UserTeam[]> {
    return await this.repository.find();
  }

  async findOne(userId: string, teamId: string): Promise<UserTeam> {
    const found = await this.repository.findOne({
      idUser: userId,
      idTeam: teamId
    });

    if(!found || found === null) {
      throw new NotFoundException(`Could not find UserTeam with with user '${userId}' and Team '${teamId}'.`)
    }

    return found;
  }

  async update(userId: string, teamId: string, updateUserTeamDto: UpdateUserTeamDto): Promise<UserTeam> {
    const found = await this.repository.findOne({
      idUser: userId,
      idTeam: teamId
    });

    if(!found || found === null) {
      throw new NotFoundException(`Could not find UserTeam with with user '${userId}' and Team '${teamId}'.`)
    }

    const merge = this.repository.merge(found, updateUserTeamDto);
    return await this.repository.save(merge);
  }

  async remove(userId: string, teamId: string): Promise<string> {
    const found = await this.repository.findOne({
      idUser: userId,
      idTeam: teamId
    });

    if(!found || found === null) {
      throw new NotFoundException(`Could not find UserTeam with user '${userId}' and Team '${teamId}'.`)
    }

    this.repository.delete({
      idUser: userId,
      idTeam: teamId
    });

    return `UserTeam with with user '${userId}' and Team '${teamId}' deleted successfully!`;
  }
}
