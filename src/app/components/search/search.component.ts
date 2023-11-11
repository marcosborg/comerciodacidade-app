import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { SecurityService } from 'src/app/services/security.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true
})
export class SearchComponent implements OnInit {

  constructor(
    private loadingController: LoadingController,
    private securityService: SecurityService,
    private router: Router
  ) { }

  access_token: string = '';
  search: string = '';
  results: any = [];

  ngOnInit() {

  }

  searchBar() {
    if (this.search.length > 3) {
      let data = {
        search: this.search,
      }
      this.securityService.search(data).subscribe((resp) => {
        this.results = resp;
      });
    }
  }

  cancel() {
    this.results = [];
  }

  goAction(type: string, id: any) {
    this.search = '';
    this.results = [];
    switch (type) {
      case 'company':
        this.router.navigateByUrl('/company/' + id);
        break;
      case 'product':
        this.router.navigateByUrl('/product/' + id);
        break;
      case 'service':
        this.router.navigateByUrl('/service/' + id);
        break;
      case 'category':
        this.router.navigateByUrl('/companies/' + id);
        break;
      default:
        break;
    }
  }

}
