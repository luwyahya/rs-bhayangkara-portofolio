<?php
namespace App\Transformers;
abstract class Transformer
{
    protected $list = [];
    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    /**
     * Transform a school
     *
     * @param  array $school
     * @return array
     */
    protected $primaryKey = "id";

    public function getList()
    {
        return $this->list;
    }


    public function transformCollection($data, $allField=true)
    {
        $result =array();
        if($allField){
            foreach ($data as $key => $value) {
                $result[] = $this->transform($value);
            }
        }else{
            foreach ($data as $key => $value) {
                $result[] = $this->transformField($value);
            }
        }
        return $result;
    }

    public function transformCollectionRecurs($data, $recursiveFName, $recursiveLabel=null){
        if($recursiveLabel==null){
            $recursiveLabel = $recursiveFName;
        }
        $result= [];
        $i=0;
        foreach ($data as $key => $value) {
            $result[$i] = $this->transform($value);
//            $cek = $value->toArray();
            if(isset($value->{$recursiveFName}) && count($value->{$recursiveFName})>0){
                $result[$i][$recursiveLabel] = $this->transformCollectionRecurs($value->{$recursiveFName}, $recursiveFName, $recursiveLabel);
            }else{
                $result[$i][$recursiveLabel] = [];
            }

            $i++;
        }

        return $result;
    }


    protected function konversi($data, $selectAtribute = null)
    {
        $list = ($selectAtribute == null) ? $this->list : $selectAtribute;
        if (count($list) > 0) {
            $data = (is_array($data)) ? (object)$data : $data;
            $result = [];
            foreach ($list as $key => $value) {
                $keyArray = explode(".", $key);
                $dt = $data;
                foreach ($keyArray as $key => $val) {
                    if ($dt != null) {
                        $dt = $dt->{$val};
                    }
                }
                $result[$value] = $dt;
            }
            return $result;
        } else {
            return $data->toArray();
        }
    }

    protected function konversiToForm($data, $selectAtribute = null)
    {
        $list = ($selectAtribute == null) ? $this->list : $selectAtribute;
        if (count($list) > 0) {
            $data = (is_array($data)) ? (object)$data : $data;
            $result = [];
            foreach ($list as $key => $value) {
                $keyArray = explode(".", $key);
                $dt = $data;
                if ($dt != null && count($keyArray) == 1) {
                    $dt = $dt->{$key};
                } else {
                    $dt = $dt->{$keyArray[0]};
                    if ($dt != null) {
                        $class = $dt->getTransformerPath();
                        $transChild = new $class;
                        $dt = $this->konversi($dt, $transChild->list);
                    }
                    //masalahnya dia tidak bisa memanggil nama tranformernya bro. gimana dong ?
                    //coba dari sini ada pencerahan gak ?
                    //ato gak coba video ini_alter
                    ///media/vinra/50E0BD89E0BD75B6/vinra data/Tutors/LARACAST/Laravel Vid/Whats New in Laravel 4
                }
                $result[$value] = $dt;
            }
            return $result;
        } else {
            return $data->toArray();
        }
    }

    protected function konversiBack($data, $class = null)
    {
        $model = ($class != null) ? new $class : null;
        if (count($this->list) > 0) {
            $result = [];
            foreach ($this->list as $key => $value) {
                $keyArray = explode(".", $key);
                if (isset($data[$value])) {
                    if (count($keyArray) == 1 && $data[$value] !="") {
                        $result[$key] = $data[$value];
                    } else {
                        if ($model != null && is_array($data[$value])) {
                            $foreignKey = $model->{$keyArray[0]}()->getForeignKey();
                            $otherKey = $model->{$keyArray[0]}()->getOtherKey();
                            $class = $model->{$keyArray[0]}()->getRelated()->getTransformerPath();
                            $transChild = new $class;
                            $dt = $transChild->transformBack($data[$value]);
                            if ($foreignKey != null && $dt[$otherKey] != null) {
                                $result[$foreignKey] = $dt[$otherKey];
                            }
                        }
                    }
                    //kalau isinya lebih dari satu beda lagi nanti yaa mungkin pake is assosc gitu kalo gak salah
                }
            }
            return $result;
        } else {
            return $data->toArray();
        }
    }

    public function transform($data)
    {
        return $this->konversi($data);
    }

    public function transformBack($data, $class = null)
    {
        return $this->konversiBack($data, $class);
    }

    public function transformToForm($data)
    {
        return $this->konversiToForm($data);
    }

    public function transformValidation($data)
    {
        if (count($this->list) > 0) {
            $result = [];
            foreach ($this->list as $key => $value) {
                if (isset($data[$key])) {
                    $result[$value] = $data[$key];
                }
            }
            return $result;
        } else {
            return $data;
        }
    }

    public function isListed($field)
    {
        $searchArray = array_search($field, $this->list);
        if ($searchArray) {
            return true;
        } else {
            return false;
        }
    }

    public function transformSigleField($field)
    {
        $searchArray = array_search($field, $this->list);
        if ($searchArray) {
            return $searchArray;
        } else {
            return $field;
        }
    }

    public function unTransformColumn($arrayData)
    {
        if (count($this->list) > 0) {
            $result = [];
            foreach ($arrayData as $key => $value) {
                $searchArray = array_search($value, $this->list);
                if ($searchArray) {
                    $result[$searchArray] = $this->list[$searchArray];
                }
            }
            return $result;
        } else {
            return $arrayData;
        }
    }

    public function transformColumn($listdata, $selectAttribute)
    {
        $result = array();
        foreach ($listdata as $data) {
            $result[] = $this->konversi($data, $selectAttribute);
        }
        return $result;
    }

    public function transformField($data)
    {
        if (count($this->list) > 0) {
            $result = [];
            foreach ($this->list as $key => $value) {
                if (isset($data[$key])) {
                    $result[$value] = $data[$key];
                }
            }
            return $result;
        } else {
            return $data;
        }
    }



    //method dev

    public function transformDummyData($data)
    {
        if (count($this->list) > 0) {
            $result = [];
            foreach ($this->list as $key => $value) {
                if (isset($data[$key]) && $key != $this->primaryKey) {
                    $result[$value] = $data[$key];
                }
            }
            return $result;
        } else {
            return $data;
        }
    }

}

