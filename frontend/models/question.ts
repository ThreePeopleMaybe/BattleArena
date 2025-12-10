import { QuestionOption } from "./questionOption";

export class Question {
  id: number;
  text: string;
  options: QuestionOption[];

  constructor(id: number = 0, text: string = '', options: QuestionOption[] = []) {
    this.id = id;
    this.text = text;
    this.options = options;
  }
}