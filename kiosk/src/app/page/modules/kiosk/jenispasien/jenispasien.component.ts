import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
@Component({
  selector: 'app-jenispasien',
  templateUrl: './jenispasien.component.html',
  styleUrls: ['./jenispasien.component.scss']
})
export class JenispasienComponent implements OnInit {
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
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  changePage(jenis) {
    this.router.navigate(['touchscreen/antrian/jenispasien/' + jenis], { queryParams: { page: this.url } })
  }
}
