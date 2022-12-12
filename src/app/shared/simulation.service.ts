import { Injectable } from '@angular/core';
import { BasicGameService } from './basic-game.service';
import { BaseAIService } from './ai/base-ai.service';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  ai1: BaseAIService;
  ai2: BaseAIService;
  constructor() { }

  public simulate(depth, game: BasicGameService){

  }
}
