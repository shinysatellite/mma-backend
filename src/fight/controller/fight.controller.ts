import { Controller, Get, Post, Body, Put, Param, Delete, NotFoundException } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { FightService } from '../service/fight.service';
import { Fight } from '../entities/fight.entity';

@Controller('fight')
export class FightController {
    constructor(private readonly fightService: FightService) {}

    //get all fights
    @Get()
    async findAll(): Promise<Fight[]> {
      return this.fightService.findAll();
    }

    //get fight by id
    @Get(':id')
    async findOne(@Param('id') id:number): Promise<Fight> {
        const fight = await this.fightService.findOne(id);
        if (!fight) {
            throw new NotFoundException('Fight does not exist!');
        } else {
            return fight;
        }
    }

    //create fight
    @Post() 
    async create(@Body() fight: Fight): Promise<Fight> {
        const newFight = await this.fightService.create(fight);
        await this.fightService.processFightResult(newFight);
        return this.fightService.create(newFight);
    }

    //update fight
    @Put('id')
    async update(@Param('id') id: number, @Body() fight: Fight): Promise<any> {
        return this.fightService.update(id, fight);
    }

    //delete fight
    @Delete('id')
    async delete(@Param('id') id: number): Promise<any> {
        //handle error if event doesn't exist
        const fight = await this.fightService.findOne(id);
        if (!fight) {
            throw new NotFoundException('Fight does not exist!');
        }
        return this.fightService.delete(id);
    }

    
    @Get(':fighterId/fight-satistics')
    async getFightStatisticsForFighter(@Param('fighterId') fighterId: number) {
        const fightStatistics = await this.fightService.getFighterStatitics(fighterId);

        if(!fightStatistics) {
            throw new NotFoundException(`Fight statistics for fighter with id ${fighterId} not found`);
        }

        return fightStatistics;
    }
}
