export const adminLteConf = {
  skin: 'blue',
  isSidebarLeftCollapsed: true,
  // isSidebarLeftExpandOnOver: false,
  // isSidebarLeftMouseOver: false,
  isSidebarLeftMini: false,
  // sidebarRightSkin: 'dark',
  // isSidebarRightCollapsed: true,
  // isSidebarRightOverContent: true,
  // layout: 'normal',
  sidebarLeftMenu: [
    { label: 'MAIN NAVIGATION', separator: true },
    { label: 'Dashboard', route: '/home', iconClasses: 'fa fa-dashboard', pullRights: [{ text: 'New', classes: 'label pull-right bg-red' }] },
    { label: 'Dashboard Pendapatan', route: '/dashboard-pendapatan', iconClasses: 'fa fa-money', pullRights: [{ text: '1', classes: 'label pull-right bg-yellow' }] },
    { label: 'Dashboard SDM', route: '/dashboard-sdm', iconClasses: 'fa fa-users', pullRights: [{ text: '1', classes: 'label pull-right bg-green' }] },
    { label: 'Dashboard Persediaan', route: '/dashboard-persediaan', iconClasses: 'fa fa-cubes', pullRights: [{ text: '1', classes: 'label pull-right bg-blue' }] },
    { label: 'Back Office', route: '/dashboard-pmkp', iconClasses: 'fa fa-star', pullRights: [{ text: '1', classes: 'label pull-right bg-red' }] },
    // { label: 'Dashboard PPI', route: '/dashboard-ppi', iconClasses: 'fa fa-gg', pullRights: [{ text: '1', classes: 'label pull-right bg-yellow' }] },
    // {
    //   label: 'Kunjungan Pasien', iconClasses: 'fa fa-files-o', pullRights: [{ text: '6', classes: 'label pull-right bg-red' }],
    //   children: [
    //     { label: 'Rawat Jalan', route: 'home/kunjungan/rawatjalan' },
    //     { label: 'Rawat Inap', route: 'home/kunjungan/rawatinap' },
    //     { label: 'IGD', route: 'home/kunjungan/rawatjalan' },
    //     { label: 'Laboratorium', route: 'home/kunjungan/rawatinap' },
    //     { label: 'Radiologi', route: 'home/kunjungan/rawatinap' },
    //     { label: 'Operasi', route: 'home/kunjungan/rawatinap' }

    //   ]
    // },
    // {
    //   label: 'Remunerasi', iconClasses: 'fa fa-money', pullRights: [{ text: '1', classes: 'label pull-right bg-yellow' }],
    //   children: [
    //     { label: 'Pagu Remunerasi', route: 'home/kunjungan/rawatjalan' }

    //   ]
    // },
    // {
    //   label: 'Layout', iconClasses: 'fa fa-th-list', children: [
    //     { label: 'Configuration', route: 'home/layout/configuration' },
    //     { label: 'Custom', route: 'home/layout/custom' },
    //     { label: 'Header', route: 'home/layout/header' },
    //     { label: 'Sidebar Left', route: 'home/layout/sidebar-left' },
    //     { label: 'Sidebar Right', route: 'home/layout/sidebar-right' },
    //     { label: 'Content', route: 'home/layout/content' }
    //   ]
    // },
    // { label: 'COMPONENTS', separator: true },
    // { label: 'Accordion', route: 'accordion', iconClasses: 'fa fa-tasks' },
    // { label: 'Alert', route: 'home/alert', iconClasses: 'fa fa-exclamation-triangle' },
    // {
    //   label: 'Boxs', iconClasses: 'fa fa-files-o', children: [
    //     { label: 'Default Box', route: 'home/boxs/box' },
    //     { label: 'Info Box', route: 'home/boxs/info-box' },
    //     { label: 'Small Box', route: 'home/boxs/small-box' }
    //   ]
    // },
    // { label: 'Dropdown', route: 'home/dropdown', iconClasses: 'fa fa-arrows-v' },
    // {
    //   label: 'Form', iconClasses: 'fa fa-files-o', children: [
    //     { label: 'Input Text', route: 'home/form/input-text' }
    //   ]
    // },
    // { label: 'Tabs', route: 'home/tabs', iconClasses: 'fa fa-th' }
  ]
};
