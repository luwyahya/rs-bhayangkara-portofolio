import { Component, OnInit, Inject, forwardRef, Directive, ElementRef, Input, OnDestroy, Renderer, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { CacheService } from '../../../../helper';

@Component({
  selector: 'app-touchscreen',
  templateUrl: './touchscreen.component.html',
  styleUrls: ['./touchscreen.component.scss']
})


export class TouchscreenComponent implements OnInit {
  focus: boolean = true;

  model: any

  @ViewChild("name") nameField: ElementRef;
  // editName(): void {
  //   this.nameField.nativeElement.focus();
  // }\
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private el: ElementRef,
    private fb: FormBuilder,
    private cache: CacheService) {

  }

  ngOnInit() {

    this.nameField.nativeElement.focus();
   }

  print(jenis){
    
  }
  goTo(name) {
    this.router.navigate(['touchscreen/' + name]);
  }
  onChangeNoreservasi(value: string) {
    if (value.length > 6) {
      this.cache.set('cacheAutoNoReservasi', value)
      this.router.navigate(['touchscreen/checkin']);
    }
  }
 
}
