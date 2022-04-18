import prompts, { PromptType } from 'prompts'
import { GameStatus } from '../scenarios/GameStatus';

export interface PromptConfig {
  type: PromptType
  value: string,
  message: string
}

export function getDieRoll() {
  return Math.floor(Math.random() * 10)
}

export function random(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); 
}

export async function promptUser(config: PromptConfig): Promise<any> {
  const response = await prompts({
    type: config.type,
    name: config.value,
    message: config.message,
    validate: (value) =>
      (value < 1 || value > 2) ? `Must enter a value between 1 and 2` : true,
  })

  return response.value
}
