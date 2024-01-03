import {Component, OnInit} from '@angular/core';
import {StoreService} from "../shared/store.service";
import {BackendService} from "../shared/backend.service";

@Component({
  selector: 'app-kindergarten-detail',
  templateUrl: './kindergarten-detail.component.html',
  styleUrls: ['./kindergarten-detail.component.scss']
})
export class KindergartenDetailComponent implements OnInit{

  constructor(public storeService: StoreService, private backendService: BackendService) {}

  ngOnInit(): void {
    this.backendService.getKindergardens();
  }

}
