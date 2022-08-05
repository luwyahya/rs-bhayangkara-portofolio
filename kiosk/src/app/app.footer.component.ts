import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="footer clearfix">
        <span>Copyright Transmedic 2019 . @TRANSMEDIC </span>
        <div class="footer-links">
            <a href="https://jasamedika.co.id/" class="first">Profile</a>
            <span class="link-divider">|</span>
            <a href="#">About</a>
            <span class="link-divider" >|</span>
         <!--   <a href="#">Privacy</a>
            <span class="link-divider">|</span>-->
            <a href="#"   pTooltip="(022) 7104596">Contact</a>
            <span class="link-divider">|</span>
            <a href="https://goo.gl/maps/KsPFKVALJqG2">Map</a>
        </div>
    </div>

    <!-- <div class="footerright clearfix">

    <div class="footer-links">
        <a href="#" [routerLink]="['/touchscreen/informasi']" class="first">
        <i class="fa fa-fw fa-info-circle"></i> Informasi</a>
        <span class="link-divider">|</span>
        <a href="#" [routerLink]="['/touchscreen/denah']">
        <i class="fa fa-fw fa-map-marker"></i> Denah</a>

    
    </div>
</div>-->
    `
})
export class AppFooterComponent {

}
