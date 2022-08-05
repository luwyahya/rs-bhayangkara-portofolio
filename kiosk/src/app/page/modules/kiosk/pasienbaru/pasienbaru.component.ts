import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
@Component({
  selector: 'app-pasienbaru',
  templateUrl: './pasienbaru.component.html',
  styleUrls: ['./pasienbaru.component.scss']
})
export class PasienbaruComponent implements OnInit {
  url: any
  sub: any;
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.sub = this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.url = params['page'];
      });

  }
  goTo(a){

  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
