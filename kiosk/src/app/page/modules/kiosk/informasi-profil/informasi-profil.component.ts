import { Component, OnInit, Inject, forwardRef, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from './../../../../app.component';
import $ from "jquery";

import { TreeNode, Message } from 'primeng/primeng';
@Component({
  selector: 'app-informasi-profil',
  templateUrl: './informasi-profil.component.html',
  styleUrls: ['./informasi-profil.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class InformasiProfilComponent implements OnInit {
  displayDialog: boolean
  title: any
  isVisi: boolean
  isSejarah: boolean
  isDireksi: boolean
  isSlogan: boolean
  displayDialog2: boolean
  isPrestasi: boolean
  isMaps: boolean
  strukTurOrg: TreeNode[];
  selectedNode: TreeNode;
  constructor(@Inject(forwardRef(() => AppComponent))
  public app: AppComponent,
    private router: Router,
    private route: ActivatedRoute) {

  }


  ngOnInit() {

    this.strukTurOrg = [{
      label: 'Direktur',
      type: 'person',
      styleClass: 'ui-person',
      expanded: true,
      data: { name: 'dr.H.L.Herman Mahaputra, M.Kes, M.H' },
      children: [
        {
          label: 'Wakil Direktur Umum dan Keuangan',
          type: 'person',
          styleClass: 'ui-person',
          expanded: true,
          data: { name: 'H.Zuhhad, Ns,M.Kes' },
          children: [
            {
              label: 'Kabag Umum',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              data: { name: 'Baiq Ida Dini Hartini, S.Sos, MM' },
              children: [
                {
                  label: 'Kasubbag Tata Usaha, Rumah Tangga dan Perlengkapan ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'Bq. Eni Prawiti, S.Sos' },

                },
                {
                  label: 'Plt. Kasubbag Kepegawaian dan Pengembangan SDM ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'Susiana Hastuti, SKM' },

                },

              ]
            },
            {
              label: 'Kabag Keuangan',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              data: { name: 'Khairul Hamdy, SE, M.Ak' },
              children: [
                {
                  label: 'Kasubbag Anggaran ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'L. Mohammad Hadaytha. SE' },

                },
                {
                  label: 'Kasubbag Perbendaharaan, Akuntansi dan Verifikasi  ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'Ida Wayan Demung, SE, ME' },

                },

              ]

            },
            {
              label: 'Kabag Program, Humas dan Rekam Medik',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              data: { name: 'H. Sumarjan, SST, S.Sos' },
              children: [
                {
                  label: 'Kasubbag Program ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'L. Ery Setiawan, SE' },

                },
                {
                  label: 'Kasubbag Kehumasan ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'L. Hardimun, S.IP' },

                },
                {
                  label: 'Kasubbag SIMRS dan Rekam Medik  ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'Fatwadi, S.Si.,M.Ak' },

                },

              ]
            },
          ]
        },
        {
          label: 'Wakil Direktur Pelayanan',
          type: 'person',
          styleClass: 'ui-person',
          expanded: true,
          data: { name: 'drg. Devy Eka Hartini' },
          children: [

            {
              label: 'Kabid Pelayanan Medik ',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              data: { name: 'dr. Emirald Isfihan' },
              children: [

                {
                  label: 'Kasi Pelayanan Medik',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'dr. Ita Patriani, MARS' },
                },
                {
                  label: 'Kasi Pengembangan Mutu Pelayanan Medik ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'drg. Andre Sebastian' },

                },
              ]
            },
            {
              label: 'Kabid Pelayanan Keperawatan',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              data: { name: 'Supardi, S.Sos, MPH' },
              children: [
                {
                  label: 'Kasi Pelayanan Keperawatan ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'H. Sulaeman, SKM' },
                },
                {
                  label: 'Kasi Pengembangan Mutu Pelayanan Keperawatan  ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'Afrina Susiarty, S.ST' },
                },
              ]

            },
            {
              label: 'Kabid Pelayanan Penunjang Medik dan Non Medik ',
              type: 'person',
              styleClass: 'ui-person',
              expanded: true,
              data: { name: 'H.L. Muhammad Amin, S.Sos' },
              children: [
                {
                  label: 'Kasi Pengembangan Mutu Penunjang Medik dan Non Medik ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'Fafir Rahmah S.Si, Apt.' },
                },
                {
                  label: 'Kasi Pelayanan Penunjang Medik dan Non Medik  ',
                  type: 'person',
                  styleClass: 'ui-person',
                  expanded: true,
                  data: { name: 'Astuti Indrawati, S.Kep, NS.' },
                }
              ]
            },
          ]
        },

      ]
    }];
  }
  showPopUp(data) {
    this.title = data
    if (data == 'Visi & Misi') {
      this.isVisi = true
      this.isSejarah = false
      this.isDireksi = false
      this.isSlogan = false
      this.isPrestasi = false
      this.isMaps = false
    }
    if (data == 'Sejarah') {
      this.isVisi = false
      this.isSejarah = true
      this.isDireksi = false
      this.isSlogan = false
      this.isPrestasi = false
      this.isMaps = false
    }
    if (data == 'Struktur Organisasi') {
      this.isVisi = false
      this.isSejarah = false
      this.isDireksi = true
      this.isSlogan = false
      this.isPrestasi = false
      this.isMaps = false

    }
    if (data == 'Slogan') {
      this.isVisi = false
      this.isSejarah = false
      this.isDireksi = false
      this.isSlogan = true
      this.isPrestasi = false
      this.isMaps = false
    }
    if (data == 'Prestasi') {
      this.isVisi = false
      this.isSejarah = false
      this.isDireksi = false
      this.isSlogan = false
      this.isPrestasi = true
      this.isMaps = false
    }
    if (data == 'Alamat / Kontak / Map') {
      this.isVisi = false
      this.isSejarah = false
      this.isDireksi = false
      this.isSlogan = false
      this.isPrestasi = false
      this.isMaps = true
    }
    this.displayDialog = true
  }
  showPopUp2(data) {
    this.title = data

    this.displayDialog2 = true
  }
  onNodeSelect(event){
    
  }
}
