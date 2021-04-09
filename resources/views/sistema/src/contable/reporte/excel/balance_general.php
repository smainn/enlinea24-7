
<html>
<table class="table-report" style="borderTop: 1px solid black;">
    <thead>
        <tr>
            <th colspan="9" style="text-align: center; 
                width: 20px; height: 27px; font-size: 16px;">
                <strong>Balance General</strong>
            </th>
        </tr>
        <tr>
            <th colspan="9" style="text-align: center; 
                width: 20px; height: 27px; font-size: 16px;">
                <? echo $subtitulo ?>
            </th>
        </tr>
    </thead>
</table>
<!--<div style="width: 100%; margin-bottom: 20px; padding-top: 20px;">-->
<table class="table-report" style="borderTop: 1px solid black;">
<thead>
    <?php 
        $count = count($data);
        $i = 0;
        $espacioRight = 40;
        $espacioLeft = 20;
        $b1 = true;
        $b2 = true;
        $indexA = 0;
        $indexP = 0;
        $indexC = 0;        
        $sw1 = true;
        $sw2 = true;
        $sw3 = true;
        while ($i < $count) {
            $pxLeft = ($data[$i]->nivelcod - 1) * $espacioLeft;
            $pxRight = ($data[$i]->nivelcod - 1) * $espacioRight;
            if ($data[$i]->tipocuenta == 'A' && $sw1) {
                $indexA = $i;
                $sw1 = false;
            } else if ($data[$i]->tipocuenta == 'P' && $sw2) {
                $indexP = $i;
                $sw2 = false;
            } else if ($data[$i]->tipocuenta == 'C' && $sw3) {
                $indexC = $i;
                $sw3 = false;
            }
                

    ?>
        
        <?php 
            if ($data[$i]->tipocuenta == 'P' && $b1) {
                $b1 = false;
        ?>
            <tr>
                <th>
                    <label style="font-weight: bold; font-size: 10;">TOTAL ACTIVO</label>
                </th>
                <th>
                    <label style="font-size: 10;"><?= sprintf("%.2f", round($data[$indexA]->valor, 2)) ?></label>
                </th>
            </tr>
        <?php       
            } else if ($data[$i]->tipocuenta == 'C' && $b2) {
                $b2 = false;
        ?>  
            <tr>
                <th>
                    <label style="font-weight: bold; font-size: 10;">TOTAL PASIVO</label>
                </th>
                <th style="text-align: right;">
                    <label style="font-size: 10;"><?= sprintf("%.2f", round($data[$indexP]->valor, 2)) ?></label>
                </th>
            </tr>
        <?php   
            }
            if ($data[$i]->nivelcod <= $nivelmax) {
        ?>
            <tr>
                <th style="margin-left: <?= $pxLeft ?>px;">
                    <label style="font-weight: bold; font-size: 10;"><?php $codigo = ($showcod == "true" ? $data[$i]->codcuenta : ''); echo $codigo . ' ' . $data[$i]->descripcion ?></label>
                </th>
                <th style="text-align: right;">
                    <label style="font-size: 10; margin-right: <?= $pxRight ?>px;"><?= $data[$i]->nivelcod == 1 ?  '' : sprintf("%.2f", round($data[$i]->valor, 2)) ?></label>
                </th>
            </tr>
        <?php
            }
            $i++;
            }
        ?>
    <tr>
        <th>
            <label style="font-weight: bold; font-size: 10;">TOTAL PATRIMONIO</label>
        </th>
        <th style="text-align: right;">
            <label style="font-size: 10;"><?= sprintf("%.2f", round($data[$indexC]->valor, 2)) ?></label>
        </th>
    </tr>
    <tr>
        <th>
            <label style="font-weight: bold; font-size: 10;">TOTAL PASIVO + PATRIMONIO</label>
        </th>
        <th style="text-align: right;">
            <label style="font-size: 10;"><?= sprintf("%.2f", round($data[$indexA]->valor + $data[$indexC]->valor, 2)) ?></label>
        </th>
    </tr>
</thead>
</table>
<!--</div>-->

</html>
