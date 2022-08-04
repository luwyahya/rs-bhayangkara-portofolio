<?php
namespace App\Transformers;

class KategoriTransformer extends Transformer{

    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */

    /**
     * Transform a school
     *
     * @param  int  $school
     * @return array
     */
    public function transform($kategori)
    {
        return [
            'NamaKategori' => $kategori['nama'],
            'Keterangan' => $kategori['keterangan']
        ];
    }
}
