import { Component, OnInit, Inject, forwardRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
@Component({
  selector: 'app-denah',
  templateUrl: './denah.component.html',
  styleUrls: ['./denah.component.scss']
})
export class DenahComponent implements OnInit {

 imageIndexOne = 0;
  imageIndexTwo = 0;
  images =[
  'assets/img/denah/denah_rs.jpg'
  ]
  config: ImageViewerConfig = {
    btnClass: 'default', // The CSS class(es) that will apply to the buttons
    zoomFactor: 0.1, // The amount that the scale will be increased by
    containerBackgroundColor: '#ccc', // The color to use for the background. This can provided in hex, or rgb(a).
    wheelZoom: true, // If true, the mouse wheel can be used to zoom in
    allowFullscreen: true, // If true, the fullscreen button will be shown, allowing the user to entr fullscreen mode
    allowKeyboardNavigation: true, // If true, the left / right arrow keys can be used for navigation
    btnIcons: { // The icon classes that will apply to the buttons. By default, font-awesome is used.
      zoomIn: 'fa fa-plus',
      zoomOut: 'fa fa-minus',
      rotateClockwise: 'fa fa-repeat',
      rotateCounterClockwise: 'fa fa-undo',
      next: 'fa fa-arrow-right',
      prev: 'fa fa-arrow-left',
      fullscreen: 'fa fa-arrows-alt',
    },
    btnShow: {
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: true,
      rotateCounterClockwise: true,
      next: false,
      prev: false
    }
  }; // {customBtns: [{name: 'print', icon: 'fa fa-print'}, {name: 'link', icon: 'fa fa-link'}]};

  handleEvent(event: CustomEvent) {
    console.log(`${event.name} has been click on img ${event.imageIndex + 1}`);

    switch (event.name) {
      case 'print':
        console.log('run print logic');
        break;
    }
  }
  constructor(@Inject(forwardRef(() => AppComponent))
    public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
  }
  changePage(e,b){

  }
  

}

export interface ImageViewerConfig {
  btnClass?: string;
  zoomFactor?: number;
  containerBackgroundColor?: string;
  wheelZoom?: boolean;
  allowFullscreen?: boolean;
  allowKeyboardNavigation?: boolean;

  btnShow?: {
    zoomIn?: boolean;
    zoomOut?: boolean;
    rotateClockwise?: boolean;
    rotateCounterClockwise?: boolean;
    next?: boolean;
    prev?: boolean;
  };

  btnIcons?: {
    zoomIn?: string;
    zoomOut?: string;
    rotateClockwise?: string;
    rotateCounterClockwise?: string;
    next?: string;
    prev?: string;
    fullscreen?: string;
  };

  customBtns?: Array<
    {
      name: string;
      icon: string;
    }
  >;
}

export class CustomEvent {
  name: string;
  imageIndex: number;

  constructor(name, imageIndex) {
    this.name = name;
    this.imageIndex = imageIndex;
  }
}