import { Component } from '@angular/core';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Australian Social Media Analytics';
  router: Router;

  constructor(_router: Router){   
    this.router = _router;
}

  onTabChange($event: NgbTabChangeEvent) {
    console.log($event.nextId);
    if ($event.nextId === 'maps') {
      this.router.navigateByUrl('maps');
    } else if ($event.nextId === 'charts') {
      this.router.navigateByUrl('charts');
    }
  }
}
