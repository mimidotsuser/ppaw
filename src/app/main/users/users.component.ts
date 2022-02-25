import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../shared/services/search.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [SearchService]
})
export class UsersComponent implements OnInit {

  ngOnInit(): void {
  }

}
