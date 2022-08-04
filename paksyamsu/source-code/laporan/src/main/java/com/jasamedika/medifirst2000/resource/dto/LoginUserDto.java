package com.jasamedika.medifirst2000.resource.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginUserDto {

	String namaLengkap;
    String namaAwal;
    String namaTengah;
    String namaAkhir;
	String namaUserEmail;
	String namaUserMobile;
	String kataSandi;
	String tglDaftar;
	String tglLahir;
	String pthFileImageUser;
	Integer kdJenisKelamin;
	Long tglStmpLahir;
}
