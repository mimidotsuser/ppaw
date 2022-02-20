import { Component, OnInit } from '@angular/core';
import { RoleService } from '../services/role.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  constructor(private roleService: RoleService) { }

  ngOnInit(): void {
  }

  get roles() {
    return this.roleService.roles;
  }

}
