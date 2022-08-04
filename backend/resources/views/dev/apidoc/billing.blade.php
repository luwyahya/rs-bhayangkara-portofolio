
<div class="grid_12">
    <div class="grid_6">

        <IMG src="{{ asset('rsab_harkit.jpg') }}">
        <IMG src="../../../assets/rsab_harkit.jpg">
        <p>Rumah Sakit Anak & Bunda</p>
        <p>Harapan Kita</p>a
        <p>Rumah Sakit Anak & Bunda</p>
    </div>
    <div class="grid_6">
    A
    </div>
</div>


















<style>
    .grid_12 {
        width: 100%;
        box-sizing: border-box;
    }

    .grid_1,
    .grid_2,
    .grid_3,
    .grid_4,
    .grid_5,
    .grid_6,
    .grid_7,
    .grid_8,
    .grid_9,
    .grid_10,
    .grid_11 {
        display: inline;
        float: left;
        padding: 5px;
        box-sizing: border-box;
    }

    .grid_12 .grid_3 {
        width: 25%;
    }

    .grid_12 .grid_6 {
        width: 50%;
    }

    .grid_12 .grid_9 {
        width: 75%;
    }

    .grid_12 .grid_12 {
        width: 100%;
        float: left;
    }

    .grid_12 .grid_1 {
        width: 8.333%;
    }

    .grid_12 .grid_2 {
        width: 16.6666666667%;
    }

    .grid_12 .grid_3 {
        width: 25%;
    }

    .grid_12 .grid_4 {
        width: 33.333%;
    }

    .grid_12 .grid_5 {
        width: 41.66667%;
    }

    .grid_12 .grid_7 {
        width: 58.3333%;
    }

    .grid_12 .grid_8 {
        width: 66.666667%;
    }

    .grid_12 .grid_10 {
        width: 83.33333%;
    }

    .grid_12 .grid_11 {
        width: 91.6666667%;
    }

    .grid_content {
        padding: 5px;
    }

    @media screen and (max-width:640px) {
        .grid_12 .grid_1,
        .grid_12 .grid_2,
        .grid_12 .grid_3,
        .grid_12 .grid_4,
        .grid_12 .grid_5,
        .grid_12 .grid_6,
        .grid_12 .grid_7,
        .grid_12 .grid_8,
        .grid_12 .grid_9,
        .grid_12 .grid_10,
        .grid_12 .grid_11,
        .grid_12 .grid_12 {
            width: 100%;
        }
    }

    @media screen and (min-width: 641px) and (max-width:960px) {
        .grid_12 .grid_1,
        .grid_12 .grid_2 {
            width: 16.66667%;
        }
        .grid_12 .grid_3,
        .grid_12 .grid_4 {
            width: 33.333333%;
        }
        .grid_12 .grid_5,
        .grid_12 .grid_6 {
            width: 50%;
        }
        .grid_12 .grid_7,
        .grid_12 .grid_8 {
            width: 66.666667%;
        }
        .grid_12 .grid_9,
        .grid_12 .grid_10 {
            width: 83.3333%;
        }
        .grid_12 .grid_11,
        .grid_12 .grid_12 {
            width: 100%;
        }
    }
</style>