import {Component, Input, OnInit} from '@angular/core';
import {Kindergarden} from "../shared/interfaces/Kindergarden";

@Component({
  selector: 'app-default-list-element',
  templateUrl: './default-list-element.component.html',
  styleUrls: ['./default-list-element.component.scss']
})
export class DefaultListElementComponent implements OnInit{
  @Input() kindergarten!: Kindergarden;

  ngOnInit(): void {

  }
}
